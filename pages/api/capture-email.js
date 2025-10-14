// pages/api/capture-email.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, timestamp, source } = req.body;

  if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  try {
    console.log('📧 Email captured:', email, timestamp, source);

    // ✅ Option 1: Send to ConvertKit (推荐)
    if (process.env.CONVERTKIT_API_KEY) {
      await fetch(`https://api.convertkit.com/v3/forms/${process.env.CONVERTKIT_FORM_ID}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: process.env.CONVERTKIT_API_KEY,
          email: email,
          tags: [5678901], // Replace with your tag ID
        })
      });
    }

    // ✅ Option 2: Send to Google Sheets (简单方案)
    // 创建一个 Google Apps Script webhook
    // if (process.env.GOOGLE_SHEETS_WEBHOOK) {
    //   await fetch(process.env.GOOGLE_SHEETS_WEBHOOK, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email, timestamp })
    //   });
    // }

    // ✅ Option 3: Store in Vercel Postgres (最佳方案)
    // const { sql } = require('@vercel/postgres');
    // await sql`
    //   INSERT INTO emails (email, created_at, source) 
    //   VALUES (${email}, NOW(), ${source})
    // `;

    return res.status(200).json({ 
      success: true,
      message: 'Email captured successfully'
    });

  } catch (error) {
    console.error('❌ Email capture error:', error);
    // 即使失败也返回成功，避免影响用户体验
    return res.status(200).json({ 
      success: true,
      message: 'Email logged locally'
    });
  }
}
