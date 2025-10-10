import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [mode, setMode] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (resultIdx, section) => {
    const key = `${resultIdx}-${section}`;
    setExpandedSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isSectionExpanded = (resultIdx, section) => {
    return expandedSections[`${resultIdx}-${section}`] || false;
  };

  const handleAnalyze = async () => {
    if (!input) {
      setError('Please enter a TikTok URL or keywords');
      return;
    }

    setLoading(true);
    setError('');
    setMode(null);
    setExpandedSections({});

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

  const CollapsibleSection = ({ title, emoji, content, resultIdx, sectionKey, bgGradient, borderColor }) => {
    const isExpanded = isSectionExpanded(resultIdx, sectionKey);
    
    return (
      <div className={`${bgGradient} border-2 ${borderColor} rounded-xl overflow-hidden`}>
        <button
          onClick={() => toggleSection(resultIdx, sectionKey)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/30 transition"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{emoji}</span>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          </div>
          <span className="text-2xl text-gray-600">
            {isExpanded ? '−' : '+'}
          </span>
        </button>
        {isExpanded && (
          <div className="px-6 py-4 bg-white/50 border-t-2 border-white/50">
            <div className="text-gray-800 leading-relaxed whitespace-pre-line">
              {content}
            </div>
          </div>
        )}
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
                    <div className="p-8 space-y-4">
                      
                      {result.analysis.hook && (
                        <CollapsibleSection
                          title="Hook (First 3 Seconds)"
                          emoji="🎣"
                          content={result.analysis.hook}
                          resultIdx={idx}
                          sectionKey="hook"
                          bgGradient="bg-gradient-to-r from-red-50 to-orange-50"
                          borderColor="border-red-300"
                        />
                      )}

                      {result.analysis.storyLine && (
                        <CollapsibleSection
                          title="Story Line"
                          emoji="📖"
                          content={result.analysis.storyLine}
                          resultIdx={idx}
                          sectionKey="story"
                          bgGradient="bg-gradient-to-r from-purple-50 to-pink-50"
                          borderColor="border-purple-300"
                        />
                      )}

                      {result.analysis.scriptingProcess && (
                        <CollapsibleSection
                          title="Scripting Process"
                          emoji="📝"
                          content={result.analysis.scriptingProcess}
                          resultIdx={idx}
                          sectionKey="scripting"
                          bgGradient="bg-gradient-to-r from-indigo-50 to-blue-50"
                          borderColor="border-indigo-300"
                        />
                      )}

                      {result.analysis.cta && (
                        <CollapsibleSection
                          title="Call to Action (CTA)"
                          emoji="👉"
                          content={result.analysis.cta}
                          resultIdx={idx}
                          sectionKey="cta"
                          bgGradient="bg-gradient-to-r from-green-50 to-emerald-50"
                          borderColor="border-green-300"
                        />
                      )}

                      {result.analysis.visualElements && (
                        <CollapsibleSection
                          title="Visual Elements"
                          emoji="🎥"
                          content={result.analysis.visualElements}
                          resultIdx={idx}
                          sectionKey="visual"
                          bgGradient="bg-gradient-to-r from-blue-50 to-cyan-50"
                          borderColor="border-blue-300"
                        />
                      )}

                      {result.analysis.successFactors && (
                        <CollapsibleSection
                          title="Success Factors"
                          emoji="🔥"
                          content={result.analysis.successFactors}
                          resultIdx={idx}
                          sectionKey="success"
                          bgGradient="bg-gradient-to-r from-orange-50 to-red-50"
                          borderColor="border-orange-300"
                        />
                      )}

                      {result.analysis.aiPrompts && (result.analysis.aiPrompts.step1?.midjourneyPrompt || result.analysis.aiPrompts.step1?.stableDiffusionPrompt) && (
                        <div className="border-2 border-purple-300 rounded-xl overflow-hidden">
                          <button
                            onClick={() => toggleSection(idx, 'ai')}
                            className="w-full px-6 py-4 bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-between hover:from-purple-200 hover:to-pink-200 transition"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">🤖</span>
                              <h3 className="text-lg font-bold text-gray-900">AI Prompt Engineering</h3>
                            </div>
                            <span className="text-2xl text-gray-600">
                              {isSectionExpanded(idx, 'ai') ? '−' : '+'}
                            </span>
                          </button>
                          
                          {isSectionExpanded(idx, 'ai') && (
                            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 space-y-5">
                              
                              {result.analysis.aiPrompts.step1?.midjourneyPrompt && (
                                <div className="bg-white p-5 rounded-lg border-2 border-purple-200 shadow-sm">
                                  <div className="flex items-center justify-between mb-3">
                                    <span className="font-bold text-gray-900">📸 Midjourney/DALL-E Prompt</span>
                                    <button
                                      onClick={() => copyToClipboard(result.analysis.aiPrompts.step1.midjourneyPrompt)}
                                      className="px-4 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
                                    >
                                      Copy
                                    </button>
                                  </div>
                                  <div className="bg-gray-50 p-4 rounded border border-purple-200 font-mono text-sm">
                                    {result.analysis.aiPrompts.step1.midjourneyPrompt}
                                  </div>
                                </div>
                              )}

                              {result.analysis.aiPrompts.step1?.stableDiffusionPrompt && (
                                <div className="bg-white p-5 rounded-lg border-2 border-blue-200 shadow-sm">
                                  <div className="flex items-center justify-between mb-3">
                                    <span className="font-bold text-gray-900">🎨 Stable Diffusion Prompt</span>
                                    <button
                                      onClick={() => copyToClipboard(result.analysis.aiPrompts.step1.stableDiffusionPrompt)}
                                      className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                                    >
                                      Copy
                                    </button>
                                  </div>
                                  <div className="bg-gray-50 p-4 rounded border border-blue-200 font-mono text-sm">
                                    {result.analysis.aiPrompts.step1.stableDiffusionPrompt}
                                  </div>
                                </div>
                              )}

                              {result.analysis.aiPrompts.step2?.template && (
                                <div className="bg-white p-5 rounded-lg border-2 border-yellow-200 shadow-sm">
                                  <div className="flex items-center justify-between mb-3">
                                    <span className="font-bold text-gray-900">🔄 Product Swap Template</span>
                                    <button
                                      onClick={() => copyToClipboard(result.analysis.aiPrompts.step2.template)}
                                      className="px-4 py-1.5 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition text-sm font-medium"
                                    >
                                      Copy
                                    </button>
                                  </div>
                                  <div className="bg-gray-50 p-4 rounded border border-yellow-200 font-mono text-sm mb-3">
                                    {result.analysis.aiPrompts.step2.template}
                                  </div>
                                  {result.analysis.aiPrompts.step2.example && (
                                    <div className="text-sm text-gray-700 bg-yellow-50 p-3 rounded border border-yellow-100">
                                      <span className="font-bold">Example:</span> {result.analysis.aiPrompts.step2.example}
                                    </div>
                                  )}
                                </div>
                              )}

                              {result.analysis.aiPrompts.step3?.breakdown && (
                                <div className="bg-white p-5 rounded-lg border-2 border-green-200 shadow-sm">
                                  <div className="font-bold text-gray-900 mb-3">🎬 Shot-by-Shot Breakdown</div>
                                  <div className="text-sm text-gray-800 whitespace-pre-line">
                                    {result.analysis.aiPrompts.step3.breakdown}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {result.analysis.replicableElements && (
                        <CollapsibleSection
                          title="Replicable Elements"
                          emoji="⚡"
                          content={result.analysis.replicableElements}
                          resultIdx={idx}
                          sectionKey="replicable"
                          bgGradient="bg-gradient-to-r from-green-50 to-teal-50"
                          borderColor="border-green-300"
                        />
                      )}

                      <div className="border-t-2 border-gray-200 pt-6 mt-6">
                        <div className="flex flex-wrap gap-3 mb-6">
                          {result.analysis.contentType && (
                            <div className="px-4 py-2 bg-purple-100 border border-purple-300 rounded-full text-sm">
                              <span className="font-bold text-purple-900">Type:</span>{' '}
                              <span className="text-purple-700">{result.analysis.contentType}</span>
                            </div>
                          )}
                          {result.analysis.category && (
                            <div className="px-4 py-2 bg-blue-100 border border-blue-300 rounded-full text-sm">
                              <span className="font-bold text-blue-900">Category:</span>{' '}
                              <span className="text-blue-700">{result.analysis.category}</span>
                            </div>
                          )}
                          {result.analysis.tone && (
                            <div className="px-4 py-2 bg-pink-100 border border-pink-300 rounded-full text-sm">
                              <span className="font-bold text-pink-900">Tone:</span>{' '}
                              <span className="text-pink-700">{result.analysis.tone}</span>
                            </div>
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
                Deep analysis with scripting insights, visual breakdown, and AI recreation prompts
              </p>
            </div>
          )}

          {loading && (
            <div className="bg-white rounded-2xl shadow-2xl p-16 text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mb-6"></div>
              <p className="text-gray-700 text-2xl font-bold">Analyzing video...</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
