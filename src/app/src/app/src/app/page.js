'use client'

import React, { useState, useEffect } from 'react';
import { Search, Clock, Target, Film, Zap, Copy, CheckCircle, History, Trash2, Download, Star, StarOff, Calendar, Upload, Filter, TrendingUp, Play, Eye, Heart, MessageCircle, Share2, Crown, X } from 'lucide-react';

export default function TikTokCompletePlatform() {
  const [activeModule, setActiveModule] = useState('analyze');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('timeline');
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  
  const [searchMode, setSearchMode] = useState('upload');
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('');
  const [searching, setSearching] = useState(false);
  const [benchmarkResults, setBenchmarkResults] = useState(null);

  const industries = [
    { id: 'beauty', name: 'Beauty', emoji: '💄' },
    { id: 'fashion', name: 'Fashion', emoji: '👗' },
    { id: 'food', name: 'Food', emoji: '🍔' },
    { id: 'fitness', name: 'Fitness', emoji: '💪' },
    { id: 'education', name: 'Education', emoji: '📚' },
    { id: 'tech', name: 'Tech', emoji: '📱' },
    { id: 'ecommerce', name: 'E-commerce', emoji: '🛍️' },
    { id: 'travel', name: 'Travel', emoji: '✈️' }
  ];

  const goals = [
    { id: 'engagement', name: 'High Engagement', desc: 'More comments & likes' },
    { id: 'views', name: 'High Views', desc: 'Better completion rate' },
    { id: 'conversion', name: 'High Conversion', desc: 'Better purchase rate' },
    { id: 'viral', name: 'Viral Spread', desc: 'Trending potential' }
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedHistory = localStorage.getItem('tiktok_history');
      if (savedHistory) {
        try {
          setHistory(JSON.parse(savedHistory));
        } catch (e) {
          setHistory([]);
        }
      }
    }
  }, []);

  const saveToHistory = (analysisData) => {
    const record = {
      id: Date.now(),
      url: url,
      timestamp: new Date().toISOString(),
      starred: false,
      analysis: analysisData
    };
    
    const newHistory = [record, ...history].slice(0, 50);
    setHistory(newHistory);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tiktok_history', JSON.stringify(newHistory));
    }
  };

  const deleteRecord = (id) => {
    const newHistory = history.filter(item => item.id !== id);
    setHistory(newHistory);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tiktok_history', JSON.stringify(newHistory));
    }
  };

  const toggleStar = (id) => {
    const newHistory = history.map(item => 
      item.id === id ? { ...item, starred: !item.starred } : item
    );
    setHistory(newHistory);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tiktok_history', JSON.stringify(newHistory));
    }
  };

  const loadRecord = (record) => {
    setUrl(record.url);
    setAnalysis(record.analysis);
    setShowHistory(false);
    setActiveModule('analyze');
    setActiveTab('timeline');
  };

  const exportHistory = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const blobUrl = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `tiktok-history-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const analyzeVideo = async () => {
    if (!url.includes('tiktok.com')) {
      alert('Please enter a valid TikTok link');
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const detailedAnalysis = {
      videoId: 'demo123456',
      videoUrl: url,
      basicInfo: {
        duration: '0:32',
        resolution: '1080x1920',
        fps: '30fps',
        fileSize: '8.5MB'
      },
      
      timelineBreakdown: [
        {
          timeRange: '0:00-0:01',
          visualDescription: 'Fade in from black, quick zoom to close-up of face',
          cameraWork: 'Handheld with slight shake for tension',
          textOverlay: 'Large white text: "Did you know?" pops up from bottom',
          textStyle: {
            font: 'Impact / PingFang Bold',
            size: '72pt',
            color: '#FFFFFF',
            stroke: 'Black outline 4px',
            animation: 'Bounce in (0.3s)',
            position: 'Center bottom'
          },
          audioDescription: 'BGM: Strong Trap music (130 BPM)',
          soundEffects: 'Quick "boom" sound with text appearance',
          transitions: 'None (opening)',
          colorGrading: 'High contrast, +15% saturation',
          purpose: 'Hook - Create suspense'
        },
        {
          timeRange: '0:01-0:03',
          visualDescription: 'Cut to problem scene: messy desk/wrong method demo',
          cameraWork: 'Fixed overhead shot',
          textOverlay: '"90% of people do this..."',
          textStyle: {
            font: 'PingFang Bold',
            size: '64pt',
            color: '#FF3366',
            stroke: 'White outline 3px',
            animation: 'Slide from left',
            position: 'Top third'
          },
          audioDescription: 'Voiceover: "But this is wrong!"',
          soundEffects: 'Error sound',
          transitions: 'Hard cut',
          colorGrading: 'Desaturated -20%',
          additionalElements: ['Red X mark', 'Screen shake'],
          purpose: 'Present problem'
        },
        {
          timeRange: '0:03-0:12',
          visualDescription: 'Show correct method in 3 steps',
          cameraWork: 'Macro shot of hands',
          textOverlay: '"Step 1, Step 2, Step 3"',
          textStyle: {
            font: 'Source Han Sans Bold',
            size: '48pt',
            color: '#00FF88',
            stroke: 'Black outline 2px',
            animation: 'Slide in + scale',
            position: 'Top left'
          },
          audioDescription: 'Voiceover explaining each step',
          soundEffects: 'Action sounds',
          transitions: 'Seamless cut',
          colorGrading: 'Bright, high saturation',
          additionalElements: ['Arrow indicators', 'Magnifier'],
          purpose: 'Tutorial content'
        },
        {
          timeRange: '0:28-0:32',
          visualDescription: 'Return to host, smiling and summarizing',
          cameraWork: 'Medium shot, slight upward angle',
          textOverlay: '"Got it? Like and save!"',
          textStyle: {
            font: 'Impact',
            size: '72pt',
            color: '#FFFFFF',
            stroke: 'Rainbow gradient',
            animation: 'Bounce up + pulse',
            position: 'Bottom third'
          },
          audioDescription: 'Voiceover: "Follow me!"',
          soundEffects: 'Like sound effect',
          transitions: 'Fade out',
          colorGrading: 'Warm tones',
          purpose: 'CTA'
        }
      ],

      technicalSpecs: {
        camera: {
          device: 'iPhone 13 Pro or higher',
          settings: '4K 30fps, HDR off',
          stabilization: 'Electronic stabilization'
        },
        lighting: {
          mainLight: 'Ring light 5600K',
          fillLight: 'Reflector',
          environment: 'Natural + fill light'
        },
        audio: {
          microphone: 'Lavalier mic',
          recording: '48kHz sampling',
          postProcessing: 'EQ boost vocals'
        }
      },

      scriptAnalysis: {
        hook: {
          type: 'Question Hook',
          text: '"Did you know? 90% of people do this..."',
          technique: 'Create curiosity + data reference',
          psychology: 'Loss aversion',
          alternatives: [
            '"Never do this again!"',
            '"This method changed my life"',
            '"99% don\'t know this secret"'
          ]
        },
        mainContent: {
          structure: 'Problem → Solution → Steps',
          tone: 'Friendly, professional, confident',
          pacing: '180-200 words per minute',
          keyPhrases: [
            '"But this is wrong!"',
            '"It\'s actually simple"',
            '"Just 3 steps"'
          ]
        },
        cta: {
          type: 'Interactive',
          text: '"Got it? Like and save!"',
          actions: ['Like', 'Save', 'Comment'],
          alternatives: [
            '"Double tap ❤️"',
            '"Comment your thoughts"'
          ]
        }
      },

      aiPrompts: {
        videoScript: {
          title: 'Generate Video Script',
          prompt: 'Generate a 32-second TikTok script with Hook, Problem, Solution, and CTA...'
        },
        captionGeneration: {
          title: 'Generate Caption',
          prompt: 'Generate 3 title variations and full caption...'
        },
        voiceoverScript: {
          title: 'Generate Voiceover Script',
          prompt: 'Generate 32-second voiceover with emphasis and pauses...'
        }
      }
    };

    setAnalysis(detailedAnalysis);
    saveToHistory(detailedAnalysis);
    setLoading(false);
  };

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedVideo({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        preview: URL.createObjectURL(file)
      });
    }
  };

  const searchBenchmarks = async () => {
    setSearching(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockResults = {
      matchScore: 92,
      yourVideo: {
        thumbnail: 'https://via.placeholder.com/200x350/6366f1/ffffff?text=Your+Video',
        duration: '0:28',
        detected: {
          industry: 'Beauty',
          style: 'Tutorial',
          hook: 'Question hook',
          visualStyle: 'Bright, clear'
        }
      },
      benchmarks: [
        {
          id: 1,
          thumbnail: 'https://via.placeholder.com/200x350/ec4899/ffffff?text=Top+1',
          author: '@beauty_queen',
          title: 'Makeup that makes you look 10 years younger!',
          duration: '0:32',
          stats: {
            views: '8.2M',
            likes: '420K',
            comments: '12.3K',
            shares: '28K'
          },
          matchReasons: [
            'Same industry: Beauty',
            'Similar duration: 30-35s',
            'High engagement: 5.1%'
          ],
          performance: {
            engagementRate: '5.1%',
            completionRate: '78%',
            shareRate: '0.34%',
            conversionRate: '3.2%'
          }
        },
        {
          id: 2,
          thumbnail: 'https://via.placeholder.com/200x350/8b5cf6/ffffff?text=Top+2',
          author: '@makeup_tips',
          title: '3 tricks makeup artists use',
          duration: '0:30',
          stats: {
            views: '6.5M',
            likes: '310K',
            comments: '8.9K',
            shares: '19K'
          },
          matchReasons: [
            'Same industry: Beauty',
            'High completion: 82%'
          ],
          performance: {
            engagementRate: '4.8%',
            completionRate: '82%',
            shareRate: '0.29%',
            conversionRate: '4.1%'
          }
        }
      ],
      insights: {
        commonPatterns: [
          'Duration focused on 30-35 seconds',
          '90% use question or comparison hooks',
          'All have 3-step structure'
        ],
        recommendations: [
          'Keep it 30-35 seconds',
          'Use data-driven hooks',
          'Add comparison visuals'
        ]
      }
    };
    
    setBenchmarkResults(mockResults);
    setSearching(false);
  };

  const copyFullGuide = () => {
    if (!analysis) return;
    const guide = `【TikTok Replication Guide】\nDuration: ${analysis.basicInfo.duration}`;
    navigator.clipboard.writeText(guide);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Film className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  TikTok Creator Platform
                </h1>
                <p className="text-xs text-gray-600">AI-Powered Video Analysis</p>
              </div>
            </div>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-semibold hover:bg-purple-200 flex items-center gap-2"
            >
              <History className="w-4 h-4" />
              History ({history.length})
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-6">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setActiveModule('analyze')}
              className={`py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                activeModule === 'analyze'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Search className="w-5 h-5" />
              Video Analysis
            </button>
            <button
              onClick={() => setActiveModule('benchmark')}
              className={`py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                activeModule === 'benchmark'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Target className="w-5 h-5" />
              Benchmark Search
            </button>
          </div>
        </div>

        {showHistory && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">📚 Analysis History</h2>
              <div className="flex gap-2">
                <button
                  onClick={exportHistory}
                  disabled={history.length === 0}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <button
                  onClick={() => setShowHistory(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>

            {history.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <History className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No records yet</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {history.map((record) => (
                  <div key={record.id} className="border-2 border-gray-200 rounded-xl p-4 hover:border-purple-300">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <button onClick={() => toggleStar(record.id)}>
                            {record.starred ? (
                              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                            ) : (
                              <StarOff className="w-5 h-5 text-gray-400" />
                            )}
                          </button>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(record.timestamp).toLocaleString()}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 truncate">{record.url}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => loadRecord(record)}
                          className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Delete this record?')) deleteRecord(record.id);
                          }}
                          className="px-3 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeModule === 'analyze' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste TikTok video URL..."
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && analyzeVideo()}
                />
                <button
                  onClick={analyzeVideo}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Analyze
                    </>
                  )}
                </button>
              </div>
            </div>

            {!analysis && !loading && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <p className="text-blue-800 text-sm">
                  💡 <strong>Deep Analysis:</strong> Frame-by-frame breakdown + script analysis + AI prompts + technical specs
                </p>
              </div>
            )}

            {analysis && (
              <div className="space-y-6">
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl p-4 shadow-md">
                    <Clock className="w-6 h-6 text-purple-600 mb-2" />
                    <div className="text-2xl font-bold">{analysis.basicInfo.duration}</div>
                    <div className="text-sm text-gray-600">Duration</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-md">
                    <Zap className="w-6 h-6 text-yellow-600 mb-2" />
                    <div className="text-2xl font-bold">{analysis.basicInfo.fps}</div>
                    <div className="text-sm text-gray-600">FPS</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-md">
                    <Target className="w-6 h-6 text-green-600 mb-2" />
                    <div className="text-2xl font-bold">{analysis.basicInfo.resolution.split('x')[0]}p</div>
                    <div className="text-sm text-gray-600">Resolution</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-md">
                    <Film className="w-6 h-6 text-blue-600 mb-2" />
                    <div className="text-2xl font-bold">{analysis.timelineBreakdown.length}</div>
                    <div className="text-sm text-gray-600">Shots</div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="border-b">
                    <div className="flex overflow-x-auto">
                      <button
                        onClick={() => setActiveTab('timeline')}
                        className={`py-4 px-6 font-semibold whitespace-nowrap ${activeTab === 'timeline' ? 'bg-white text-purple-600 border-b-2 border-purple-600' : 'bg-gray-50 text-gray-600'}`}
                      >
                        🎬 Timeline
                      </button>
                      <button
                        onClick={() => setActiveTab('technical')}
                        className={`py-4 px-6 font-semibold whitespace-nowrap ${activeTab === 'technical' ? 'bg-white text-purple-600 border-b-2 border-purple-600' : 'bg-gray-50 text-gray-600'}`}
                      >
                        ⚙️ Technical
                      </button>
                      <button
                        onClick={() => setActiveTab('script')}
                        className={`py-4 px-6 font-semibold whitespace-nowrap ${activeTab === 'script' ? 'bg-white text-purple-600 border-b-2 border-purple-600' : 'bg-gray-50 text-gray-600'}`}
                      >
                        💬 Script
                      </button>
                      <button
                        onClick={() => setActiveTab('prompts')}
                        className={`py-4 px-6 font-semibold whitespace-nowrap ${activeTab === 'prompts' ? 'bg-white text-purple-600 border-b-2 border-purple-600' : 'bg-gray-50 text-gray-600'}`}
                      >
                        🤖 AI Prompts
                      </button>
                    </div>
                  </div>

                  <div className="p-6 max-h-[600px] overflow-y-auto">
                    {activeTab === 'timeline' && (
                      <div className="space-y-4">
                        {analysis.timelineBreakdown.map((frame, idx) => (
                          <div key={idx} className="border-l-4 border-indigo-600 bg-indigo-50 rounded-r-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-2 py-1 bg-indigo-600 text-white rounded text-sm font-mono font-bold">
                                {frame.timeRange}
                              </span>
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                                {frame.purpose}
                              </span>
                            </div>
                            <div className="space-y-2 text-sm">
                              <p><strong>Visual:</strong> {frame.visualDescription}</p>
                              <p><strong>Camera:</strong> {frame.cameraWork}</p>
                              <p><strong>Text:</strong> {frame.textOverlay}</p>
                              <div className="grid grid-cols-2 gap-2 bg-white p-2 rounded mt-2">
                                <span className="text-xs"><strong>Font:</strong> {frame.textStyle.font}</span>
                                <span className="text-xs"><strong>Size:</strong> {frame.textStyle.size}</span>
                                <span className="text-xs"><strong>Color:</strong> {frame.textStyle.color}</span>
                                <span className="text-xs"><strong>Animation:</strong> {frame.textStyle.animation}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeTab === 'technical' && (
                      <div className="space-y-4">
                        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
                          <h3 className="font-bold mb-2">📷 Camera</h3>
                          <p className="text-sm"><strong>Device:</strong> {analysis.technicalSpecs.camera.device}</p>
                          <p className="text-sm"><strong>Settings:</strong> {analysis.technicalSpecs.camera.settings}</p>
                        </div>
                        <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded-r-lg">
                          <h3 className="font-bold mb-2">💡 Lighting</h3>
                          <p className="text-sm"><strong>Main Light:</strong> {analysis.technicalSpecs.lighting.mainLight}</p>
                        </div>
                        <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-r-lg">
                          <h3 className="font-bold mb-2">🎙️ Audio</h3>
                          <p className="text-sm"><strong>Mic:</strong> {analysis.technicalSpecs.audio.microphone}</p>
                        </div>
                      </div>
                    )}

                    {activeTab === 'script' && (
                      <div className="space-y-4">
                        <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded-r-lg">
                          <h3 className="font-bold mb-2">🎯 Hook</h3>
                          <p className="text-sm italic mb-2">"{analysis.scriptAnalysis.hook.text}"</p>
                          <p className="text-sm"><strong>Technique:</strong> {analysis.scriptAnalysis.hook.technique}</p>
                          <div className="mt-2">
                            <p className="text-sm font-semibold mb-1">Alternatives:</p>
                            {analysis.scriptAnalysis.hook.alternatives.map((alt, i) => (
                              <p key={i} className="text-sm">• {alt}</p>
                            ))}
                          </div>
                        </div>
                        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
                          <h3 className="font-bold mb-2">📖 Main Content</h3>
                          <p className="text-sm"><strong>Structure:</strong> {analysis.scriptAnalysis.mainContent.structure}</p>
                          <p className="text-sm"><strong>Pacing:</strong> {analysis.scriptAnalysis.mainContent.pacing}</p>
                        </div>
                        <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-r-lg">
                          <h3 className="font-bold mb-2">📢 CTA</h3>
                          <p className="text-sm italic">"{analysis.scriptAnalysis.cta.text}"</p>
                        </div>
</div>
                    )}

                    {activeTab === 'prompts' && (
                      <div className="space-y-4">
                        {Object.entries(analysis.aiPrompts).map(([key, data]) => (
                          <div key={key} className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded-r-lg">
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="font-bold">{data.title}</h3>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(data.prompt);
                                  alert('Copied!');
                                }}
                                className="px-3 py-1 bg-indigo-600 text-white rounded text-xs font-semibold hover:bg-indigo-700 flex items-center gap-1"
                              >
                                <Copy className="w-3 h-3" />
                                Copy
                              </button>
                            </div>
                            <pre className="bg-white p-3 rounded text-xs overflow-auto max-h-48 whitespace-pre-wrap">
{data.prompt}
                            </pre>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={copyFullGuide}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      Copy Full Guide
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {activeModule === 'benchmark' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setSearchMode('upload')}
                  className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all ${
                    searchMode === 'upload'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Upload className="w-5 h-5 inline-block mr-2" />
                  Upload Video
                </button>
                <button
                  onClick={() => setSearchMode('criteria')}
                  className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all ${
                    searchMode === 'criteria'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Filter className="w-5 h-5 inline-block mr-2" />
                  Filter by Criteria
                </button>
              </div>

              {searchMode === 'upload' && (
                <div>
                  <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center hover:border-purple-500 transition-colors cursor-pointer bg-purple-50">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleUpload}
                      className="hidden"
                      id="video-upload"
                    />
                    <label htmlFor="video-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                      <p className="text-lg font-semibold text-gray-800 mb-2">
                        Click to upload or drag video here
                      </p>
                      <p className="text-sm text-gray-600">
                        Support MP4, MOV, AVI
                      </p>
                    </label>
                  </div>

                  {uploadedVideo && (
                    <div className="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                            <Play className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{uploadedVideo.name}</p>
                            <p className="text-sm text-gray-600">{uploadedVideo.size}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setUploadedVideo(null)}
                          className="p-2 hover:bg-red-100 rounded-lg"
                        >
                          <X className="w-5 h-5 text-red-600" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {searchMode === 'criteria' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                      Select Industry
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {industries.map(industry => (
                        <button
                          key={industry.id}
                          onClick={() => setSelectedIndustry(industry.id)}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            selectedIndustry === industry.id
                              ? 'border-purple-600 bg-purple-50 shadow-md'
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          <div className="text-3xl mb-2">{industry.emoji}</div>
                          <div className="text-sm font-semibold">{industry.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                      Your Goal
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {goals.map(goal => (
                        <button
                          key={goal.id}
                          onClick={() => setSelectedGoal(goal.id)}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            selectedGoal === goal.id
                              ? 'border-purple-600 bg-purple-50 shadow-md'
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          <div className="font-semibold mb-1">{goal.name}</div>
                          <div className="text-xs text-gray-600">{goal.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={searchBenchmarks}
                disabled={searching || (searchMode === 'upload' && !uploadedVideo) || (searchMode === 'criteria' && (!selectedIndustry || !selectedGoal))}
                className="w-full mt-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {searching ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-6 h-6" />
                    Find Benchmarks
                  </>
                )}
              </button>
            </div>

            {benchmarkResults && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Crown className="w-6 h-6 text-yellow-500" />
                    Match Score: {benchmarkResults.matchScore}%
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="space-y-3">
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600">Industry</p>
                          <p className="font-semibold">{benchmarkResults.yourVideo.detected.industry}</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600">Style</p>
                          <p className="font-semibold">{benchmarkResults.yourVideo.detected.style}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold mb-4">Found {benchmarkResults.benchmarks.length} Trending Videos</h2>
                  <div className="space-y-6">
                    {benchmarkResults.benchmarks.map((video) => (
                      <div key={video.id} className="border-2 border-gray-200 rounded-xl p-5 hover:border-purple-400">
                        <div className="flex gap-5">
                          <div className="relative flex-shrink-0">
                            <div className="w-32 h-56 bg-gray-200 rounded-lg overflow-hidden">
                              <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute top-2 left-2 px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded">
                              {video.duration}
                            </div>
                          </div>

                          <div className="flex-1">
                            <p className="font-bold text-gray-800 mb-2">{video.author}</p>
                            <p className="text-sm text-gray-700 mb-3">{video.title}</p>

                            <div className="grid grid-cols-4 gap-3 mb-3">
                              <div className="text-center">
                                <Eye className="w-4 h-4 mx-auto text-gray-600 mb-1" />
                                <div className="font-bold text-sm">{video.stats.views}</div>
                              </div>
                              <div className="text-center">
                                <Heart className="w-4 h-4 mx-auto text-red-500 mb-1" />
                                <div className="font-bold text-sm">{video.stats.likes}</div>
                              </div>
                              <div className="text-center">
                                <MessageCircle className="w-4 h-4 mx-auto text-blue-500 mb-1" />
                                <div className="font-bold text-sm">{video.stats.comments}</div>
                              </div>
                              <div className="text-center">
                                <Share2 className="w-4 h-4 mx-auto text-green-500 mb-1" />
                                <div className="font-bold text-sm">{video.stats.shares}</div>
                              </div>
                            </div>

                            <div className="grid grid-cols-4 gap-2">
                              <div className="bg-green-50 p-2 rounded text-center">
                                <div className="text-xs text-gray-600">Engagement</div>
                                <div className="font-bold text-green-700 text-sm">{video.performance.engagementRate}</div>
                              </div>
                              <div className="bg-blue-50 p-2 rounded text-center">
                                <div className="text-xs text-gray-600">Completion</div>
                                <div className="font-bold text-blue-700 text-sm">{video.performance.completionRate}</div>
                              </div>
                              <div className="bg-purple-50 p-2 rounded text-center">
                                <div className="text-xs text-gray-600">Share</div>
                                <div className="font-bold text-purple-700 text-sm">{video.performance.shareRate}</div>
                              </div>
                              <div className="bg-pink-50 p-2 rounded text-center">
                                <div className="text-xs text-gray-600">Convert</div>
                                <div className="font-bold text-pink-700 text-sm">{video.performance.conversionRate}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg p-6 text-white">
                  <h2 className="text-xl font-bold mb-4">💡 AI Insights</h2>
                  <div className="space-y-4">
                    <div className="bg-white bg-opacity-20 rounded-lg p-4">
                      <h3 className="font-semibold mb-2">Common Patterns</h3>
                      <ul className="space-y-1">
                        {benchmarkResults.insights.commonPatterns.map((pattern, i) => (
                          <li key={i} className="text-sm">▸ {pattern}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-lg p-4">
                      <h3 className="font-semibold mb-2">Recommendations</h3>
                      <ul className="space-y-1">
                        {benchmarkResults.insights.recommendations.map((rec, i) => (
                          <li key={i} className="text-sm">✓ {rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
