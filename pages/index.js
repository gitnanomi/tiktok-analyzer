import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [mode, setMode] = useState(null);
  const [detailedView, setDetailedView] = useState({});

  const toggleDetailedView = (resultIdx, section) => {
    const key = `${resultIdx}-${section}`;
    setDetailedView(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isDetailedViewActive = (resultIdx, section) => {
    return detailedView[`${resultIdx}-${section}`] || false;
  };

  const handleAnalyze = async () => {
    if (!input) {
      setError('Please enter a TikTok URL or keywords');
      return;
    }

    setLoading(true);
    setError('');
    setMode(null);
    setDetailedView({});

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
      'Content Type', 'Category', 'Hook Summary', 'Is Ad?', 'Success Factors'
    ];
    
    const rows = results.map(r => [
      r.author || '',
      `"${(r.description || '').replace(/"/g, '""')}"`,
      r.views || 0,
      r.likes || 0,
      r.analysis?.contentType || '',
      r.analysis?.category || '',
      `"${(r.analysis?.hook?.summary || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      r.analysis?.isAd || '',
      `"${(r.analysis?.successFactors || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `tiktok-analysis-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const SectionCard = ({ title, emoji, summaryContent, detailedContent, resultIdx, sectionKey, bgColor }) => {
    const showDetailed = isDetailedViewActive(resultIdx, sectionKey);
    
    return (
      <div className={`${bgColor} rounded-xl p-6 border-2 border-gray-200`}>
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="text-2xl">{emoji}</span>
            {title}
          </h3>
          <button
            onClick={() => toggleDetailedView(resultIdx, sectionKey)}
            className="px-4 py-1.5 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-semibold text-gray-700"
          >
            {showDetailed ? '📋 Summary' : '📖 Details'}
          </button>
        </div>
        
        <div className="text-gray-800 leading-relaxed whitespace-pre-line">
          {showDetailed ? detailedContent : summaryContent}
        </div>
      </div>
    );
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
                  Deep content analysis • AI recreation prompts • Scripting insights
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
            <div className="mb-4">
              <div className="flex gap-4 mb-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                  placeholder="Paste TikTok URL or enter keywords..."
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
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="px-3 py-1 bg-blue-100 rounded-full font-medium">🔗 URL Mode</span>
                <span className="text-gray-400">or</span>
                <span className="px-3 py-1 bg-green-100 rounded-full font-medium">🔍 Keyword Mode</span>
                <span className="text-gray-500 ml-2">← Both work! Paste a link or search by keywords</span>
              </div>
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
                    <div className="p-8 space-y-5">
                      
                      {result.analysis.hook && (
                        <SectionCard
                          title="Hook (First 3 Seconds)"
                          emoji="🎣"
                          summaryContent={result.analysis.hook.summary}
                          detailedContent={result.analysis.hook.detailed}
                          resultIdx={idx}
                          sectionKey="hook"
                          bgColor="bg-gradient-to-r from-red-50 to-orange-50"
                        />
                      )}

                      {result.analysis.storyLine && (
                        <SectionCard
                          title="Story Line"
                          emoji="📖"
                          summaryContent={result.analysis.storyLine.summary}
                          detailedContent={result.analysis.storyLine.detailed}
                          resultIdx={idx}
                          sectionKey="story"
                          bgColor="bg-gradient-to-r from-purple-50 to-pink-50"
                        />
                      )}

                      {result.analysis.scriptingProcess && (
                        <SectionCard
                          title="Scripting Process"
                          emoji="📝"
                          summaryContent={result.analysis.scriptingProcess.summary}
                          detailedContent={result.analysis.scriptingProcess.detailed}
                          resultIdx={idx}
                          sectionKey="scripting"
                          bgColor="bg-gradient-to-r from-indigo-50 to-blue-50"
                        />
                      )}

                      {result.analysis.cta && (
                        <SectionCard
                          title="Call to Action (CTA)"
                          emoji="👉"
                          summaryContent={result.analysis.cta.summary}
                          detailedContent={result.analysis.cta.detailed}
                          resultIdx={idx}
                          sectionKey="cta"
                          bgColor="bg-gradient-to-r from-green-50 to-emerald-50"
                        />
                      )}

                      {result.analysis.visualElements && (
                        <SectionCard
                          title="Visual Elements"
                          emoji="🎥"
                          summaryContent={result.analysis.visualElements.summary}
                          detailedContent={result.analysis.visualElements.detailed}
                          resultIdx={idx}
                          sectionKey="visual"
                          bgColor="bg-gradient-to-r from-blue-50 to-cyan-50"
                        />
                      )}

                      {result.analysis.successFactors && (
                        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border-2 border-gray-200">
                          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                            <span className="text-2xl">🔥</span>
                            Success Factors
                          </h3>
                          <div className="text-gray-800 leading-relaxed whitespace-pre-line">
                            {result.analysis.successFactors}
                          </div>
                        </div>
                      )}

                      {result.analysis.aiPrompts && (result.analysis.aiPrompts.midjourney || result.analysis.aiPrompts.stableDiffusion) && (
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-300">
                          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-5">
                            <span className="text-2xl">🤖</span>
                            AI Prompt Engineering
                          </h3>
                          
                          <div className="space-y-4">
                            
                            {result.analysis.aiPrompts.midjourney && (
                              <div className="bg-white p-5 rounded-lg border-2 border-purple-200 shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="font-bold text-gray-900">📸 Midjourney/DALL-E</span>
                                  <button
                                    onClick={() => copyToClipboard(result.analysis.aiPrompts.midjourney)}
                                    className="px-4 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
                                  >
                                    Copy
                                  </button>
                                </div>
                                <div className="bg-gray-50 p-4 rounded border border-purple-200 text-sm leading-relaxed">
                                  {result.analysis.aiPrompts.midjourney}
                                </div>
                              </div>
                            )}

                            {result.analysis.aiPrompts.stableDiffusion && (
                              <div className="bg-white p-5 rounded-lg border-2 border-blue-200 shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="font-bold text-gray-900">🎨 Stable Diffusion</span>
                                  <button
                                    onClick={() => copyToClipboard(result.analysis.aiPrompts.stableDiffusion)}
                                    className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                                  >
                                    Copy
                                  </button>
                                </div>
                                <div className="bg-gray-50 p-4 rounded border border-blue-200 text-sm leading-relaxed">
                                  {result.analysis.aiPrompts.stableDiffusion}
                                </div>
                              </div>
                            )}

                            {result.analysis.aiPrompts.productTemplate && (
                              <div className="bg-white p-5 rounded-lg border-2 border-yellow-200 shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="font-bold text-gray-900">🔄 Product Swap Template</span>
                                  <button
                                    onClick={() => copyToClipboard(result.analysis.aiPrompts.productTemplate)}
                                    className="px-4 py-1.5 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition text-sm font-medium"
                                  >
                                    Copy
                                  </button>
                                </div>
                                <div className="bg-gray-50 p-4 rounded border border-yellow-200 text-sm leading-relaxed mb-3">
                                  {result.analysis.aiPrompts.productTemplate}
                                </div>
                                {result.analysis.aiPrompts.example && (
                                  <div className="bg-yellow-50 p-3 rounded border border-yellow-100 text-sm">
                                    <span className="font-bold">Example:</span> {result.analysis.aiPrompts.example}
                                  </div>
                                )}
                              </div>
                            )}

                            {result.analysis.aiPrompts.shotBreakdown && (
                              <div className="bg-white p-5 rounded-lg border-2 border-green-200 shadow-sm">
                                <div className="font-bold text-gray-900 mb-3">🎬 Shot-by-Shot Breakdown</div>
                                <div className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
                                  {result.analysis.aiPrompts.shotBreakdown}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {result.analysis.replicableElements && (
                        <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6 border-2 border-gray-200">
                          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                            <span className="text-2xl">⚡</span>
                            Replicable Elements
                          </h3>
                          <div className="text-gray-800 leading-relaxed whitespace-pre-line">
                            {result.analysis.replicableElements}
                          </div>
                        </div>
                      )}

                      <div className="border-t-2 border-gray-200 pt-6">
                        <div className="flex flex-wrap gap-3 mb-6">
                          {result.analysis.contentType && (
                            <span className="px-4 py-2 bg-purple-100 border border-purple-300 rounded-full text-sm font-semibold text-purple-900">
                              {result.analysis.contentType}
                            </span>
                          )}
                          {result.analysis.category && (
                            <span className="px-4 py-2 bg-blue-100 border border-blue-300 rounded-full text-sm font-semibold text-blue-900">
                              {result.analysis.category}
                            </span>
                          )}
                          {result.analysis.tone && (
                            <span className="px-4 py-2 bg-pink-100 border border-pink-300 rounded-full text-sm font-semibold text-pink-900">
                              {result.analysis.tone}
                            </span>
                          )}
                        </div>

                        {result.url && (
                          <a
                            href={result.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 font-bold text-lg"
                          >
                            <span>🎬 Watch on TikTok</span>
                            <span>→</span>
                          </a>
                        )}
                      </div>

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
                Paste a <span className="font-bold text-purple-600">TikTok URL</span> for single video deep dive,
                or enter <span className="font-bold text-green-600">keywords</span> to analyze top viral videos
              </p>
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 p-8 rounded-xl">
                  <div className="text-5xl mb-4">🔗</div>
                  <h3 className="font-black text-xl text-gray-900 mb-3">URL Analysis</h3>
                  <p className="text-gray-700 text-sm">
                    Complete breakdown with scripting insights, visual analysis, and AI recreation prompts
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 p-8 rounded-xl">
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="font-black text-xl text-gray-900 mb-3">Keyword Research</h3>
                  <p className="text-gray-700 text-sm">
                    Batch analysis of trending videos for competitive intelligence and market research
                  </p>
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="bg-white rounded-2xl shadow-2xl p-16 text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mb-6"></div>
              <p className="text-gray-700 text-2xl font-bold">Analyzing with AI...</p>
              <p className="text-gray-500 mt-2">Generating dual-version analysis</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
