export interface VocabItem {
  id: string;
  arabicWord: string;
  transliteration: string;
  indonesianMeaning: string;
  category: string;
  exampleSentenceArabic: string;
  exampleSentenceTranslation: string;
}

export const VOCABULARY_LIST: VocabItem[] = [
  // Benda / Isim
  {
    id: 'v-1',
    arabicWord: 'كِتَابٌ',
    transliteration: 'Kitaabun',
    indonesianMeaning: 'Buku',
    category: 'Kata Benda',
    exampleSentenceArabic: 'هَذَا كِتَابٌ مُفِيدٌ جِدًّا',
    exampleSentenceTranslation: 'Ini adalah buku yang sangat bermanfaat.'
  },
  {
    id: 'v-2',
    arabicWord: 'قَلَمٌ',
    transliteration: 'Qalamun',
    indonesianMeaning: 'Pena / Pulpen',
    category: 'Kata Benda',
    exampleSentenceArabic: 'اشْتَرَيْتُ قَلَمًا جَدِيدًا',
    exampleSentenceTranslation: 'Saya membeli sebuah pena baru.'
  },
  {
    id: 'v-3',
    arabicWord: 'مَسْجِدٌ',
    transliteration: 'Masjidun',
    indonesianMeaning: 'Masjid',
    category: 'Kata Benda',
    exampleSentenceArabic: 'نُصَلِّي الظُّهْرَ فِي الْمَسْجِدِ',
    exampleSentenceTranslation: 'Kami shalat dzuhur di masjid.'
  },
  {
    id: 'v-4',
    arabicWord: 'بَيْتٌ',
    transliteration: 'Baytun',
    indonesianMeaning: 'Rumah',
    category: 'Kata Benda',
    exampleSentenceArabic: 'بَيْتِي قَرِيبٌ مِنَ الْمَدْرَسَةِ',
    exampleSentenceTranslation: 'Rumah saya dekat dari sekolah.'
  },
  {
    id: 'v-5',
    arabicWord: 'سَيَّارَةٌ',
    transliteration: 'Sayyaaratun',
    indonesianMeaning: 'Mobil',
    category: 'Kata Benda',
    exampleSentenceArabic: 'رَكِبْتُ السَّيَّارَةَ إِلَى الْمَدِينَةِ',
    exampleSentenceTranslation: 'Saya menaiki mobil menuju kota.'
  },
  {
    id: 'v-6',
    arabicWord: 'حَاسُوبٌ',
    transliteration: 'Haasuubun',
    indonesianMeaning: 'Komputer / Laptop',
    category: 'Kata Benda',
    exampleSentenceArabic: 'أَتَعَلَّمُ اللُّغَةَ الْعَرَبِيَّةَ بِالْحَاسُوبِ',
    exampleSentenceTranslation: 'Saya belajar bahasa Arab menggunakan komputer.'
  },

  // Fi'il / Kata Kerja
  {
    id: 'v-7',
    arabicWord: 'قَرَأَ - يَقْرَأُ',
    transliteration: 'Qara\'a - Yaqra\'u',
    indonesianMeaning: 'Membaca',
    category: 'Kata Kerja',
    exampleSentenceArabic: 'أَقْرَأُ الْقُرْآنَ الْكَرِيمَ كُلَّ صَبَاحٍ',
    exampleSentenceTranslation: 'Saya membaca Al-Qur\'an setiap pagi.'
  },
  {
    id: 'v-8',
    arabicWord: 'كَتَبَ - يَكْتُبُ',
    transliteration: 'Kataba - Yaktubu',
    indonesianMeaning: 'Menulis',
    category: 'Kata Kerja',
    exampleSentenceArabic: 'يَكْتُبُ الطَّالِبُ الدَّرْسَ عَلَى الدَّفْتَرِ',
    exampleSentenceTranslation: 'Siswa itu menulis pelajaran di buku tulis.'
  },
  {
    id: 'v-9',
    arabicWord: 'ذَهَبَ - يَذْهَبُ',
    transliteration: 'Dzahaba - Yadzhabu',
    indonesianMeaning: 'Pergi',
    category: 'Kata Kerja',
    exampleSentenceArabic: 'نَذْهَبُ إِلَى الْمَسْجِدِ مَعًا',
    exampleSentenceTranslation: 'Kami pergi ke masjid bersama-sama.'
  },
  {
    id: 'v-10',
    arabicWord: 'أَكَلَ - يَأْكُلُ',
    transliteration: 'Akala - Ya\'kulu',
    indonesianMeaning: 'Makan',
    category: 'Kata Kerja',
    exampleSentenceArabic: 'تَأْكُلُ الْأُسْرَةُ الْفُطُورَ فِي الصَّبَاحِ',
    exampleSentenceTranslation: 'Keluarga memakan sarapan di pagi hari.'
  },
  {
    id: 'v-11',
    arabicWord: 'شَرِبَ - يَشْرَبُ',
    transliteration: 'Syariba - Yasyrabu',
    indonesianMeaning: 'Minum',
    category: 'Kata Kerja',
    exampleSentenceArabic: 'أَشْرَبُ الْمَاءَ الْبَارِدَ',
    exampleSentenceTranslation: 'Saya meminum air dingin.'
  },

  // Angka
  {
    id: 'v-12',
    arabicWord: 'وَاحِدٌ (١)',
    transliteration: 'Waahidun',
    indonesianMeaning: 'Satu',
    category: 'Angka',
    exampleSentenceArabic: 'عِنْدِي كِتَابٌ وَاحِدٌ',
    exampleSentenceTranslation: 'Saya memiliki satu buku.'
  },
  {
    id: 'v-13',
    arabicWord: 'اِثْنَانِ (٢)',
    transliteration: 'Itsnaani',
    indonesianMeaning: 'Dua',
    category: 'Angka',
    exampleSentenceArabic: 'فِي الْفَصْلِ قَلَمَانِ اثْنَانِ',
    exampleSentenceTranslation: 'Di kelas ada dua pulpen.'
  },
  {
    id: 'v-14',
    arabicWord: 'ثَلَاثَةٌ (٣)',
    transliteration: 'Tsalaatsatun',
    indonesianMeaning: 'Tiga',
    category: 'Angka',
    exampleSentenceArabic: 'لَدَيَّ ثَلَاثَةُ إِخْوَةٍ',
    exampleSentenceTranslation: 'Saya memiliki tiga orang saudara.'
  },
  {
    id: 'v-15',
    arabicWord: 'عَشَرَةٌ (١٠)',
    transliteration: '\'Asyaratun',
    indonesianMeaning: 'Sepuluh',
    category: 'Angka',
    exampleSentenceArabic: 'قَرَأْتُ عَشْرَ صَفَحَاتٍ',
    exampleSentenceTranslation: 'Saya telah membaca sepuluh halaman.'
  },

  // Percakapan & Sapaan
  {
    id: 'v-16',
    arabicWord: 'شُكْرًا جَزِيلًا',
    transliteration: 'Syukran jaziilan',
    indonesianMeaning: 'Terima kasih banyak',
    category: 'Percakapan',
    exampleSentenceArabic: 'شُكْرًا جَزِيلًا عَلَى مُسَاعَدَتِكَ',
    exampleSentenceTranslation: 'Terima kasih banyak atas bantuanmu.'
  },
  {
    id: 'v-17',
    arabicWord: 'عَفْوًا',
    transliteration: '\'Afwan',
    indonesianMeaning: 'Sama-sama / Maaf',
    category: 'Percakapan',
    exampleSentenceArabic: 'عَفْوًا، لَا شُكْرَ عَلَى وَاجِبٍ',
    exampleSentenceTranslation: 'Sama-sama, tidak perlu berterima kasih atas sebuah kewajiban.'
  },
  {
    id: 'v-18',
    arabicWord: 'مَعَ السَّلَامَةِ',
    transliteration: 'Ma\'as-salaamah',
    indonesianMeaning: 'Selamat jalan / Sampai jumpa',
    category: 'Percakapan',
    exampleSentenceArabic: 'مَعَ السَّلَامَةِ، فِي أَمَانِ اللهِ',
    exampleSentenceTranslation: 'Selamat jalan, semoga dalam lindungan Allah.'
  }
];
