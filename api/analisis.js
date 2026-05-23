// api/analisis.js
// Serverless Function — API key GROQ disimpan aman di environment variable Vercel
// Tidak pernah terekspos ke browser

export default async function handler(req, res) {
  // Hanya izinkan POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Ambil API key dari environment variable (diset di dashboard Vercel)
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: 'API key tidak dikonfigurasi di server.' });
  }

  const { summaryText } = req.body;
  if (!summaryText || typeof summaryText !== 'string') {
    return res.status(400).json({ error: 'Data siswa (summaryText) tidak ditemukan.' });
  }

  const systemPrompt = `Kamu adalah Pakar Konseling Karir dan Guru BK yang profesional. Tugasmu menganalisis data instrumen siswa dan menyusun rekomendasi berbasis "ADAPTING STRATEGY". Tulis output langsung menggunakan tag HTML dasar seperti <p>, <strong>, <ul>, dan <li>. Jangan gunakan format Markdown.`;

  const userPrompt = `Berikut data instrumen dasar siswa:\n\n${summaryText}\n\nBerikan analisis mendalam 3 bagian:\n1. <strong>Analisis Kesiapan & Potensi Mismatch</strong>\n2. <strong>Rencana Aksi Adaptasi Siswa</strong>\n3. <strong>Rekomendasi Strategi untuk Guru BK</strong>`;

  try {
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user',   content: userPrompt   },
        ],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });

    if (!groqResponse.ok) {
      const errText = await groqResponse.text();
      return res.status(groqResponse.status).json({ error: `Groq API error: ${errText}` });
    }

    const data = await groqResponse.json();
    const content = data.choices?.[0]?.message?.content || '';
    return res.status(200).json({ result: content });

  } catch (err) {
    return res.status(500).json({ error: `Server error: ${err.message}` });
  }
}
