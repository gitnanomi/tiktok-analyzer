import { useState } from 'react';

export default function ShareAnalysisButton({ result, viralScore }) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const author = result.author || 'creator';
  const views = result.views || 0;
  const description = result.description || 'Viral TikTok analysis';
  const thumbnail = result.thumbnail || '';
  const resultId = result.id || `analysis-${Date.now()}`;

  const generateShareText = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `I just analyzed @${author}'s viral TikTok video\n\nViral Score: ${viralScore || 9}/10\nViews: ${(views / 1000000).toFixed(1)}M\n\nCheck it out: ${origin}/shared/${resultId}\n\n#TikTokMarketing #ViralContent`;
  };

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(generateShareText())}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`,
  };

  const copyLink = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const shareUrl = `${origin}/shared/${resultId}?ref=share`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareReward = () => {
    const shareCount = parseInt(localStorage.getItem('shareCount') || '0');
    localStorage.setItem('shareCount', (shareCount + 1).toString());
    
    const currentCount = parseInt(localStorage.getItem('analysisCount') || '0');
    if (currentCount > 0) {
      const newCount = Math.max(0, currentCount - 1);
      localStorage.setItem('analysisCount', newCount.toString());
    }
    
    setShowShareModal(false);
    setTimeout(() => {
      alert('Thanks for sharing! You earned 1 free analysis credit.');
    }, 500);
  };

  return (
    <div>
      <button
        onClick={() => setShowShareModal(true)}
        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition font-bold flex items-center gap-2"
      >
        <span>Share Analysis</span>
      </button>

      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>

            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🎁</div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">
                Share and Get Rewarded
              </h3>
              <p className="text-gray-600">
                Share this analysis and get <span className="font-bold text-purple-600">1 free analysis credit</span>
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 mb-6 border-2 border-purple-200">
              <div className="flex items-center gap-3 mb-3">
                {thumbnail ? (
                  <img src={thumbnail} alt="Thumbnail" className="w-16 h-16 rounded-lg object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-purple-200 flex items-center justify-center">
                    <span className="text-2xl">Video</span>
                  </div>
                )}
                <div className="flex-1">
                  <div className="font-bold text-gray-900">@{author}</div>
                  <div className="text-sm text-gray-600">{viralScore || 9}/10 Viral Score</div>
                </div>
              </div>
              <div className="text-xs text-gray-700 line-clamp-2">
                {description}
              </div>
            </div>

            <div className="space-y-3 mb-6">
              
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleShareReward}
                className="block w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold text-center"
              >
                Share on Twitter
              </a>

              
                href={shareLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleShareReward}
                className="block w-full px-4 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition font-semibold text-center"
              >
                Share on LinkedIn
              </a>

              <button
                onClick={copyLink}
                className="w-full px-4 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition font-semibold"
              >
                {copied ? 'Link Copied!' : 'Copy Link'}
              </button>
            </div>

            <div className="text-center text-sm text-gray-500">
              <p>1,247 people shared this week</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
