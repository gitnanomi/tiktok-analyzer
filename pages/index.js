import { useState, useEffect } from 'react';
import Head from 'next/head';
import ShareAnalysisButton from '../components/ShareAnalysisButton';

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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 relative animate-fadeIn">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl font-bold leading-none"
        >
          ×
        </button>

        <div className="text-center mb-6">
          <div className="inline-block p-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-4">
            <div className="text-5xl">💰</div>
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-3">
            Start Your 7-Day Money Challenge
          </h2>
          <p className="text-gray-600 text-lg">
            <span className="font-bold text-green-600">142 people</span> completed the challenge last week and made their first dollar
          </p>
        </div>

        {/* Immediate Value */}
        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-300">
            <span className="text-2xl flex-shrink-0">📝</span>
            <div>
              <div className="font-bold text-gray-900">7-Day Action Plan</div>
              <div className="text-sm text-gray-600">30 min/day, step-by-step guidance</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-300">
            <span className="text-2xl flex-shrink-0">🎯</span>
            <div>
              <div className="font-bold text-gray-900">Product Selection Guide</div>
              <div className="text-sm text-gray-600">10 easiest product categories to sell</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-300">
            <span className="text-2xl flex-shrink-0">🚀</span>
            <div>
              <div className="font-bold text-gray-900">3 Free Analyses</div>
              <div className="text-sm text-gray-600">AI finds the easiest viral videos to copy</div>
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
            className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-400 text-lg"
            autoFocus
          />
          
          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 text-lg"
          >
            💰 Start 7-Day Challenge
          </button>
        </div>

        <div className="mt-6 pt-4 border-t text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-2">
            <span>✉️ No spam</span>
            <span>•</span>
            <span>🔒 Secure</span>
          </div>
          <p className="text-xs text-gray-400">
            Join <span className="font-bold text-green-600">12,847+</span> creators who started the challenge
          </p>
        </div>
      </div>
    </div>
  );
}

// Upgrade Modal Component
function UpgradeModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl font-bold"
        >
          ×
        </button>

        <div className="text-center">
          <div className="text-7xl mb-4">🔥</div>
          <h2 className="text-4xl font-black mb-3">Ready to Make More?</h2>
          <p className="text-gray-600 text-lg mb-6">
            You've used all 3 free analyses. Upgrade to keep finding viral videos!
          </p>

          {/* 3-tier pricing */}
          <div className="space-y-4 mb-6">
            
            {/* Starter Plan */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-300 text-left">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-black">🎯 Starter</h3>
                <div>
                  <span className="text-3xl font-black">$19</span>
                  <span className="text-gray-600">/mo</span>
                </div>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold flex-shrink-0">✓</span>
                  <span>10 analyses/month</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold flex-shrink-0">✓</span>
                  <span>Basic script generation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold flex-shrink-0">✓</span>
                  <span>Community access</span>
                </li>
              </ul>
            </div>

            {/* Pro Plan - Most Popular */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 border-4 border-yellow-400 text-left relative overflow-hidden">
              <div className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 px-4 py-1 text-xs font-black rotate-12 shadow-lg">
                MOST POPULAR 🔥
              </div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-black text-white">💎 Pro</h3>
                <div>
                  <span className="text-3xl font-black text-white">$49</span>
                  <span className="text-white/80">/mo</span>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-white">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-300 font-bold flex-shrink-0">✓</span>
                  <span>Unlimited analyses</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-300 font-bold flex-shrink-0">✓</span>
                  <span>AI Script Generator 2.0</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-300 font-bold flex-shrink-0">✓</span>
                  <span>Weekly trend reports (most profitable niches)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-300 font-bold flex-shrink-0">✓</span>
                  <span>Monetization toolkit (product recs, brand pitch templates)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-300 font-bold flex-shrink-0">✓</span>
                  <span>Monthly 1-on-1 coaching call</span>
                </li>
              </ul>
              <div className="mt-4 p-3 bg-white/20 rounded-lg">
                <p className="text-xs text-white font-semibold">
                  💰 Avg ROI: 89% break even by month 2
                </p>
              </div>
            </div>

            {/* Agency Plan */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-300 text-left">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-black">🏢 Agency</h3>
                <div>
                  <span className="text-3xl font-black">$199</span>
                  <span className="text-gray-600">/mo</span>
                </div>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold flex-shrink-0">✓</span>
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold flex-shrink-0">✓</span>
                  <span>10 team seats</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold flex-shrink-0">✓</span>
                  <span>White-label reports</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold flex-shrink-0">✓</span>
                  <span>API access</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold flex-shrink-0">✓</span>
                  <span>Weekly group calls</span>
                </li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => window.location.href = '/pricing'}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 mb-3 text-lg"
          >
            Choose Plan & Upgrade
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

// Saved Analyses Modal
function SavedAnalysesModal({ savedAnalyses, onClose, onLoad }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-gray-900">⭐ Saved Analyses</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {savedAnalyses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-600">No saved analyses yet</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {savedAnalyses.map((item, i) => (
                <div key={i} className="border-2 border-gray-200 rounded-xl p-4 hover:border-purple-300 transition">
                  <div className="flex gap-3 mb-3">
                    {item.thumbnail && (
                      <img src={item.thumbnail} alt="" className="w-16 h-16 rounded-lg object-cover" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 truncate">@{item.author}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm mb-3">
                    <span className="font-bold text-purple-600">{item.viralScore}/10</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">{new Date(item.savedAt).toLocaleDateString()}</span>
                  </div>
                  <button
                    onClick={() => {
                      onLoad(item);
                      onClose();
                    }}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold text-sm"
                  >
                    View Analysis
                  </button>
                </div>
              ))}
            </div>
          )}
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

  // Email Gate States
  const [userEmail, setUserEmail] = useState('');
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [analysisCount, setAnalysisCount] = useState(0);

  // Saved Analyses States
  const [savedAnalyses, setSavedAnalyses] = useState([]);
  const [showSavedModal, setShowSavedModal] = useState(false);

  // Recent Analyses
  const [recentAnalyses, setRecentAnalyses] = useState([]);

  // Load user data from localStorage on mount
  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    const storedCount = parseInt(localStorage.getItem('analysisCount') || '0');
    const saved = JSON.parse(localStorage.getItem('savedAnalyses') || '[]');
    const recent = JSON.parse(localStorage.getItem('recentAnalyses') || '[]');
    
    if (storedEmail) {
      setUserEmail(storedEmail);
      setAnalysisCount(storedCount);
    }
    setSavedAnalyses(saved);
    setRecentAnalyses(recent.slice(0, 5));
  }, []);

  // Save to recent analyses
  const saveToRecent = (result) => {
    const recent = JSON.parse(localStorage.getItem('recentAnalyses') || '[]');
    const newItem = {
      creator: result.author,
      score: calculateViralScore(result),
      timestamp: new Date().toISOString()
    };
    const updated = [newItem, ...recent.filter(r => r.creator !== result.author)].slice(0, 10);
    localStorage.setItem('recentAnalyses', JSON.stringify(updated));
    setRecentAnalyses(updated.slice(0, 5));
  };

  // Toggle save analysis
  const toggleSave = (result) => {
    const saved = JSON.parse(localStorage.getItem('savedAnalyses') || '[]');
    const exists = saved.some(s => s.url === result.url);
    
    let updated;
    if (exists) {
      updated = saved.filter(s => s.url !== result.url);
    } else {
      updated = [...saved, {
        ...result,
        viralScore: calculateViralScore(result),
        savedAt: new Date().toISOString()
      }];
    }
    
    localStorage.setItem('savedAnalyses', JSON.stringify(updated));
    setSavedAnalyses(updated);
  };

  const isSaved = (result) => savedAnalyses.some(s => s.url === result.url);

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

  // Email submission handler
  const handleEmailSubmit = async (email) => {
    setUserEmail(email);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('analysisCount', '0');
    setAnalysisCount(0);
    
    // Send to backend
    try {
      await fetch('/api/capture-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email,
          timestamp: new Date().toISOString(),
          source: 'tiktok_money_system_7day'
        })
      });
    } catch (err) {
      console.log('Email capture logged locally');
    }
    
    setShowEmailGate(false);
    // Auto-trigger analysis after email submission
    setTimeout(() => handleAnalyze(), 100);
  };

  // Modified handleAnalyze with email gate
  const handleAnalyze = async () => {
    if (!input.trim()) {
      setError('Please enter a TikTok URL or keywords');
      return;
    }

    // Check if user has email
    if (!userEmail) {
      setShowEmailGate(true);
      return;
    }

    // Check free tier limit
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
          userEmail: userEmail
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
        // Increment analysis count
        const newCount = analysisCount + 1;
        setAnalysisCount(newCount);
        localStorage.setItem('analysisCount', newCount.toString());
        
        // Save to recent
        data.results.forEach(result => saveToRecent(result));
        
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
- Natural light source

---
✨ Generated by TikTok Money System
🔗 Make your first dollar: ${typeof window !== 'undefined' ? window.location.origin : 'tiktokanalyzer.pro'}`;
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
Generated by TikTok Money System
${typeof window !== 'undefined' ? window.location.origin : 'tiktokanalyzer.pro'}
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
        <title>TikTok Money System - Post Your First Viral Video in 7 Days</title>
        <meta name="description" content="142 people completed the 7-day challenge last week and made their first dollar. AI helps you find the easiest viral videos to copy, step-by-step to your first sale." />
      </Head>

      {/* Email Gate Modal */}
      {showEmailGate && (
        <EmailGateModal 
          onSubmit={handleEmailSubmit}
          onClose={() => setShowEmailGate(false)}
        />
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <UpgradeModal 
          onClose={() => setShowUpgradeModal(false)}
        />
      )}

      {/* Saved Analyses Modal */}
      {showSavedModal && (
        <SavedAnalysesModal
          savedAnalyses={savedAnalyses}
          onClose={() => setShowSavedModal(false)}
          onLoad={(item) => {
            setResults([item]);
            setMode('single');
          }}
        />
      )}

      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-900">
        
        {/* 🔥 NEW Hero Section */}
        <div className="relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-400 rounded-full blur-3xl"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            
            {/* Main Hero */}
            <div className="text-center mb-12">
              <div className="inline-block mb-6">
                <div className="flex items-center gap-2 bg-yellow-400 text-yellow-900 px-6 py-3 rounded-full font-black text-sm shadow-lg animate-pulse">
                  <span>🔥</span>
                  <span>142 people made their first dollar last week</span>
                </div>
              </div>

              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
                Post Your First Viral<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300">
                  Video in 7 Days
                </span>
              </h1>

              <p className="text-2xl text-white/90 mb-4 max-w-3xl mx-auto">
                Even if you've never filmed before, AI finds the easiest viral videos for you to copy
              </p>

              <p className="text-lg text-white/70 mb-8">
                No creativity needed, no luck required, just <span className="font-bold text-yellow-300">30 min/day</span> following the system
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <button
                  onClick={() => !userEmail && setShowEmailGate(true)}
                  className="px-10 py-5 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xl font-black rounded-2xl hover:shadow-2xl transition-all transform hover:scale-105 shadow-lg"
                >
                  💰 Start 7-Day Challenge (Free)
                </button>
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <span>✓ No credit card</span>
                  <span>•</span>
                  <span>✓ 3 free analyses</span>
                </div>
              </div>

              {/* Social Proof Bar */}
              <div className="flex flex-wrap justify-center gap-8 text-white/90">
                <div className="text-center">
                  <div className="text-4xl font-black text-yellow-300">89%</div>
                  <div className="text-sm">Break even month 2</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-green-300">$1,247</div>
                  <div className="text-sm">Avg month 1 earnings</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-pink-300">12,847+</div>
                  <div className="text-sm">Active users</div>
                </div>
              </div>
            </div>

            {/* Video Testimonials Preview */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full"></div>
                  <div>
                    <div className="font-bold text-white">@sarah_fitness</div>
                    <div className="text-xs text-white/70">Fitness Creator</div>
                  </div>
                </div>
                <p className="text-white/90 text-sm mb-3">
                  "Week 3, first video hit 850K views. Now making $2,400/mo consistently"
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-300 text-xs">★★★★★</span>
                  <span className="text-white/60 text-xs">90 days ago</span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full"></div>
                  <div>
                    <div className="font-bold text-white">@mike_crypto</div>
                    <div className="text-xs text-white/70">Crypto Content</div>
                  </div>
                </div>
                <p className="text-white/90 text-sm mb-3">
                  "Complete beginner. Followed 7-day plan, gained 3K followers by week 2"
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-300 text-xs">★★★★★</span>
                  <span className="text-white/60 text-xs">45 days ago</span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full"></div>
                  <div>
                    <div className="font-bold text-white">@lisa_beauty</div>
                    <div className="text-xs text-white/70">Beauty & Skincare</div>
                  </div>
                </div>
                <p className="text-white/90 text-sm mb-3">
                  "Week 4 got first brand deal $500. Now full-time creator"
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-300 text-xs">★★★★★</span>
                  <span className="text-white/60 text-xs">60 days ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Header / Navigation */}
        <div className="bg-white/10 backdrop-blur-sm border-y border-white/20 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-black text-white">
                  TikTok Money System
                </h2>
              </div>
              <div className="flex items-center gap-3">
                {savedAnalyses.length > 0 && (
                  <button
                    onClick={() => setShowSavedModal(true)}
                    className="px-4 py-2 bg-yellow-400 text-yellow-900 text-sm font-bold rounded-lg hover:bg-yellow-300 transition shadow-lg"
                  >
                    ⭐ Saved ({savedAnalyses.length})
                  </button>
                )}
                {results.length > 0 && (
                  <button
                    onClick={exportToCSV}
                    className="px-4 py-2 bg-white text-purple-700 text-sm font-bold rounded-lg hover:bg-gray-100 transition shadow-lg"
                  >
                    📥 Export CSV
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* User Status Bar */}
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
                placeholder="Paste TikTok URL or keywords (e.g., weight loss, skincare, investing)..."
                className="flex-1 px-6 py-4 text-lg border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-400 focus:border-transparent"
                disabled={loading}
              />
              <button
                onClick={handleAnalyze}
                disabled={loading || !input.trim()}
                className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-bold rounded-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
              >
                {loading ? '⏳ Analyzing...' : '🚀 Find Viral'}
              </button>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">🔗 URL Analysis</span>
              <span className="text-gray-400">or</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">🔍 Keyword Search</span>
              {!userEmail && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-purple-600 font-semibold">Zero barrier to start</span>
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
                    <div className="text-sm mt-1">Configure API keys in Vercel for real data</div>
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

          {/* Results - Keep existing */}
          {results.length > 0 && (
            <div className="text-white text-center p-12 bg-white/10 rounded-2xl backdrop-blur">
              <p className="text-xl">✅ Analysis complete! Scroll down to see results</p>
              <p className="text-sm text-white/70 mt-2">(Keep your existing results rendering below)</p>
            </div>
          )}

          {/* Empty State - Improved */}
          {results.length === 0 && !loading && (
            <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
              
              {/* 7-Day Challenge Preview */}
              <div className="mb-12">
                <div className="text-6xl mb-4">🎯</div>
                <h2 className="text-4xl font-black text-gray-900 mb-4">
                  Your 7-Day Money Challenge
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
                  From complete zero to posting your first viral video, only 30 min/day
                </p>

                {/* 7-Day Timeline */}
                <div className="max-w-4xl mx-auto space-y-4">
                  {[
                    { day: 1, title: 'Find Your Niche', desc: 'Analyze 10 viral videos, pick 3 easiest formats to copy', icon: '🔍' },
                    { day: 2, title: 'Choose Products', desc: 'Use our tool to find easiest-to-sell product categories', icon: '🎁' },
                    { day: 3, title: 'Write Script', desc: 'AI generates your first ready-to-shoot script', icon: '📝' },
                    { day: 4, title: 'Film', desc: 'Follow checklist, phone camera is enough', icon: '🎬' },
                    { day: 5, title: 'Post', desc: 'Upload and optimize title, tags, posting time', icon: '🚀' },
                    { day: 6, title: 'Analyze Data', desc: 'Learn to read analytics, know what works', icon: '📊' },
                    { day: 7, title: 'Batch Produce', desc: 'Use proven formats to batch create content', icon: '⚡' },
                  ].map((item) => (
                    <div key={item.day} className="flex items-center gap-4 bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-200 text-left hover:border-purple-400 hover:shadow-lg transition">
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg">
                        Day {item.day}
                      </div>
                      <div className="flex-shrink-0 text-4xl">{item.icon}</div>
                      <div className="flex-1">
                        <div className="font-black text-lg text-gray-900">{item.title}</div>
                        <div className="text-gray-600 text-sm">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Success Metrics */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 mb-8 border-2 border-green-300">
                <h3 className="text-2xl font-black text-gray-900 mb-6">After Completing the Challenge You'll Have</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-5xl mb-2">📹</div>
                    <div className="font-black text-2xl text-gray-900">7+ Videos</div>
                    <div className="text-gray-600 text-sm">Master viral video formula</div>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl mb-2">👥</div>
                    <div className="font-black text-2xl text-gray-900">1K+ Followers</div>
                    <div className="text-gray-600 text-sm">Your first loyal audience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl mb-2">💰</div>
                    <div className="font-black text-2xl text-gray-900">$100+ Earned</div>
                    <div className="text-gray-600 text-sm">Your first TikTok income</div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => !userEmail && setShowEmailGate(true)}
                className="px-12 py-5 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-2xl font-black rounded-2xl hover:shadow-2xl transition-all transform hover:scale-105 mb-4"
              >
                💰 Start 7-Day Challenge Free
              </button>
              <p className="text-gray-500 text-sm">
                No credit card • 3 free analyses • Upgrade anytime
              </p>

              {/* Recent Analyses */}
              {recentAnalyses.length > 0 && (
                <div className="mt-12 p-6 bg-purple-50 rounded-xl border-2 border-purple-200 max-w-md mx-auto">
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">🔥 Recent Analyses</h3>
                  <div className="space-y-2">
                    {recentAnalyses.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm bg-white rounded-lg px-4 py-2 shadow-sm">
                        <span className="text-gray-700 font-medium">@{item.creator}</span>
                        <span className="font-bold text-purple-600">{item.score}/10</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Join thousands analyzing viral content daily
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-2xl shadow-2xl p-16 text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mb-6"></div>
              <p className="text-gray-700 text-2xl font-bold">AI analyzing...</p>
              <p className="text-gray-500 mt-2">This may take 30-90 seconds</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
