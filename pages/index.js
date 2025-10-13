import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [demoMode, setDemoMode] = useState(false);
  const [mode, setMode] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [detailedView, setDetailedView] = useState({});

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
    if (!input.trim()) {
      setError('Please enter a TikTok URL or keywords');
      return;
    }

    setLoading(true);
    setError('');
    setDemoMode(false);
    setMode(null);
    setExpandedSections({});
    setDetailedView({});

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: input.trim() }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }
      
      setResults(data.results || []);
      setMode(data.mode);
      setDemoMode(data.demo || false);
      
      if (data.results && data.results.length > 0) {
        setInput('');
      }
      
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'Failed to analyze. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = '✓ Copied!';
    button.classList.add('bg-green-600');
    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('bg-green-600');
    }, 2000);
  };

  const copyAllPrompts = (prompts) => {
    const allText = `MIDJOURNEY/DALL-E PROMPT:\n${prompts.midjourney}\n\nSTABLE DIFFUSION PROMPT:\n${prompts.stableDiffusion}\n\nPRODUCT SWAP TEMPLATE:\n${prompts.productTemplate}\n\nEXAMPLE:\n${prompts.example}\n\nSHOT BREAKDOWN:\n${prompts.shotBreakdown}`;
    navigator.clipboard.writeText(allText);
    alert('✅ All prompts copied to clipboard!');
  };

  const exportToCSV = () => {
    if (results.length === 0) return;

    const headers = [
      'Author', 'Description', 'Views', 'Likes', 'Comments', 'Shares',
      'Content Type', 'Category', 'Tone', 'Success Factors', 'URL'
    ];
    
    const rows = results.map(r => [
      r.author || '',
      `"${(r.description || '').replace(/"/g, '""')}"`,
      r.views || 0,
      r.likes || 0,
      r.comments || 0,
      r.shares || 0,
      r.analysis?.contentType || '',
      r.analysis?.category || '',
      r.analysis?.tone || '',
      `"${(r.analysis?.successFactors || '').replace(/"/g, '""').replace(/\n/g, ' | ')}"`,
      r.url || ''
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `tiktok-analysis-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <>
      <Head>
        <title>TikTok Analyzer Pro - Viral Content Analysis</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-900">
        
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-black text-white">
                  TikTok Analyzer Pro
                </h1>
                <p className="text-white/90 mt-2 text-lg">
                  Deep content analysis • Scripting framework • AI recreation prompts
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
          
          {/* Search Box */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
            <div className="flex gap-4 mb-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !loading && handleAnalyze()}
                placeholder="Paste TikTok URL or enter keywords..."
                className="flex-1 px-6 py-4 text-lg border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-400 focus:border-transparent"
                disabled={loading}
              />
              <button
                onClick={handleAnalyze}
                disabled={loading || !input.trim()}
                className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-bold rounded-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
              >
                {loading ? '⏳ Analyzing...' : '🚀 Analyze'}
              </button>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">🔗 URL Mode</span>
              <span className="text-gray-400">or</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">🔍 Keyword Mode</span>
            </div>
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 border-2 border-red-300 rounded-xl text-red-700">
                <div className="font-bold mb-1">❌ Error</div>
                <div className="text-sm">{error}</div>
              </div>
            )}
            
            {demoMode && (
              <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-xl text-yellow-800">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold">⚠️ Demo Mode Active</div>
                    <div className="text-sm mt-1">Configure API keys in Vercel for live data</div>
                  </div>
                  <button 
                    onClick={() => setDemoMode(false)}
                    className="text-yellow-600 hover:text-yellow-800 font-bold"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-8">
              {results.map((result, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                  
                  {/* LEVEL 1: Video Header Card */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 border-b-2 border-gray-200">
                    <div className="flex gap-6 items-start">
                      {result.thumbnail && (
                        <img 
                          src={result.thumbnail} 
                          alt="Video thumbnail"
                          className="w-32 h-32 rounded-xl object-cover shadow-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h2 className="text-3xl font-black text-gray-900 mb-2">
                          @{result.author}
                        </h2>
                        <p className="text-gray-700 text-lg mb-4">{result.description}</p>
                        
                        {/* Stats */}
                        <div className="flex flex-wrap gap-3 mb-4">
                          {result.views > 0 && (
                            <span className="px-4 py-2 bg-blue-100 text-blue-900 rounded-full font-bold text-sm">
                              👁️ {(result.views / 1000000).toFixed(1)}M views
                            </span>
                          )}
                          {result.likes > 0 && (
                            <span className="px-4 py-2 bg-red-100 text-red-900 rounded-full font-bold text-sm">
                              ❤️ {(result.likes / 1000).toFixed(1)}K likes
                            </span>
                          )}
                          {result.comments > 0 && (
                            <span className="px-4 py-2 bg-green-100 text-green-900 rounded-full font-bold text-sm">
                              💬 {result.comments.toLocaleString()}
                            </span>
                          )}
                          {result.shares > 0 && (
                            <span className="px-4 py-2 bg-purple-100 text-purple-900 rounded-full font-bold text-sm">
                              🔄 {result.shares.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {result.analysis?.contentType && result.analysis.contentType !== 'Unknown' && (
                            <span className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm font-bold">
                              {result.analysis.contentType}
                            </span>
                          )}
                          {result.analysis?.category && result.analysis.category !== 'Unknown' && (
                            <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-bold">
                              {result.analysis.category}
                            </span>
                          )}
                          {result.analysis?.tone && result.analysis.tone !== 'Unknown' && (
                            <span className="px-3 py-1 bg-pink-600 text-white rounded-lg text-sm font-bold">
                              {result.analysis.tone}
                            </span>
                          )}
                          {result.analysis?.isAd?.toLowerCase().includes('yes') && (
                            <span className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded-lg text-sm font-bold">
                              💰 SPONSORED
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {result.analysis && (
                    <div className="p-8">
                      
                      {/* LEVEL 2: Core Insights - 2 Column Grid */}
                      <div className="grid lg:grid-cols-2 gap-6 mb-6">
                        
                        {/* Success Factors - Gold */}
                        {result.analysis.successFactors && (
                          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-4 border-yellow-400 shadow-lg">
                            <h3 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
                              <span className="text-3xl">🏆</span>
                              SUCCESS FACTORS
                            </h3>
                            <div className="space-y-3">
                              {result.analysis.successFactors.split(/\n\n/).filter(f => f.trim()).map((factor, i) => (
                                <div key={i} className="bg-white p-4 rounded-xl shadow-sm border-2 border-yellow-200">
                                  <div className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">
                                    {factor}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Replicable Elements - Green */}
                        {result.analysis.replicableElements && (
                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-4 border-green-400 shadow-lg">
                            <h3 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
                              <span className="text-3xl">⚡</span>
                              REPLICABLE ELEMENTS
                            </h3>
                            <div className="text-sm text-green-700 font-semibold mb-3">✅ Ready to Use</div>
                            <div className="space-y-3">
                              {result.analysis.replicableElements.split(/\n\n/).filter(e => e.trim()).map((element, i) => (
                                <div key={i} className="bg-white p-4 rounded-xl shadow-sm border-2 border-green-200">
                                  <div className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">
                                    {element}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* LEVEL 2: Scripting Process - Full Width, Special */}
                      {result.analysis.scriptingProcess && (
                        <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-50 rounded-2xl p-8 border-4 border-purple-500 shadow-xl mb-6">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-4xl">⭐</span>
                            <div>
                              <h3 className="text-3xl font-black text-purple-900">
                                DEEP DIVE: SCRIPTING PROCESS
                              </h3>
                              <p className="text-purple-700 font-semibold">The 7-Step Backwards Framework</p>
                            </div>
                          </div>
                          
                          <div className="mt-6 bg-white rounded-xl p-6 border-2 border-purple-300">
                            <div className="text-gray-800 text-sm leading-relaxed whitespace-pre-line mb-4">
                              {result.analysis.scriptingProcess.summary}
                            </div>
                            
                            {result.analysis.scriptingProcess.detailed && (
                              <button
                                onClick={() => toggleDetailedView(idx, 'scripting')}
                                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-bold w-full"
                              >
                                {isDetailedViewActive(idx, 'scripting') ? '📋 Show Summary' : '📖 Read Full Analysis'}
                              </button>
                            )}
                            
                            {isDetailedViewActive(idx, 'scripting') && result.analysis.scriptingProcess.detailed && (
                              <div className="mt-4 p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                                <div className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">
                                  {result.analysis.scriptingProcess.detailed}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* LEVEL 3: Detailed Analysis - Collapsible */}
                      <div className="space-y-4 mb-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">📋 Detailed Breakdown</h3>
                        
                        {/* Hook */}
                        {result.analysis.hook && (
                          <div className="border-2 border-gray-300 rounded-xl overflow-hidden">
                            <button
                              onClick={() => toggleSection(idx, 'hook')}
                              className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition flex items-center justify-between"
                            >
                              <span className="font-bold text-gray-900 flex items-center gap-2">
                                <span className="text-2xl">🎣</span>
                                Hook (First 3 Seconds)
                              </span>
                              <span className="text-2xl text-gray-600">
                                {isSectionExpanded(idx, 'hook') ? '−' : '+'}
                              </span>
                            </button>
                            {isSectionExpanded(idx, 'hook') && (
                              <div className="p-6 bg-white border-t-2 border-gray-200">
                                <div className="text-sm text-gray-700 mb-3 font-semibold">📋 SUMMARY</div>
                                <div className="text-gray-800 leading-relaxed whitespace-pre-line mb-4">
                                  {result.analysis.hook.summary}
                                </div>
                                {result.analysis.hook.detailed && (
                                  <>
                                    <button
                                      onClick={() => toggleDetailedView(idx, 'hook')}
                                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition text-sm font-semibold"
                                    >
                                      {isDetailedViewActive(idx, 'hook') ? '📋 Summary' : '📖 Details'}
                                    </button>
                                    {isDetailedViewActive(idx, 'hook') && (
                                      <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="text-sm text-gray-700 mb-2 font-semibold">📖 DETAILED</div>
                                        <div className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">
                                          {result.analysis.hook.detailed}
                                        </div>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Story Line */}
                        {result.analysis.storyLine && (
                          <div className="border-2 border-gray-300 rounded-xl overflow-hidden">
                            <button
                              onClick={() => toggleSection(idx, 'story')}
                              className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition flex items-center justify-between"
                            >
                              <span className="font-bold text-gray-900 flex items-center gap-2">
                                <span className="text-2xl">📖</span>
                                Story Line
                              </span>
                              <span className="text-2xl text-gray-600">
                                {isSectionExpanded(idx, 'story') ? '−' : '+'}
                              </span>
                            </button>
                            {isSectionExpanded(idx, 'story') && (
                              <div className="p-6 bg-white border-t-2 border-gray-200">
                                <div className="text-sm text-gray-700 mb-3 font-semibold">📋 SUMMARY</div>
                                <div className="text-gray-800 leading-relaxed whitespace-pre-line mb-4">
                                  {result.analysis.storyLine.summary}
                                </div>
                                {result.analysis.storyLine.detailed && (
                                  <>
                                    <button
                                      onClick={() => toggleDetailedView(idx, 'story')}
                                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition text-sm font-semibold"
                                    >
                                      {isDetailedViewActive(idx, 'story') ? '📋 Summary' : '📖 Details'}
                                    </button>
                                    {isDetailedViewActive(idx, 'story') && (
                                      <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="text-sm text-gray-700 mb-2 font-semibold">📖 DETAILED</div>
                                        <div className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">
                                          {result.analysis.storyLine.detailed}
                                        </div>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Visual Elements */}
                        {result.analysis.visualElements && (
                          <div className="border-2 border-gray-300 rounded-xl overflow-hidden">
                            <button
                              onClick={() => toggleSection(idx, 'visual')}
                              className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition flex items-center justify-between"
                            >
                              <span className="font-bold text-gray-900 flex items-center gap-2">
                                <span className="text-2xl">🎥</span>
                                Visual Elements
                              </span>
                              <span className="text-2xl text-gray-600">
                                {isSectionExpanded(idx, 'visual') ? '−' : '+'}
                              </span>
                            </button>
                            {isSectionExpanded(idx, 'visual') && (
                              <div className="p-6 bg-white border-t-2 border-gray-200">
                                <div className="text-sm text-gray-700 mb-3 font-semibold">📋 SUMMARY</div>
                                <div className="text-gray-800 leading-relaxed whitespace-pre-line mb-4">
                                  {result.analysis.visualElements.summary}
                                </div>
                                {result.analysis.visualElements.detailed && (
                                  <>
                                    <button
                                      onClick={() => toggleDetailedView(idx, 'visual')}
                                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition text-sm font-semibold"
                                    >
                                      {isDetailedViewActive(idx, 'visual') ? '📋 Summary' : '📖 Details'}
                                    </button>
                                    {isDetailedViewActive(idx, 'visual') && (
                                      <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="text-sm text-gray-700 mb-2 font-semibold">📖 DETAILED</div>
                                        <div className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">
                                          {result.analysis.visualElements.detailed}
                                        </div>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* CTA */}
                        {result.analysis.cta && (
                          <div className="border-2 border-gray-300 rounded-xl overflow-hidden">
                            <button
                              onClick={() => toggleSection(idx, 'cta')}
                              className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition flex items-center justify-between"
                            >
                              <span className="font-bold text-gray-900 flex items-center gap-2">
                                <span className="text-2xl">👉</span>
                                Call to Action (CTA)
                              </span>
                              <span className="text-2xl text-gray-600">
                                {isSectionExpanded(idx, 'cta') ? '−' : '+'}
                              </span>
                            </button>
                            {isSectionExpanded(idx, 'cta') && (
                              <div className="p-6 bg-white border-t-2 border-gray-200">
                                <div className="text-sm text-gray-700 mb-3 font-semibold">📋 SUMMARY</div>
                                <div className="text-gray-800 leading-relaxed whitespace-pre-line mb-4">
                                  {result.analysis.cta.summary}
                                </div>
                                {result.analysis.cta.detailed && (
                                  <>
                                    <button
                                      onClick={() => toggleDetailedView(idx, 'cta')}
                                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition text-sm font-semibold"
                                    >
                                      {isDetailedViewActive(idx, 'cta') ? '📋 Summary' : '📖 Details'}
                                    </button>
                                    {isDetailedViewActive(idx, 'cta') && (
                                      <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="text-sm text-gray-700 mb-2 font-semibold">📖 DETAILED</div>
                                        <div className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">
                                          {result.analysis.cta.detailed}
                                        </div>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* AI Prompts - Special Section */}
                      {result.analysis.aiPrompts && (result.analysis.aiPrompts.midjourney || result.analysis.aiPrompts.stableDiffusion) && (
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-300 shadow-lg mb-6">
                          <div className="flex items-center justify-between mb-5">
                            <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                              <span className="text-3xl">🤖</span>
                              AI PROMPT ENGINEERING
                            </h3>
                            <button
                              onClick={() => copyAllPrompts(result.analysis.aiPrompts)}
                              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition font-bold text-sm"
                            >
                              📋 Copy All
                            </button>
                          </div>
                          
                          <div className="space-y-4">
                            {result.analysis.aiPrompts.midjourney && (
                              <div className="bg-white p-5 rounded-xl shadow-sm border-2 border-purple-200">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="font-bold text-gray-900 flex items-center gap-2">
                                    <span>📸</span>
                                    Midjourney/DALL-E
                                  </span>
                                  <button
                                    onClick={(e) => copyToClipboard(result.analysis.aiPrompts.midjourney)}
                                    className="px-4 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
                                  >
                                    Copy
                                  </button>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg border border-purple-200 text-sm leading-relaxed">
                                  {result.analysis.aiPrompts.midjourney}
                                </div>
                              </div>
                            )}

                            {result.analysis.aiPrompts.stableDiffusion && (
                              <div className="bg-white p-5 rounded-xl shadow-sm border-2 border-blue-200">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="font-bold text-gray-900 flex items-center gap-2">
                                    <span>🎨</span>
                                    Stable Diffusion
                                  </span>
                                  <button
                                    onClick={(e) => copyToClipboard(result.analysis.aiPrompts.stableDiffusion)}
                                    className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                                  >
                                    Copy
                                  </button>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg border border-blue-200 text-sm leading-relaxed">
                                  {result.analysis.aiPrompts.stableDiffusion}
                                </div>
                              </div>
                            )}

                            {result.analysis.aiPrompts.productTemplate && (
                              <div className="bg-white p-5 rounded-xl shadow-sm border-2 border-yellow-200">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="font-bold text-gray-900 flex items-center gap-2">
                                    <span>🔄</span>
                                    Product Swap Template
                                  </span>
                                  <button
                                    onClick={(e) => copyToClipboard(result.analysis.aiPrompts.productTemplate)}
                                    className="px-4 py-1.5 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition text-sm font-medium"
                                  >
                                    Copy
                                  </button>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg border border-yellow-200 text-sm font-mono leading-relaxed mb-3">
                                  {result.analysis.aiPrompts.productTemplate}
                                </div>
                                {result.analysis.aiPrompts.example && (
                                  <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-sm">
                                    <span className="font-bold">💡 Example:</span> {result.analysis.aiPrompts.example}
                                  </div>
                                )}
                              </div>
                            )}

                            {result.analysis.aiPrompts.shotBreakdown && (
                              <div className="bg-white p-5 rounded-xl shadow-sm border-2 border-green-200">
                                <div className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                  <span>🎬</span>
                                  Shot-by-Shot Breakdown
                                </div>
                                <div className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
                                  {result.analysis.aiPrompts.shotBreakdown}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Watch Button */}
                      {result.url && (
                        <div className="text-center pt-6 border-t-2 border-gray-200">
                          <a
                            href={result.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 font-bold text-xl"
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

          {/* Empty State */}
          {results.length === 0 && !loading && (
            <div className="bg-white rounded-2xl shadow-2xl p-16 text-center">
              <div className="text-7xl mb-6">🎯</div>
              <h2 className="text-4xl font-black text-gray-900 mb-4">
                Analyze Any TikTok Video
              </h2>
              <p className="text-gray-600 text-xl max-w-3xl mx-auto mb-8">
                Paste a <span className="font-bold text-purple-600">TikTok URL</span> for single video deep dive,
                or enter <span className="font-bold text-green-600">keywords</span> to analyze trending videos
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

          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-2xl shadow-2xl p-16 text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mb-6"></div>
              <p className="text-gray-700 text-2xl font-bold">Analyzing with AI...</p>
              <p className="text-gray-500 mt-2">This may take 30-90 seconds</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
