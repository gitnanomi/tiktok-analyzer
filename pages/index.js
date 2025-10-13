import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [demoMode, setDemoMode] = useState(false);
  const [mode, setMode] = useState(null);
  const [viewMode, setViewMode] = useState({}); // 'execute' or 'learn'
  const [expandedSections, setExpandedSections] = useState({});
  const [detailedView, setDetailedView] = useState({});
  const [customProduct, setCustomProduct] = useState({});

  const getViewMode = (idx) => viewMode[idx] || 'execute';
  const setResultViewMode = (idx, mode) => {
    setViewMode(prev => ({ ...prev, [idx]: mode }));
  };

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
    setViewMode({});

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

  const calculateViralScore = (result) => {
    // 简单算法：基于engagement rate
    const engagement = (result.likes + result.comments + result.shares) / Math.max(result.views, 1);
    let score = Math.min(10, Math.round(engagement * 100 * 2));
    
    // 如果没有真实数据，给demo score
    if (result.views === 0 || result.id?.includes('demo')) {
      score = 9;
    }
    
    return score;
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 8) return 'bg-green-50 border-green-300';
    if (score >= 6) return 'bg-yellow-50 border-yellow-300';
    return 'bg-orange-50 border-orange-300';
  };

  const generateScript = (result, product = '') => {
    const productName = product || '[YOUR PRODUCT]';
    return `🎬 YOUR SCRIPT TEMPLATE

Hook (0-3s):
"Wait, ${productName} actually works?"
→ Raise eyebrows, direct eye contact, show product

Beat 1 (3-6s):
"Let me show you what happened over 3 days"
→ Show ${productName} clearly

Beat 2 (6-10s):
[Day 1] [Day 2] [Day 3] rapid montage
→ 2-second clips, same angle

Beat 3 (10-15s):
"Okay I'm actually [YOUR RESULT]!"
→ Energetic reaction, hold product visible

---

FILMING NOTES:
- iPhone front camera
- Natural window light
- Same outfit for continuity  
- 2-second cuts between scenes
- Abrupt ending, no fade

PROPS NEEDED:
- ${productName}
- Consistent background
- Natural light source`;
  };

  const copyToClipboard = (text, buttonElement) => {
    navigator.clipboard.writeText(text);
    if (buttonElement) {
      const originalText = buttonElement.textContent;
      buttonElement.textContent = '✓ Copied!';
      buttonElement.classList.add('bg-green-600');
      setTimeout(() => {
        buttonElement.textContent = originalText;
        buttonElement.classList.remove('bg-green-600');
      }, 2000);
    }
  };

  const downloadChecklist = (result) => {
    const checklist = `🎬 SHOOTING CHECKLIST FOR: ${result.title}

PRE-PRODUCTION
□ Script finalized
□ Props gathered: [YOUR PRODUCT], [SURFACE], [BACKGROUND]
□ Outfit selected (consistent if multi-day)
□ Location scouted (natural light identified)
□ Phone fully charged

SHOOT DAY SETUP
□ Front camera set to 1080p
□ Natural light test (golden hour preferred)
□ Test frame: you on right 1/3, product left
□ Background decluttered

TAKES NEEDED
□ Hook (0-3s): Film 3 takes
□ Intro (3-6s): Film 2 takes
□ Montage (6-10s): Film 5+ clips, use best 3
□ Ending (10-15s): Film 3 takes

EDITING CHECKLIST
□ Edit to 2-second average cut length
□ Add text overlays (white, sans-serif, bottom)
□ Hard cuts only - no transitions
□ Export: 1080x1920, 30fps

TECHNICAL SPECS
Camera: iPhone front camera / handheld
Lighting: Natural window light, 2800K warm
Framing: Rule of thirds, eye-level
Editing: 1.8s avg shot, hard cuts
Text: White sans-serif, bottom third, 3-4 words

POST-PRODUCTION
□ Color grade (slight saturation boost)
□ Audio levels balanced
□ Captions synced with speech
□ Final review for pacing

---
Generated by TikTok Analyzer Pro
${new Date().toLocaleDateString()}`;

    const blob = new Blob([checklist], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `shooting-checklist-${result.author}.txt`;
    link.click();
  };

  const exportToCSV = () => {
    if (results.length === 0) return;

    const headers = [
      'Author', 'Description', 'Views', 'Likes', 'Viral Score',
      'Content Type', 'Category', 'Success Factors', 'URL'
    ];
    
    const rows = results.map(r => [
      r.author || '',
      `"${(r.description || '').replace(/"/g, '""')}"`,
      r.views || 0,
      r.likes || 0,
      calculateViralScore(r),
      r.analysis?.contentType || '',
      r.analysis?.category || '',
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
        <title>TikTok Analyzer Pro - Viral Content Analysis & Replication</title>
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
                  Analyze why it's viral • Generate your script • Execute in minutes
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
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">🔗 URL</span>
              <span className="text-gray-400">or</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">🔍 Keywords</span>
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
                    <div className="font-bold">⚠️ Demo Mode</div>
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
              {results.map((result, idx) => {
                const viralScore = calculateViralScore(result);
                const currentViewMode = getViewMode(idx);
                
                return (
                  <div key={idx} className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    
                    {/* Video Header */}
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
                                💰 AD
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {result.analysis && (
                      <div className="p-8">
                        
                        {/* Viral Score Card */}
                        <div className={`rounded-2xl p-6 border-3 mb-6 ${getScoreBgColor(viralScore)}`}>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-2xl font-black text-gray-900">⚡ VIRAL ANALYSIS</h3>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <div className="text-sm text-gray-600 font-semibold mb-2">Overall Viral Score</div>
                              <div className={`text-6xl font-black ${getScoreColor(viralScore)}`}>
                                {viralScore}/10
                              </div>
                              <div className="mt-2">
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                  <div 
                                    className={`h-3 rounded-full ${viralScore >= 8 ? 'bg-green-500' : viralScore >= 6 ? 'bg-yellow-500' : 'bg-orange-500'}`}
                                    style={{ width: `${viralScore * 10}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-gray-700">Replication Difficulty:</span>
                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-bold">
                                  ✅ Easy
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-gray-700">Production Cost:</span>
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">
                                  💰 Low
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-gray-700">Time to Replicate:</span>
                                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-bold">
                                  ⏱️ 1-2 hours
                                </span>
                              </div>
                              {viralScore >= 8 && (
                                <div className="mt-3 p-3 bg-white rounded-lg border-2 border-green-300">
                                  <div className="text-green-800 font-bold text-sm">
                                    🔥 HIGH REPLICATION POTENTIAL
                                  </div>
                                  <div className="text-green-700 text-xs mt-1">
                                    Recommended: Copy this format immediately
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Mode Switcher */}
                        <div className="flex gap-2 mb-6 border-b-2 border-gray-200">
                          <button
                            onClick={() => setResultViewMode(idx, 'execute')}
                            className={`px-6 py-3 font-bold text-lg transition-all ${
                              currentViewMode === 'execute'
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-xl'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            ⚡ Execute Mode
                          </button>
                          <button
                            onClick={() => setResultViewMode(idx, 'learn')}
                            className={`px-6 py-3 font-bold text-lg transition-all ${
                              currentViewMode === 'learn'
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-xl'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            🎓 Learn Mode
                          </button>
                        </div>

                        {/* Execute Mode Content */}
                        {currentViewMode === 'execute' && (
                          <div className="space-y-6">
                            
                            {/* Script Generator */}
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-300">
                              <h3 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
                                <span className="text-3xl">📝</span>
                                YOUR SCRIPT TEMPLATE
                              </h3>
                              
                              <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  Customize for your product (optional):
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g., Vitamin C Serum, Wireless Earbuds, Protein Powder"
                                  value={customProduct[idx] || ''}
                                  onChange={(e) => setCustomProduct({...customProduct, [idx]: e.target.value})}
                                  className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                />
                              </div>

                              <div className="bg-white p-5 rounded-xl border-2 border-purple-200 font-mono text-sm whitespace-pre-line mb-4">
                                {generateScript(result, customProduct[idx])}
                              </div>

                              <button
                                onClick={(e) => copyToClipboard(generateScript(result, customProduct[idx]), e.target)}
                                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-bold w-full"
                              >
                                📋 Copy Script
                              </button>
                            </div>

                            {/* Shoot Checklist */}
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-300">
                              <h3 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
                                <span className="text-3xl">🎬</span>
                                PRODUCTION CHECKLIST
                              </h3>

                              <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div className="bg-white p-4 rounded-xl border-2 border-green-200">
                                  <div className="font-bold text-gray-900 mb-2">📱 Equipment</div>
                                  <ul className="text-sm text-gray-700 space-y-1">
                                    <li>• iPhone front camera</li>
                                    <li>• Fully charged</li>
                                    <li>• Set to 1080p</li>
                                  </ul>
                                </div>

                                <div className="bg-white p-4 rounded-xl border-2 border-green-200">
                                  <div className="font-bold text-gray-900 mb-2">☀️ Lighting</div>
                                  <ul className="text-sm text-gray-700 space-y-1">
                                    <li>• Natural window light</li>
                                    <li>• Soft diffused quality</li>
                                    <li>• 2800K warm tone</li>
                                  </ul>
                                </div>

                                <div className="bg-white p-4 rounded-xl border-2 border-green-200">
                                  <div className="font-bold text-gray-900 mb-2">🎯 Framing</div>
                                  <ul className="text-sm text-gray-700 space-y-1">
                                    <li>• Rule of thirds</li>
                                    <li>• Eye-level angle</li>
                                    <li>• Subject right 1/3</li>
                                  </ul>
                                </div>

                                <div className="bg-white p-4 rounded-xl border-2 border-green-200">
                                  <div className="font-bold text-gray-900 mb-2">✂️ Editing</div>
                                  <ul className="text-sm text-gray-700 space-y-1">
                                    <li>• 2-second avg cuts</li>
                                    <li>• Hard cuts only</li>
                                    <li>• Export 1080x1920</li>
                                  </ul>
                                </div>
                              </div>

                              <button
                                onClick={() => downloadChecklist(result)}
                                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-bold w-full"
                              >
                                📥 Download Full Checklist
                              </button>
                            </div>

                            {/* Quick Tips */}
                            {result.analysis.replicableElements && (
                              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-300">
                                <h3 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
                                  <span className="text-3xl">💡</span>
                                  QUICK TIPS
                                </h3>
                                
                                <div className="space-y-3">
                                  {result.analysis.replicableElements.split(/\n\n|\n(?=\d)/).filter(e => e.trim()).map((element, i) => (
                                    <div key={i} className="bg-white p-4 rounded-xl border-2 border-yellow-200">
                                      <div className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">
                                        {element}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Learn Mode Content */}
                        {currentViewMode === 'learn' && (
                          <div className="space-y-6">
                            
                            {/* Success Factors */}
                            {result.analysis.successFactors && (
                              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-4 border-yellow-400">
                                <h3 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
                                  <span className="text-3xl">🏆</span>
                                  SUCCESS FACTORS
                                </h3>
                                <div className="space-y-3">
                                  {result.analysis.successFactors.split(/\n\n/).filter(f => f.trim()).map((factor, i) => (
                                    <div key={i} className="bg-white p-5 rounded-xl shadow-sm border-2 border-yellow-200">
                                      <div className="text-gray-800 leading-relaxed whitespace-pre-line">
                                        {factor}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Scripting Process */}
                            {result.analysis.scriptingProcess && (
                              <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-50 rounded-2xl p-8 border-4 border-purple-500">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="text-4xl">⭐</span>
                                  <div>
                                    <h3 className="text-3xl font-black text-purple-900">
                                      SCRIPTING PROCESS
                                    </h3>
                                    <p className="text-purple-700 font-semibold">The 7-Step Framework</p>
                                  </div>
                                </div>
                                
                                <div className="mt-6 bg-white rounded-xl p-6 border-2 border-purple-300">
                                  <div className="text-gray-800 leading-relaxed whitespace-pre-line mb-4">
                                    {result.analysis.scriptingProcess.summary}
                                  </div>
                                  
                                  {result.analysis.scriptingProcess.detailed && (
                                    <>
                                      <button
                                        onClick={() => toggleDetailedView(idx, 'scripting')}
                                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-bold w-full"
                                      >
                                        {isDetailedViewActive(idx, 'scripting') ? '📋 Show Summary' : '📖 Read Full Analysis'}
                                      </button>
                                      
                                      {isDetailedViewActive(idx, 'scripting') && (
                                        <div className="mt-4 p-5 bg-purple-50 rounded-lg border-2 border-purple-200">
                                          <div className="text-sm text-purple-700 mb-2 font-semibold">📖 DETAILED ANALYSIS</div>
                                          <div className="text-gray-800 leading-relaxed whitespace-pre-line">
                                            {result.analysis.scriptingProcess.detailed}
                                          </div>
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Detailed Sections - Collapsible */}
                            <div className="space-y-4">
                              <h3 className="text-xl font-bold text-gray-900">📋 Detailed Breakdown</h3>
                              
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
                                      Call to Action
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

                            {/* AI Prompts */}
                            {result.analysis.aiPrompts && (result.analysis.aiPrompts.midjourney || result.analysis.aiPrompts.stableDiffusion) && (
                              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-300">
                                <h3 className="text-2xl font-black text-gray-900 mb-5 flex items-center gap-2">
                                  <span className="text-3xl">🤖</span>
                                  AI PROMPT ENGINEERING
                                </h3>
                                
                                <div className="space-y-4">
                                  {result.analysis.aiPrompts.midjourney && (
                                    <div className="bg-white p-5 rounded-xl shadow-sm border-2 border-purple-200">
                                      <div className="flex items-center justify-between mb-3">
                                        <span className="font-bold text-gray-900 flex items-center gap-2">
                                          <span>📸</span>
                                          Midjourney/DALL-E
                                        </span>
                                        <button
                                          onClick={(e) => copyToClipboard(result.analysis.aiPrompts.midjourney, e.target)}
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
                                          onClick={(e) => copyToClipboard(result.analysis.aiPrompts.stableDiffusion, e.target)}
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
                                          onClick={(e) => copyToClipboard(result.analysis.aiPrompts.productTemplate, e.target)}
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
                          </div>
                        )}

                        {/* Watch Button */}
                        {result.url && (
                          <div className="text-center pt-6 mt-6 border-t-2 border-gray-200">
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
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {results.length === 0 && !loading && (
            <div className="bg-white rounded-2xl shadow-2xl p-16 text-center">
              <div className="text-7xl mb-6">🎯</div>
              <h2 className="text-4xl font-black text-gray-900 mb-4">
                Analyze & Replicate Viral Videos
              </h2>
              <p className="text-gray-600 text-xl max-w-3xl mx-auto mb-8">
                <span className="font-bold text-purple-600">Execute Mode</span>: Get scripts & checklists in minutes<br/>
                <span className="font-bold text-blue-600">Learn Mode</span>: Deep dive into why it works
              </p>
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 p-8 rounded-xl">
                  <div className="text-5xl mb-4">⚡</div>
                  <h3 className="font-black text-xl text-gray-900 mb-3">Execute Mode</h3>
                  <p className="text-gray-700 text-sm">
                    Generate custom scripts, download checklists, copy in 10 minutes
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 p-8 rounded-xl">
                  <div className="text-5xl mb-4">🎓</div>
                  <h3 className="font-black text-xl text-gray-900 mb-3">Learn Mode</h3>
                  <p className="text-gray-700 text-sm">
                    Understand psychology, scripting framework, technical details
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
