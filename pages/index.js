import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [mode, setMode] = useState('batch'); // 'batch' or 'single'
  const [keywords, setKeywords] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  // 批量分析
  const handleBatchAnalyze = async () => {
    if (!keywords) {
      setError('Please enter keywords');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/batch-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          keywords: keywords,
          count: 20 
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      setResults(data.results);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 单个URL分析
  const handleSingleAnalyze = async () => {
    if (!url.includes('tiktok.com')) {
      setError('Please enter a valid TikTok URL');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/single-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      setResults([data]);
      setUrl('');
      
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

  return (
    <>
      <Head>
        <title>TikTok Analyzer Pro - Batch Analysis</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-black text-white mb-3">
              🎯 TikTok Analyzer Pro
            </h1>
            <p className="text-xl text-white/90">
              Powered by Gemini 2.0 • Real Video Analysis • Batch Processing
            </p>
            <div className="mt-3 flex gap-2 justify-center">
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                ✅ Sees Video Content
              </span>
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                ⚡ Batch 20 Videos
              </span>
              <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                🆓 Free AI (Gemini)
              </span>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setMode('batch')}
                className={`flex-1 py-3 rounded-xl font-bold transition ${
                  mode === 'batch'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                📊 Batch Analysis (20 videos)
              </button>
              <button
                onClick={() => setMode('single')}
                className={`flex-1 py-3 rounded-xl font-bold transition ${
                  mode === 'single'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                🔗 Single URL Analysis
              </button>
            </div>

            {/* Batch Mode */}
            {mode === 'batch' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🔍 Enter Keywords (e.g., "AI tools", "productivity hacks")
                </label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="Enter keywords to search..."
                    className="flex-1 px-6 py-4 text-lg border-2 border-purple-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-400"
                  />
                  <button
                    onClick={handleBatchAnalyze}
                    disabled={loading}
                    className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-bold rounded-2xl hover:shadow-2xl transition disabled:opacity-50"
                  >
                    {loading ? '⏳ Analyzing...' : '🚀 Analyze Top 20'}
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  💡 Will search TikTok, download top 20 videos, and analyze with Gemini 2.0
                </p>
              </div>
            )}

            {/* Single Mode */}
            {mode === 'single' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🔗 Paste TikTok URL
                </label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://www.tiktok.com/@user/video/..."
                    className="flex-1 px-6 py-4 text-lg border-2 border-purple-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-400"
                  />
                  <button
                    onClick={handleSingleAnalyze}
                    disabled={loading}
                    className="px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-lg font-bold rounded-2xl hover:shadow-2xl transition disabled:opacity-50"
                  >
                    {loading ? '⏳ Analyzing...' : '🔍 Analyze'}
                  </button>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
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
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 transition"
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
              {results.map((result, idx) => (
                <div key={idx} className="bg-white rounded-3xl shadow-2xl p-8">
                  
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Video #{idx + 1}: @{result.author}
                      </h3>
                      <p className="text-gray-600">{result.description}</p>
                    </div>
                    {result.analysis?.isAd === 'YES' && (
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold">
                        💰 Advertisement
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  {result.views && (
                    <div className="grid grid-cols-4 gap-3 mb-6">
                      <div className="bg-purple-50 p-3 rounded-xl text-center">
                        <div className="text-xl font-bold">
                          {result.views.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-600">Views</div>
                      </div>
                      <div className="bg-pink-50 p-3 rounded-xl text-center">
                        <div className="text-xl font-bold">
                          {result.likes.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-600">Likes</div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-xl text-center">
                        <div className="text-xl font-bold">
                          {result.comments.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-600">Comments</div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-xl text-center">
                        <div className="text-xl font-bold">
                          {result.shares.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-600">Shares</div>
                      </div>
                    </div>
                  )}

                  {/* Analysis Grid */}
                  {result.analysis && !result.analysis.error && (
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-red-50 p-4 rounded-xl">
                        <div className="font-bold text-red-900 mb-2">🎯 Hook</div>
                        <div className="text-sm text-gray-700">
                          {result.analysis.hook}
                        </div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-xl">
                        <div className="font-bold text-blue-900 mb-2">👁️ Visual Hook</div>
                        <div className="text-sm text-gray-700">
                          {result.analysis.visualHook}
                        </div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-xl">
                        <div className="font-bold text-purple-900 mb-2">📁 Category</div>
                        <div className="text-sm">
                          <span className="bg-purple-200 px-2 py-1 rounded">
                            {result.analysis.category}
                          </span>
                        </div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-xl">
                        <div className="font-bold text-green-900 mb-2">🎨 Tone</div>
                        <div className="text-sm">
                          <span className="bg-green-200 px-2 py-1 rounded">
                            {result.analysis.tone}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Full Analysis */}
                  {result.analysis && (
                    <details className="mt-4">
                      <summary className="cursor-pointer text-purple-600 font-bold hover:text-purple-800">
                        📋 View Complete Analysis
                      </summary>
                      <div className="mt-4 p-6 bg-gray-50 rounded-xl whitespace-pre-wrap text-sm">
                        {result.analysis.fullText || result.analysis.analysis}
                      </div>
                    </details>
                  )}

                  {/* Video Link */}
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
                Choose Your Analysis Mode
              </h2>
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-8">
                <div className="bg-purple-50 p-8 rounded-2xl">
                  <div className="text-4xl mb-4">📊</div>
                  <h3 className="font-bold text-xl mb-3">Batch Analysis</h3>
                  <ul className="text-left text-sm text-gray-600 space-y-2">
                    <li>✅ Search by keywords</li>
                    <li>✅ Analyze top 20 videos</li>
                    <li>✅ Gemini watches each video</li>
                    <li>✅ Export to CSV</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-8 rounded-2xl">
                  <div className="text-4xl mb-4">🔗</div>
                  <h3 className="font-bold text-xl mb-3">Single URL</h3>
                  <ul className="text-left text-sm text-gray-600 space-y-2">
                    <li>✅ Paste any TikTok URL</li>
                    <li>✅ Deep video analysis</li>
                    <li>✅ Hook breakdown</li>
                    <li>✅ Replication guide</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
