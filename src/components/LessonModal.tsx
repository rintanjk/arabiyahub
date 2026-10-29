import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Lesson } from '../types';
import { useAuth } from '../context/AuthContext';
import { AudioButton } from './AudioButton';
import {
  X,
  CheckCircle,
  HelpCircle,
  Award,
  ChevronRight,
  BookOpen,
  ArrowLeft,
  RotateCcw,
} from 'lucide-react';

interface LessonModalProps {
  lesson: Lesson;
  onClose: () => void;
}

export const LessonModal: React.FC<LessonModalProps> = ({ lesson, onClose }) => {
  const { markLessonComplete, addXP } = useAuth();
  const [activeStep, setActiveStep] = useState<'material' | 'quiz' | 'result'>('material');
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = lesson.quiz[currentQuizIndex];

  const handleSelectOption = (optionIndex: number) => {
    if (showAnswerFeedback) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuizIndex]: optionIndex,
    }));
    setShowAnswerFeedback(true);
  };

  const handleNextQuestion = () => {
    setShowAnswerFeedback(false);
    if (currentQuizIndex < lesson.quiz.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
    } else {
      // Calculate final score
      let correctCount = 0;
      lesson.quiz.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctIndex) {
          correctCount++;
        }
      });
      const calculatedScore = Math.round((correctCount / lesson.quiz.length) * 100);
      setScore(calculatedScore);
      setActiveStep('result');

      // Save to Firestore and award XP
      markLessonComplete(lesson.id, calculatedScore);
      addXP(lesson.xpReward);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore if canvas not available
      }
    }
  };

  const restartQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedAnswers({});
    setShowAnswerFeedback(false);
    setActiveStep('quiz');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-emerald-900/50 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {lesson.category}
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                {lesson.title}
              </h2>
              <p className="text-xs text-emerald-400 font-arabic text-base leading-none">
                {lesson.arabicTitle}
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

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {activeStep === 'material' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
                {lesson.description}
              </div>

              {lesson.materials.map((mat, index) => (
                <div
                  key={index}
                  className="p-5 rounded-2xl bg-slate-950/80 border border-emerald-900/30 hover:border-emerald-600/40 transition-colors space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-emerald-300 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-bold">
                        {index + 1}
                      </span>
                      {mat.sectionTitle}
                    </h3>
                    <AudioButton arabicText={mat.arabicText} label="Dengar" />
                  </div>

                  {/* Arabic Text Display */}
                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/30 text-right">
                    <p className="font-arabic text-2xl sm:text-3xl font-bold text-emerald-200 leading-loose tracking-wide">
                      {mat.arabicText}
                    </p>
                  </div>

                  {/* Transliteration & Translation */}
                  <div className="space-y-1 text-xs">
                    <p className="text-slate-400 italic">
                      <strong className="text-slate-300 not-italic">Cara Baca:</strong> {mat.transliteration}
                    </p>
                    <p className="text-slate-200 font-medium">
                      <strong className="text-emerald-400">Terjemahan:</strong> {mat.indonesianTranslation}
                    </p>
                  </div>

                  {mat.notes && (
                    <div className="p-3 rounded-lg bg-slate-900/90 border-l-2 border-emerald-500 text-xs text-slate-400">
                      <strong className="text-emerald-300 block mb-0.5">Kaidah / Catatan Penting:</strong>
                      {mat.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeStep === 'quiz' && currentQuestion && (
            <div className="space-y-5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Soal {currentQuizIndex + 1} dari {lesson.quiz.length}</span>
                <span className="text-emerald-400 font-semibold">Kuis Pemahaman</span>
              </div>

              {/* Question Card */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h3 className="text-base font-bold text-white leading-snug">
                  {currentQuestion.question}
                </h3>
                {currentQuestion.arabicQuestion && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/30 text-right">
                    <AudioButton arabicText={currentQuestion.arabicQuestion} size="sm" />
                    <p className="font-arabic text-xl font-bold text-emerald-300">
                      {currentQuestion.arabicQuestion}
                    </p>
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQuestion.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentQuizIndex] === optIdx;
                  const isCorrect = optIdx === currentQuestion.correctIndex;

                  let buttonStyle = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200';
                  if (showAnswerFeedback) {
                    if (isCorrect) {
                      buttonStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                    } else if (isSelected && !isCorrect) {
                      buttonStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                    }
                  } else if (isSelected) {
                    buttonStyle = 'bg-emerald-950 border-emerald-500 text-white';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full p-4 rounded-xl border text-left text-sm transition-all duration-150 flex items-center justify-between cursor-pointer ${buttonStyle}`}
                    >
                      <span>{opt}</span>
                      <span className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-xs">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Answer Explanation */}
              {showAnswerFeedback && (
                <div className="p-4 rounded-xl bg-slate-950/90 border border-emerald-800/40 text-xs space-y-1 animate-fadeIn">
                  <p className="font-semibold text-emerald-400">Penjelasan Kaidah:</p>
                  <p className="text-slate-300">{currentQuestion.explanation}</p>
                </div>
              )}
            </div>
          )}

          {activeStep === 'result' && (
            <div className="text-center py-8 space-y-4">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-500/20">
                <Award className="w-10 h-10" />
              </div>

              <h3 className="text-2xl font-bold text-white">
                Maa Syaa Allah! Pelajaran Selesai!
              </h3>
              <p className="text-xs text-emerald-400 font-arabic text-xl">
                بَارَكَ اللهُ فِيكَ
              </p>

              <div className="max-w-xs mx-auto p-4 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-2 gap-3 text-center my-4">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">Nilai Kuis</span>
                  <p className="text-2xl font-bold text-emerald-400">{score}%</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">Hadiah XP</span>
                  <p className="text-2xl font-bold text-amber-400">+{lesson.xpReward}</p>
                </div>
              </div>

              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Kemajuan Anda telah disimpan otomatis ke Google Firebase Firestore. Tingkat pemahaman dan streak Anda terus meningkat!
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          {activeStep === 'material' ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={() => setActiveStep('quiz')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <span>Mulai Kuis Latihan</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          ) : activeStep === 'quiz' ? (
            <>
              <button
                onClick={() => setActiveStep('material')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Baca Materi Lagi</span>
              </button>

              <button
                onClick={handleNextQuestion}
                disabled={!showAnswerFeedback}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <span>
                  {currentQuizIndex < lesson.quiz.length - 1 ? 'Soal Berikutnya' : 'Selesaikan Kuis'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="w-full flex items-center justify-between">
              <button
                onClick={restartQuiz}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Ulangi Kuis</span>
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                Lanjut ke Materi Lain
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
