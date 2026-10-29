import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Initialize Gemini client server-side
const ai = new GoogleGenAI({});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'ArabiyaHub Express API',
    timestamp: new Date().toISOString(),
  });
});

// Admin authentication endpoint
// Credentials requested by user: username 'admin', password '12345678'
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (username === 'admin' && password === '12345678') {
    return res.json({
      success: true,
      token: 'admin-auth-session-token-' + Date.now(),
      user: {
        uid: 'admin_local_master',
        email: 'admin@arabiyahub.local',
        displayName: 'Ustadz Admin (Superuser)',
        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        role: 'admin',
        xp: 9999,
        level: 99,
        streak: 100,
      },
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Username atau password admin tidak valid! Gunakan admin / 12345678',
  });
});

// AI Arabic Tutor Chat endpoint (Server-side Gemini)
app.post('/api/gemini/tutor', async (req: Request, res: Response) => {
  try {
    const { message, history, mode = 'general' } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const systemInstructions = `
Anda adalah "Ustadz AI ArabiyaHub", seorang guru bahasa Arab modern yang ramah, berilmu, dan fasih berbahasa Indonesia dan Arab Fusha.
Target Anda adalah membantu pembelajar memahami bahasa Arab secara interaktif, mudah, dan menyenangkan.

Aturan Respon:
1. Selalu sertakan harakat lengkap pada setiap teks Arab (Tashkeel).
2. Sertakan transliterasi latin (cara baca) dan terjemahan bahasa Indonesia yang jelas.
3. Jelaskan tata bahasa (Nahwu & Shorof) dengan ringkas dan mudah dipahami, tidak berbelit-belit.
4. Mode saat ini: "${mode}". Jika mode "conversation", ajak percakapan interaktif dua arah. Jika "grammar", jelaskan struktur i'rab dan wazan kata.
5. Berikan 1 contoh kalimat praktis dan latihan singkat di akhir jawaban.
6. Format respon dengan markdown yang rapi (bold, bullet points).
`;

    // Build chat context
    let promptContent = `${systemInstructions}\n\n`;
    if (Array.isArray(history) && history.length > 0) {
      promptContent += "Riwayat Percakapan Sebelumnya:\n";
      for (const h of history.slice(-6)) {
        promptContent += `${h.role === 'user' ? 'Murid' : 'Ustadz AI'}: ${h.text}\n`;
      }
      promptContent += "\n";
    }
    promptContent += `Pertanyaan Murid: ${message}\nJawaban Ustadz AI:`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptContent,
    });

    const reply = response.text || 'Afwan, saya sedang menyiapkan materi. Silakan tanyakan kembali.';
    return res.json({ reply });
  } catch (err: any) {
    console.error('Gemini Tutor Error:', err);
    return res.status(500).json({
      error: 'Gagal memproses permintaan AI Tutor: ' + (err.message || 'Unknown error'),
    });
  }
});

// AI Harakat & I'rab Checker endpoint (Server-side Gemini)
app.post('/api/gemini/check-harakat', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Teks bahasa Arab dibutuhkan' });
    }

    const prompt = `
Analisis kalimat atau kata bahasa Arab berikut ini: "${text}"

Berikan respon HANYA dalam format JSON valid (tanpa bungkus markdown \`\`\`json) dengan skema berikut:
{
  "originalText": "${text}",
  "vowelledText": "Teks Arab lengkap dengan harakat / tashkeel yang tepat",
  "transliteration": "Cara membaca latin",
  "indonesianTranslation": "Terjemahan bahasa Indonesia yang akurat",
  "wordsBreakdown": [
    {
      "word": "kata berharakat",
      "type": "Isim / Fi'il / Huruf",
      "meaning": "arti per kata",
      "harakatExplanation": "alasan harakat akhir (contoh: Marfu' karena Fa'il / Majrur karena huruf jar)"
    }
  ],
  "grammarNotes": "Ringkasan kaidah nahwu/shorof utama yang ada pada kalimat ini (1-2 kalimat)",
  "usageExample": "Contoh kalimat variasi lain menggunakan kata utama ini"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let rawText = response.text?.trim() || '{}';
    if (rawText.startsWith('```json')) {
      rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    } else if (rawText.startsWith('```')) {
      rawText = rawText.replace(/```/g, '').trim();
    }

    const parsed = JSON.parse(rawText);
    return res.json(parsed);
  } catch (err: any) {
    console.error('Gemini Check Harakat Error:', err);
    return res.status(500).json({
      error: 'Gagal menganalisis harakat: ' + (err.message || 'Unknown error'),
    });
  }
});

// AI Dynamic Quiz Generator endpoint
app.post('/api/gemini/quiz-generator', async (req: Request, res: Response) => {
  try {
    const { topic = 'Percakapan Sehari-hari', level = 'Dasar' } = req.body;

    const prompt = `
Buatkan kuis latihan bahasa Arab interaktif untuk topik "${topic}" tingkat "${level}".
Buatkan 4 soal pilihan ganda yang bervariasi (mufrodat, tata bahasa nahwu/shorof, terjemahan, dan kelengkapan kalimat).

Hasilkan HANYA JSON valid (tanpa bungkus markdown \`\`\`json) dengan format:
{
  "topic": "${topic}",
  "level": "${level}",
  "questions": [
    {
      "id": 1,
      "question": "Pertanyaan dalam bahasa Indonesia dengan kutipan kata Arab berharakat",
      "arabicContext": "Teks kalimat Arab berharakat jika ada",
      "options": ["Pilihan A berharakat", "Pilihan B berharakat", "Pilihan C berharakat", "Pilihan D berharakat"],
      "correctIndex": 0,
      "explanation": "Penjelasan mengapa jawaban tersebut benar beserta kaidahnya"
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let rawText = response.text?.trim() || '{}';
    if (rawText.startsWith('```json')) {
      rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    } else if (rawText.startsWith('```')) {
      rawText = rawText.replace(/```/g, '').trim();
    }

    const parsed = JSON.parse(rawText);
    return res.json(parsed);
  } catch (err: any) {
    console.error('Gemini Quiz Gen Error:', err);
    return res.status(500).json({
      error: 'Gagal membuat kuis otomatis: ' + (err.message || 'Unknown error'),
    });
  }
});

// AI Word of the Day & Wisdom Generator
app.get('/api/gemini/daily-wisdom', async (_req: Request, res: Response) => {
  try {
    const prompt = `
Berikan satu kata mutiara / mahfuzhat / pepatah hikmah bahasa Arab yang menginspirasi untuk pembelajar hari ini.
Hasilkan HANYA JSON valid:
{
  "arabic": "Pepatah Arab lengkap harakat",
  "transliteration": "Transliterasi latin",
  "translation": "Terjemahan Indonesia",
  "lesson": "Pelajaran hidup atau tips bahasa Arab dari kata ini"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let rawText = response.text?.trim() || '{}';
    if (rawText.startsWith('```json')) {
      rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    } else if (rawText.startsWith('```')) {
      rawText = rawText.replace(/```/g, '').trim();
    }

    const parsed = JSON.parse(rawText);
    return res.json(parsed);
  } catch (err: any) {
    return res.json({
      arabic: "مَنْ جَدَّ وَجَدَ",
      transliteration: "Man jadda wajada",
      translation: "Barangsiapa bersungguh-sungguh, maka ia akan berhasil.",
      lesson: "Konsistensi adalah kunci menguasai tata bahasa dan mufrodat Arab.",
    });
  }
});

export default app;
