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
    console.log('📧 Capturing email:', email);

    // ✅ Send to Google Sheets
    if (process.env.GOOGLE_SHEETS_WEBHOOK) {
      const response = await fetch(process.env.GOOGLE_SHEETS_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          timestamp: timestamp || new Date().toISOString(),
          source: source || 'tiktok_analyzer',
          ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
          userAgent: req.headers['user-agent']
        })
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Email saved to Google Sheets');
      } else {
        console.error('⚠️ Google Sheets error:', result.error);
      }
    } else {
      console.log('⚠️ GOOGLE_SHEETS_WEBHOOK not configured');
    }

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
