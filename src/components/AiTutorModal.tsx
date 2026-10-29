import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User as UserIcon,
  Copy,
  Check,
  MessageSquare,
  BookOpen,
  Coffee,
} from 'lucide-react';
import { AudioButton } from './AudioButton';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  arabicSnippet?: string;
}

interface AiTutorModalProps {
  onClose: () => void;
}

export const AiTutorModal: React.FC<AiTutorModalProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      text: 'Ahlan wa Sahlan! Saya **Ustadz AI ArabiyaHub** siap mendampingi antum belajar bahasa Arab Fusha. Ada kaidah Nahwu/Shorof yang ingin dibahas, latihan percakapan, atau makna kata tertentu?',
      arabicSnippet: 'أَهْلًا وَسَهْلًا بِكُمْ فِي مَرْكَزِ الْعَرَبِيَّةِ الذَّكِيِّ',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'conversation' | 'grammar' | 'general'>('general');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const quickPrompts = [
    {
      title: 'Perbedaan Isim & Fi\'il',
      text: 'Ustadz, tolong jelaskan perbedaan mendasar antara Isim dan Fi\'il beserta contohnya.',
    },
    {
      title: 'Latihan Percakapan Restoran',
      text: 'Ayo buat dialog simulasi memesan makanan dan minuman di restoran Arab.',
    },
    {
      title: 'I\'rab Jumlah Ismiyyah',
      text: 'Bagaimana cara meng-i\'rab kalimat: "الْعِلْمُ نُورٌ" (Al-\'ilmu nuurun)?',
    },
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const historyPayload = messages.slice(-6).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const response = await fetch('/api/gemini/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: historyPayload,
          mode,
        }),
      });

      const data = await response.json();

      if (response.ok && data.reply) {
        // Extract Arabic sentence snippet for audio button if present
        const arabicMatch = data.reply.match(/[\u0600-\u06FF\s،؛ـ؟]+/g);
        const longestArabic = arabicMatch
          ? arabicMatch.sort((a: string, b: string) => b.length - a.length)[0]?.trim()
          : undefined;

        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: data.reply,
          arabicSnippet: longestArabic && longestArabic.length > 5 ? longestArabic : undefined,
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error(data.error || 'Server error');
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: 'Afwan, terjadi kendala saat menghubungkan ke server AI: ' + (err.message || 'Coba lagi nanti.'),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-emerald-900/60 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Ustadz AI ArabiyaHub</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Gemini Server-Side
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Tutor interaktif Nahwu, Shorof, Mufrodat, dan Percakapan Fusha
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

        {/* Mode Selector */}
        <div className="px-4 py-2 border-b border-slate-800/60 bg-slate-950/40 flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Mode:</span>
          <button
            onClick={() => setMode('general')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              mode === 'general' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Umum & Tanya Bebas
          </button>
          <button
            onClick={() => setMode('conversation')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              mode === 'conversation' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Latihan Percakapan
          </button>
          <button
            onClick={() => setMode('grammar')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              mode === 'grammar' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Kaidah Nahwu / I&apos;rab
          </button>
        </div>

        {/* Chat History */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center shrink-0 text-emerald-400">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-slate-950 border border-emerald-900/30 text-slate-200 rounded-tl-none space-y-2'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>

                {m.role === 'assistant' && (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                    <div className="flex items-center gap-2">
                      {m.arabicSnippet && (
                        <AudioButton arabicText={m.arabicSnippet} size="sm" label="Lafalkan" />
                      )}
                    </div>
                    <button
                      onClick={() => copyText(m.id, m.text)}
                      className="p-1 hover:text-white transition-colors cursor-pointer"
                      title="Salin jawaban"
                    >
                      {copiedId === m.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                )}
              </div>

              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-slate-300">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center text-slate-400 text-xs">
              <div className="w-8 h-8 rounded-full bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce delay-150" />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce delay-300" />
                <span className="ml-2 text-xs">Ustadz AI sedang menyusun materi...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        {messages.length < 3 && (
          <div className="px-4 py-2 border-t border-slate-800/50 bg-slate-950/30 flex items-center gap-2 overflow-x-auto text-[11px]">
            <span className="text-slate-500 shrink-0">Contoh:</span>
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q.text)}
                className="px-3 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 whitespace-nowrap transition-colors cursor-pointer"
              >
                {q.title}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/90">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanyakan kata bahasa Arab, kaidah Nahwu, atau ajak mengobrol..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
