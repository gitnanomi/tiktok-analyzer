import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!url.includes('tiktok.com')) {
      setError('Please enter a valid TikTok URL');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Analysis failed');
      setResult(data);
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 解析和格式化分析文本
  const parseAnalysis = (text) => {
    if (!text) return [];
    
    const modules = [
      { id: 1, emoji: '🎯', title: 'HOOK ANALYSIS', color: 'from-red-500 to-pink-500', bg: 'bg-red-50', border: 'border-red-200' },
      { id: 2, emoji: '📖', title: 'STORYLINE BREAKDOWN', color: 'from-blue-500 to-indigo-500', bg: 'bg-blue-50', border: 'border-blue-200' },
      { id: 3, emoji: '📢', title: 'CTA', color: 'from-green-500 to-emerald-500', bg: 'bg-green-50', border: 'border-green-200' },
      { id: 4, emoji: '⏱️', title: 'TIMING', color: 'from-yellow-500 to-orange-500', bg: 'bg-yellow-50', border: 'border-yellow-200' },
      { id: 5, emoji: '📝', title: 'COMPLETE SCRIPT', color: 'from-purple-500 to-violet-500', bg: 'bg-purple-50', border: 'border-purple-200' },
      { id: 6, emoji: '🤖', title: 'AI PROMPT LIBRARY', color: 'from-pink-500 to-rose-500', bg: 'bg-pink-50', border: 'border-pink-200' }
    ];

    const sections = [];
    const lines = text.split('\n');
    let currentModule = null;
    let currentContent = [];

    for (let line of lines) {
      // 检测模块标题
      const moduleMatch = line.match(/##\s*(\d)️⃣\s*(.+)/);
      if (moduleMatch) {
        // 保存上一个模块
        if (currentModule) {
          sections.push({
            ...currentModule,
            content: currentContent.join('\n')
          });
        }
        // 开始新模块
        const moduleNum = parseInt(moduleMatch[1]);
        currentModule = modules[moduleNum - 1];
        currentContent = [];
      } else if (currentModule) {
        currentContent.push(line);
      }
    }

    // 保存最后一个模块
    if (currentModule) {
      sections.push({
        ...currentModule,
        content: currentContent.join('\n')
      });
    }

    return sections;
  };

  // 格式化模块内容
  const formatContent = (content) => {
    return content
      .split('\n')
      .map((line, i) => {
        // 粗体
        line = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        
        // 标题
        if (line.startsWith('###')) {
          return `<h3 key="${i}" style="font-size: 1.25rem; font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.75rem; color: #1f2937;">${line.substring(4)}</h3>`;
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return `<h4 key="${i}" style="font-weight: 600; margin-top: 1rem; margin-bottom: 0.5rem; color: #374151;">${line.slice(2, -2)}</h4>`;
        }
        
        // 列表
        if (line.trim().startsWith('- ')) {
          return `<li key="${i}" style="margin-left: 1.5rem; margin-bottom: 0.5rem; color: #4b5563;">${line.substring(2)}</li>`;
        }
        
        // 代码块
        if (line.trim().startsWith('```')) {
          return '';
        }
        
        // 空行
        if (line.trim() === '') {
          return '<br key="' + i + '" />';
        }
        
        // 普通段落
        return `<p key="${i}" style="margin-bottom: 0.75rem; line-height: 1.75; color: #374151;">${line}</p>`;
      })
      .join('');
  };

  const modules = result ? parseAnalysis(result.analysis) : [];

  return (
    <html lang="en">
      <head>
        <title>TikTok Analyzer - 6 Core Modules</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-6xl font-black text-white mb-4">🎬 TikTok Analyzer</h1>
            <p className="text-2xl text-white/90 font-medium">6-Module Deep Analysis System</p>
          </div>

          {/* Input Section */}
          {!loading && !result && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
              <div className="flex gap-4 mb-6 flex-wrap">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                  placeholder="🔗 Paste TikTok URL..."
                  className="flex-1 min-w-[300px] px-6 py-4 text-lg border-2 border-purple-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-400"
                />
                <button
                  onClick={handleAnalyze}
                  disabled={!url}
                  className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-bold rounded-2xl hover:shadow-2xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🚀 Analyze
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { emoji: '🎯', label: 'HOOK', bg: 'bg-red-100' },
                  { emoji: '📖', label: 'STORYLINE', bg: 'bg-blue-100' },
                  { emoji: '📢', label: 'CTA', bg: 'bg-green-100' },
                  { emoji: '⏱️', label: 'TIMING', bg: 'bg-yellow-100' },
                  { emoji: '📝', label: 'SCRIPT', bg: 'bg-purple-100' },
                  { emoji: '🤖', label: 'AI PROMPTS', bg: 'bg-pink-100' }
                ].map((m, i) => (
                  <div key={i} className={`${m.bg} p-4 rounded-xl text-center hover:scale-105 transition`}>
                    <div className="text-3xl mb-2">{m.emoji}</div>
                    <div className="font-bold text-xs">{m.label}</div>
                  </div>
                ))}
              </div>

              {error && (
                <div className="mt-6 p-4 bg-red-100 border-2 border-red-400 rounded-xl text-red-800 font-semibold">
                  ❌ {error}
                </div>
              )}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="bg-white rounded-3xl shadow-2xl p-16 text-center">
              <div className="w-16 h-16 border-8 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-6"></div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Analyzing Video...</h2>
              <p className="text-gray-600">Extracting 6 core modules</p>
            </div>
          )}

          {/* Results - Beautiful Module Cards */}
          {result && modules.length > 0 && (
            <div>
              {/* Video Info */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 mb-6 text-white shadow-2xl">
                <h2 className="text-3xl font-bold mb-4">📊 Analysis Complete!</h2>
                {result.videoData && result.videoData.author && (
                  <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                    <span className="opacity-80">Creator: </span>
                    <span className="font-bold text-lg">@{result.videoData.author}</span>
                  </div>
                )}
              </div>

              {/* Module Cards */}
              <div className="space-y-6 mb-8">
                {modules.map((module, idx) => (
                  <div key={idx} className="bg-white rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition">
                    {/* Module Header */}
                    <div className={`bg-gradient-to-r ${module.color} rounded-2xl p-6 mb-6 text-white`}>
                      <div className="flex items-center gap-4">
                        <span className="text-5xl">{module.emoji}</span>
                        <div>
                          <div className="text-sm opacity-80">Module {module.id}</div>
                          <h2 className="text-3xl font-black">{module.title}</h2>
                        </div>
                      </div>
                    </div>

                    {/* Module Content */}
                    <div 
                      className={`${module.bg} rounded-2xl p-8 border-2 ${module.border}`}
                      dangerouslySetInnerHTML={{ __html: formatContent(module.content) }}
                    />
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(result.analysis);
                    alert('✅ Copied!');
                  }}
                  className="px-8 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-bold rounded-2xl hover:shadow-2xl transition"
                >
                  📋 Copy All
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([result.analysis], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'tiktok-analysis.txt';
                    a.click();
                  }}
                  className="px-8 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-bold rounded-2xl hover:shadow-2xl transition"
                >
                  💾 Download
                </button>
                <button
                  onClick={() => {
                    setResult(null);
                    setUrl('');
                  }}
                  className="px-8 py-5 bg-gray-700 text-white text-lg font-bold rounded-2xl hover:shadow-2xl transition"
                >
                  🔄 New Analysis
                </button>
              </div>
            </div>
          )}
        </div>
      </body>
    </html>
  );
}
