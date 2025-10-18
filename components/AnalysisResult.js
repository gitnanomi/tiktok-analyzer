import { useState } from 'react';

/**
 * 全新的分析结果展示组件
 * 设计原则：
 * 1. 视觉优先 - 用卡片、图标、颜色引导注意力
 * 2. 清晰的信息层级 - 最重要的信息最突出
 * 3. 强烈的行动指引 - 每个区块都有明确的 CTA
 * 4. 突出 Vision AI 价值 - 让用户看到 AI "真的看了视频"
 */

export default function AnalysisResult({ result, index, onGenerateScript, onSave, isSaved }) {
  const [activeTab, setActiveTab] = useState('overview'); // overview | breakdown | replicate
  const [scriptProduct, setScriptProduct] = useState('');
  
  const viralScore = calculateViralScore(result);
  const analysis = result.analysis;
  
  // 如果没有分析数据，显示错误
  if (!analysis) {
    return <ErrorState result={result} />;
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8">
      
      {/* 头部：视频基本信息 */}
      <VideoHeader 
        result={result} 
        viralScore={viralScore}
        onSave={onSave}
        isSaved={isSaved}
      />

      {/* Vision AI 徽章（如果使用了 Vision）*/}
      {result.visionUsed && <VisionBadge />}

      {/* 关键指标卡片 */}
      <KeyMetrics 
        viralScore={viralScore}
        structured={analysis.structured}
      />

      {/* 标签导航 */}
      <TabNavigation 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* 内容区域 */}
      <div className="p-8">
        {activeTab === 'overview' && (
          <OverviewTab 
            analysis={analysis}
            result={result}
            viralScore={viralScore}
          />
        )}
        
        {activeTab === 'breakdown' && (
          <BreakdownTab 
            analysis={analysis}
            result={result}
          />
        )}
        
        {activeTab === 'replicate' && (
          <ReplicateTab 
            analysis={analysis}
            result={result}
            scriptProduct={scriptProduct}
            setScriptProduct={setScriptProduct}
            onGenerateScript={onGenerateScript}
          />
        )}
      </div>

      {/* 底部 CTA */}
      <BottomCTA result={result} viralScore={viralScore} />
    </div>
  );
}

// ============ 子组件 ============

function VideoHeader({ result, viralScore, onSave, isSaved }) {
  return (
    <div className="relative">
      {/* 背景渐变 */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 opacity-90"></div>
      
      {/* 内容 */}
      <div className="relative p-8 text-white">
        <div className="flex gap-6 items-start">
          
          {/* 缩略图 */}
          {result.thumbnail && (
            <div className="flex-shrink-0">
              <img 
                src={result.thumbnail} 
                alt="Video"
                className="w-32 h-32 rounded-xl object-cover shadow-2xl ring-4 ring-white/30"
              />
            </div>
          )}
          
          {/* 信息 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-sm font-semibold text-white/80 mb-1">Creator</div>
                <h2 className="text-3xl font-black">@{result.author}</h2>
              </div>
              
              {/* 病毒分数徽章 */}
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 text-center border-2 border-white/40">
                <div className="text-sm font-bold text-white/90 mb-1">Viral Score</div>
                <div className="text-5xl font-black">{viralScore}</div>
                <div className="text-sm text-white/80">/10</div>
              </div>
            </div>
            
            {/* 描述 */}
            <p className="text-white/90 text-lg mb-4 line-clamp-2">
              {result.description}
            </p>
            
            {/* 数据标签 */}
            <div className="flex flex-wrap gap-3">
              {result.views > 0 && (
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="font-bold">{formatNumber(result.views)}</span>
                  <span className="text-white/80 ml-1">views</span>
                </div>
              )}
              {result.likes > 0 && (
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="font-bold">{formatNumber(result.likes)}</span>
                  <span className="text-white/80 ml-1">likes</span>
                </div>
              )}
              {result.comments > 0 && (
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="font-bold">{formatNumber(result.comments)}</span>
                  <span className="text-white/80 ml-1">comments</span>
                </div>
              )}
            </div>
          </div>
          
          {/* 保存按钮 */}
          <button
            onClick={onSave}
            className={`flex-shrink-0 px-6 py-3 rounded-xl font-bold transition-all ${
              isSaved
                ? 'bg-yellow-400 text-yellow-900 shadow-lg scale-105'
                : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border-2 border-white/40'
            }`}
          >
            {isSaved ? '⭐ Saved' : '☆ Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

function VisionBadge() {
  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-4">
      <div className="flex items-center justify-center gap-3 text-white">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
          <span className="text-2xl">👁️</span>
        </div>
        <div>
          <div className="font-black text-lg">Vision AI Analysis</div>
          <div className="text-sm text-white/80">Our AI actually "watched" the video frame by frame</div>
        </div>
      </div>
    </div>
  );
}

function KeyMetrics({ viralScore, structured }) {
  const metrics = [
    {
      icon: '🎯',
      label: 'Replication Score',
      value: structured?.replicationScore || viralScore,
      max: 10,
      color: 'purple',
      description: getReplicationDesc(structured?.replicationScore || viralScore)
    },
    {
      icon: '⚡',
      label: 'Difficulty',
      value: structured?.difficulty || 5,
      max: 10,
      color: 'blue',
      description: getDifficultyDesc(structured?.difficulty || 5)
    },
    {
      icon: '💰',
      label: 'Budget Needed',
      value: `$${structured?.budget || 50}`,
      color: 'green',
      description: getBudgetDesc(structured?.budget || 50)
    },
    {
      icon: '✅',
      label: 'Beginner Friendly',
      value: structured?.canBeginneerDoIt === 'yes' ? 'YES' : 
             structured?.canBeginneerDoIt === 'no' ? 'NO' : 'MAYBE',
      color: structured?.canBeginneerDoIt === 'yes' ? 'green' : 
             structured?.canBeginneerDoIt === 'no' ? 'red' : 'yellow',
      description: getBeginnerDesc(structured?.canBeginneerDoIt)
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-8 bg-gray-50">
      {metrics.map((metric, i) => (
        <MetricCard key={i} {...metric} />
      ))}
    </div>
  );
}

function MetricCard({ icon, label, value, max, color, description }) {
  const colorClasses = {
    purple: 'from-purple-500 to-pink-500',
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    yellow: 'from-yellow-500 to-orange-500',
    red: 'from-red-500 to-pink-500'
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-2xl`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-gray-500 uppercase">{label}</div>
          <div className="text-2xl font-black text-gray-900">{value}</div>
        </div>
      </div>
      
      {max && (
        <div className="mb-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full bg-gradient-to-r ${colorClasses[color]}`}
              style={{ width: `${(value / max) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
      
      <p className="text-xs text-gray-600">{description}</p>
    </div>
  );
}

function TabNavigation({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'overview', label: '📊 Quick Overview', desc: '3-min read' },
    { id: 'breakdown', label: '🔍 Deep Dive', desc: 'Full analysis' },
    { id: 'replicate', label: '🎬 Replicate Now', desc: 'Get script' }
  ];

  return (
    <div className="border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
      <div className="flex">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-6 py-4 font-bold text-center transition-all ${
              activeTab === tab.id
                ? 'text-purple-600 border-b-4 border-purple-600 bg-purple-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="text-lg">{tab.label}</div>
            <div className="text-xs opacity-70">{tab.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function OverviewTab({ analysis, result, viralScore }) {
  // 从 fullText 中提取关键信息
  const sections = parseAnalysisText(analysis.fullText || '');
  
  return (
    <div className="space-y-6">
      
      {/* 核心判断 */}
      <div className={`rounded-2xl p-8 border-4 ${
        viralScore >= 8 ? 'bg-green-50 border-green-400' :
        viralScore >= 6 ? 'bg-yellow-50 border-yellow-400' :
        'bg-orange-50 border-orange-400'
      }`}>
        <div className="flex items-center gap-4 mb-4">
          <div className="text-6xl">
            {viralScore >= 8 ? '🔥' : viralScore >= 6 ? '👍' : '🤔'}
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900">
              {viralScore >= 8 ? 'COPY THIS NOW!' :
               viralScore >= 6 ? 'Worth Trying' :
               'Maybe Skip This One'}
            </h3>
            <p className="text-gray-700">
              {viralScore >= 8 ? 'High replication potential. This format is proven to work.' :
               viralScore >= 6 ? 'Decent format but may need adaptation.' :
               'Complex setup or low replication score. Consider easier targets.'}
            </p>
          </div>
        </div>
      </div>

      {/* 3 秒总结 */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
        <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          3-Second Summary
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm font-semibold text-gray-600 mb-1">Format</div>
            <div className="font-bold text-gray-900">
              {analysis.contentType || 'Product Review / Tutorial'}
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-600 mb-1">Best For</div>
            <div className="font-bold text-gray-900">
              {analysis.category || 'E-commerce / Info Products'}
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-600 mb-1">Time to Film</div>
            <div className="font-bold text-gray-900">1-2 hours</div>
          </div>
        </div>
      </div>

      {/* 为什么它能爆 */}
      {sections.successFactors && (
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
          <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            Why This Video Went Viral
          </h3>
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-line text-gray-700">
              {sections.successFactors}
            </div>
          </div>
        </div>
      )}

      {/* 你能复制什么 */}
      {sections.replicableElements && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
          <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">✨</span>
            What You Can Replicate
          </h3>
          <div className="space-y-3">
            {sections.replicableElements.split('\n\n').filter(e => e.trim()).map((element, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-lg p-4">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {i + 1}
                </span>
                <p className="text-gray-700 text-sm">{element}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="text-center py-6">
        <p className="text-gray-600 mb-4">Ready to create your version?</p>
        <button 
          onClick={() => document.querySelector('[data-tab="replicate"]')?.click()}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-bold rounded-xl hover:shadow-2xl transition-all transform hover:scale-105"
        >
          Get Your Custom Script →
        </button>
      </div>
    </div>
  );
}

function BreakdownTab({ analysis, result }) {
  const sections = parseAnalysisText(analysis.fullText || '');
  
  // 定义所有可能的分析部分
  const analysisBlocks = [
    { 
      key: 'visualAnalysis', 
      title: '👁️ Visual Analysis', 
      subtitle: 'What we saw in the video',
      color: 'purple'
    },
    { 
      key: 'hook', 
      title: '🎣 Hook (First 3 Seconds)', 
      subtitle: 'How they grabbed attention',
      color: 'red'
    },
    { 
      key: 'storyLine', 
      title: '📖 Story Structure', 
      subtitle: 'How the video flows',
      color: 'blue'
    },
    { 
      key: 'cameraSetup', 
      title: '📹 Camera & Lighting', 
      subtitle: 'Technical setup details',
      color: 'orange'
    },
    { 
      key: 'equipment', 
      title: '🛠️ Equipment Needed', 
      subtitle: 'Shopping list',
      color: 'green'
    },
    { 
      key: 'shotList', 
      title: '🎬 Shot-by-Shot Breakdown', 
      subtitle: 'Exact filming sequence',
      color: 'pink'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* 完整的 Vision 分析文本 */}
      {analysis.fullText && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-200">
          <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">📋</span>
            Complete AI Analysis
          </h3>
          <div className="bg-white rounded-xl p-6 max-h-[600px] overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700 font-sans">
              {analysis.fullText}
            </pre>
          </div>
        </div>
      )}

      {/* 如果没有 fullText，显示结构化数据 */}
      {!analysis.fullText && sections && Object.keys(sections).length > 0 && (
        <>
          {analysisBlocks.map(block => {
            const content = sections[block.key];
            if (!content) return null;
            
            return (
              <AnalysisBlock
                key={block.key}
                title={block.title}
                subtitle={block.subtitle}
                content={content}
                color={block.color}
              />
            );
          })}
        </>
      )}

      {/* 如果什么都没有 */}
      {!analysis.fullText && (!sections || Object.keys(sections).length === 0) && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🤔</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Limited Analysis Available</h3>
          <p className="text-gray-600">
            Upgrade to Pro for full Vision AI analysis with detailed breakdowns.
          </p>
        </div>
      )}
    </div>
  );
}

function AnalysisBlock({ title, subtitle, content, color }) {
  const colorClasses = {
    purple: 'from-purple-50 to-pink-50 border-purple-200',
    red: 'from-red-50 to-rose-50 border-red-200',
    blue: 'from-blue-50 to-cyan-50 border-blue-200',
    orange: 'from-orange-50 to-yellow-50 border-orange-200',
    green: 'from-green-50 to-emerald-50 border-green-200',
    pink: 'from-pink-50 to-rose-50 border-pink-200'
  };

  return (
    <div className={`bg-gradient-to-r ${colorClasses[color]} rounded-2xl p-6 border-2`}>
      <h3 className="text-xl font-black text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{subtitle}</p>
      <div className="bg-white rounded-xl p-5">
        <div className="prose prose-sm max-w-none">
          <div className="whitespace-pre-line text-gray-700">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReplicateTab({ analysis, result, scriptProduct, setScriptProduct, onGenerateScript }) {
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedChecklist, setCopiedChecklist] = useState(false);

  const script = generateQuickScript(result, analysis, scriptProduct);
  const checklist = generateChecklist(result, analysis);

  const copyToClipboard = (text, setterFn) => {
    navigator.clipboard.writeText(text);
    setterFn(true);
    setTimeout(() => setterFn(false), 2000);
  };

  return (
    <div className="space-y-8">
      
      {/* 步骤指南 */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
        <h3 className="text-2xl font-black text-gray-900 mb-6">
          🚀 3 Steps to Replicate This Video
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">📝</div>
            <div className="font-bold text-gray-900 mb-2">1. Get Script</div>
            <div className="text-sm text-gray-600">Customize it for your product below</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">🎬</div>
            <div className="font-bold text-gray-900 mb-2">2. Film It</div>
            <div className="text-sm text-gray-600">Follow the checklist, takes 1-2 hours</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">💰</div>
            <div className="font-bold text-gray-900 mb-2">3. Post & Earn</div>
            <div className="text-sm text-gray-600">Add your affiliate links, watch it grow</div>
          </div>
        </div>
      </div>

      {/* 脚本生成器 */}
      <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
        <h3 className="text-2xl font-black text-gray-900 mb-4">
          📝 Your Custom Script
        </h3>
        
        {/* 产品输入 */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            What product will you promote? (optional)
          </label>
          <input
            type="text"
            value={scriptProduct}
            onChange={(e) => setScriptProduct(e.target.value)}
            placeholder="e.g., Vitamin C Serum, iPhone Case, Protein Powder..."
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-400 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Leave blank for a generic template you can customize later
          </p>
        </div>

        {/* 脚本展示 */}
        <div className="bg-gray-50 rounded-xl p-6 mb-4 max-h-96 overflow-y-auto">
          <pre className="whitespace-pre-line text-sm leading-relaxed font-mono text-gray-800">
            {script}
          </pre>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-3">
          <button
            onClick={() => copyToClipboard(script, setCopiedScript)}
            className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition font-bold"
          >
            {copiedScript ? '✓ Copied!' : '📋 Copy Script'}
          </button>
          <button
            onClick={() => {
              const blob = new Blob([script], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `script-${result.author}-${Date.now()}.txt`;
              a.click();
            }}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-bold"
          >
            💾 Download
          </button>
        </div>
      </div>

      {/* 拍摄清单 */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-300">
        <h3 className="text-2xl font-black text-gray-900 mb-4">
          ✅ Filming Checklist
        </h3>
        
        <div className="bg-white rounded-xl p-6 mb-4">
          <pre className="whitespace-pre-line text-sm leading-relaxed font-sans text-gray-700">
            {checklist}
          </pre>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => copyToClipboard(checklist, setCopiedChecklist)}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-bold"
          >
            {copiedChecklist ? '✓ Copied!' : '📋 Copy Checklist'}
          </button>
          <button
            onClick={() => {
              const blob = new Blob([checklist], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `checklist-${result.author}-${Date.now()}.txt`;
              a.click();
            }}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-bold"
          >
            💾 Download
          </button>
        </div>
      </div>

      {/* 高级脚本生成器（付费功能） */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 border-2 border-yellow-300">
        <div className="flex items-start gap-4">
          <div className="text-5xl">🤖</div>
          <div className="flex-1">
            <h3 className="text-xl font-black text-gray-900 mb-2">
              Want Even Better Scripts?
            </h3>
            <p className="text-gray-700 mb-4">
              Pro users get AI Script Generator 2.0 with second-by-second breakdowns, 
              multiple variations, and director notes.
            </p>
            <button 
              onClick={onGenerateScript}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-xl transition-all"
            >
              Upgrade to Generate Pro Scripts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BottomCTA({ result, viralScore }) {
  if (viralScore < 6) return null; // 低分视频不显示强烈 CTA
  
  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-center text-white">
      <h3 className="text-2xl font-black mb-3">
        {viralScore >= 8 ? '🔥 This Format Is Gold!' : '👍 Worth Trying!'}
      </h3>
      <p className="text-lg text-white/90 mb-6">
        {viralScore >= 8 
          ? 'High replication score. Dozens of creators made money with this exact format.'
          : 'Decent potential. Customize it to your niche and you could see results.'}
      </p>
      <div className="flex gap-4 justify-center">
        <a
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold hover:shadow-2xl transition-all"
        >
          Watch Original Video
        </a>
        <button
          onClick={() => window.location.href = '/pricing'}
          className="px-8 py-4 bg-yellow-400 text-yellow-900 rounded-xl font-bold hover:shadow-2xl transition-all"
        >
          Analyze More Videos
        </button>
      </div>
    </div>
  );
}

function ErrorState({ result }) {
  return (
    <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
      <div className="text-6xl mb-4">😕</div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        Analysis Incomplete
      </h3>
      <p className="text-gray-600 mb-6">
        We couldn't fully analyze this video. This might be due to:
      </p>
      <ul className="text-left max-w-md mx-auto text-gray-600 space-y-2 mb-6">
        <li>• Video is private or deleted</li>
        <li>• API quota exceeded</li>
        <li>• Network timeout</li>
      </ul>
      <button
        onClick={() => window.location.reload()}
        className="px-8 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition"
      >
        Try Again
      </button>
    </div>
  );
}

// ============ 辅助函数 ============

function calculateViralScore(result) {
  if (result.views === 0 || result.id?.includes('demo')) return 9;
  const engagement = (result.likes + result.comments + result.shares) / Math.max(result.views, 1);
  return Math.min(10, Math.round(engagement * 100 * 2));
}

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

function getReplicationDesc(score) {
  if (score >= 8) return 'Very easy to copy - proven format';
  if (score >= 6) return 'Moderately easy with some adaptation';
  if (score >= 4) return 'Challenging but possible';
  return 'Difficult to replicate';
}

function getDifficultyDesc(score) {
  if (score <= 3) return 'Beginner friendly - start today';
  if (score <= 6) return 'Intermediate - some skills needed';
  return 'Advanced - requires experience';
}

function getBudgetDesc(budget) {
  if (budget === 0) return 'Free! Use what you have';
  if (budget < 50) return 'Very affordable setup';
  if (budget < 200) return 'Moderate investment';
  return 'Significant equipment needed';
}

function getBeginnerDesc(level) {
  if (level === 'yes') return 'Perfect for complete beginners';
  if (level === 'no') return 'Not recommended for beginners';
  return 'Possible with some preparation';
}

function parseAnalysisText(fullText) {
  if (!fullText) return {};
  
  const sections = {};
  
  // 简单的解析逻辑 - 按标题分段
  const lines = fullText.split('\n');
  let currentSection = null;
  let currentContent = [];
  
  lines.forEach(line => {
    // 检测标题（## 或 **粗体:**）
    if (line.startsWith('##') || line.match(/^\*\*[^:]+:\*\*/)) {
      // 保存上一个section
      if (currentSection) {
        sections[currentSection] = currentContent.join('\n').trim();
      }
      // 开始新section
      currentSection = line.replace(/^##\s*/, '').replace(/\*\*/g, '').replace(/:$/, '').trim()
        .toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
      currentContent = [];
    } else if (currentSection) {
      currentContent.push(line);
    }
  });
  
  // 保存最后一个section
  if (currentSection) {
    sections[currentSection] = currentContent.join('\n').trim();
  }
  
  return sections;
}

function generateQuickScript(result, analysis, product) {
  const productName = product || '[YOUR PRODUCT]';
  
  return `🎬 QUICK SCRIPT - Based on @${result.author}'s Format

PRODUCT: ${productName}

HOOK (0-3s):
"Wait... ${productName} actually works?"
→ Look surprised, show product
→ Make direct eye contact with camera

SETUP (3-8s):
"Let me show you what happened..."
→ Hold ${productName} clearly visible
→ Keep it simple, conversational

DEMO (8-15s):
[Show before/after OR quick demo OR 3-day test]
→ Keep cuts tight (2 seconds each)
→ Same lighting, same angle throughout

ENDING (Last 2s):
"Okay I'm actually impressed!"
→ Natural excitement
→ Product still in frame

---
FILMING NOTES:
📱 Camera: iPhone front-facing
☀️ Lighting: Natural window light
👤 Framing: You on right side, product left
⏱️ Length: 15-20 seconds total
✂️ Editing: Hard cuts every 2 seconds

BUDGET: ~$${analysis?.structured?.budget || 50}
DIFFICULTY: ${analysis?.structured?.difficulty || 5}/10

---
Generated by TikTok Money System
Analyzed from: ${result.url}`;
}

function generateChecklist(result, analysis) {
  return `✅ FILMING CHECKLIST - @${result.author} Style

PRE-PRODUCTION
□ Script memorized (read it 5 times)
□ Product ready and charged/clean
□ Background clean and simple
□ Natural light window identified
□ Phone fully charged (80%+)

CAMERA SETUP
□ Front-facing camera on
□ Set to 1080p video mode
□ Rule of thirds: you on right 1/3
□ Test frame before filming
□ Lock exposure (tap and hold)

LIGHTING
□ Face the window (natural light)
□ Avoid harsh overhead lights
□ Film during golden hour if possible
□ Check for shadows on face

FILMING (Do 3 takes minimum!)
□ Take 1: Practice run
□ Take 2: Real attempt
□ Take 3: Backup

DURING FILMING
□ Hold product at chest level
□ Keep product in frame entire time
□ Direct eye contact with camera
□ Natural expressions (not forced)
□ Keep it under 20 seconds

EDITING CHECKLIST
□ Cut to best takes
□ 2-second average shot length
□ Hard cuts only (no transitions)
□ Add text overlays (white, bottom)
□ Color grade: slight saturation boost
□ Check audio levels

TECHNICAL SPECS
Resolution: 1080 x 1920 (vertical)
Frame Rate: 30 fps
Audio: Clear, minimal background noise
Length: 15-20 seconds
File Size: Under 50MB

BEFORE POSTING
□ Watch it 3 times - does it hook in 3s?
□ Show to a friend - do they get it?
□ Product clearly visible throughout?
□ Audio clear and understandable?

BUDGET: $${analysis?.structured?.budget || 50}
TIME NEEDED: 1-2 hours total

---
You got this! 🚀
Generated: ${new Date().toLocaleDateString()}`;
}
