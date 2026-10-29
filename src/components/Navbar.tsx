import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LogOut,
  Flame,
  Award,
  BookOpen,
  Sparkles,
  Search,
  Bot,
  ShieldCheck,
  Bookmark,
  Languages,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openAiTutor: () => void;
  openHarakatChecker: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openAiTutor,
  openHarakatChecker,
}) => {
  const { user, isAdmin, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('lessons')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-arabic font-bold text-xl shadow-md shadow-emerald-500/20">
              ع
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-white tracking-tight">ArabiyaHub</span>
                {isAdmin ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                    ADMIN
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    MURID
                  </span>
                )}
              </div>
              <span className="text-[10px] text-emerald-400 font-arabic hidden sm:inline">
                الْمَرْكَزُ الْعَرَبِيُّ التَّفَاعُلِيُّ
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('lessons')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'lessons'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Kurikulum Materi
            </button>

            <button
              onClick={() => setActiveTab('vocab')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'vocab'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              Kamus Mufrodat
            </button>

            <button
              onClick={openHarakatChecker}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 text-teal-300 hover:text-white hover:bg-teal-950/60 border border-teal-800/40 transition-colors cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5 text-teal-400" />
              Cek Harakat & I&apos;rab
            </button>

            <button
              onClick={openAiTutor}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 bg-gradient-to-r from-emerald-600/30 to-teal-500/30 border border-emerald-500/50 text-emerald-300 hover:text-white hover:border-emerald-400 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Tanya Ustadz AI
            </button>

            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-amber-600 text-white'
                    : 'text-amber-400 hover:text-amber-300 hover:bg-amber-950/40 border border-amber-800/50'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Panel Admin
              </button>
            )}
          </nav>

          {/* User Stats & Logout */}
          <div className="flex items-center gap-3">
            {/* Streak & XP Counters */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{user?.streak || 1} Hari</span>
              </div>

              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span>{user?.xp || 0} XP</span>
              </div>
            </div>

            {/* Profile Avatar & Name */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <img
                src={user?.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.uid || 'user'}`}
                alt={user?.displayName || 'Avatar'}
                className="w-8 h-8 rounded-full border border-emerald-500/40 object-cover bg-slate-800"
              />
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-white leading-tight truncate max-w-[120px]">
                  {user?.displayName || 'Santri Arabiya'}
                </p>
                <p className="text-[10px] text-slate-400 truncate max-w-[120px]">
                  {user?.email || 'Murid'}
                </p>
              </div>
            </div>

            {/* Tombol Logout Sesuai Permintaan */}
            <button
              onClick={logout}
              title="Keluar dari akun (Logout)"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/30 transition-all duration-200 text-xs font-semibold cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800/60 overflow-x-auto text-[11px] gap-2">
          <button
            onClick={() => setActiveTab('lessons')}
            className={`px-2.5 py-1 rounded font-medium whitespace-nowrap ${
              activeTab === 'lessons' ? 'bg-emerald-600 text-white' : 'text-slate-400'
            }`}
          >
            Materi
          </button>
          <button
            onClick={() => setActiveTab('vocab')}
            className={`px-2.5 py-1 rounded font-medium whitespace-nowrap ${
              activeTab === 'vocab' ? 'bg-emerald-600 text-white' : 'text-slate-400'
            }`}
          >
            Mufrodat
          </button>
          <button
            onClick={openHarakatChecker}
            className="px-2.5 py-1 rounded font-medium text-teal-300 bg-teal-950/60 whitespace-nowrap"
          >
            Cek Harakat
          </button>
          <button
            onClick={openAiTutor}
            className="px-2.5 py-1 rounded font-medium text-emerald-300 bg-emerald-950/60 whitespace-nowrap"
          >
            AI Tutor
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-2.5 py-1 rounded font-medium whitespace-nowrap ${
                activeTab === 'admin' ? 'bg-amber-600 text-white' : 'text-amber-400'
              }`}
            >
              Admin
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
