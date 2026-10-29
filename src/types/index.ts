export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'student' | 'admin';
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  arabicTitle: string;
  category: 'Dasar' | 'Mufrodat' | 'Nahwu' | 'Shorof' | 'Percakapan';
  level: number;
  description: string;
  iconName: string;
  xpReward: number;
  materials: {
    sectionTitle: string;
    arabicText: string;
    transliteration: string;
    indonesianTranslation: string;
    notes?: string;
  }[];
  quiz: {
    question: string;
    arabicQuestion?: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface UserProgressItem {
  lessonId: string;
  completed: boolean;
  score: number;
  attempts: number;
  completedAt: string;
  updatedAt: string;
}

export interface SavedVocabularyItem {
  id: string;
  arabicWord: string;
  transliteration: string;
  indonesianMeaning: string;
  category: string;
  masteryLevel: number; // 1-5
  notes?: string;
  createdAt: string;
}

export interface AdminBroadcast {
  id?: string;
  title: string;
  arabic: string;
  content: string;
  author: string;
  updatedAt: string;
}
