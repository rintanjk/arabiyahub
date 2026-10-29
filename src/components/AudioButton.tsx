import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioButtonProps {
  arabicText: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  arabicText,
  size = 'md',
  className = '',
  label,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const speak = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!('speechSynthesis' in window)) {
      alert('Browser Anda belum mendukung text-to-speech audio.');
      return;
    }

    window.speechSynthesis.cancel();

    // Clean up text if needed for speech
    const cleanText = arabicText.replace(/[^\u0600-\u06FF\s]/g, '').trim() || arabicText;
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.85; // slightly slower for language learners

    // Find Arabic voice if available
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find((v) => v.lang.startsWith('ar'));
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'p-2 text-sm',
    lg: 'p-2.5 text-base',
  };

  return (
    <button
      onClick={speak}
      type="button"
      title="Dengarkan pengucapan fasih bahasa Arab"
      className={`inline-flex items-center gap-1.5 rounded-full transition-all duration-200 cursor-pointer ${
        isPlaying
          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-105'
          : 'bg-emerald-950/60 hover:bg-emerald-800 text-emerald-300 border border-emerald-700/40'
      } ${sizeClasses[size]} ${className}`}
    >
      {isPlaying ? (
        <Volume2 className="w-4 h-4 animate-pulse text-white" />
      ) : (
        <Volume2 className="w-4 h-4" />
      )}
      {label && <span className="font-medium text-xs pr-1">{label}</span>}
    </button>
  );
};
