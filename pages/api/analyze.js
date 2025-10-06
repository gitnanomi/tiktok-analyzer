import OpenAI from 'openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

  if (!url || !url.includes('tiktok.com')) {
    return res.status(400).json({ error: 'Invalid TikTok URL' });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // 调用OpenAI分析
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a TikTok video analysis expert. Analyze the video structure, hook, storyline, and CTA."
        },
        {
          role: "user",
          content: `Analyze this TikTok video: ${url}\n\nProvide analysis in this format:\n- Duration estimate\n- Hook type\n- Content structure\n- CTA analysis\n- Key recommendations`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const analysis = completion.choices[0].message.content;

    return res.status(200).json({
      success: true,
      url: url,
      analysis: analysis,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(500).json({ 
      error: 'Analysis failed',
      message: error.message 
    });
  }
}
