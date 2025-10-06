import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!url.includes('tiktok.com')) {
      setError('Please enter a valid TikTok URL');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      // 模拟分析（3秒后显示结果）
      // 真实版本会调用 /api/analyze
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setResult({
        duration: '0:32',
        fps: '30fps',
        resolution: '1080x1920',
        analysis: 'Video analyzed successfully! This is a demo result.'
      });
    } catch (err) {
      setError('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <html>
      <head>
        <title>TikTok Analyzer</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .spinner {
            animation: spin 1s linear infinite;
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
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                placeholder="Paste TikTok video URL here..."
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '18px 24px',
                  fontSize: '16px',
                  border: '2px solid rgba(255,255,255,0.8)',
                  borderRadius: '12px',
                  marginBottom: '16px',
                  outline: 'none',
                  opacity: loading ? 0.6 : 1
                }}
              />
              <button 
                onClick={handleAnalyze}
                disabled={loading || !url}
                style={{
                  width: '100%',
                  padding: '18px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: 'white',
                  background: loading || !url 
                    ? '#ccc' 
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: loading || !url ? 'not-allowed' : 'pointer',
                  boxShadow: loading || !url ? 'none' : '0 4px 15px rgba(102, 126, 234, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px'
                }}>
                {loading ? (
                  <>
                    <div className="spinner" style={{
                      width: '20px',
                      height: '20px',
                      border: '3px solid rgba(255,255,255,0.3)',
                      borderTop: '3px solid white',
                      borderRadius: '50%'
                    }}></div>
                    Analyzing...
                  </>
                ) : (
                  <>🔍 Analyze Video</>
                )}
              </button>
            </div>

            {error && (
              <div style={{
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '24px',
                color: 'white',
                textAlign: 'center',
                fontWeight: '600'
              }}>
                ❌ {error}
              </div>
            )}

            {result && (
              <div style={{
                background: 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)',
                padding: '24px',
                borderRadius: '12px',
                marginBottom: '24px'
              }}>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#2d5016',
                  marginBottom: '16px'
                }}>
                  ✅ Analysis Complete!
                </h3>
                <div style={{
                  background: 'rgba(255,255,255,0.8)',
                  padding: '16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#333'
                }}>
                  <p style={{ marginBottom: '8px' }}><strong>Duration:</strong> {result.duration}</p>
                  <p style={{ marginBottom: '8px' }}><strong>FPS:</strong> {result.fps}</p>
                  <p style={{ marginBottom: '8px' }}><strong>Resolution:</strong> {result.resolution}</p>
                  <p style={{ margin: 0 }}><strong>Status:</strong> {result.analysis}</p>
                </div>
              </div>
            )}

            {!result && !loading && (
              <div style={{
                background: 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)',
                padding: '20px',
                borderRadius: '12px',
                textAlign: 'center',
                marginBottom: '24px'
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
            )}

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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
