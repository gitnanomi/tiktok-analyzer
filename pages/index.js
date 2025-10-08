import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [mode, setMode] = useState(null);

  const handleAnalyze = async () => {
    if (!input) {
      setError('Please enter a TikTok URL or keywords');
      return;
    }

    setLoading(true);
    setError('');
    setMode(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          input: input,
          count: 20 
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      setResults(data.results);
      setMode(data.mode);
      setInput('');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (results.length === 0) return;

    const headers = [
      'Author', 'Description', 'Views', 'Likes', 
      'Content Type', 'Category', 'Hook', 'Is Ad?', 'Analysis'
    ];
    
    const rows = results.map(r => [
      r.author || '',
      `"${(r.description || '').replace(/"/g, '""')}"`,
      r.views || 0,
      r.likes || 0,
      r.analysis?.contentType || '',
      r.analysis?.category || '',
      `"${(r.analysis?.hook || '').replace(/"/g, '""')}"`,
      r.analysis?.isAd || '',
      `"${(r.analysis?.analysis || '').replace(/"/g, '""')}"`,
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `tiktok-analysis-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // 智能检测输入类型
  const inputType = input.includes('tiktok.com') ? 'url' : 'keywords';
  const placeholder = inputType === 'url' 
    ? '🔗 Paste TikTok URL or 🔍 Enter keywords (e.g., "AI tools")'
    : '🔗 Paste TikTok URL or 🔍 Enter keywords (e.g., "AI tools")';

  return (
    <>
      <Head>
        <title>TikTok Analyzer Pro - Smart Analysis</title>
      </Head>

      <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-8">
            <h1 className="text-5xl font-black text-white mb-3">
              🎯 TikTok Analyzer Pro
            </h1>
            <p className="text-xl text-white/90">
              Smart Analysis • Paste URL or Enter Keywords
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
            
            {/* Smart Input */}
            <div className="mb-6">
              <div className="flex gap-4 mb-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                  placeholder={placeholder}
                  className="flex-1 px-6 py-4 text-lg border-2 border-purple-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-400"
                />
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !input}
                  className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-bold rounded-2xl hover:shadow-2xl transition disabled:opacity-50"
                >
                  {loading ? '⏳ Analyzing...' : '🚀 Analyze'}
                </button>
              </div>
              
              {/* Input Type Indicator */}
              {input && (
                <div className="text-sm text-gray-600">
                  {inputType === 'url' ? (
                    <span>✅ Single URL Analysis Mode</span>
                  ) : (
                    <span>✅ Batch Search Mode - Will analyze top 20 videos</span>
                  )}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-purple-50 p-4 rounded-xl text-center">
                <div className="text-3xl font-black text-purple-600">
                  {results.length}
                </div>
                <div className="text-sm text-gray-600">Videos Analyzed</div>
              </div>
              <div className="bg-red-50 p-4 rounded-xl text-center">
                <div className="text-3xl font-black text-red-600">
                  {results.filter(r => r.analysis?.isAd === 'YES').length}
                </div>
                <div className="text-sm text-gray-600">Ads Detected</div>
              </div>
              <div className="bg-green-50 p-4 rounded-xl text-center">
                <button
                  onClick={exportToCSV}
                  disabled={results.length === 0}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50"
                >
                  📥 Export CSV
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-100 border-2 border-red-400 rounded-xl text-red-800">
                ❌ {error}
              </div>
            )}
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur p-4 rounded-xl">
                <div className="text-white text-center">
                  {mode === 'single' ? (
                    <span>📊 Single Video Analysis Complete</span>
                  ) : (
                    <span>📊 Batch Analysis Complete - {results.length} videos analyzed</span>
                  )}
                </div>
              </div>

              {results.map((result, idx) => (
                <div key={idx} className="bg-white rounded-3xl shadow-2xl p-8">
                  {/* Video card content - same as before */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {mode === 'single' ? 'Analysis Result' : `Video #${idx + 1}`}
                      </h3>
                      <p className="text-gray-600">@{result.author}</p>
                      <p className="text-gray-600 mt-2">{result.description}</p>
                    </div>
                    {result.analysis?.isAd === 'YES' && (
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold">
                        💰 Ad
                      </span>
                    )}
                  </div>

                  {/* Analysis details */}
                  {result.analysis && !result.analysis.error && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-red-50 p-4 rounded-xl">
                        <div className="font-bold text-red-900 mb-2">🎯 Hook</div>
                        <div className="text-sm">{result.analysis.hook}</div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-xl">
                        <div className="font-bold text-blue-900 mb-2">📁 Category</div>
                        <div className="text-sm">
                          <span className="bg-blue-200 px-2 py-1 rounded">
                            {result.analysis.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {result.url && (
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 text-purple-600 hover:text-purple-800 font-semibold"
                    >
                      🔗 Watch on TikTok →
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {results.length === 0 && !loading && (
            <div className="bg-white rounded-3xl shadow-2xl p-16 text-center">
              <div className="text-6xl mb-6">🎬</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Smart Analysis - One Input Box
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Paste a TikTok URL for single analysis<br/>
                <span className="font-bold">OR</span><br/>
                Enter keywords for batch analysis
              </p>
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="bg-blue-50 p-8 rounded-2xl">
                  <div className="text-4xl mb-4">🔗</div>
                  <h3 className="font-bold text-xl mb-3">Single URL</h3>
                  <p className="text-sm text-gray-600">
                    Paste: https://tiktok.com/@user/video/123
                  </p>
                </div>
                <div className="bg-purple-50 p-8 rounded-2xl">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="font-bold text-xl mb-3">Batch Keywords</h3>
                  <p className="text-sm text-gray-600">
                    Enter: "AI tools" or "productivity"
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
