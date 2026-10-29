import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './components/LoginPage';
import { Navbar } from './components/Navbar';
import { LESSONS_DATA } from './data/lessonsData';
import { Lesson } from './types';
import { LessonModal } from './components/LessonModal';
import { AiTutorModal } from './components/AiTutorModal';
import { HarakatChecker } from './components/HarakatChecker';
import { VocabExplorer } from './components/VocabExplorer';
import { QuizGeneratorModal } from './components/QuizGeneratorModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AudioButton } from './components/AudioButton';
import {
  BookOpen,
  Sparkles,
  Award,
  Flame,
  CheckCircle2,
  ChevronRight,
  Play,
  RotateCcw,
  Languages,
  HelpCircle,
  TrendingUp,
  Brain,
  Quote,
} from 'lucide-react';

const MainApp: React.FC = () => {
  const { user, loading, userProgress, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'lessons' | 'vocab' | 'admin'>('lessons');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showAiTutor, setShowAiTutor] = useState(false);
  const [showHarakatChecker, setShowHarakatChecker] = useState(false);
  const [showQuizGenerator, setShowQuizGenerator] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  // Daily wisdom quote
  const [dailyWisdom, setDailyWisdom] = useState({
    arabic: 'مَنْ جَدَّ وَجَدَ، وَمَنْ زَرَعَ حَصَدَ',
    transliteration: 'Man jadda wajada, wa man zara\'a hasada',
    translation: 'Barangsiapa bersungguh-sungguh dia akan berhasil, dan barangsiapa menanam dia akan menuai.',
  });

  useEffect(() => {
    // Check if admin broadcasted a custom wisdom
    const savedWisdom = localStorage.getItem('arabiyahub_admin_daily_wisdom');
    if (savedWisdom) {
      try {
        const parsed = JSON.parse(savedWisdom);
        setDailyWisdom({
          arabic: parsed.arabic,
          transliteration: parsed.title,
          translation: parsed.translation,
        });
      } catch (e) {
        // use default
      }
    }
  }, []);

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-arabic text-3xl font-bold shadow-2xl shadow-emerald-500/20 animate-pulse">
          ع
        </div>
        <p className="mt-4 text-xs font-semibold text-emerald-400 tracking-wider uppercase">
          Memuat ArabiyaHub...
        </p>
      </div>
    );
  }

  // 2. HALAMAN WAJIB LOGIN: Jika belum login, tampilkan halaman Login
  if (!user) {
    return <LoginPage />;
  }

  // Filter lessons
  const filteredLessons = LESSONS_DATA.filter((l) =>
    selectedCategory === 'Semua' ? true : l.category === selectedCategory
  );

  // Compute progress stats
  const completedCount = Object.values(userProgress).filter((p) => p.completed).length;
  const progressPercentage = Math.round((completedCount / LESSONS_DATA.length) * 100);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar with Logout button */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(t) => setActiveTab(t as any)}
        openAiTutor={() => setShowAiTutor(true)}
        openHarakatChecker={() => setShowHarakatChecker(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Render Admin Dashboard if tab is 'admin' */}
        {activeTab === 'admin' && isAdmin ? (
          <AdminDashboard />
        ) : activeTab === 'vocab' ? (
          <VocabExplorer />
        ) : (
          /* Main Lessons & Curriculum View */
          <div className="space-y-8">
            {/* Daily Wisdom & User Progress Hero */}
            <div className="grid lg:grid-cols-3 gap-6">
              
              {/* Daily Arabic Wisdom Card */}
              <div className="lg:col-span-2 p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-950 border border-emerald-800/40 shadow-xl relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none font-arabic text-8xl text-emerald-300">
                  حكمة
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider border border-emerald-500/30">
                      <Quote className="w-3.5 h-3.5" />
                      Mahfuzhat & Kata Mutiara Hari Ini
                    </span>

                    <AudioButton arabicText={dailyWisdom.arabic} size="sm" label="Lafalkan" />
                  </div>

                  <div className="text-right py-2">
                    <p className="font-arabic text-2xl sm:text-3xl font-bold text-white leading-relaxed tracking-wide">
                      {dailyWisdom.arabic}
                    </p>
                  </div>

                  <p className="text-xs text-emerald-300 font-medium italic mt-2">
                    &quot;{dailyWisdom.transliteration}&quot;
                  </p>
                  <p className="text-xs text-slate-300 mt-1">
                    {dailyWisdom.translation}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>Tersinkronisasi otomatis dengan Firestore</span>
                  <button
                    onClick={() => setShowAiTutor(true)}
                    className="text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Diskusikan maknanya dengan Ustadz AI</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Student Level & Progress Stats Card */}
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Statistik Belajar Anda
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      Level {user.level || 1}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {/* XP Progress */}
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-300 font-medium">Progres XP Menuju Level {(user.level || 1) + 1}</span>
                        <span className="text-emerald-400 font-bold">{user.xp || 0} / {((user.level || 1) * 200)} XP</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, (((user.xp || 0) % 200) / 200) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Lesson Completion Rate */}
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-300 font-medium">Modul Terselesaikan</span>
                        <span className="text-white font-bold">{completedCount} dari {LESSONS_DATA.length} ({progressPercentage}%)</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 text-center text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">Streak Harian</span>
                        <span className="text-amber-400 font-bold text-sm">🔥 {user.streak || 1} Hari</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">Peran Akun</span>
                        <span className="text-emerald-400 font-bold text-sm capitalize">{user.role}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 text-center">
                  <span className="text-[11px] text-slate-500">
                    ID Akun: {user.uid.slice(0, 14)}...
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Interactive Tool Launchers */}
            <div className="grid sm:grid-cols-3 gap-4">
              <button
                onClick={() => setShowAiTutor(true)}
                className="group p-4 rounded-2xl bg-gradient-to-br from-emerald-950/50 to-slate-900 border border-emerald-800/40 hover:border-emerald-500 transition-all text-left flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white">Ustadz AI (Gemini)</h3>
                    <p className="text-[11px] text-slate-400">Tanya kaidah & percakapan</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </button>

              <button
                onClick={() => setShowHarakatChecker(true)}
                className="group p-4 rounded-2xl bg-gradient-to-br from-teal-950/50 to-slate-900 border border-teal-800/40 hover:border-teal-500 transition-all text-left flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-600/20 border border-teal-500/40 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
                    <Languages className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white">Cek Harakat & I&apos;rab</h3>
                    <p className="text-[11px] text-slate-400">Beri tashkeel teks gundul</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 transition-colors" />
              </button>

              <button
                onClick={() => setShowQuizGenerator(true)}
                className="group p-4 rounded-2xl bg-gradient-to-br from-amber-950/50 to-slate-900 border border-amber-800/40 hover:border-amber-500 transition-all text-left flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white">Generator Kuis AI</h3>
                    <p className="text-[11px] text-slate-400">Buat soal dinamis instan</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
              </button>
            </div>

            {/* Curriculum Lessons Section */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>Kurikulum & Peta Belajar</span>
                    <span className="font-arabic text-emerald-400 text-lg">مَنْهَجُ التَّعَلُّمِ</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Mulai dari huruf, sapaan dasar, nahwu, hingga percakapan praktis
                  </p>
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
                  {['Semua', 'Dasar', 'Nahwu', 'Shorof', 'Percakapan'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-colors cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lessons Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredLessons.map((lesson) => {
                  const progress = userProgress[lesson.id];
                  const isDone = progress?.completed;

                  return (
                    <div
                      key={lesson.id}
                      className="group p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-emerald-600/50 hover:shadow-2xl hover:shadow-emerald-950/40 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-950 text-emerald-400 border border-slate-800">
                            Level {lesson.level} • {lesson.category}
                          </span>

                          {isDone ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              Selesai ({progress.score}%)
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              +{lesson.xpReward} XP
                            </span>
                          )}
                        </div>

                        <div>
                          <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                            {lesson.title}
                          </h3>
                          <p className="font-arabic text-xl font-bold text-emerald-400 mt-1">
                            {lesson.arabicTitle}
                          </p>
                        </div>

                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {lesson.description}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500">
                          {lesson.materials.length} Bahasan • {lesson.quiz.length} Soal
                        </span>

                        <button
                          onClick={() => setSelectedLesson(lesson)}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            isDone
                              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
                          }`}
                        >
                          {isDone ? (
                            <>
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Ulangi</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Mulai Belajar</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-arabic text-emerald-400 text-base">الْعِلْمُ نُورٌ</span>
            <span>&bull; ArabiyaHub: Platform Belajar Bahasa Arab Modern</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Express Backend: <code className="text-emerald-400">/api/index.ts</code></span>
            <span>&bull;</span>
            <span>Siap Deploy Vercel</span>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      {selectedLesson && (
        <LessonModal lesson={selectedLesson} onClose={() => setSelectedLesson(null)} />
      )}

      {showAiTutor && <AiTutorModal onClose={() => setShowAiTutor(false)} />}

      {showHarakatChecker && (
        <HarakatChecker onClose={() => setShowHarakatChecker(false)} />
      )}

      {showQuizGenerator && (
        <QuizGeneratorModal onClose={() => setShowQuizGenerator(false)} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
