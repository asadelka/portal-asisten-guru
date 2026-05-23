export default async function handler(req, res) {
  // Hanya izinkan metode POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { systemPrompt, userPrompt } = req.body;

  if (!systemPrompt || !userPrompt) {
    return res.status(400).json({ error: 'systemPrompt dan userPrompt wajib diisi.' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GROQ_API_KEY belum dikonfigurasi di Vercel.' });
  }

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user',   content: userPrompt   }
        ],
        temperature: 0.3,
        max_tokens: 1500
      })
    });

    if (!groqRes.ok) {
      const errBody = await groqRes.text();
      return res.status(groqRes.status).json({ error: `Groq error: ${errBody}` });
    }

    const data = await groqRes.json();
    const content = data.choices?.[0]?.message?.content ?? '';

    return res.status(200).json({ content });

  } catch (err) {
    console.error('analisis.js error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
