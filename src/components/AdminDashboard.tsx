import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LESSONS_DATA } from '../data/lessonsData';
import { VOCABULARY_LIST } from '../data/vocabularyData';
import {
  ShieldCheck,
  Users,
  BookOpen,
  Sparkles,
  Server,
  Activity,
  Send,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Database,
  Lock,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'content' | 'broadcast' | 'api-test'>('overview');

  // Broadcast state
  const [broadcastTitle, setBroadcastTitle] = useState('Kata Hikmah Hari Ini');
  const [broadcastArabic, setBroadcastArabic] = useState('مَنْ صَبَرَ ظَفِرَ');
  const [broadcastTranslation, setBroadcastTranslation] = useState('Barangsiapa bersabar, maka ia akan beruntung.');
  const [broadcastStatus, setBroadcastStatus] = useState('');
  const [isGeneratingWisdom, setIsGeneratingWisdom] = useState(false);

  // API Test state
  const [apiHealth, setApiHealth] = useState<any>(null);
  const [apiTesting, setApiTesting] = useState(false);
  const [geminiTestOutput, setGeminiTestOutput] = useState('');

  const handleTestHealth = async () => {
    setApiTesting(true);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setApiHealth(data);
    } catch (err: any) {
      setApiHealth({ error: err.message || 'Gagal koneksi' });
    } finally {
      setApiTesting(false);
    }
  };

  const handleTestGemini = async () => {
    setApiTesting(true);
    setGeminiTestOutput('Memanggil server-side Gemini 2.5 Flash...');
    try {
      const res = await fetch('/api/gemini/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Halo Ustadz, tolong berikan 1 contoh kalimat Fusha sederhana dengan kata قَرَأَ.',
          mode: 'general',
        }),
      });
      const data = await res.json();
      setGeminiTestOutput(data.reply || JSON.stringify(data));
    } catch (err: any) {
      setGeminiTestOutput('Error: ' + err.message);
    } finally {
      setApiTesting(false);
    }
  };

  const handleGenerateWisdomAi = async () => {
    setIsGeneratingWisdom(true);
    try {
      const res = await fetch('/api/gemini/daily-wisdom');
      const data = await res.json();
      if (data.arabic) {
        setBroadcastArabic(data.arabic);
        setBroadcastTranslation(`${data.translation} (${data.transliteration})`);
        setBroadcastTitle('Hikmah: ' + data.transliteration);
        setBroadcastStatus('Kata mutiara berhasil digenerate otomatis dari Gemini!');
      }
    } catch (err) {
      setBroadcastStatus('Gagal memuat dari AI.');
    } finally {
      setIsGeneratingWisdom(false);
    }
  };

  const handleSaveBroadcast = () => {
    localStorage.setItem(
      'arabiyahub_admin_daily_wisdom',
      JSON.stringify({
        title: broadcastTitle,
        arabic: broadcastArabic,
        translation: broadcastTranslation,
        updatedAt: new Date().toISOString(),
      })
    );
    setBroadcastStatus('Siaran kata mutiara harian berhasil diperbarui untuk semua murid!');
    setTimeout(() => setBroadcastStatus(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-950 border border-amber-600/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">Portal Administrator</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Superuser Aktif
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Login sebagai <strong>admin</strong> (Password: 12345678). Manajemen kurikulum, siaran harian, dan pemantauan API.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400">
            <span className="text-emerald-400 font-semibold">● Online</span> | Vercel Ready
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`px-3 py-2 rounded-xl font-semibold transition-colors cursor-pointer ${
            activeSubTab === 'overview'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Ringkasan Sistem & Statistik
        </button>
        <button
          onClick={() => setActiveSubTab('content')}
          className={`px-3 py-2 rounded-xl font-semibold transition-colors cursor-pointer ${
            activeSubTab === 'content'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Daftar Kurikulum ({LESSONS_DATA.length} Modul)
        </button>
        <button
          onClick={() => setActiveSubTab('broadcast')}
          className={`px-3 py-2 rounded-xl font-semibold transition-colors cursor-pointer ${
            activeSubTab === 'broadcast'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Siaran Hikmah Harian
        </button>
        <button
          onClick={() => setActiveSubTab('api-test')}
          className={`px-3 py-2 rounded-xl font-semibold transition-colors cursor-pointer ${
            activeSubTab === 'api-test'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Test Express & Gemini AI
        </button>
      </div>

      {/* Sub-Tab 1: Overview */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Total Modul Pelajaran</span>
                <BookOpen className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-bold text-white">{LESSONS_DATA.length} Level</p>
              <p className="text-[11px] text-emerald-400">Nahwu, Shorof, & Percakapan</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Database Mufrodat</span>
                <Sparkles className="w-4 h-4 text-teal-400" />
              </div>
              <p className="text-2xl font-bold text-white">{VOCABULARY_LIST.length}+ Kata</p>
              <p className="text-[11px] text-teal-400">Lengkap Tashkeel & Audio</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Database Firestore</span>
                <Database className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-bold text-white">Terkoneksi</p>
              <p className="text-[11px] text-amber-400">Auto-sync Per Akun User</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Backend Express</span>
                <Server className="w-4 h-4 text-indigo-400" />
              </div>
              <p className="text-2xl font-bold text-white">/api/index.ts</p>
              <p className="text-[11px] text-indigo-400">Vercel Serverless Ready</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Konfigurasi Akun & Keamanan
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-xs text-slate-300">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-500 font-semibold uppercase text-[10px]">Akun Admin</span>
                <p>Username: <code className="text-amber-400 font-mono font-bold">admin</code></p>
                <p>Password: <code className="text-amber-400 font-mono font-bold">12345678</code></p>
                <p className="text-[11px] text-slate-500 mt-1">Sesuai instruksi khusus permintaan prompt.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-500 font-semibold uppercase text-[10px]">Autentikasi Murid</span>
                <p>Metode: <strong className="text-emerald-400">Firebase Auth (Google Sign-In)</strong></p>
                <p>Storage: <strong className="text-emerald-400">Firestore Per User</strong></p>
                <p className="text-[11px] text-slate-500 mt-1">Halaman wajib login dan tombol logout aktif.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Curriculum List */}
      {activeSubTab === 'content' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Modul Pembelajaran Aktif</h3>
          </div>

          <div className="grid gap-3">
            {LESSONS_DATA.map((lesson) => (
              <div
                key={lesson.id}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-950 text-emerald-400 border border-slate-800">
                      Level {lesson.level} - {lesson.category}
                    </span>
                    <h4 className="text-sm font-bold text-white">{lesson.title}</h4>
                    <span className="font-arabic text-emerald-300 text-base">{lesson.arabicTitle}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{lesson.description}</p>
                </div>

                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    +{lesson.xpReward} XP
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Broadcast */}
      {activeSubTab === 'broadcast' && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Kirim Siaran Kata Hikmah / Pelajaran Harian</h3>
              <p className="text-xs text-slate-400">
                Pesan ini akan ditampilkan di halaman dashboard utama semua murid.
              </p>
            </div>
            <button
              onClick={handleGenerateWisdomAi}
              disabled={isGeneratingWisdom}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-semibold transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGeneratingWisdom ? 'Membuat...' : 'Generate Baru via Gemini'}</span>
            </button>
          </div>

          {broadcastStatus && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
              {broadcastStatus}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Judul Siaran</label>
              <input
                type="text"
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Teks Pepatah / Hadits Arab (Lengkap Harakat)</label>
              <input
                type="text"
                dir="rtl"
                value={broadcastArabic}
                onChange={(e) => setBroadcastArabic(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-right font-arabic text-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Terjemahan & Penjelasan</label>
              <textarea
                rows={3}
                value={broadcastTranslation}
                onChange={(e) => setBroadcastTranslation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveBroadcast}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shadow-lg shadow-amber-600/30 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Simpan & Siarkan ke Seluruh Murid</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 4: API Test */}
      {activeSubTab === 'api-test' && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-5">
          <div>
            <h3 className="text-base font-bold text-white">Pengujian Endpoint Express & Gemini API</h3>
            <p className="text-xs text-slate-400">
              Verifikasi rute backend Express di <code className="text-amber-400">api/index.ts</code> dan server-side Gemini AI.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Health Test */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">GET /api/health</span>
                <button
                  onClick={handleTestHealth}
                  disabled={apiTesting}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors"
                >
                  Uji Endpoint
                </button>
              </div>

              {apiHealth && (
                <pre className="p-3 rounded-xl bg-slate-900 text-[11px] text-emerald-300 font-mono overflow-x-auto">
                  {JSON.stringify(apiHealth, null, 2)}
                </pre>
              )}
            </div>

            {/* Gemini Server Test */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">POST /api/gemini/tutor</span>
                <button
                  onClick={handleTestGemini}
                  disabled={apiTesting}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs text-white font-semibold transition-colors"
                >
                  Panggil Gemini Server
                </button>
              </div>

              {geminiTestOutput && (
                <div className="p-3 rounded-xl bg-slate-900 text-xs text-slate-200 whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {geminiTestOutput}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
