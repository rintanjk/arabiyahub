import { Lesson } from '../types';

export const LESSONS_DATA: Lesson[] = [
  {
    id: 'lesson-1-huruf-harakat',
    title: 'Pengenalan Huruf & Harakat',
    arabicTitle: 'الْحُرُوفُ وَالْحَرَكَاتُ',
    category: 'Dasar',
    level: 1,
    description: 'Pelajari dasar bunyi huruf hijaiyah, harakat pokok (Fathah, Kasrah, Dhommah, Sukun), dan Tanwin.',
    iconName: 'Sparkles',
    xpReward: 120,
    materials: [
      {
        sectionTitle: 'Harakat Pokok (Tanda Baca Utama)',
        arabicText: 'بَ - بِ - بُ - بْ',
        transliteration: 'Ba (Fathah) - Bi (Kasrah) - Bu (Dhommah) - B (Sukun)',
        indonesianTranslation: 'Fathah berbunyi "A", Kasrah berbunyi "I", Dhommah berbunyi "U", dan Sukun mematikan huruf.',
        notes: 'Harakat adalah kunci utama dalam menentukan makna kata dan status gramatikal (i\'rab) dalam bahasa Arab.'
      },
      {
        sectionTitle: 'Tanwin (Nun Mati yang Tersembunyi)',
        arabicText: 'كِتَابٌ - كِتَابًا - كِتَابٍ',
        transliteration: 'Kitaabun (Dhommatain) - Kitaaban (Fathatain) - Kitaabin (Kasratain)',
        indonesianTranslation: 'Sebuah buku (tanda Isim nakirah/umum)',
        notes: 'Tanwin hanya masuk pada kata benda (Isim), tidak pernah masuk pada kata kerja (Fi\'il) atau kata dengan Alif Lam (Al-).'
      },
      {
        sectionTitle: 'Huruf Syamsiyyah & Qomariyyah',
        arabicText: 'الشَّمْسُ (Asy-Syamsu) / الْقَمَرُ (Al-Qomaru)',
        transliteration: 'Asy-Syamsu vs Al-Qamaru',
        indonesianTranslation: 'Matahari vs Bulan',
        notes: 'Pada huruf Syamsiyyah lam tidak dibaca dan dilebur ke tasydid. Pada Qomariyyah lam dibaca jelas (idzhar).'
      }
    ],
    quiz: [
      {
        question: 'Manakah tanda harakat yang menghasilkan bunyi vokal "U"?',
        arabicQuestion: 'مَا هِيَ الْحَرَكَةُ الَّتِي تَدُلُّ عَلَى الضَّمِّ؟',
        options: ['الفَتْحَة (Fathah)', 'الكَسْرَة (Kasrah)', 'الضَّمَّة (Dhommah)', 'السُّكُون (Sukun)'],
        correctIndex: 2,
        explanation: 'Dhommah (ُ) menghasilkan bunyi "U", contohnya بُ (Bu).'
      },
      {
        question: 'Apakah kata yang memiliki awalan "الْـ" (Al-) boleh diakhiri dengan Tanwin?',
        options: [
          'Tidak boleh, Al- dan Tanwin tidak pernah bersatu',
          'Boleh pada semua kalimat',
          'Hanya boleh pada isim jamak',
          'Tergantung harakat akhirnya'
        ],
        correctIndex: 0,
        explanation: 'Kaidah dasar: Al- (makrifat) dan Tanwin (nakirah) adalah dua hal yang berlawanan dan tidak bisa bertemu pada satu kata.'
      }
    ]
  },
  {
    id: 'lesson-2-tahiyyat-sapaan',
    title: 'Sapaan & Perkenalan Diri',
    arabicTitle: 'التَّحِيَّاتُ وَالتَّعَارُفُ',
    category: 'Percakapan',
    level: 1,
    description: 'Ungkapan salam sopan, menanyakan kabar, perkenalan nama, dan negara asal.',
    iconName: 'MessageCircle',
    xpReward: 150,
    materials: [
      {
        sectionTitle: 'Salam & Sapaan Hangat',
        arabicText: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ',
        transliteration: 'As-Salaamu \'alaikum wa rahmatullaahi wa barakaatuh',
        indonesianTranslation: 'Semoga keselamatan, rahmat Allah, dan berkah-Nya tercurah kepadamu.',
        notes: 'Jawaban yang benar: وَعَلَيْكُمُ السَّلَامُ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ'
      },
      {
        sectionTitle: 'Menanyakan Kabar',
        arabicText: 'كَيْفَ حَالُكَ؟ - أَنَا بِخَيْرٍ، وَالْحَمْدُ لِلَّهِ',
        transliteration: 'Kayfa haaluka? - Ana bi-khairin, walhamdulillaah',
        indonesianTranslation: 'Bagaimana kabarmu? - Saya baik-baik saja, segala puji bagi Allah.',
        notes: 'Gunakan "haaluka" untuk laki-laki, dan "haaluki" (حَالُكِ) untuk perempuan.'
      },
      {
        sectionTitle: 'Perkenalan Nama & Asal',
        arabicText: 'مَا اسْمُكَ؟ - اسْمِي أَحْمَدُ، وَأَنَا مِنْ إِنْدُونِيسِيَا',
        transliteration: 'Mas-muka? - Ismii Ahmad, wa ana min Induuniisiyaa',
        indonesianTranslation: 'Siapa namamu? - Nama saya Ahmad, dan saya dari Indonesia.',
        notes: '"Min" (مِنْ) adalah huruf jar yang berarti "dari".'
      }
    ],
    quiz: [
      {
        question: 'Bagaimana cara menanyakan kabar kepada seorang perempuan?',
        arabicQuestion: 'كَيْفَ تَسْأَلُ امْرَأَةً عَنْ حَالِهَا؟',
        options: [
          'كَيْفَ حَالُكَ؟ (Kayfa haaluka?)',
          'كَيْفَ حَالُكِ؟ (Kayfa haaluki?)',
          'مَا اسْمُكِ؟ (Mas-muki?)',
          'مِنْ أَيْنَ أَنْتَ؟ (Min ayna anta?)'
        ],
        correctIndex: 1,
        explanation: 'Untuk perempuan (mukhathob muannats), dhomir kaf diberi harakat kasrah: حَالُكِ (haaluki).'
      },
      {
        question: 'Apa arti dari ungkapan "أَهْلًا وَسَهْلًا" (Ahlan wa Sahlan)?',
        options: ['Sampai jumpa', 'Selamat datang', 'Terima kasih banyak', 'Permisi'],
        correctIndex: 1,
        explanation: '"Ahlan wa Sahlan" adalah ucapan selamat datang yang ramah dalam tradisi bangsa Arab.'
      }
    ]
  },
  {
    id: 'lesson-3-trio-kalimat',
    title: 'Pilar Kata: Isim, Fi\'il, & Huruf',
    arabicTitle: 'أَقْسَامُ الْكَلَامِ: اسْمٌ، فِعْلٌ، حَرْفٌ',
    category: 'Nahwu',
    level: 2,
    description: 'Pahami klasifikasi kata bahasa Arab: Isim (Kata Benda), Fi\'il (Kata Kerja), dan Huruf (Kata Tugas).',
    iconName: 'BookOpen',
    xpReward: 180,
    materials: [
      {
        sectionTitle: '1. Al-Ism (الاسْمُ) - Kata Benda & Sifat',
        arabicText: 'كِتَابٌ، مَسْجِدٌ، قَلَمٌ، جَمِيلٌ',
        transliteration: 'Kitaabun, Masjidun, Qalamun, Jamiilun',
        indonesianTranslation: 'Buku, Masjid, Pena, Indah',
        notes: 'Ciri Isim: bisa dimasuki Alif Lam (الـ), bisa menerima Tanwin, dan bisa dimasuki huruf Jar.'
      },
      {
        sectionTitle: '2. Al-Fi\'l (الفِعْلُ) - Kata Kerja Terikat Waktu',
        arabicText: 'كَتَبَ (Telah menulis) - يَكْتُبُ (Sedang menulis) - اكْتُبْ (Tulislah!)',
        transliteration: 'Kataba (Madhi) - Yaktubu (Mudhari\') - Uktub (Amr)',
        indonesianTranslation: 'Pembagian kata kerja: Lampau (Madhi), Sekarang/Akan Datang (Mudhari\'), dan Perintah (Amr).',
        notes: 'Fi\'il tidak pernah menerima tanwin atau huruf jar.'
      },
      {
        sectionTitle: '3. Al-Harf (الحَرْفُ) - Kata Sambung / Sendi',
        arabicText: 'فِي (Di dalam), عَلَى (Di atas), إِلَى (Ke), مِنْ (Dari)',
        transliteration: 'Fii, \'Alaa, Ilaa, Min',
        indonesianTranslation: 'Huruf tidak memiliki makna mandiri yang sempurna kecuali jika bersambung dengan Isim atau Fi\'il.',
        notes: 'Huruf Jar membuat isim setelahnya menjadi Majrur (berharakat kasrah pada umumnya).'
      }
    ],
    quiz: [
      {
        question: 'Manakah di bawah ini yang merupakan contoh Fi\'il Madhi (kata kerja lampau)?',
        arabicQuestion: 'أَيُّ كَلِمَةٍ هِيَ فِعْلٌ مَاضٍ؟',
        options: ['قَرَأَ (Qara\'a)', 'يَقْرَأُ (Yaqra\'u)', 'اقْرَأْ (Iqra\')', 'قِرَاءَةٌ (Qiraa\'atun)'],
        correctIndex: 0,
        explanation: 'قَرَأَ (Qara\'a) berpola Fa\'ala menunjukkan perbuatan yang telah selesai dilakukan (lampau).'
      },
      {
        question: 'Jika kata "مَسْجِدٌ" (Masjidun) dimasuki huruf jar "فِي" (Fii), bagaimanakah harakat akhirnya?',
        options: ['فِي مَسْجِدٌ (Fii masjidun)', 'فِي مَسْجِدًا (Fii masjidan)', 'فِي الْمَسْجِدِ (Fi-l-masjidi)', 'فِي مَسْجِدُ (Fii masjidu)'],
        correctIndex: 2,
        explanation: 'Huruf jar mewajibkan kata setelahnya menjadi Majrur (berharakat kasrah): فِي الْمَسْجِدِ.'
      }
    ]
  },
  {
    id: 'lesson-4-dhamir-kata-ganti',
    title: 'Dhomir (Kata Ganti Orang)',
    arabicTitle: 'الضَّمَائِرُ الْمُنْفَصِلَةُ',
    category: 'Shorof',
    level: 2,
    description: 'Kuasai 14 kata ganti orang dalam bahasa Arab: Huwa, Huma, Hum, Hiya, Anta, Ana, Nahnu, dll.',
    iconName: 'Users',
    xpReward: 200,
    materials: [
      {
        sectionTitle: 'Orang Ketiga (Gaib / Yang Dibicarakan)',
        arabicText: 'هُوَ (Dia L) - هِيَ (Dia P) - هُمْ (Mereka L) - هُنَّ (Mereka P)',
        transliteration: 'Huwa - Hiya - Hum - Hunna',
        indonesianTranslation: 'Huwa thoolibun (Dia seorang pelajar putra) | Hiya thoolibatun (Dia pelajar putri).',
        notes: 'Bahasa Arab membedakan gender (Mudzakkar laki-laki vs Muannats perempuan).'
      },
      {
        sectionTitle: 'Orang Kedua (Lawan Bicara)',
        arabicText: 'أَنْتَ (Kamu L) - أَنْتِ (Kamu P) - أَنْتُمْ (Kalian L)',
        transliteration: 'Anta - Anti - Antum',
        indonesianTranslation: 'Anta ustaadzun (Kamu seorang guru laki-laki) | Anti ustaadhatun (Kamu guru perempuan).',
        notes: 'Gunakan Antum juga untuk bentuk kesopanan/penghormatan.'
      },
      {
        sectionTitle: 'Orang Pertama (Pembicara)',
        arabicText: 'أَنَا (Saya) - نَحْنُ (Kami / Kita)',
        transliteration: 'Ana - Nahnu',
        indonesianTranslation: 'Ana muslimun (Saya seorang muslim) | Nahnu muslimuun (Kami orang-orang muslim).',
        notes: 'Dhomir Ana dan Nahnu berlaku sama untuk laki-laki maupun perempuan.'
      }
    ],
    quiz: [
      {
        question: 'Dhomir apakah yang digunakan untuk "Dia seorang perempuan"?',
        arabicQuestion: 'مَا هُوَ الضَّمِيرُ لِلْمُؤَنَّثِ الْغَائِبِ الْمُفْرَدِ؟',
        options: ['هُوَ (Huwa)', 'هِيَ (Hiya)', 'أَنْتِ (Anti)', 'هُمْ (Hum)'],
        correctIndex: 1,
        explanation: 'هِيَ (Hiya) adalah kata ganti untuk orang ketiga tunggal perempuan (Dia perempuan).'
      },
      {
        question: 'Lengkapi kalimat berikut: "..... طُلَّابٌ مُجْتَهِدُونَ" (.... para siswa yang rajin)',
        options: ['أَنَا (Ana)', 'هِيَ (Hiya)', 'نَحْنُ (Nahnu)', 'أَنْتَ (Anta)'],
        correctIndex: 2,
        explanation: '"Thullaab" adalah jamak, sehingga membutuhkan kata ganti jamak "Nahnu" (Kami) atau "Hum" (Mereka).'
      }
    ]
  },
  {
    id: 'lesson-5-mubtada-khabar',
    title: 'Jumlah Ismiyyah (Mubtada\' & Khabar)',
    arabicTitle: 'الْجُمْلَةُ الاسْمِيَّةُ: الْمُبْتَدَأُ وَالْخَبَرُ',
    category: 'Nahwu',
    level: 3,
    description: 'Susun kalimat nominal sempurna bahasa Arab yang terdiri dari subjek (Mubtada\') dan predikat (Khabar).',
    iconName: 'Layers',
    xpReward: 220,
    materials: [
      {
        sectionTitle: 'Kaidah Mubtada\' dan Khabar',
        arabicText: 'الْبَيْتُ نَظِيفٌ (Al-Baytu nadziifun)',
        transliteration: 'Al-Baytu (Mubtada\') nadziifun (Khabar)',
        indonesianTranslation: 'Rumah itu bersih.',
        notes: 'Mubtada\' biasanya isim makrifat (ada Al-), sedangkan Khabar biasanya nakirah (tanwin). Keduanya berstatus Marfu\' (dhommah).'
      },
      {
        sectionTitle: 'Kesesuaian Gender (Mudzakkar vs Muannats)',
        arabicText: 'الْحَدِيقَةُ جَمِيلَةٌ (Al-Hadiiqatu jamiilatun)',
        transliteration: 'Al-Hadiiqatu jamiilatun',
        indonesianTranslation: 'Taman itu indah.',
        notes: 'Jika Mubtada\' muannats (berakhiran ta marbuthah ة), maka Khabar wajib muannats juga.'
      }
    ],
    quiz: [
      {
        question: 'Lengkapi kalimat: "السَّيَّارَةُ ....." (Mobil itu cepat)',
        options: ['سَرِيعٌ (Sarii\'un)', 'سَرِيعَةٌ (Sarii\'atun)', 'سَرِيعًا (Sarii\'an)', 'سَرِيعٍ (Sarii\'in)'],
        correctIndex: 1,
        explanation: 'Karena "As-Sayyaratu" adalah isim Muannats (ada ة), khabarnya harus muannats dan marfu\': سَرِيعَةٌ.'
      }
    ]
  },
  {
    id: 'lesson-6-suq-dan-belanja',
    title: 'Percakapan di Pasar & Toko',
    arabicTitle: 'حِوَارٌ فِي السُّوقِ وَالشِّرَاءِ',
    category: 'Percakapan',
    level: 3,
    description: 'Kosa kata dan dialog menanyakan harga barang, menawar, dan bertransaksi dalam bahasa Arab.',
    iconName: 'ShoppingBag',
    xpReward: 250,
    materials: [
      {
        sectionTitle: 'Menanyakan Harga',
        arabicText: 'بِكَمْ هَذَا الْقَمِيصُ؟ - هَذَا بِعِشْرِينَ رِيَالًا',
        transliteration: 'Bikam haadzal qamiish? - Haadza bi-\'isyriina riyaalan',
        indonesianTranslation: 'Berapa harga kemeja ini? - Ini seharga 20 riyal.',
        notes: '"Bikam" adalah kata tanya untuk menanyakan harga.'
      },
      {
        sectionTitle: 'Meminta Diskon / Tawar-Menawar',
        arabicText: 'هَلْ يُمْكِنُ أَنْ تُخَفِّضَ السِّعْرَ قَلِيلًا؟',
        transliteration: 'Hal yumkinu an tukhaffidhas-si\'ra qaliilan?',
        indonesianTranslation: 'Apakah bisa menurunkan harganya sedikit?',
        notes: '"As-Si\'ru" berarti harga, "Tukhaffidh" berarti mengurangi/diskon.'
      }
    ],
    quiz: [
      {
        question: 'Kata tanya manakah yang digunakan khusus untuk menanyakan harga barang?',
        arabicQuestion: 'مَا هِيَ أَدَاةُ الاسْتِفْهَامِ لِلسُّؤَالِ عَنِ الثَّمَنِ؟',
        options: ['مَتَى (Mata - Kapan)', 'أَيْنَ (Ayna - Dimana)', 'بِكَمْ (Bikam - Berapa harga)', 'كَيْفَ (Kayfa - Bagaimana)'],
        correctIndex: 2,
        explanation: '"Bikam" (بِكَمْ) berarti "berapa harganya".'
      }
    ]
  }
];
