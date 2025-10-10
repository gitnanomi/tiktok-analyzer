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

  return (
    <>
      <Head>
        <title>TikTok Analyzer - Viral Content Analysis</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  TikTok Analyzer
                </h1>
                <p className="text-gray-600 mt-1">
                  Reverse-engineer viral content • AI recreation prompts • Content strategy insights
                </p>
              </div>
              {results.length > 0 && (
                <button
                  onClick={exportToCSV}
                  className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition"
                >
                  Export CSV
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                placeholder="Paste TikTok URL or enter keywords..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              />
              <button
                onClick={handleAnalyze}
                disabled={loading || !input}
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Analyzing...' : 'Analyze'}
              </button>
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-8">
              {results.map((result, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  
                  {/* Video Header */}
                  <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">
                          @{result.author}
                        </h2>
                        <p className="text-gray-600 mt-1">{result.description}</p>
                      </div>
                      {result.analysis?.isAd?.toLowerCase().includes('yes') && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                          Sponsored
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Analysis Content */}
                  {result.analysis && (
                    <div className="p-6 space-y-6">
                      
                      {/* Hook */}
                      {result.analysis.hook && (
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-3">
                            🎣 Hook (First 3 Seconds)
                          </h3>
                          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
                            <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                              {result.analysis.hook}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Story Line */}
                      {result.analysis.storyLine && (
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-3">
                            📖 Story Line
                          </h3>
                          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r">
                            <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                              {result.analysis.storyLine}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* CTA */}
                      {result.analysis.cta && (
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-3">
                            👉 Call to Action (CTA)
                          </h3>
                          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r">
                            <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                              {result.analysis.cta}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Visual Elements */}
                      {result.analysis.visualElements && (
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-3">
                            🎥 Visual Elements
                          </h3>
                          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r">
                            <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                              {result.analysis.visualElements}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Success Factors */}
                      {result.analysis.successFactors && (
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-3">
                            🔥 Success Factors
                          </h3>
                          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r">
                            <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                              {result.analysis.successFactors}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* AI Prompts */}
                      {result.analysis.aiPrompts && (result.analysis.aiPrompts.midjourney || result.analysis.aiPrompts.stableDiffusion) && (
                        <div className="border-t border-gray-200 pt-6">
                          <h3 className="text-lg font-bold text-gray-900 mb-4">
                            🤖 AI Prompt Engineering
                          </h3>
                          
                          <div className="space-y-4">
                            
                            {/* Midjourney */}
                            {result.analysis.aiPrompts.midjourney && (
                              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-lg border border-purple-200">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="font-semibold text-gray-900">Midjourney/DALL-E Prompt</span>
                                  <button
                                    onClick={() => copyToClipboard(result.analysis.aiPrompts.midjourney)}
                                    className="text-sm px-4 py-1.5 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition font-medium"
                                  >
                                    Copy
                                  </button>
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-purple-200 font-mono text-sm leading-relaxed">
                                  {result.analysis.aiPrompts.midjourney}
                                </div>
                              </div>
                            )}

                            {/* Stable Diffusion */}
                            {result.analysis.aiPrompts.stableDiffusion && (
                              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-5 rounded-lg border border-blue-200">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="font-semibold text-gray-900">Stable Diffusion Prompt</span>
                                  <button
                                    onClick={() => copyToClipboard(result.analysis.aiPrompts.stableDiffusion)}
                                    className="text-sm px-4 py-1.5 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition font-medium"
                                  >
                                    Copy
                                  </button>
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-blue-200 font-mono text-sm leading-relaxed">
                                  {result.analysis.aiPrompts.stableDiffusion}
                                </div>
                              </div>
                            )}

                            {/* Product Template */}
                            {result.analysis.aiPrompts.template && (
                              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-5 rounded-lg border border-yellow-200">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="font-semibold text-gray-900">Product Swap Template</span>
                                  <button
                                    onClick={() => copyToClipboard(result.analysis.aiPrompts.template)}
                                    className="text-sm px-4 py-1.5 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition font-medium"
                                  >
                                    Copy
                                  </button>
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-yellow-200 font-mono text-sm leading-relaxed mb-3">
                                  {result.analysis.aiPrompts.template}
                                </div>
                                {result.analysis.aiPrompts.example && (
                                  <div className="text-sm text-gray-700 bg-white/50 p-3 rounded border border-yellow-100">
                                    <span className="font-semibold">Example:</span> {result.analysis.aiPrompts.example}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Replicable Elements */}
                      {result.analysis.replicableElements && (
                        <div className="border-t border-gray-200 pt-6">
                          <h3 className="text-lg font-bold text-gray-900 mb-3">
                            ⚡ Replicable Elements
                          </h3>
                          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                            <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                              {result.analysis.replicableElements}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Meta Info */}
                      <div className="border-t border-gray-200 pt-6">
                        <div className="flex flex-wrap gap-3">
                          {result.analysis.contentType && (
                            <div className="px-4 py-2 bg-gray-100 rounded-full text-sm">
                              <span className="font-semibold text-gray-700">Type:</span>{' '}
                              <span className="text-gray-600">{result.analysis.contentType}</span>
                            </div>
                          )}
                          {result.analysis.category && (
                            <div className="px-4 py-2 bg-gray-100 rounded-full text-sm">
                              <span className="font-semibold text-gray-700">Category:</span>{' '}
                              <span className="text-gray-600">{result.analysis.category}</span>
                            </div>
                          )}
                          {result.analysis.tone && (
                            <div className="px-4 py-2 bg-gray-100 rounded-full text-sm">
                              <span className="font-semibold text-gray-700">Tone:</span>{' '}
                              <span className="text-gray-600">{result.analysis.tone}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Video Link */}
                   {result.url && (
  <div className="border-t border-gray-200 pt-6">
    <a                        
      href={result.url}
      target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-medium"
                          >
                            <span>Watch on TikTok</span>
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-16 text-center">
              <div className="text-6xl mb-6">🎯</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Analyze Any TikTok Video
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Paste a video URL to get hook analysis, CTA breakdown, and AI prompts for content recreation.
              </p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-16 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mb-4"></div>
              <p className="text-gray-600 text-lg">Analyzing video...</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
