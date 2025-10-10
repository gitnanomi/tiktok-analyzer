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
        body: JSON.stringify({ 
          input: input,
          count: 20 
        }),
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

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    alert(`${label} 已复制到剪贴板！`);
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

  const inputType = input.includes('tiktok.com') ? 'url' : 'keywords';

  return (
    <>
      <Head>
        <title>TikTok Analyzer Pro - AI Powered Analysis</title>
      </Head>

      <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-8">
            <h1 className="text-5xl font-black text-white mb-3">
              🎯 TikTok Analyzer Pro
            </h1>
            <p className="text-xl text-white/90">
              Smart Analysis • AI Prompt Generator • Content Strategy
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              🎨 功能特色
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
              <div>
                <p className="font-semibold mb-1">📊 深度内容分析</p>
                <p className="text-xs">Hook、Story、CTA 完整解构</p>
              </div>
              <div>
                <p className="font-semibold mb-1">🤖 AI 提示词生成</p>
                <p className="text-xs">Midjourney, DALL-E, SD 格式</p>
              </div>
              <div>
                <p className="font-semibold mb-1">🔄 产品替换方案</p>
                <p className="text-xs">融合你的产品，一键复制风格</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
            
            <div className="mb-6">
              <div className="flex gap-4 mb-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                  placeholder="🔗 Paste TikTok URL or 🔍 Enter keywords (e.g., 'AI tools')"
                  className="flex-1 px-6 py-4 text-lg border-2 border-purple-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-400"
                />
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !input}
                  className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-bold rounded-2xl hover:shadow-2xl transition disabled:opacity-50"
                >
                  {loading ? '⏳ Analyzing...' : '🚀 Analyze'}
                </button>
              </div>
              
              {input && (
                <div className="text-sm text-gray-600">
                  {inputType === 'url' ? (
                    <span>✅ Single URL Analysis Mode</span>
                  ) : (
                    <span>✅ Batch Search Mode - Will analyze top videos</span>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-purple-50 p-4 rounded-xl text-center">
                <div className="text-3xl font-black text-purple-600">
                  {results.length}
                </div>
                <div className="text-sm text-gray-600">Videos Analyzed</div>
              </div>
              <div className="bg-red-50 p-4 rounded-xl text-center">
                <div className="text-3xl font-black text-red-600">
                  {results.filter(r => r.analysis?.isAd?.includes('YES')).length}
                </div>
                <div className="text-sm text-gray-600">Ads Detected</div>
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

          {results.length > 0 && (
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur p-4 rounded-xl">
                <div className="text-white text-center">
                  {mode === 'single' ? (
                    <span>📊 Single Video Analysis Complete</span>
                  ) : (
                    <span>📊 Batch Analysis Complete - {results.length} videos</span>
                  )}
                </div>
              </div>

              {results.map((result, idx) => (
                <div key={idx} className="bg-white rounded-3xl shadow-2xl p-8">
                  
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {mode === 'single' ? 'Analysis Result' : `Video #${idx + 1}`}
                      </h3>
                      <p className="text-gray-600">@{result.author}</p>
                      <p className="text-gray-600 mt-2">{result.description}</p>
                    </div>
                    {result.analysis?.isAd?.includes('YES') && (
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold">
                        💰 Ad
                      </span>
                    )}
                  </div>

                  {result.analysis && (
                    <div className="space-y-4">
                      
                      {result.analysis.hook && (
                        <div className="bg-red-50 p-6 rounded-xl">
                          <div className="font-bold text-red-900 mb-3 text-lg">🎯 Hook (First 3 Seconds)</div>
                          <div className="text-sm whitespace-pre-line">{result.analysis.hook}</div>
                        </div>
                      )}

                      {result.analysis.storyLine && (
                        <div className="bg-purple-50 p-6 rounded-xl">
                          <div className="font-bold text-purple-900 mb-3 text-lg">📖 Story Line</div>
                          <div className="text-sm whitespace-pre-line">{result.analysis.storyLine}</div>
                        </div>
                      )}

                      {result.analysis.cta && (
                        <div className="bg-green-50 p-6 rounded-xl">
                          <div className="font-bold text-green-900 mb-3 text-lg">🎬 Call to Action</div>
                          <div className="text-sm whitespace-pre-line">{result.analysis.cta}</div>
                        </div>
                      )}

                      {result.analysis.visualElements && (
                        <div className="bg-blue-50 p-6 rounded-xl">
                          <div className="font-bold text-blue-900 mb-3 text-lg">🎨 Visual Elements</div>
                          <div className="text-sm whitespace-pre-line">{result.analysis.visualElements}</div>
                        </div>
                      )}

                      {result.analysis.successFactors && (
                        <div className="bg-yellow-50 p-6 rounded-xl">
                          <div className="font-bold text-yellow-900 mb-3 text-lg">🔥 Success Factors</div>
                          <div className="text-sm whitespace-pre-line">{result.analysis.successFactors}</div>
                        </div>
                      )}

                      {result.analysis.aiPrompts && (
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-200">
                          <div className="font-bold text-purple-900 mb-4 text-xl">
                            🤖 AI 提示词生成器
                          </div>
                          
                          <div className="mb-6">
                            <div className="font-semibold text-lg mb-3 text-purple-800">
                              📸 Step 1: 参考图提示词反推
                            </div>
                            
                            {result.analysis.aiPrompts.step1?.midjourneyPrompt && (
                              <div className="mb-4 bg-white p-4 rounded-lg">
                                <div className="text-sm font-semibold text-gray-700 mb-2">
                                  Midjourney / DALL-E 提示词:
                                </div>
                                <div className="bg-gray-100 p-3 rounded font-mono text-xs">
                                  {result.analysis.aiPrompts.step1.midjourneyPrompt}
                                </div>
                                <button
                                  onClick={() => copyToClipboard(
                                    result.analysis.aiPrompts.step1.midjourneyPrompt,
                                    'Midjourney 提示词'
                                  )}
                                  className="mt-2 text-xs bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                                >
                                  📋 复制提示词
                                </button>
                              </div>
                            )}
                            
                            {result.analysis.aiPrompts.step1?.stableDiffusionPrompt && (
                              <div className="bg-white p-4 rounded-lg">
                                <div className="text-sm font-semibold text-gray-700 mb-2">
                                  Stable Diffusion 提示词:
                                </div>
                                <div className="bg-gray-100 p-3 rounded font-mono text-xs">
                                  {result.analysis.aiPrompts.step1.stableDiffusionPrompt}
                                </div>
                                <button
                                  onClick={() => copyToClipboard(
                                    result.analysis.aiPrompts.step1.stableDiffusionPrompt,
                                    'Stable Diffusion 提示词'
                                  )}
                                  className="mt-2 text-xs bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                                >
                                  📋 复制提示词
                                </button>
                              </div>
                            )}
                          </div>
                          
                          {result.analysis.aiPrompts.step2?.template && (
                            <div className="mb-6">
                              <div className="font-semibold text-lg mb-3 text-purple-800">
                                🔄 Step 2: 融合你的产品
                              </div>
                              <div className="bg-white p-4 rounded-lg">
                                <div className="text-sm font-semibold text-gray-700 mb-2">
                                  提示词模板:
                                </div>
                                <div className="bg-yellow-50 border-2 border-yellow-300 p-3 rounded text-xs mb-3">
                                  {result.analysis.aiPrompts.step2.template}
                                </div>
                                
                                {result.analysis.aiPrompts.step2.example && (
                                  <>
                                    <div className="text-sm font-semibold text-gray-700 mb-2">
                                      示例:
                                    </div>
                                    <div className="bg-green-50 border-2 border-green-300 p-3 rounded text-xs mb-3">
                                      {result.analysis.aiPrompts.step2.example}
                                    </div>
                                  </>
                                )}
                                
                                <button
                                  onClick={() => copyToClipboard(
                                    result.analysis.aiPrompts.step2.template,
                                    '模板'
                                  )}
                                  className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                >
                                  📋 复制模板
                                </button>
                                <p className="text-xs text-gray-600 mt-2">
                                  💡 复制后替换 [YOUR PRODUCT] 为你的产品名称
                                </p>
                              </div>
                            </div>
                          )}
                          
                          {result.analysis.aiPrompts.step3?.breakdown && (
                            <div>
                              <div className="font-semibold text-lg mb-3 text-purple-800">
                                🎬 Step 3: 分镜头提示词
                              </div>
                              <div className="bg-white p-4 rounded-lg">
                                <div className="text-xs whitespace-pre-line">
                                  {result.analysis.aiPrompts.step3.breakdown}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {result.analysis.visualReplicationGuide && (
                        <div className="bg-indigo-50 p-6 rounded-xl">
                          <div className="font-bold text-indigo-900 mb-3 text-lg">
                            🎯 视觉复制指南
                          </div>
                          <div className="text-sm whitespace-pre-line">
                            {result.analysis.visualReplicationGuide}
                          </div>
                        </div>
                      )}

                      {result.analysis.strategyInsights && (
                        <div className="bg-teal-50 p-6 rounded-xl">
                          <div className="font-bold text-teal-900 mb-3 text-lg">
                            💡 Content Strategy
                          </div>
                          <div className="text-sm whitespace-pre-line">
                            {result.analysis.strategyInsights}
                          </div>
                        </div>
                      )}

                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-indigo-50 p-4 rounded-xl">
                          <div className="font-bold text-indigo-900 mb-2">📁 Category</div>
                          <span className="bg-indigo-200 px-3 py-1 rounded-full text-sm">
                            {result.analysis.category}
                          </span>
                        </div>
                        <div className="bg-pink-50 p-4 rounded-xl">
                          <div className="font-bold text-pink-900 mb-2">🎵 Tone</div>
                          <span className="bg-pink-200 px-3 py-1 rounded-full text-sm">
                            {result.analysis.tone}
                          </span>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-xl">
                          <div className="font-bold text-orange-900 mb-2">📊 Type</div>
                          <span className="bg-orange-200 px-3 py-1 rounded-full text-sm">
                            {result.analysis.contentType}
                          </span>
                        </div>
                      </div>

                    </div>
                  )}

{result.url && (
  <a                       
    href={result.url}
    target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-6 text-purple-600 hover:text-purple-800 font-semibold"
                    >
                      🔗 Watch on TikTok →
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {results.length === 0 && !loading && (
            <div className="bg-white rounded-3xl shadow-2xl p-16 text-center">
              <div className="text-6xl mb-6">🎬</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                AI-Powered TikTok Analysis
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Paste a TikTok URL for deep analysis<br/>
                <span className="font-bold">OR</span><br/>
                Enter keywords for batch research
              </p>
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="bg-blue-50 p-8 rounded-2xl">
                  <div className="text-4xl mb-4">🔗</div>
                  <h3 className="font-bold text-xl mb-3">Single URL</h3>
                  <p className="text-sm text-gray-600">
                    Full content breakdown + AI prompts
                  </p>
                </div>
                <div className="bg-purple-50 p-8 rounded-2xl">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="font-bold text-xl mb-3">Batch Keywords</h3>
                  <p className="text-sm text-gray-600">
                    Market research + competitive analysis
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
