import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ArrowRight,
  BookOpen,
  Volume2,
  BookmarkPlus,
  Check,
  Languages,
  HelpCircle,
} from 'lucide-react';
import { AudioButton } from './AudioButton';
import { useAuth } from '../context/AuthContext';

interface WordBreakdown {
  word: string;
  type: string;
  meaning: string;
  harakatExplanation: string;
}

interface HarakatAnalysis {
  originalText: string;
  vowelledText: string;
  transliteration: string;
  indonesianTranslation: string;
  wordsBreakdown: WordBreakdown[];
  grammarNotes: string;
  usageExample?: string;
}

interface HarakatCheckerProps {
  onClose: () => void;
}

export const HarakatChecker: React.FC<HarakatCheckerProps> = ({ onClose }) => {
  const { saveVocabulary } = useAuth();
  const [inputText, setInputText] = useState('ذهب الطالب الى المسجد');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HarakatAnalysis | null>(null);
  const [savedStatus, setSavedStatus] = useState<Record<string, boolean>>({});
  const [errorMsg, setErrorMsg] = useState('');

  const sampleTexts = [
    'ذهب الطالب الى المسجد',
    'الولد يكتب الدرس بالقلم',
    'العلم نور والجهل ظلام',
    'قرأت كتابا مفيدا في المكتبة',
  ];

  const handleAnalyze = async (textToUse?: string) => {
    const text = textToUse || inputText;
    if (!text.trim() || loading) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/gemini/check-harakat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      if (res.ok && data.vowelledText) {
        setResult(data);
      } else {
        throw new Error(data.error || 'Gagal memproses');
      }
    } catch (err: any) {
      console.error('Harakat check error:', err);
      setErrorMsg(err.message || 'Gagal menganalisis teks. Pastikan server aktif.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWord = async (wb: WordBreakdown) => {
    await saveVocabulary({
      arabicWord: wb.word,
      transliteration: wb.meaning,
      indonesianMeaning: `${wb.meaning} (${wb.type})`,
      category: wb.type.includes('Fi\'il') ? 'Kata Kerja' : 'Kata Benda',
      masteryLevel: 1,
      notes: wb.harakatExplanation,
    });
    setSavedStatus((prev) => ({ ...prev, [wb.word]: true }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-teal-900/60 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Pemeriksa Harakat & I&apos;rab AI</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-400 border border-teal-500/30">
                  Tashkeel Otomatis
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Lengkapi teks gundul dengan harakat akurat, cara baca, dan analisa gramatikal
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* Input Box */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-300">
              Ketik atau tempel teks bahasa Arab (boleh tanpa harakat / Arab gundul):
            </label>
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                dir="rtl"
                rows={3}
                placeholder="اكتب هنا باللغة العربية..."
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 font-arabic text-xl sm:text-2xl text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              />
            </div>

            {/* Quick Sample Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-400">
              <span className="text-[11px] text-slate-500">Coba contoh:</span>
              {sampleTexts.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputText(sample);
                    handleAnalyze(sample);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-teal-300 font-arabic text-sm transition-colors cursor-pointer"
                >
                  {sample}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleAnalyze()}
              disabled={loading || !inputText.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-semibold text-sm shadow-lg shadow-teal-600/20 disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Menganalisis Harakat & Kaidah...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analisis & Beri Harakat Lengkap</span>
                </>
              )}
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Analysis Result Card */}
          {result && (
            <div className="space-y-6 pt-4 border-t border-slate-800 animate-fadeIn">
              
              {/* Primary Output Display */}
              <div className="p-5 rounded-2xl bg-teal-950/20 border border-teal-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
                    Hasil Harakat Lengkap (Tashkeel)
                  </span>
                  <AudioButton arabicText={result.vowelledText} label="Dengarkan Pelafalan" />
                </div>

                <div className="text-right py-2">
                  <p className="font-arabic text-3xl sm:text-4xl font-bold text-white leading-loose tracking-wide">
                    {result.vowelledText}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 pt-3 border-t border-teal-900/40 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Cara Baca (Latin):</span>
                    <p className="text-teal-200 font-medium italic">{result.transliteration}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Terjemahan Indonesia:</span>
                    <p className="text-white font-medium">{result.indonesianTranslation}</p>
                  </div>
                </div>
              </div>

              {/* Grammar & I'rab Notes */}
              {result.grammarNotes && (
                <div className="p-4 rounded-xl bg-slate-950/80 border-l-4 border-teal-500 text-xs space-y-1">
                  <p className="font-semibold text-teal-300">Kaidah Nahwu / Shorof:</p>
                  <p className="text-slate-300 leading-relaxed">{result.grammarNotes}</p>
                </div>
              )}

              {/* Word-by-Word Breakdown Table */}
              {result.wordsBreakdown && result.wordsBreakdown.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Bedah Kata & Alasan Harakat (I&apos;rab):
                  </h3>

                  <div className="grid gap-2.5">
                    {result.wordsBreakdown.map((wb, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <AudioButton arabicText={wb.word} size="sm" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-arabic text-xl font-bold text-teal-300">
                                {wb.word}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-teal-400">
                                {wb.type}
                              </span>
                            </div>
                            <p className="text-xs text-slate-300 mt-0.5">{wb.meaning}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">{wb.harakatExplanation}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleSaveWord(wb)}
                          disabled={savedStatus[wb.word]}
                          title="Simpan ke Kamus Saya"
                          className="px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer bg-slate-800 hover:bg-teal-950 text-slate-300 hover:text-teal-300 disabled:opacity-50"
                        >
                          {savedStatus[wb.word] ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400 text-[10px]">Tersimpan</span>
                            </>
                          ) : (
                            <>
                              <BookmarkPlus className="w-3.5 h-3.5" />
                              <span className="text-[10px]">Simpan</span>
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
