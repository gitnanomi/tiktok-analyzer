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
        body: JSON.stringify({ input }),
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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const exportToCSV = () => {
    if (results.length === 0) return;

    const headers = [
      'Author', 'Description', 'Views', 'Likes', 
      'Content Type', 'Category', 'Hook', 'Is Ad?', 'Success Factors'
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
      `"${(r.analysis?.successFactors || '').replace(/"/g, '""')}"`,
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
        <title>TikTok Analyzer - Viral Content Analysis</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-900">
        
        <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-black text-white">
                  TikTok Analyzer Pro
                </h1>
                <p className="text-white/90 mt-2 text-lg">
                  Reverse-engineer viral content • AI recreation prompts • Jenny Hoyos Framework
                </p>
              </div>
              {results.length > 0 && (
                <button
                  onClick={exportToCSV}
                  className="px-5 py-2.5 bg-white text-purple-700 text-sm font-bold rounded-lg hover:bg-gray-100 transition shadow-lg"
                >
                  📥 Export CSV
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
            <div className="flex gap-4 mb-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                placeholder="🔗 Paste TikTok URL or 🔍 Enter keywords..."
                className="flex-1 px-6 py-4 text-lg border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-400 focus:border-transparent"
              />
              <button
                onClick={handleAnalyze}
                disabled={loading || !input}
                className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-bold rounded-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
              >
                {loading ? '⏳ Analyzing...' : '🚀 Analyze'}
              </button>
            </div>
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 border-2 border-red-300 rounded-xl text-red-700 font-medium">
                ❌ {error}
              </div>
            )}
          </div>

          {results.length > 0 && (
            <div className="space-y-8">
              {results.map((result, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                  
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 px-8 py-6 border-b-2 border-purple-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-2xl font-black text-gray-900">
                          @{result.author}
                        </h2>
                        <p className="text-gray-700 mt-2 text-lg">{result.description}</p>
                      </div>
                      {result.analysis?.isAd?.toLowerCase().includes('yes') && (
                        <span className="px-4 py-2 bg-yellow-400 text-yellow-900 text-sm font-bold rounded-full shadow-md">
                          💰 SPONSORED
                        </span>
                      )}
                    </div>
                  </div>

                  {result.analysis && (
                    <div className="p-8 space-y-8">
                      
                      {result.analysis.hook && (
                        <div>
                          <h3 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                            <span className="text-3xl">🎣</span>
                            Hook (First 3 Seconds)
                          </h3>
                          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-6 rounded-r-xl">
                            <p className="text-gray-800 leading-relaxed text-base whitespace-pre-line">
                              {result.analysis.hook}
                            </p>
                          </div>
                        </div>
                      )}

                      {result.analysis.storyLine && (
                        <div>
                          <h3 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                            <span className="text-3xl">📖</span>
                            Story Line
                          </h3>
                          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 p-6 rounded-r-xl">
                            <p className="text-gray-800 leading-relaxed text-base whitespace-pre-line">
                              {result.analysis.storyLine}
                            </p>
                          </div>
                        </div>
                      )}

                      {result.analysis.cta && (
                        <div>
                          <h3 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                            <span className="text-3xl">👉</span>
                            Call to Action (CTA)
                          </h3>
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-6 rounded-r-xl">
                            <p className="text-gray-800 leading-relaxed text-base whitespace-pre-line">
                              {result.analysis.cta}
                            </p>
                          </div>
                        </div>
                      )}

                      {result.analysis.visualElements && (
                        <div>
                          <h3 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                            <span className="text-3xl">🎥</span>
                            Visual Elements
                          </h3>
                          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 p-6 rounded-r-xl">
                            <p className="text-gray-800 leading-relaxed text-base whitespace-pre-line">
                              {result.analysis.visualElements}
                            </p>
                          </div>
                        </div>
                      )}

                      {result.analysis.jennyFramework && (
                        <div className="border-4 border-purple-300 rounded-2xl overflow-hidden">
                          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
                            <h3 className="text-2xl font-black text-white flex items-center gap-3">
                              <span className="text-3xl">🎬</span>
                              Jenny Hoyos Filming Framework
                            </h3>
                            <p className="text-white/90 mt-1 text-sm">
                              How top creators engineer videos backwards - hook to ending
                            </p>
                          </div>
                          <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-8">
                            <div className="text-gray-800 leading-relaxed text-base whitespace-pre-line">
                              {result.analysis.jennyFramework}
                            </div>
                          </div>
                        </div>
                      )}

                      {result.analysis.successFactors && (
                        <div>
                          <h3 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                            <span className="text-3xl">🔥</span>
                            Success Factors
                          </h3>
                          <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 p-6 rounded-r-xl">
                            <p className="text-gray-800 leading-relaxed text-base whitespace-pre-line">
                              {result.analysis.successFactors}
                            </p>
                          </div>
                        </div>
                      )}

                      {result.analysis.aiPrompts && (result.analysis.aiPrompts.midjourney || result.analysis.aiPrompts.stableDiffusion) && (
                        <div className="border-t-2 border-gray-200 pt-8">
                          <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                            <span className="text-3xl">🤖</span>
                            AI Prompt Engineering
                          </h3>
                          
                          <div className="space-y-5">
                            
                            {result.analysis.aiPrompts.midjourney && (
                              <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-xl border-2 border-purple-300">
                                <div className="flex items-center justify-between mb-4">
                                  <span className="font-bold text-gray-900 text-lg">Midjourney/DALL-E Prompt</span>
                                  <button
                                    onClick={() => copyToClipboard(result.analysis.aiPrompts.midjourney)}
                                    className="px-5 py-2 bg-white border-2 border-purple-400 rounded-lg hover:bg-purple-50 transition font-bold text-purple-700 shadow-md"
                                  >
                                    📋 Copy
                                  </button>
                                </div>
                                <div className="bg-white p-5 rounded-lg border-2 border-purple-200 font-mono text-sm leading-relaxed shadow-inner">
                                  {result.analysis.aiPrompts.midjourney}
                                </div>
                              </div>
                            )}

                            {result.analysis.aiPrompts.stableDiffusion && (
                              <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-6 rounded-xl border-2 border-blue-300">
                                <div className="flex items-center justify-between mb-4">
                                  <span className="font-bold text-gray-900 text-lg">Stable Diffusion Prompt</span>
                                  <button
                                    onClick={() => copyToClipboard(result.analysis.aiPrompts.stableDiffusion)}
                                    className="px-5 py-2 bg-white border-2 border-blue-400 rounded-lg hover:bg-blue-50 transition font-bold text-blue-700 shadow-md"
                                  >
                                    📋 Copy
                                  </button>
                                </div>
                                <div className="bg-white p-5 rounded-lg border-2 border-blue-200 font-mono text-sm leading-relaxed shadow-inner">
                                  {result.analysis.aiPrompts.stableDiffusion}
                                </div>
                              </div>
                            )}

                            {result.analysis.aiPrompts.template && (
                              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-xl border-2 border-yellow-300">
                                <div className="flex items-center justify-between mb-4">
                                  <span className="font-bold text-gray-900 text-lg">Product Swap Template</span>
                                  <button
                                    onClick={() => copyToClipboard(result.analysis.aiPrompts.template)}
                                    className="px-5 py-2 bg-white border-2 border-yellow-400 rounded-lg hover:bg-yellow-50 transition font-bold text-yellow-700 shadow-md"
                                  >
                                    📋 Copy
                                  </button>
                                </div>
                                <div className="bg-white p-5 rounded-lg border-2 border-yellow-200 font-mono text-sm leading-relaxed mb-4 shadow-inner">
                                  {result.analysis.aiPrompts.template}
                                </div>
                                {result.analysis.aiPrompts.example && (
                                  <div className="text-sm text-gray-700 bg-white/70 p-4 rounded-lg border-2 border-yellow-100">
                                    <span className="font-bold">Example:</span> {result.analysis.aiPrompts.example}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {result.analysis.replicableElements && (
                        <div>
                          <h3 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                            <span className="text-3xl">⚡</span>
                            Replicable Elements
                          </h3>
                          <div className="bg-gradient-to-r from-green-50 to-teal-50 border-l-4 border-green-500 p-6 rounded-r-xl">
                            <p className="text-gray-800 leading-relaxed text-base whitespace-pre-line">
                              {result.analysis.replicableElements}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="border-t-2 border-gray-200 pt-6">
                        <div className="flex flex-wrap gap-4">
                          {result.analysis.contentType && (
                            <div className="px-5 py-3 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full text-sm border-2 border-purple-300">
                              <span className="font-bold text-purple-900">Type:</span>{' '}
                              <span className="text-purple-700">{result.analysis.contentType}</span>
                            </div>
                          )}
                          {result.analysis.category && (
                            <div className="px-5 py-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full text-sm border-2 border-blue-300">
                              <span className="font-bold text-blue-900">Category:</span>{' '}
                              <span className="text-blue-700">{result.analysis.category}</span>
                            </div>
                          )}
                          {result.analysis.tone && (
                            <div className="px-5 py-3 bg-gradient-to-r from-pink-100 to-pink-200 rounded-full text-sm border-2 border-pink-300">
                              <span className="font-bold text-pink-900">Tone:</span>{' '}
                              <span className="text-pink-700">{result.analysis.tone}</span>
                            </div>
                          )}
                        </div>
                      </div>

                   {result.url && (
  <div className="border-t border-gray-200 pt-6">
    <a                              
      href={result.url}
      target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 font-bold text-lg"
                          >
                            <span>🎬 Watch on TikTok</span>
                            <span>→</span>
                          </a>
                        </div>
                      )}

                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {results.length === 0 && !loading && (
            <div className="bg-white rounded-2xl shadow-2xl p-16 text-center">
              <div className="text-7xl mb-6">🎯</div>
              <h2 className="text-4xl font-black text-gray-900 mb-4">
                Analyze Any TikTok Video
              </h2>
              <p className="text-gray-600 text-xl max-w-3xl mx-auto mb-8">
                Get deep analysis including the Jenny Hoyos Framework - how top creators engineer videos backwards from hook to ending
              </p>
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 p-8 rounded-xl">
                  <div className="text-5xl mb-4">🔗</div>
                  <h3 className="font-black text-xl text-gray-900 mb-3">Single Video Deep Dive</h3>
                  <p className="text-gray-700">
                    Complete breakdown including Jenny Hoyos structure analysis
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 p-8 rounded-xl">
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="font-black text-xl text-gray-900 mb-3">Batch Research</h3>
                  <p className="text-gray-700">
                    Analyze multiple videos for competitive intelligence
                  </p>
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="bg-white rounded-2xl shadow-2xl p-16 text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mb-6"></div>
              <p className="text-gray-700 text-2xl font-bold">Analyzing with Jenny Hoyos Framework...</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
