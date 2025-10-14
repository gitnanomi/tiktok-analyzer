import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function SharedAnalysis() {
  const router = useRouter();
  const { id } = router.query;
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    if (id) {
      // 从localStorage或API获取
      const saved = JSON.parse(localStorage.getItem('publicAnalyses') || '{}');
      setAnalysis(saved[id]);
    }
  }, [id]);

  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Analysis Not Found
          </h2>
          <a href="/" className="text-purple-600 hover:underline">
            Analyze your own video →
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>How @{analysis.author} got {(analysis.views/1000000).toFixed(1)}M views - TikTok Analysis</title>
        <meta name="description" content={`Complete viral breakdown: ${analysis.description.substring(0, 150)}...`} />
        <meta property="og:title" content={`@${analysis.author}'s Viral TikTok Strategy`} />
        <meta property="og:description" content={`${analysis.viralScore}/10 viral score • Full breakdown available`} />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🎬</div>
              <h1 className="text-3xl font-black text-gray-900 mb-2">
                @{analysis.author}'s Viral Strategy
              </h1>
              <p className="text-gray-600">
                Analyzed by TikTok Analyzer Pro • {new Date(analysis.analyzedAt).toLocaleDateString()}
              </p>
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{analysis.viralScore}/10</div>
                <div className="text-sm text-gray-600">Viral Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{(analysis.views/1000000).toFixed(1)}M</div>
                <div className="text-sm text-gray-600">Views</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{(analysis.likes/1000).toFixed(0)}K</div>
                <div className="text-sm text-gray-600">Likes</div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 text-center border-2 border-purple-200">
              <h3 className="font-bold text-gray-900 mb-2">Want the full breakdown?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get hook analysis, script templates, and AI prompts
              </p>
              
                href="/?ref=shared"
                className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition"
              >
                Analyze Your Own Video - Free
              </a>
            </div>
          </div>

          {/* Preview of Analysis (teaser) */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🎣 Hook Strategy</h2>
            <div className="text-gray-700 mb-6">
              {analysis.analysis?.hook?.summary?.substring(0, 200)}...
            </div>
            
            <div className="bg-gray-100 rounded-lg p-6 text-center">
              <p className="text-gray-600 mb-4">
                🔒 Sign up to see the complete analysis
              </p>
              
                href="/?ref=shared"
                className="inline-block px-6 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700"
              >
                Get Full Analysis
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
