import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  onSnapshot,
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserProfile, UserProgressItem, SavedVocabularyItem } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isAdmin: boolean;
  userProgress: Record<string, UserProgressItem>;
  savedVocabs: SavedVocabularyItem[];
  loginWithGoogle: () => Promise<void>;
  loginAsAdmin: (password: string, username: string) => Promise<boolean>;
  logout: () => Promise<void>;
  addXP: (amount: number) => Promise<void>;
  markLessonComplete: (lessonId: string, score: number) => Promise<void>;
  saveVocabulary: (vocab: Omit<SavedVocabularyItem, 'id' | 'createdAt'>) => Promise<void>;
  removeVocabulary: (vocabId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_STORAGE_KEY = 'arabiyahub_admin_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState<Record<string, UserProgressItem>>({});
  const [savedVocabs, setSavedVocabs] = useState<SavedVocabularyItem[]>([]);

  // 1. Check for active admin session in localStorage
  useEffect(() => {
    const savedAdmin = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (savedAdmin) {
      try {
        const parsed = JSON.parse(savedAdmin);
        setUser(parsed);
        setLoading(false);
        return;
      } catch (e) {
        localStorage.removeItem(ADMIN_STORAGE_KEY);
      }
    }

    // 2. Listen for Firebase Auth changes
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const userSnap = await getDoc(userDocRef).catch((err) =>
            handleFirestoreError(err, OperationType.GET, `users/${fbUser.uid}`)
          );

          const today = new Date().toISOString().split('T')[0];

          if (userSnap && userSnap.exists()) {
            const data = userSnap.data() as UserProfile;
            // Calculate streak
            let currentStreak = data.streak || 1;
            if (data.lastActiveDate) {
              const lastDate = new Date(data.lastActiveDate);
              const diffDays = Math.floor(
                (new Date(today).getTime() - new Date(lastDate.toISOString().split('T')[0]).getTime()) /
                  (1000 * 3600 * 24)
              );
              if (diffDays === 1) {
                currentStreak += 1;
              } else if (diffDays > 1) {
                currentStreak = 1;
              }
            }

            const updatedProfile: UserProfile = {
              ...data,
              displayName: fbUser.displayName || data.displayName || 'Santri Arabiya',
              photoURL: fbUser.photoURL || data.photoURL,
              streak: currentStreak,
              lastActiveDate: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            await updateDoc(userDocRef, {
              streak: currentStreak,
              lastActiveDate: updatedProfile.lastActiveDate,
              updatedAt: updatedProfile.updatedAt,
            }).catch((err) => handleFirestoreError(err, OperationType.UPDATE, `users/${fbUser.uid}`));

            setUser(updatedProfile);
          } else {
            // New user registration in Firestore
            const newProfile: UserProfile = {
              uid: fbUser.uid,
              email: fbUser.email || '',
              displayName: fbUser.displayName || 'Santri Baru',
              photoURL:
                fbUser.photoURL ||
                `https://api.dicebear.com/7.x/bottts/svg?seed=${fbUser.uid}`,
              role: 'student',
              xp: 100,
              level: 1,
              streak: 1,
              lastActiveDate: new Date().toISOString(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            await setDoc(userDocRef, newProfile).catch((err) =>
              handleFirestoreError(err, OperationType.CREATE, `users/${fbUser.uid}`)
            );
            setUser(newProfile);
          }
        } catch (error) {
          console.error('Error fetching user profile from Firestore:', error);
        }
      } else {
        if (!localStorage.getItem(ADMIN_STORAGE_KEY)) {
          setUser(null);
          setUserProgress({});
          setSavedVocabs([]);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Listen for user progress & vocabulary when Firebase user is present
  useEffect(() => {
    if (!firebaseUser) return;

    // Listen to progress subcollection
    const progressRef = collection(db, 'users', firebaseUser.uid, 'progress');
    const unsubProgress = onSnapshot(
      progressRef,
      (snapshot) => {
        const progressMap: Record<string, UserProgressItem> = {};
        snapshot.forEach((docSnap) => {
          progressMap[docSnap.id] = docSnap.data() as UserProgressItem;
        });
        setUserProgress(progressMap);
      },
      (error) => {
        console.error('Progress listener error:', error);
      }
    );

    // Listen to vocabulary subcollection
    const vocabRef = collection(db, 'users', firebaseUser.uid, 'vocabulary');
    const unsubVocab = onSnapshot(
      vocabRef,
      (snapshot) => {
        const vocabs: SavedVocabularyItem[] = [];
        snapshot.forEach((docSnap) => {
          vocabs.push({
            id: docSnap.id,
            ...(docSnap.data() as Omit<SavedVocabularyItem, 'id'>),
          });
        });
        setSavedVocabs(vocabs);
      },
      (error) => {
        console.error('Vocabulary listener error:', error);
      }
    );

    return () => {
      unsubProgress();
      unsubVocab();
    };
  }, [firebaseUser]);

  // Google Sign-In with Firebase Auth
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Login with Google error:', err);
      alert('Gagal login Google: ' + (err.message || 'Silakan coba lagi'));
    } finally {
      setLoading(false);
    }
  };

  // Admin login with requested credentials: username 'admin', password '12345678'
  const loginAsAdmin = async (password: string, username: string = 'admin'): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(data.user));
        return true;
      } else {
        alert(data.message || 'Login admin gagal');
        return false;
      }
    } catch (error) {
      console.error('Admin login error:', error);
      // Fallback for direct offline / dev verification
      if (username === 'admin' && password === '12345678') {
        const fallbackAdmin: UserProfile = {
          uid: 'admin_local_master',
          email: 'admin@arabiyahub.local',
          displayName: 'Ustadz Admin (Superuser)',
          photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
          role: 'admin',
          xp: 9999,
          level: 99,
          streak: 100,
          lastActiveDate: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setUser(fallbackAdmin);
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(fallbackAdmin));
        return true;
      }
      alert('Koneksi gagal atau kredensial salah');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout from any session (Firebase Auth & Admin)
  const logout = async () => {
    setLoading(true);
    try {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
      await signOut(auth);
      setUser(null);
      setFirebaseUser(null);
      setUserProgress({});
      setSavedVocabs([]);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Increment XP and level
  const addXP = async (amount: number) => {
    if (!user) return;
    const newXP = (user.xp || 0) + amount;
    const newLevel = Math.floor(newXP / 200) + 1;

    const updatedUser = {
      ...user,
      xp: newXP,
      level: newLevel,
      updatedAt: new Date().toISOString(),
    };
    setUser(updatedUser);

    if (firebaseUser) {
      try {
        const userRef = doc(db, 'users', firebaseUser.uid);
        await updateDoc(userRef, {
          xp: newXP,
          level: newLevel,
          updatedAt: new Date().toISOString(),
        }).catch((err) => handleFirestoreError(err, OperationType.UPDATE, `users/${firebaseUser.uid}`));
      } catch (err) {
        console.error('Failed to update XP in Firestore:', err);
      }
    }
  };

  // Save lesson progress in subcollection
  const markLessonComplete = async (lessonId: string, score: number) => {
    if (!user) return;

    const progressItem: UserProgressItem = {
      lessonId,
      completed: true,
      score,
      attempts: (userProgress[lessonId]?.attempts || 0) + 1,
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setUserProgress((prev) => ({
      ...prev,
      [lessonId]: progressItem,
    }));

    if (firebaseUser) {
      try {
        const progDoc = doc(db, 'users', firebaseUser.uid, 'progress', lessonId);
        await setDoc(progDoc, progressItem).catch((err) =>
          handleFirestoreError(err, OperationType.WRITE, `users/${firebaseUser.uid}/progress/${lessonId}`)
        );
      } catch (err) {
        console.error('Failed to save progress in Firestore:', err);
      }
    }
  };

  // Save vocabulary to subcollection
  const saveVocabulary = async (vocab: Omit<SavedVocabularyItem, 'id' | 'createdAt'>) => {
    const vocabId = `vocab_${Date.now()}`;
    const newVocab: SavedVocabularyItem = {
      ...vocab,
      id: vocabId,
      createdAt: new Date().toISOString(),
    };

    setSavedVocabs((prev) => [newVocab, ...prev]);

    if (firebaseUser) {
      try {
        const vocabDoc = doc(db, 'users', firebaseUser.uid, 'vocabulary', vocabId);
        await setDoc(vocabDoc, {
          userId: firebaseUser.uid,
          ...vocab,
          createdAt: newVocab.createdAt,
        }).catch((err) =>
          handleFirestoreError(err, OperationType.WRITE, `users/${firebaseUser.uid}/vocabulary/${vocabId}`)
        );
      } catch (err) {
        console.error('Failed to save vocabulary in Firestore:', err);
      }
    }
  };

  // Remove vocabulary from subcollection
  const removeVocabulary = async (vocabId: string) => {
    setSavedVocabs((prev) => prev.filter((v) => v.id !== vocabId));

    if (firebaseUser) {
      try {
        const vocabDoc = doc(db, 'users', firebaseUser.uid, 'vocabulary', vocabId);
        await deleteDoc(vocabDoc).catch((err) =>
          handleFirestoreError(err, OperationType.DELETE, `users/${firebaseUser.uid}/vocabulary/${vocabId}`)
        );
      } catch (err) {
        console.error('Failed to delete vocabulary from Firestore:', err);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        isAdmin: user?.role === 'admin',
        userProgress,
        savedVocabs,
        loginWithGoogle,
        loginAsAdmin,
        logout,
        addXP,
        markLessonComplete,
        saveVocabulary,
        removeVocabulary,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
