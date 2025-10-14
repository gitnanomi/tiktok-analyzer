import { useState } from 'react';

export default function ShareAnalysisButton({ result, viralScore }) {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const author = result.author || 'creator';
  const views = result.views || 0;

  const handleShare = (platform) => {
    const shareCount = parseInt(localStorage.getItem('shareCount') || '0');
    localStorage.setItem('shareCount', (shareCount + 1).toString());
    
    const currentCount = parseInt(localStorage.getItem('analysisCount') || '0');
    if (currentCount > 0) {
      localStorage.setItem('analysisCount', (currentCount - 1).toString());
    }
    
    setShowModal(false);
    alert('Thanks for sharing! You earned 1 free analysis credit.');
  };

  const copyToClipboard = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTwitterUrl = () => {
    const text = `I analyzed @${author}'s viral TikTok video! Viral Score: ${viralScore}/10`;
    const url = typeof window !== 'undefined' ? window.location.href : '';
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  };

  return (
    <div>
      <button
        onClick={() => setShowModal(true)}
        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition font-bold"
        type="button"
      >
        Share Analysis
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <button
              onClick={() => setShowModal(false)}
              className="float-right text-gray-400 hover:text-gray-600 text-2xl"
              type="button"
            >
              ×
            </button>
            
            <div className="clear-both text-center mb-6">
              <div className="text-4xl mb-3">🎁</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Share and Get Rewarded
              </h3>
              <p className="text-gray-600">
                Get 1 free analysis credit
              </p>
            </div>

            <div className="space-y-3">
              
                href={getTwitterUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleShare('twitter')}
                className="block w-full px-4 py-3 bg-blue-500 text-white text-center rounded-lg hover:bg-blue-600 transition font-semibold"
              >
                Share on Twitter
              </a>

              <button
                onClick={copyToClipboard}
                className="w-full px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-semibold"
                type="button"
              >
                {copied ? 'Link Copied!' : 'Copy Link'}
              </button>
            </div>

            <div className="text-center mt-6 text-sm text-gray-500">
              1,247 people shared this week
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
