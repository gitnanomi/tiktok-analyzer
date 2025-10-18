import { useState } from 'react';

/**
 * 超级精美的分析结果展示组件 v2.0
 * 设计理念：现代、精致、有呼吸感
 */

export default function AnalysisResult({ result, index, onGenerateScript, onSave, isSaved }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [scriptProduct, setScriptProduct] = useState('');
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedChecklist, setCopiedChecklist] = useState(false);
  
  const viralScore = calculateViralScore(result);
  const analysis = result.analysis;
  
  if (!analysis) {
    return <ErrorState result={result} />;
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl overflow-hidden mb-12 border border-gray-100">
      
      {/* 超级精美的头部 */}
      <VideoHeaderPremium 
        result={result} 
        viralScore={viralScore}
        onSave={onSave}
        isSaved={isSaved}
      />

      {/* Vision AI 徽章（如果使用了）*/}
      {result.visionUsed && <VisionBadgePremium />}

      {/* 4个精美指标卡片 */}
      <KeyMetricsPremium 
        viralScore={viralScore}
        structured={analysis.structured}
      />

      {/* 超级精美的标签导航 */}
      <TabNavigationPremium 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* 内容区域 */}
      <div className="p-10">
        {activeTab === 'overview' && (
          <OverviewTabPremium 
            analysis={analysis}
            result={result}
            viralScore={viralScore}
            setActiveTab={setActiveTab}
          />
        )}
        
        {activeTab === 'breakdown' && (
          <BreakdownTabPremium 
            analysis={analysis}
            result={result}
          />
        )}
        
        {activeTab === 'replicate' && (
          <ReplicateTabPremium 
            analysis={analysis}
            result={result}
            scriptProduct={scriptProduct}
            setScriptProduct={setScriptProduct}
            onGenerateScript={onGenerateScript}
            copiedScript={copiedScript}
            setCopiedScript={setCopiedScript}
            copiedChecklist={copiedChecklist}
            setCopiedChecklist={setCopiedChecklist}
          />
        )}
      </div>

      {/* 精美的底部 CTA */}
      <BottomCTAPremium result={result} viralScore={viralScore} />
    </div>
  );
}

// ============ 超级精美的子组件 ============

function VideoHeaderPremium({ result, viralScore, onSave, isSaved }) {
  return (
    <div className="relative overflow-hidden">
      {/* 动态渐变背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"></div>
      
      {/* 装饰性圆圈 */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      
      {/* 内容 */}
      <div className="relative p-10 text-white">
        <div className="flex gap-8 items-start">
          
          {/* 超大缩略图 */}
          {result.thumbnail && (
            <div className="flex-shrink-0 group">
              <div className="relative">
                <img 
                  src={result.thumbnail} 
                  alt="Video"
                  className="w-40 h-40 rounded-2xl object-cover shadow-2xl ring-4 ring-white/40 transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <a 
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-white/90 text-purple-600 rounded-lg font-bold text-sm hover:bg-white transition"
                  >
                    ▶ Watch
                  </a>
                </div>
              </div>
            </div>
          )}
          
          {/* 信息区 */}
          <div className="flex-1 min-w-0">
            
            {/* Creator 名字 */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-2xl shadow-lg">
                👤
              </div>
              <div>
                <div className="text-sm font-semibold text-white/70 uppercase tracking-wider">Creator</div>
                <h2 className="text-4xl font-black tracking-tight">@{result.author}</h2>
              </div>
            </div>
            
            {/* 描述 */}
            <p className="text-white/90 text-xl mb-6 line-clamp-2 leading-relaxed">
              {result.description}
            </p>
            
            {/* 数据标签 - 更精美 */}
            <div className="flex flex-wrap gap-4">
              {result.views > 0 && (
                <div className="group relative">
                  <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl group-hover:blur-2xl transition"></div>
                  <div className="relative bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 hover:border-white/40 transition">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">👁️</span>
                      <div>
                        <span className="text-2xl font-black">{formatNumber(result.views)}</span>
                        <span className="text-white/70 ml-2 text-sm">views</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {result.likes > 0 && (
                <div className="group relative">
                  <div className="absolute inset-0 bg-pink-500/30 rounded-2xl blur-xl group-hover:blur-2xl transition"></div>
                  <div className="relative bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 hover:border-white/40 transition">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">❤️</span>
                      <div>
                        <span className="text-2xl font-black">{formatNumber(result.likes)}</span>
                        <span className="text-white/70 ml-2 text-sm">likes</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {result.comments > 0 && (
                <div className="group relative">
                  <div className="absolute inset-0 bg-blue-500/30 rounded-2xl blur-xl group-hover:blur-2xl transition"></div>
                  <div className="relative bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 hover:border-white/40 transition">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">💬</span>
                      <div>
                        <span className="text-2xl font-black">{formatNumber(result.comments)}</span>
                        <span className="text-white/70 ml-2 text-sm">comments</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* 右侧：病毒分数 + 保存按钮 */}
          <div className="flex flex-col gap-4 items-end">
            
            {/* 超大病毒分数徽章 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition"></div>
              <div className="relative bg-white/95 backdrop-blur-md rounded-3xl px-8 py-6 text-center border-4 border-white/50 shadow-2xl transform group-hover:scale-105 transition-transform">
                <div className="text-sm font-black text-gray-500 uppercase tracking-wider mb-1">Viral Score</div>
                <div className="text-7xl font-black bg-gradient-to-br from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {viralScore}
                </div>
                <div className="text-2xl font-bold text-gray-400">/10</div>
              </div>
            </div>
            
            {/* 保存按钮 */}
            <button
              onClick={onSave}
              className={`group relative px-8 py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 ${
                isSaved
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-2xl'
                  : 'bg-white/20 backdrop-blur-md text-white border-2 border-white/30 hover:bg-white/30'
              }`}
            >
              <span className="flex items-center gap-2">
                {isSaved ? '⭐ Saved' : '☆ Save'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function VisionBadgePremium() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>
      <div className="relative px-10 py-6">
        <div className="flex items-center gap-4 text-white">
          <div className="relative">
            <div className="absolute inset-0 bg-white/30 rounded-full blur-xl"></div>
            <div className="relative w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/40">
              <span className="text-3xl">👁️</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="font-black text-2xl mb-1">Vision AI Analysis</div>
            <div className="text-lg text-white/80">Our AI actually watched this video frame by frame to understand what makes it viral</div>
          </div>
          <div className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
            <div className="text-sm font-semibold text-white/70">Powered by</div>
            <div className="text-xl font-black">Claude 4 Sonnet</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KeyMetricsPremium({ viralScore, structured }) {
  const metrics = [
    {
      icon: '🎯',
      label: 'Replication Score',
      value: structured?.replicationScore || viralScore,
      max: 10,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      description: getReplicationDesc(structured?.replicationScore || viralScore)
    },
    {
      icon: '⚡',
      label: 'Difficulty',
      value: structured?.difficulty || 5,
      max: 10,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      description: getDifficultyDesc(structured?.difficulty || 5)
    },
    {
      icon: '💰',
      label: 'Budget Needed',
      value: `$${structured?.budget || 50}`,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
      description: getBudgetDesc(structured?.budget || 50)
    },
    {
      icon: '✅',
      label: 'Beginner Friendly',
      value: structured?.canBeginneerDoIt === 'yes' ? 'YES' : 
             structured?.canBeginneerDoIt === 'no' ? 'NO' : 'MAYBE',
      gradient: structured?.canBeginneerDoIt === 'yes' ? 'from-green-500 to-emerald-500' : 
                structured?.canBeginneerDoIt === 'no' ? 'from-red-500 to-pink-500' : 'from-yellow-500 to-orange-500',
      bgGradient: structured?.canBeginneerDoIt === 'yes' ? 'from-green-50 to-emerald-50' : 
                  structured?.canBeginneerDoIt === 'no' ? 'from-red-50 to-pink-50' : 'from-yellow-50 to-orange-50',
      description: getBeginnerDesc(structured?.canBeginneerDoIt)
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-10 bg-gradient-to-br from-gray-50 to-white">
      {metrics.map((metric, i) => (
        <MetricCardPremium key={i} {...metric} />
      ))}
    </div>
  );
}

function MetricCardPremium({ icon, label, value, max, gradient, bgGradient, description }) {
  return (
    <div className="group relative">
      {/* 发光效果 */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition duration-500`}></div>
      
      {/* 卡片本身 */}
      <div className={`relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2 border border-gray-100`}>
        
        {/* 图标 */}
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-3xl shadow-lg transform group-hover:scale-110 transition-transform`}>
            {icon}
          </div>
          <div className="flex-1">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</div>
            <div className="text-4xl font-black text-gray-900">{value}</div>
          </div>
        </div>
        
        {/* 进度条 */}
        {max && typeof value === 'number' && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-3 rounded-full bg-gradient-to-r ${gradient} transition-all duration-1000 ease-out`}
                style={{ width: `${(value / max) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* 描述 */}
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function TabNavigationPremium({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'overview', label: 'Quick Overview', icon: '📊', desc: '3-min read' },
    { id: 'breakdown', label: 'Deep Dive', icon: '🔍', desc: 'Full analysis' },
    { id: 'replicate', label: 'Replicate Now', icon: '🎬', desc: 'Get script' }
  ];

  return (
    <div className="bg-white border-y border-gray-100 sticky top-0 z-20 shadow-sm backdrop-blur-lg bg-white/95">
      <div className="flex">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-8 py-6 font-bold text-center transition-all relative group ${
              activeTab === tab.id
                ? 'text-purple-600'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {/* 选中指示器 */}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-pink-600"></div>
            )}
            
            <div className="flex items-center justify-center gap-3 mb-1">
              <span className="text-2xl">{tab.icon}</span>
              <span className="text-lg">{tab.label}</span>
            </div>
            <div className={`text-xs ${activeTab === tab.id ? 'text-purple-500' : 'text-gray-400'}`}>
              {tab.desc}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function OverviewTabPremium({ analysis, result, viralScore, setActiveTab }) {
  const sections = parseAnalysisText(analysis.fullText || '');
  
  return (
    <div className="space-y-8">
      
      {/* 核心判断 - 超级精美 */}
      <div className={`relative overflow-hidden rounded-3xl p-10 border-4 ${
        viralScore >= 8 ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-400' :
        viralScore >= 6 ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-400' :
        'bg-gradient-to-br from-orange-50 to-red-50 border-orange-400'
      }`}>
        
        {/* 背景装饰 */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/50 rounded-full blur-3xl -mr-32 -mt-32"></div>
        
        <div className="relative flex items-center gap-6">
          <div className="text-8xl animate-bounce">
            {viralScore >= 8 ? '🔥' : viralScore >= 6 ? '👍' : '🤔'}
          </div>
          <div className="flex-1">
            <h3 className="text-4xl font-black text-gray-900 mb-3">
              {viralScore >= 8 ? '🎯 COPY THIS NOW!' :
               viralScore >= 6 ? '👌 Worth Trying' :
               '🤷 Maybe Skip This One'}
            </h3>
            <p className="text-xl text-gray-700 leading-relaxed">
              {viralScore >= 8 ? 'Extremely high replication potential. This format has been proven to work repeatedly. Start filming today!' :
               viralScore >= 6 ? 'Decent format with good potential. May need some adaptation to your specific niche.' :
               'Complex setup or lower replication score. Consider easier targets unless you have specific reasons to replicate this.'}
            </p>
          </div>
        </div>
      </div>

      {/* 3秒总结 - 精美卡片 */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-8 border-2 border-purple-200">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-4 left-4 w-32 h-32 bg-purple-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-4 right-4 w-32 h-32 bg-pink-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative">
          <h3 className="text-3xl font-black text-gray-900 mb-6 flex items-center gap-3">
            <span className="text-4xl">⚡</span>
            3-Second Summary
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-200">
              <div className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">Format</div>
              <div className="text-xl font-black text-gray-900">
                {analysis.contentType || 'Product Review / Tutorial'}
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-200">
              <div className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">Best For</div>
              <div className="text-xl font-black text-gray-900">
                {analysis.category || 'E-commerce / Info Products'}
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-200">
              <div className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">Time to Film</div>
              <div className="text-xl font-black text-gray-900">1-2 hours</div>
            </div>
          </div>
        </div>
      </div>

      {/* 其他部分保持类似的精美风格... */}
      {sections.successFactors && (
        <ContentBlockPremium
          title="Why This Video Went Viral"
          icon="🎯"
          content={sections.successFactors}
          gradient="from-blue-500 to-indigo-600"
        />
      )}

      {sections.replicableElements && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border-2 border-blue-200">
          <h3 className="text-3xl font-black text-gray-900 mb-6 flex items-center gap-3">
            <span className="text-4xl">✨</span>
            What You Can Replicate
          </h3>
          <div className="space-y-4">
            {sections.replicableElements.split('\n\n').filter(e => e.trim()).map((element, i) => (
              <div key={i} className="flex items-start gap-4 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-200 hover:shadow-lg transition-shadow">
                <span className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">
                  {i + 1}
                </span>
                <p className="text-gray-700 text-lg leading-relaxed">{element}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="text-center py-8">
        <p className="text-gray-600 text-xl mb-6">Ready to create your version?</p>
        <button 
          onClick={() => setActiveTab('replicate')}
          className="group relative px-12 py-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-2xl font-black rounded-2xl hover:shadow-2xl transition-all transform hover:scale-105"
        >
          <span className="relative z-10">Get Your Custom Script →</span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>
      </div>
    </div>
  );
}

function ContentBlockPremium({ title, icon, content, gradient }) {
  return (
    <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 hover:border-gray-300 transition-colors shadow-lg hover:shadow-xl">
      <h3 className="text-3xl font-black text-gray-900 mb-6 flex items-center gap-3">
        <span className={`text-4xl`}>{icon}</span>
        {title}
      </h3>
      <div className="prose prose-lg max-w-none">
        <div className="whitespace-pre-line text-gray-700 leading-relaxed text-lg">
          {content}
        </div>
      </div>
    </div>
  );
}

function BreakdownTabPremium({ analysis, result }) {
  return (
    <div className="space-y-8">
      {analysis.fullText && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 border-2 border-indigo-200">
          <h3 className="text-3xl font-black text-gray-900 mb-6 flex items-center gap-3">
            <span className="text-4xl">📋</span>
            Complete AI Analysis
          </h3>
          <div className="bg-white rounded-2xl p-8 max-h-[600px] overflow-y-auto border border-indigo-200 shadow-inner">
            <pre className="whitespace-pre-wrap text-base leading-relaxed text-gray-700 font-sans">
              {analysis.fullText}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

function ReplicateTabPremium({ analysis, result, scriptProduct, setScriptProduct, onGenerateScript, copiedScript, setCopiedScript, copiedChecklist, setCopiedChecklist }) {
  const script = generateQuickScript(result, analysis, scriptProduct);
  const checklist = generateChecklist(result, analysis);

  const copyToClipboard = (text, setterFn) => {
    navigator.clipboard.writeText(text);
    setterFn(true);
    setTimeout(() => setterFn(false), 2000);
  };

  return (
    <div className="space-y-8">
      
      {/* 3步指南 - 超级精美 */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border-2 border-purple-200">
        <h3 className="text-3xl font-black text-gray-900 mb-8 text-center">
          🚀 3 Steps to Replicate This Video
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: 1, icon: '📝', title: 'Get Script', desc: 'Customize it for your product below' },
            { step: 2, icon: '🎬', title: 'Film It', desc: 'Follow the checklist, takes 1-2 hours' },
            { step: 3, icon: '💰', title: 'Post & Earn', desc: 'Add your affiliate links, watch it grow' }
          ].map((item) => (
            <div key={item.step} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
              <div className="relative bg-white rounded-2xl p-8 text-center transform group-hover:-translate-y-2 transition-transform shadow-lg">
                <div className="text-6xl mb-4">{item.icon}</div>
                <div className="text-sm font-bold text-purple-600 mb-2">Step {item.step}</div>
                <div className="text-xl font-black text-gray-900 mb-2">{item.title}</div>
                <div className="text-sm text-gray-600">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 脚本生成器 - 精美版 */}
      <div className="bg-white rounded-3xl p-10 border-2 border-gray-200 shadow-xl">
        <h3 className="text-3xl font-black text-gray-900 mb-6">
          📝 Your Custom Script
        </h3>
        
        <div className="mb-8">
          <label className="block text-lg font-bold text-gray-700 mb-3">
            What product will you promote? (optional)
          </label>
          <input
            type="text"
            value={scriptProduct}
            onChange={(e) => setScriptProduct(e.target.value)}
            placeholder="e.g., Vitamin C Serum, iPhone Case, Protein Powder..."
            className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-400 focus:border-transparent transition"
          />
        </div>

        <div className="bg-gray-50 rounded-2xl p-8 mb-6 max-h-96 overflow-y-auto border-2 border-gray-200">
          <pre className="whitespace-pre-line text-base leading-relaxed font-mono text-gray-800">
            {script}
          </pre>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => copyToClipboard(script, setCopiedScript)}
            className="flex-1 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:shadow-2xl transition-all font-bold text-lg transform hover:scale-105"
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
            className="px-8 py-4 bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 transition font-bold text-lg"
          >
            💾 Download
          </button>
        </div>
      </div>

      {/* 拍摄清单 - 精美版 */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-10 border-2 border-green-300 shadow-xl">
        <h3 className="text-3xl font-black text-gray-900 mb-6">
          ✅ Filming Checklist
        </h3>
        
        <div className="bg-white rounded-2xl p-8 mb-6 border-2 border-green-200">
          <pre className="whitespace-pre-line text-base leading-relaxed font-sans text-gray-700">
            {checklist}
          </pre>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => copyToClipboard(checklist, setCopiedChecklist)}
            className="flex-1 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl hover:shadow-2xl transition-all font-bold text-lg transform hover:scale-105"
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
            className="px-8 py-4 bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 transition font-bold text-lg"
          >
            💾 Download
          </button>
        </div>
      </div>
    </div>
  );
}

function BottomCTAPremium({ result, viralScore }) {
  if (viralScore < 6) return null;
  
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 p-12 text-center text-white">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-yellow-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-pink-400 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative">
        <h3 className="text-4xl font-black mb-4">
          {viralScore >= 8 ? '🔥 This Format Is Pure Gold!' : '👍 Definitely Worth Trying!'}
        </h3>
        <p className="text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
          {viralScore >= 8 
            ? 'Extremely high replication score. Dozens of creators have made serious money with this exact format. Don\'t miss out!'
            : 'Solid potential here. Customize it to your niche and you could see real results. Time to take action!'}
        </p>
        <div className="flex gap-6 justify-center">
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-5 bg-white text-purple-600 rounded-2xl font-black text-lg hover:shadow-2xl transition-all transform hover:scale-105"
          >
            Watch Original Video
          </a>
          <button
            onClick={() => window.location.href = '/pricing'}
            className="px-10 py-5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-2xl font-black text-lg hover:shadow-2xl transition-all transform hover:scale-105"
          >
            Analyze More Videos
          </button>
        </div>
      </div>
    </div>
  );
}

function ErrorState({ result }) {
  return (
    <div className="bg-white rounded-3xl shadow-2xl p-16 text-center border-2 border-gray-200">
      <div className="text-8xl mb-6">😕</div>
      <h3 className="text-3xl font-black text-gray-900 mb-4">
        Analysis Incomplete
      </h3>
      <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
        We couldn't fully analyze this video. This might be due to technical issues or API limitations.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-105"
      >
        Try Again
      </button>
    </div>
  );
}

// ============ 辅助函数（保持不变）============

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
  if (score >= 8) return 'Very easy to copy - proven format that works';
  if (score >= 6) return 'Moderately easy with some adaptation needed';
  if (score >= 4) return 'Challenging but possible with effort';
  return 'Difficult to replicate - requires experience';
}

function getDifficultyDesc(score) {
  if (score <= 3) return 'Beginner friendly - you can start today';
  if (score <= 6) return 'Intermediate level - some skills needed';
  return 'Advanced - requires experience and equipment';
}

function getBudgetDesc(budget) {
  if (budget === 0) return 'Completely free! Use what you already have';
  if (budget < 50) return 'Very affordable setup - minimal investment';
  if (budget < 200) return 'Moderate investment - worth it for quality';
  return 'Significant equipment needed - pro setup';
}

function getBeginnerDesc(level) {
  if (level === 'yes') return 'Perfect for complete beginners - no experience needed';
  if (level === 'no') return 'Not recommended for beginners - build skills first';
  return 'Possible with some preparation and learning';
}

function parseAnalysisText(fullText) {
  if (!fullText) return {};
  
  const sections = {};
  const lines = fullText.split('\n');
  let currentSection = null;
  let currentContent = [];
  
  lines.forEach(line => {
    if (line.startsWith('##') || line.match(/^\*\*[^:]+:\*\*/)) {
      if (currentSection) {
        sections[currentSection] = currentContent.join('\n').trim();
      }
      currentSection = line.replace(/^##\s*/, '').replace(/\*\*/g, '').replace(/:$/, '').trim()
        .toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
      currentContent = [];
    } else if (currentSection) {
      currentContent.push(line);
    }
  });
  
  if (currentSection) {
    sections[currentSection] = currentContent.join('\n').trim();
  }
  
  return sections;
}

function generateQuickScript(result, analysis, product) {
  const productName = product || '[YOUR PRODUCT]';
  
  return `🎬 QUICK SCRIPT - Based on @${result.author}'s Viral Format

PRODUCT: ${productName}

🎯 HOOK (0-3 seconds):
"Wait... ${productName} actually works?"
→ Look genuinely surprised
→ Show product clearly in frame
→ Direct eye contact with camera

⚡ SETUP (3-8 seconds):
"Let me show you what happened..."
→ Hold ${productName} prominently
→ Keep it conversational and natural
→ Build curiosity

🎬 DEMO (8-15 seconds):
[Show transformation OR quick demo OR 3-day results]
→ Keep cuts tight (every 2 seconds)
→ Maintain consistent lighting and angle
→ Show clear before/after if applicable

🎉 ENDING (Last 2 seconds):
"Okay I'm actually impressed!"
→ Natural, genuine excitement
→ Product still visible in frame

---
📱 FILMING NOTES:
Camera: iPhone front-facing camera
☀️ Lighting: Natural window light (golden hour best)
👤 Framing: You on right 2/3, product on left
⏱️ Length: 15-20 seconds total
✂️ Editing: Hard cuts every 2 seconds, no fancy transitions

💰 BUDGET: ~$${analysis?.structured?.budget || 50}
⚡ DIFFICULTY: ${analysis?.structured?.difficulty || 5}/10

---
✨ Generated by TikTok Money System
📊 Analyzed from: ${result.url}`;
}

function generateChecklist(result, analysis) {
  return `✅ PROFESSIONAL FILMING CHECKLIST
Based on @${result.author}'s Viral Style

🎬 PRE-PRODUCTION
□ Script memorized (read it 5+ times out loud)
□ Product ready, charged, and clean
□ Background clean and visually simple
□ Natural light window identified
□ Phone fully charged (80%+ battery)
□ Do a test recording to check everything

📹 CAMERA SETUP
□ Front-facing camera activated
□ Set to 1080p video mode (or highest quality)
□ Rule of thirds: position yourself on right 1/3
□ Test frame composition before filming
□ Lock exposure (tap and hold on screen)
□ Ensure phone is stable (tripod recommended)

☀️ LIGHTING CHECKLIST
□ Face the window for natural light
□ Avoid harsh overhead lighting
□ Film during golden hour if possible (sunrise/sunset)
□ Check for unwanted shadows on face
□ Ensure even lighting across frame

🎥 FILMING (Minimum 3 Takes!)
□ Take 1: Practice run (get comfortable)
□ Take 2: Real attempt (give it your all)
□ Take 3: Backup (just in case)
□ Review each take before moving on

⚡ DURING FILMING
□ Hold product at chest level throughout
□ Keep product in frame the entire time
□ Maintain direct eye contact with camera
□ Use natural expressions (don't force it)
□ Keep video under 20 seconds total

✂️ EDITING CHECKLIST
□ Cut to the best takes only
□ Average 2-second shot length
□ Use hard cuts only (no fancy transitions)
□ Add text overlays (white text, bottom third)
□ Slight saturation boost for vibrancy
□ Check audio levels (clear and balanced)
□ Export at 1080 x 1920 (vertical format)

📊 TECHNICAL SPECS
Resolution: 1080 x 1920 (9:16 ratio)
Frame Rate: 30 fps minimum
Audio: Clear with minimal background noise
Length: 15-20 seconds ideal
File Size: Under 50MB for best upload quality

✅ BEFORE POSTING
□ Watch it 3 times - does it hook within 3 seconds?
□ Show to a friend - do they understand immediately?
□ Is product clearly visible throughout?
□ Audio clear and understandable?
□ Does it feel natural and authentic?

💰 COST: $${analysis?.structured?.budget || 50}
⏱️ TIME: 1-2 hours total (including setup)

---
🚀 You got this! Follow this checklist and you'll nail it.
📅 Generated: ${new Date().toLocaleDateString()}`;
}
