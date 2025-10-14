import { useState, useEffect } from 'react';
import Head from 'next/head';

// Email Gate Modal Component
function EmailGateModal({ onSubmit, onClose }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleSubmit = () => {
    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      return;
    }
    onSubmit(email);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-fadeIn">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
        >
          ×
        </button>

        <div className="text-center mb-6">
          <div className="inline-block p-4 bg-purple-100 rounded-full mb-4">
            <div className="text-5xl">🔒</div>
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">
            Unlock Your Analysis
          </h2>
          <p className="text-gray-600">
            Get instant access + free viral video course
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <span className="text-2xl">✅</span>
            <div>
              <div className="font-bold text-gray-900">Complete Analysis</div>
              <div className="text-sm text-gray-600">Hook, script, AI prompts</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <span className="text-2xl">📚</span>
            <div>
              <div className="font-bold text-gray-900">7-Day Course</div>
              <div className="text-sm text-gray-600">Zero to viral guide</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <span className="text-2xl">🎁</span>
            <div>
              <div className="font-bold text-gray-900">3 Free Analyses</div>
              <div className="text-sm text-gray-600">No card required</div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="your@email.com"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-400"
            autoFocus
          />
          
          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg transition"
          >
            🚀 Unlock Now
          </button>
        </div>

        <div className="mt-6 pt-4 border-t text-center">
          <div className="flex items-center justify-center gap-3 text-xs text-gray-500">
            <span>✉️ No spam</span>
            <span>•</span>
            <span>🔒 Private</span>
            <span>•</span>
            <span>👥 12,847+ users</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Upgrade Modal Component
function UpgradeModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
        >
          ×
        </button>

        <div className="text-center">
          <div className="text-6xl mb-4">🚀</div>
          <h2 className="text-3xl font-black mb-3">You're on fire!</h2>
          <p className="text-gray-600 text-lg mb-6">
            You've used all 3 free analyses. Upgrade for unlimited access.
          </p>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-6 border-2 border-purple-200">
            <div className="text-4xl font-black text-purple-600 mb-2">
              $29<span className="text-xl text-gray-600">/mo</span>
            </div>
            <div className="text-sm text-gray-500 mb-4">or $290/year (save $58)</div>
            <ul className="text-left space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="font-semibold">Unlimited analyses</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="font-semibold">Batch keyword search with Apify</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="font-semibold">Priority support</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="font-semibold">Export to CSV</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="font-semibold">Access to new features</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => window.location.href = '/pricing'}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-2xl transition mb-3"
          >
            Upgrade Now
          </button>

          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [demoMode, setDemoMode] = useState(false);
  const [mode, setMode] = useState(null);
  const [viewMode, setViewMode] = useState({});
  const [expandedSections, setExpandedSections] = useState({});
  const [detailedView, setDetailedView] = useState({});
  const [customProduct, setCustomProduct] = useState({});

  // ✅ Email Gate States
  const [userEmail, setUserEmail] = useState('');
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [analysisCount, setAnalysisCount] = useState(0);

  // ✅ Load user data from localStorage on mount
  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    const storedCount = parseInt(localStorage.getItem('analysisCount') || '0');
    
    if (storedEmail) {
      setUserEmail(storedEmail);
      setAnalysisCount(storedCount);
    }
  }, []);

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

  // ✅ Email submission handler
  const handleEmailSubmit = async (email) => {
    setUserEmail(email);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('analysisCount', '0');
    setAnalysisCount(0);
    
    // Send to backend (optional)
    try {
      await fetch('/api/capture-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email,
          timestamp: new Date().toISOString(),
          source: 'tiktok_analyzer'
        })
      });
    } catch (err) {
      console.log('Email capture logged locally');
    }
    
    setShowEmailGate(false);
    // Auto-trigger analysis after email submission
    setTimeout(() => handleAnalyze(), 100);
  };

  // ✅ Modified handleAnalyze with email gate
  const handleAnalyze = async () => {
    if (!input.trim()) {
      setError('Please enter a TikTok URL or keywords');
      return;
    }

    // 🔒 Check if user has email
    if (!userEmail) {
      setShowEmailGate(true);
      return;
    }

    // ⚠️ Check free tier limit
    if (analysisCount >= 3) {
      setShowUpgradeModal(true);
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
        body: JSON.stringify({ 
          input: input.trim(),
          userEmail: userEmail // Pass email to backend
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }
      
      setResults(data.results || []);
      setMode(data.mode);
      setDemoMode(data.demo || false);
      
      if (data.results && data.results.length > 0) {
        // ✅ Increment analysis count
        const newCount = analysisCount + 1;
        setAnalysisCount(newCount);
        localStorage.setItem('analysisCount', newCount.toString());
        
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
    const engagement = (result.likes + result.comments + result.shares) / Math.max(result.views, 1);
    let score = Math.min(10, Math.round(engagement * 100 * 2));
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
    } else {
      alert('✅ Copied to clipboard!');
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

      {/* ✅ Email Gate Modal */}
      {showEmailGate && (
        <EmailGateModal 
          onSubmit={handleEmailSubmit}
          onClose={() => setShowEmailGate(false)}
        />
      )}

      {/* ✅ Upgrade Modal */}
      {showUpgradeModal && (
        <UpgradeModal 
          onClose={() => setShowUpgradeModal(false)}
        />
      )}

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
          
          {/* ✅ User Status Bar */}
          {userEmail && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 mb-6 flex items-center justify-between border border-white/20">
              <div className="flex items-center gap-3">
                <span className="text-white text-sm">✉️ {userEmail}</span>
              </div>
              <div className="flex items-center gap-4">
                {analysisCount >= 3 ? (
                  <>
                    <span className="text-red-300 text-sm font-bold">⚠️ Free limit reached</span>
                    <button
                      onClick={() => setShowUpgradeModal(true)}
                      className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold rounded-lg hover:shadow-lg transition"
                    >
                      ⭐ Upgrade Now
                    </button>
                  </>
                ) : (
                  <span className="text-white text-sm font-bold">
                    ⚡ {3 - analysisCount} free {3 - analysisCount === 1 ? 'analysis' : 'analyses'} left
                  </span>
                )}
              </div>
            </div>
          )}
          
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
              {!userEmail && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-purple-600 font-semibold">No login required to start</span>
                </>
              )}
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

                        {/* Learn Mode - Keep your existing Learn Mode code here */}
                        {currentViewMode === 'learn' && (
                          <div className="text-center py-12 text-gray-600">
                            <div className="text-5xl mb-4">🎓</div>
                            <p className="text-lg">Learn Mode content from your original code goes here</p>
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
                <span className="font-bold text-blue-600">Learn Mode</span>: Deep dive into psychology & scripting
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
                    Understand audience psychology, 7-step framework, technical details
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
