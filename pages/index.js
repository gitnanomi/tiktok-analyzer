import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]); // 改成数组，积累多个分析
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!url.includes('tiktok.com')) {
      setError('Please enter a valid TikTok URL');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Analysis failed');
      
      // 添加到结果列表
      setResults(prev => [data, ...prev]);
      setUrl(''); // 清空输入框，准备下一个
      
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 导出为CSV
  const exportToCSV = () => {
    if (results.length === 0) {
      alert('No data to export!');
      return;
    }

    const csvRows = [];
    
    // Header
    csvRows.push([
      'Date',
      'URL',
      'Creator',
      'Title',
      'Hook - Opening',
      'Hook - Visual',
      'Hook - Type',
      'Hook - Why Works',
      'Storyline',
      'Pain Points',
      'Emotional Journey',
      'Content Format',
      'Solution',
      'Is Ad?',
      'Product Mentioned',
      'CTA Type',
      'Key Takeaways',
      'Replication Potential'
    ].join(','));

    // Data rows
    results.forEach(result => {
      const d = result.structured;
      csvRows.push([
        d.date_analyzed,
        d.url,
        d.creator,
        `"${d.title}"`,
        `"${d.hook_opening}"`,
        `"${d.hook_visual}"`,
        d.hook_type,
        `"${d.hook_why_works}"`,
        `"${d.storyline}"`,
        `"${d.pain_points}"`,
        `"${d.emotional_journey}"`,
        d.content_format,
        `"${d.solution}"`,
        d.is_ad,
        `"${d.product_mentioned}"`,
        `"${d.cta_type}"`,
        `"${d.key_takeaways}"`,
        d.replication_potential
      ].join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tiktok-market-research-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    alert('✅ CSV exported! Open in Google Sheets or Excel.');
  };

  return (
    <html lang="en">
      <head>
        <title>TikTok Market Research Tool</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-black text-white mb-3">📊 TikTok Market Research Tool</h1>
            <p className="text-xl text-white/90">Steven's Million Dollar App Playbook - Phase 1</p>
            <p className="text-white/70 mt-2">Analyze viral videos → Build your content database</p>
          </div>

          {/* Input Section */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
            <div className="flex gap-4 mb-6">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                placeholder="🔗 Paste viral TikTok URL..."
                className="flex-1 px-6 py-4 text-lg border-2 border-purple-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-400"
              />
              <button
                onClick={handleAnalyze}
                disabled={!url || loading}
                className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-bold rounded-2xl hover:shadow-2xl transition disabled:opacity-50"
              >
                {loading ? '⏳ Analyzing...' : '🔍 Research'}
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-purple-50 p-4 rounded-xl text-center">
                <div className="text-3xl font-black text-purple-600">{results.length}</div>
                <div className="text-sm text-gray-600">Videos Analyzed</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl text-center">
                <div className="text-3xl font-black text-blue-600">
                  {results.filter(r => r.structured?.is_ad?.includes('YES')).length}
                </div>
                <div className="text-sm text-gray-600">Identified Ads</div>
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

          {/* Results List */}
          {results.length > 0 && (
            <div className="space-y-6">
              {results.map((result, idx) => (
                <div key={idx} className="bg-white rounded-3xl shadow-2xl p-8">
                  {/* Video Info */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Video #{results.length - idx}
                      </h3>
                      <p className="text-gray-600">{result.videoData?.title}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        by @{result.videoData?.author_name} • {result.structured.date_analyzed}
                      </p>
                    </div>
                    <button
                      onClick={() => setResults(results.filter((_, i) => i !== idx))}
                      className="text-red-500 hover:text-red-700 font-bold"
                    >
                      🗑️ Remove
                    </button>
                  </div>

                  {/* 3 Core Elements */}
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Hook */}
                    <div className="bg-red-50 rounded-2xl p-6 border-2 border-red-200">
                      <h4 className="text-lg font-bold text-red-900 mb-3">🎯 HOOK</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-semibold">Opening:</span>
                          <p className="text-gray-700">{result.structured.hook_opening}</p>
                        </div>
                        <div>
                          <span className="font-semibold">Visual:</span>
                          <p className="text-gray-700">{result.structured.hook_visual}</p>
                        </div>
                        <div>
                          <span className="font-semibold">Type:</span>
                          <span className="ml-2 bg-red-200 px-2 py-1 rounded text-xs">
                            {result.structured.hook_type}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Storyline */}
                    <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
                      <h4 className="text-lg font-bold text-blue-900 mb-3">📖 STORYLINE</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-semibold">Story:</span>
                          <p className="text-gray-700">{result.structured.storyline}</p>
                        </div>
                        <div>
                          <span className="font-semibold">Pain Points:</span>
                          <p className="text-gray-700">{result.structured.pain_points}</p>
                        </div>
                        <div>
                          <span className="font-semibold">Format:</span>
                          <span className="ml-2 bg-blue-200 px-2 py-1 rounded text-xs">
                            {result.structured.content_format}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
                      <h4 className="text-lg font-bold text-green-900 mb-3">📢 CTA/SOLUTION</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-semibold">Solution:</span>
                          <p className="text-gray-700">{result.structured.solution}</p>
                        </div>
                        <div>
                          <span className="font-semibold">Product:</span>
                          <p className="text-gray-700">{result.structured.product_mentioned}</p>
                        </div>
                        <div>
                          <span className="font-semibold">Is Ad?</span>
                          <span className={`ml-2 px-2 py-1 rounded text-xs font-bold ${
                            result.structured.is_ad?.includes('YES') 
                              ? 'bg-yellow-200 text-yellow-900' 
                              : 'bg-green-200 text-green-900'
                          }`}>
                            {result.structured.is_ad}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Full Analysis Toggle */}
                  <details className="mt-6">
                    <summary className="cursor-pointer text-purple-600 font-semibold hover:text-purple-800">
                      📋 View Full Analysis
                    </summary>
                    <div className="mt-4 p-6 bg-gray-50 rounded-xl whitespace-pre-wrap text-sm">
                      {result.analysis}
                    </div>
                  </details>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {results.length === 0 && !loading && (
            <div className="bg-white rounded-3xl shadow-2xl p-16 text-center">
              <div className="text-6xl mb-6">📊</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Start Your Market Research</h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Following Steven's playbook: Spend 7 days analyzing viral videos in your niche. 
                Save them here, analyze the Hook/Storyline/CTA, and build your content strategy database.
              </p>
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-red-50 p-6 rounded-2xl">
                  <div className="text-4xl mb-3">🎯</div>
                  <h3 className="font-bold text-lg mb-2">Analyze Hooks</h3>
                  <p className="text-sm text-gray-600">Understand what grabs attention in the first 3 seconds</p>
                </div>
                <div className="bg-blue-50 p-6 rounded-2xl">
                  <div className="text-4xl mb-3">📖</div>
                  <h3 className="font-bold text-lg mb-2">Study Stories</h3>
                  <p className="text-sm text-gray-600">Identify pain points and emotional journeys</p>
                </div>
                <div className="bg-green-50 p-6 rounded-2xl">
                  <div className="text-4xl mb-3">💡</div>
                  <h3 className="font-bold text-lg mb-2">Find Solutions</h3>
                  <p className="text-sm text-gray-600">Discover how products are promoted organically</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </body>
    </html>
  );
}
