import React, { useState } from 'react';
import { VOCABULARY_LIST, VocabItem } from '../data/vocabularyData';
import { useAuth } from '../context/AuthContext';
import { AudioButton } from './AudioButton';
import {
  Search,
  Bookmark,
  BookmarkCheck,
  Plus,
  Trash2,
  Sparkles,
  Layers,
  Check,
  Volume2,
} from 'lucide-react';

export const VocabExplorer: React.FC = () => {
  const { savedVocabs, saveVocabulary, removeVocabulary } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New word form state
  const [newArabic, setNewArabic] = useState('');
  const [newLatin, setNewLatin] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [newCategory, setNewCategory] = useState('Kata Benda');
  const [newNotes, setNewNotes] = useState('');

  const categories = [
    'Semua',
    'Tersimpan Saya',
    'Kata Benda',
    'Kata Kerja',
    'Angka',
    'Percakapan',
  ];

  // Merge default list with user saved vocabs
  const allVocabs: (VocabItem & { isUserCustom?: boolean })[] = [
    ...savedVocabs.map((v) => ({
      id: v.id,
      arabicWord: v.arabicWord,
      transliteration: v.transliteration,
      indonesianMeaning: v.indonesianMeaning,
      category: v.category || 'Tersimpan',
      exampleSentenceArabic: v.notes || '',
      exampleSentenceTranslation: '',
      isUserCustom: true,
    })),
    ...VOCABULARY_LIST,
  ];

  // Filter based on category and search
  const filteredVocabs = allVocabs.filter((item) => {
    const matchesCategory =
      selectedCategory === 'Semua'
        ? true
        : selectedCategory === 'Tersimpan Saya'
        ? item.isUserCustom || savedVocabs.some((s) => s.arabicWord === item.arabicWord)
        : item.category.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchesSearch =
      item.arabicWord.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.indonesianMeaning.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const isSaved = (word: string) => {
    return savedVocabs.some((v) => v.arabicWord === word);
  };

  const toggleSave = async (item: VocabItem) => {
    if (isSaved(item.arabicWord)) {
      const target = savedVocabs.find((v) => v.arabicWord === item.arabicWord);
      if (target) {
        await removeVocabulary(target.id);
      }
    } else {
      await saveVocabulary({
        arabicWord: item.arabicWord,
        transliteration: item.transliteration,
        indonesianMeaning: item.indonesianMeaning,
        category: item.category,
        masteryLevel: 1,
        notes: item.exampleSentenceArabic,
      });
    }
  };

  const handleAddNewWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArabic.trim() || !newMeaning.trim()) return;

    await saveVocabulary({
      arabicWord: newArabic.trim(),
      transliteration: newLatin.trim(),
      indonesianMeaning: newMeaning.trim(),
      category: newCategory,
      masteryLevel: 1,
      notes: newNotes.trim(),
    });

    setNewArabic('');
    setNewLatin('');
    setNewMeaning('');
    setNewNotes('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Kamus & Flashcard Mufrodat</span>
            <span className="font-arabic text-emerald-400 text-lg">الْمُفْرَدَاتُ</span>
          </h2>
          <p className="text-xs text-slate-400">
            Kumpulan kosa kata bahasa Arab pilihan lengkap dengan harakat, audio, dan contoh kalimat
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kosa Kata Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
              {cat === 'Tersimpan Saya' && savedVocabs.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-950 text-emerald-300">
                  {savedVocabs.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kata atau arti..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Grid of Flashcards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVocabs.map((item) => {
          const saved = isSaved(item.arabicWord);
          return (
            <div
              key={item.id}
              className="group p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-600/50 hover:shadow-xl hover:shadow-emerald-950/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-950 text-emerald-400 border border-slate-800">
                    {item.category}
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    <AudioButton arabicText={item.arabicWord} size="sm" />
                    <button
                      onClick={() => toggleSave(item)}
                      title={saved ? 'Hapus dari simpanan' : 'Simpan ke Kosakata Saya'}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        saved
                          ? 'text-amber-400 bg-amber-500/10'
                          : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {saved ? (
                        <BookmarkCheck className="w-4 h-4" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                    {item.isUserCustom && (
                      <button
                        onClick={() => removeVocabulary(item.id)}
                        title="Hapus kata kustom"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Big Arabic Script */}
                <div className="text-right py-2">
                  <p className="font-arabic text-3xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {item.arabicWord}
                  </p>
                </div>

                {/* Transliteration & Meaning */}
                <div className="space-y-1 text-xs pt-1 border-t border-slate-800/80">
                  <p className="text-slate-400 italic">
                    <span className="not-italic text-slate-500 font-medium">Baca:</span> {item.transliteration}
                  </p>
                  <p className="text-slate-200 font-semibold text-sm">
                    {item.indonesianMeaning}
                  </p>
                </div>

                {/* Example sentence if any */}
                {item.exampleSentenceArabic && (
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-right space-y-1">
                    <p className="font-arabic text-sm text-emerald-300">
                      {item.exampleSentenceArabic}
                    </p>
                    {item.exampleSentenceTranslation && (
                      <p className="text-[11px] text-slate-400 text-left">
                        {item.exampleSentenceTranslation}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredVocabs.length === 0 && (
        <div className="text-center py-12 p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
          Tidak ada kosa kata yang cocok dengan filter. Coba cari kata lain atau tambahkan kosa kata baru!
        </div>
      )}

      {/* Add Custom Word Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-900/60 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Tambah Kosa Kata Baru</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewWord} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Kata Bahasa Arab (berharakat)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={newArabic}
                  onChange={(e) => setNewArabic(e.target.value)}
                  required
                  placeholder="مثال: قَلَمٌ"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-right font-arabic text-lg text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Cara Baca Latin
                </label>
                <input
                  type="text"
                  value={newLatin}
                  onChange={(e) => setNewLatin(e.target.value)}
                  placeholder="Contoh: Qalamun"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Arti Bahasa Indonesia
                </label>
                <input
                  type="text"
                  value={newMeaning}
                  onChange={(e) => setNewMeaning(e.target.value)}
                  required
                  placeholder="Contoh: Pulpen / Pena"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Kategori
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Kata Benda">Kata Benda (Isim)</option>
                  <option value="Kata Kerja">Kata Kerja (Fi&apos;il)</option>
                  <option value="Angka">Angka</option>
                  <option value="Percakapan">Percakapan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Contoh Kalimat / Catatan Tambahan (Opsional)
                </label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Contoh kalimat penggunaan kata ini"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30"
                >
                  Simpan ke Firestore
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
