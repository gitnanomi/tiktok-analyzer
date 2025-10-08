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
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setResult(data);
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <html lang="en">
      <head>
        <title>TikTok Analyzer - 6 Core Modules</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="https://cdn.tailwindcss.com"></script>
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: system-ui, -apple-system, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            min-height: 100vh; 
          }
          @keyframes spin { to { transform: rotate(360deg); } }
          .spinner { animation: spin 1s linear infinite; }
          .module-card { transition: all 0.3s ease; }
          .module-card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
        `}</style>
      </head>
      <body style={{ padding: '24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: '900', color: 'white', marginBottom: '12px' }}>
              🎬 TikTok Video Analyzer
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)' }}>
              6-Module Deep Analysis System
            </p>
          </div>

          {/* Input Section */}
          {!loading && !result && (
            <div style={{ background: 'white', borderRadius: '24px', boxShadow: '0 25px 50px rgba(0,0,0,0.3)', padding: '32px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                  placeholder="🔗 Paste TikTok URL..."
                  style={{
                    flex: 1,
                    minWidth: '300px',
                    padding: '16px 24px',
                    fontSize: '18px',
                    border: '2px solid #a78bfa',
                    borderRadius: '16px',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={handleAnalyze}
                  disabled={!url}
                  style={{
                    padding: '16px 40px',
                    background: url ? 'linear-gradient(135deg, #a78bfa 0%, #ec4899 100%)' : '#ccc',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    borderRadius: '16px',
                    border: 'none',
                    cursor: url ? 'pointer' : 'not-allowed',
                    boxShadow: url ? '0 4px 15px rgba(167,139,250,0.4)' : 'none'
                  }}
                >
                  🚀 Analyze
                </button>
              </div>

              {/* 6 Module Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
                {[
                  { emoji: '🎯', label: 'HOOK', bg: '#fee2e2' },
                  { emoji: '📖', label: 'STORYLINE', bg: '#dbeafe' },
                  { emoji: '📢', label: 'CTA', bg: '#d1fae5' },
                  { emoji: '⏱️', label: 'TIMING', bg: '#fef3c7' },
                  { emoji: '📝', label: 'SCRIPT', bg: '#e9d5ff' },
                  { emoji: '🤖', label: 'AI PROMPTS', bg: '#fce7f3' }
                ].map((module, i) => (
                  <div key={i} className="module-card" style={{
                    background: module.bg,
                    padding: '16px',
                    borderRadius: '12px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{module.emoji}</div>
                    <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{module.label}</div>
                  </div>
                ))}
              </div>

              {error && (
                <div style={{
                  marginTop: '24px',
                  padding: '16px',
                  background: '#fee2e2',
                  border: '2px solid #ef4444',
                  borderRadius: '12px',
                  color: '#991b1b',
                  fontWeight: '600'
                }}>
                  ❌ {error}
                </div>
              )}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div style={{ background: 'white', borderRadius: '24px', boxShadow: '0 25px 50px rgba(0,0,0,0.3)', padding: '64px', textAlign: 'center' }}>
              <div className="spinner" style={{
                width: '64px',
                height: '64px',
                border: '8px solid #e9d5ff',
                borderTop: '8px solid #a78bfa',
                borderRadius: '50%',
                margin: '0 auto 24px'
              }}></div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '12px' }}>
                Analyzing Video...
              </h2>
              <p style={{ color: '#6b7280' }}>Extracting 6 core modules</p>
            </div>
          )}

          {/* Results */}
          {result && (
            <div>
              {/* Video Info Header */}
              <div style={{
                background: 'linear-gradient(135deg, #a78bfa 0%, #ec4899 100%)',
                borderRadius: '24px',
                padding: '32px',
                marginBottom: '24px',
                color: 'white',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
              }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '16px' }}>
                  📊 Video Analysis Complete!
                </h2>
                {result.videoData && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    {result.videoData.author && (
                      <div style={{ background: 'rgba(255,255,255,0.2)', padding: '16px', borderRadius: '12px' }}>
                        <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>Creator</div>
                        <div style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>@{result.videoData.author}</div>
                      </div>
                    )}
                    <div style={{ background: 'rgba(255,255,255,0.2)', padding: '16px', borderRadius: '12px' }}>
                      <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>Blueprint Sections</div>
                      <div style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>6 Complete Modules</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Analysis Content */}
              <div style={{
                background: 'white',
                borderRadius: '24px',
                padding: '48px',
                boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
                marginBottom: '24px'
              }}>
                <div style={{
                  maxHeight: '70vh',
                  overflowY: 'auto',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.8',
                  fontSize: '16px',
                  color: '#1f2937'
                }}>
                  {result.analysis}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(result.analysis);
                    alert('✅ Copied to clipboard!');
                  }}
                  style={{
                    padding: '20px',
                    background: 'linear-gradient(135deg, #a78bfa 0%, #ec4899 100%)',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    borderRadius: '16px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(167,139,250,0.4)'
                  }}
                >
                  📋 Copy Analysis
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([result.analysis], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'tiktok-analysis.txt';
                    a.click();
                  }}
                  style={{
                    padding: '20px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    borderRadius: '16px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(59,130,246,0.4)'
                  }}
                >
                  💾 Download
                </button>
                <button
                  onClick={() => {
                    setResult(null);
                    setUrl('');
                  }}
                  style={{
                    padding: '20px',
                    background: '#4b5563',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    borderRadius: '16px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  🔄 Analyze Another
                </button>
              </div>
            </div>
          )}
        </div>
      </body>
    </html>
  );
}
