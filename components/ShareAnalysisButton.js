import { useState } from 'react';

export default function ShareAnalysisButton({ result, viralScore }) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // ✅ 防御性检查
  if (!result) {
    return null;
  }

  const author = result.author || 'creator';
  const views = result.views || 0;
  const description = result.description || 'Viral TikTok analysis';
  const thumbnail = result.thumbnail || '';
  const resultId = result.id || `analysis-${Date.now()}`;

  const generateShareText = () => {
    return `I just analyzed @${author}'s viral TikTok video 🔥

⚡ Viral Score: ${viralScore || 9}/10
👁️ ${(views / 1000000).toFixed(1)}M views
🎯 Complete breakdown: hook, script, AI prompts

Check it out: ${typeof window !== 'undefined' ? window.location.origin : ''}/shared/${resultId}

#TikTokMarketing #ViralContent`;
  };

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(generateShareText())}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`
  };

  const copyLink = () => {
    const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/shared/${resultId}?ref=share`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Share Button */}
      <button
        onClick={() => setShowShareModal(true)}
        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition font-bold flex items-center gap-2"
      >
        <span>📤</span>
        <span>Share Analysis</span>
      </button>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
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
                Share & Get Rewarded
              </h3>
              <p className="text-gray-600">
                Share this analysis and get <span className="font-bold text-purple-600">1 free analysis credit</span>
              </p>
            </div>

            {/* Preview Card */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 mb-6 border-2 border-purple-200">
              <div className="flex items-center gap-3 mb-3">
                {thumbnail && (
                  <img src={thumbnail} alt="" className="w-16 h-16 rounded-lg object-cover" />
                )}
                {!thumbnail && (
                  <div className="w-16 h-16 rounded-lg bg-purple-200 flex items-center justify-center">
                    <span className="text-2xl">🎬</span>
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

            {/* Share Options */}
            <div className="space-y-3 mb-6">
              
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-4 py-3 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1a8cd8] transition font-semibold flex items-center justify-center gap-2"
              >
                <span>🐦</span>
                <span>Share on Twitter</span>
              </a>

              
                href={shareLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-4 py-3 bg-[#0A66C2] text-white rounded-lg hover:bg-[#004182] transition font-semibold flex items-center justify-center gap-2"
              >
                <span>💼</span>
                <span>Share on LinkedIn</span>
              </a>

              <button
                onClick={copyLink}
                className="w-full px-4 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition font-semibold flex items-center justify-center gap-2"
              >
                <span>{copied ? '✓' : '🔗'}</span>
                <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
              </button>
            </div>

            {/* Social Proof */}
            <div className="text-center text-sm text-gray-500">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span>👥</span>
                <span className="font-semibold">1,247 people</span>
                <span>shared this week</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
