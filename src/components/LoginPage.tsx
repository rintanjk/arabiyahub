import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  Sparkles,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  GraduationCap,
  Globe2,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { loginWithGoogle, loginAsAdmin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'student' | 'admin'>('student');
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('12345678');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    const success = await loginAsAdmin(adminPassword, adminUsername);
    setIsSubmitting(false);
    if (!success) {
      setErrorMsg('Kredensial admin salah! Gunakan username: admin dan password: 12345678');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-4xl grid md:grid-cols-2 rounded-3xl bg-slate-900/90 border border-emerald-900/40 shadow-2xl backdrop-blur-xl overflow-hidden z-10">
        
        {/* Left Side: Brand & Value Proposition */}
        <div className="p-8 md:p-10 bg-gradient-to-br from-emerald-950/80 via-slate-900/90 to-slate-950 border-b md:border-b-0 md:border-r border-emerald-900/40 flex flex-col justify-between relative">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Platform Belajar Bahasa Arab Modern
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold text-2xl font-arabic">
                ع
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  ArabiyaHub
                </h1>
                <p className="text-xs text-emerald-400 font-arabic text-lg leading-none mt-0.5">
                  الْمَرْكَزُ الْعَرَبِيُّ الذَّكِيُّ
                </p>
              </div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Kuasai bahasa Arab dengan metode interaktif, kurikulum terstruktur (Nahwu, Shorof, Mufrodat), audio pelafalan fasih, dan bimbingan langsung Ustadz AI (Gemini).
            </p>

            {/* Feature Highlights */}
            <div className="space-y-3">
              <div className="flex items-start gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Firebase Auth & Firestore:</strong> Progres belajar & XP tersimpan rapi per akun Google.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>AI Ustadz Tutor (Gemini):</strong> Tanya kaidah I&apos;rab, harakat, dan latihan percakapan kapan saja.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Portal Admin Lengkap:</strong> Akses khusus manajemen materi & murid (admin / 12345678).</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span className="font-arabic text-emerald-400 text-sm">مَنْ جَدَّ وَجَدَ</span>
            <span>Siap deploy ke Vercel</span>
          </div>
        </div>

        {/* Right Side: Login Form with Tabs */}
        <div className="p-8 md:p-10 flex flex-col justify-center">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-white mb-1">
              Selamat Datang di ArabiyaHub
            </h2>
            <p className="text-xs text-slate-400">
              Silakan login untuk mengakses materi pembelajaran bahasa Arab
            </p>
          </div>

          {/* Tab Selector */}
          <div className="grid grid-cols-2 p-1 bg-slate-950/70 border border-slate-800 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab('student');
                setErrorMsg('');
              }}
              className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'student'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Murid (Google Sign-In)
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('admin');
                setErrorMsg('');
              }}
              className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'admin'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Portal
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center font-medium">
              {errorMsg}
            </div>
          )}

          {activeTab === 'student' ? (
            /* Student Firebase Google Sign-In Tab */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 text-center">
                <Globe2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-xs text-slate-300 font-medium">
                  Masuk menggunakan akun Google Anda untuk menyimpan kemajuan, riwayat kuis, dan XP secara real-time.
                </p>
              </div>

              <button
                onClick={loginWithGoogle}
                disabled={loading}
                type="button"
                className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm transition-all duration-200 shadow-lg shadow-white/5 cursor-pointer disabled:opacity-60"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                {loading ? 'Menghubungkan ke Google...' : 'Masuk dengan Google (Firebase)'}
              </button>

              <div className="text-center pt-2">
                <span className="text-[11px] text-slate-500">
                  Data Anda tersinkronisasi otomatis dengan Google Firebase Firestore.
                </span>
              </div>
            </div>
          ) : (
            /* Admin Login Tab: username 'admin', password '12345678' */
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                <p className="font-semibold mb-0.5">Kredensial Admin Bawaan:</p>
                <div className="flex justify-between font-mono text-[11px] bg-slate-950/60 p-2 rounded">
                  <span>Username: <strong>admin</strong></span>
                  <span>Password: <strong>12345678</strong></span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Username Admin
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    required
                    placeholder="admin"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                  <ShieldCheck className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Password Admin
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                    placeholder="12345678"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-semibold text-sm transition-all shadow-lg shadow-amber-600/20 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  'Memverifikasi...'
                ) : (
                  <>
                    <span>Masuk sebagai Administrator</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
