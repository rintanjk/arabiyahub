import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Award,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { AudioButton } from './AudioButton';
import { useAuth } from '../context/AuthContext';

interface QuizQuestion {
  id: number;
  question: string;
  arabicContext?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface QuizGeneratorModalProps {
  onClose: () => void;
}

export const QuizGeneratorModal: React.FC<QuizGeneratorModalProps> = ({ onClose }) => {
  const { addXP } = useAuth();
  const [topic, setTopic] = useState('Percakapan Sehari-hari');
  const [level, setLevel] = useState('Dasar');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const topicsList = [
    'Percakapan Sehari-hari',
    'Mufrodat Sekolah & Belajar',
    'Kaidah Nahwu: Isim, Fi\'il, & Huruf',
    'Kaidah Dhomir & Kata Ganti',
    'Angka & Bilangan Arab',
    'Mufrodat Rumah & Keluarga',
  ];

  const handleGenerate = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/gemini/quiz-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, level }),
      });

      const data = await res.json();
      if (res.ok && data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setCurrentIndex(0);
        setSelectedAnswers({});
        setShowFeedback(false);
        setIsCompleted(false);
      } else {
        throw new Error(data.error || 'Gagal menghasilkan kuis');
      }
    } catch (err: any) {
      console.error('Quiz gen error:', err);
      setErrorMsg(err.message || 'Gagal membuat kuis otomatis');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (idx: number) => {
    if (showFeedback) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: idx,
    }));
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      addXP(100);
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }
    }
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-emerald-900/60 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Generator Kuis AI Gemini</h2>
              <p className="text-xs text-slate-400">
                Latihan soal dinamis tanpa batas sesuai topik & tingkatan Anda
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

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {questions.length === 0 && !loading && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <label className="block text-xs font-semibold text-slate-300">
                  Pilih Topik Soal:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {topicsList.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTopic(t)}
                      className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                        topic === t
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-semibold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Tingkat Kesulitan:
                </label>
                <div className="flex gap-2">
                  {['Dasar (Mubtadi)', 'Menengah (Mutawassith)', 'Lanjutan (Mutaqoddim)'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setLevel(lvl)}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                        level === lvl
                          ? 'bg-emerald-600 border-emerald-500 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {lvl.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {errorMsg}
                </div>
              )}

              <button
                onClick={handleGenerate}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Buat Soal Kuis Sekarang (AI Gemini)</span>
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center py-16 space-y-3">
              <Sparkles className="w-10 h-10 text-emerald-400 animate-spin mx-auto" />
              <p className="text-sm font-semibold text-white">
                Gemini sedang meracik 4 soal berkualitas tinggi...
              </p>
              <p className="text-xs text-slate-400">
                Menyusun opsi jawaban, teks Arab berharakat, dan penjelasan kaidah
              </p>
            </div>
          )}

          {questions.length > 0 && !isCompleted && currentQ && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Soal {currentIndex + 1} dari {questions.length}</span>
                <span className="text-emerald-400 font-semibold">{topic}</span>
              </div>

              {/* Question */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h3 className="text-sm sm:text-base font-bold text-white leading-relaxed">
                  {currentQ.question}
                </h3>
                {currentQ.arabicContext && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/30">
                    <AudioButton arabicText={currentQ.arabicContext} size="sm" />
                    <p className="font-arabic text-xl font-bold text-emerald-300 text-right">
                      {currentQ.arabicContext}
                    </p>
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentIndex] === optIdx;
                  const isCorrect = optIdx === currentQ.correctIndex;

                  let style = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200';
                  if (showFeedback) {
                    if (isCorrect) {
                      style = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                    } else if (isSelected && !isCorrect) {
                      style = 'bg-rose-950/80 border-rose-500 text-rose-200';
                    }
                  } else if (isSelected) {
                    style = 'bg-emerald-950 border-emerald-500 text-white';
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${style}`}
                    >
                      <span>{opt}</span>
                      <span className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-[10px]">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                    </button>
                  );
                })}
              </div>

              {showFeedback && (
                <div className="p-4 rounded-xl bg-slate-950 border border-emerald-800/40 text-xs space-y-1 animate-fadeIn">
                  <p className="font-semibold text-emerald-400">Pembahasan Kaidah:</p>
                  <p className="text-slate-300">{currentQ.explanation}</p>
                </div>
              )}

              {showFeedback && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                  >
                    <span>
                      {currentIndex < questions.length - 1 ? 'Soal Berikutnya' : 'Selesaikan Kuis'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {isCompleted && (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center mx-auto text-emerald-400">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Kuis AI Selesai!</h3>
              <p className="text-xs text-slate-300">
                Selamat! Anda mendapatkan <strong className="text-amber-400">+100 XP</strong> tambahan.
              </p>
              <div className="pt-3 flex justify-center gap-3">
                <button
                  onClick={() => {
                    setQuestions([]);
                    setIsCompleted(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Buat Kuis Topik Lain</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                >
                  Tutup
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
