export default function Home() {
  return (
    <html>
      <head>
        <title>TikTok Analyzer</title>
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }
        `}</style>
      </head>
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '48px',
            maxWidth: '800px',
            width: '100%',
            boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h1 style={{
                fontSize: '56px',
                margin: '0 0 16px 0',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold'
              }}>
                🎬 TikTok Analyzer
              </h1>
              <p style={{
                fontSize: '20px',
                color: '#666',
                margin: 0
              }}>
                AI-Powered Video Analysis Platform
              </p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              padding: '32px',
              borderRadius: '16px',
              marginBottom: '24px'
            }}>
              <input
                type="text"
                placeholder="Paste TikTok video URL here..."
                style={{
                  width: '100%',
                  padding: '18px 24px',
                  fontSize: '16px',
                  border: '2px solid rgba(255,255,255,0.8)',
                  borderRadius: '12px',
                  marginBottom: '16px',
                  outline: 'none',
                  transition: 'all 0.3s'
                }}
              />
              <button style={{
                width: '100%',
                padding: '18px',
                fontSize: '18px',
                fontWeight: 'bold',
                color: 'white',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
              }}>
                🔍 Analyze Video
              </button>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)',
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <p style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: '600',
                color: '#2d5016'
              }}>
                ✅ Platform Successfully Deployed!
              </p>
              <p style={{
                margin: '8px 0 0 0',
                fontSize: '14px',
                color: '#4a7c3a'
              }}>
                Ready to analyze TikTok videos
              </p>
            </div>

            <div style={{
              marginTop: '32px',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px'
            }}>
              <div style={{
                background: '#f8f9fa',
                padding: '20px',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎯</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>Deep Analysis</div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Frame by frame</div>
              </div>
              <div style={{
                background: '#f8f9fa',
                padding: '20px',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>💬</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>Script Analysis</div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Hook & CTA</div>
              </div>
              <div style={{
                background: '#f8f9fa',
                padding: '20px',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🤖</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>AI Prompts</div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Ready to use</div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
