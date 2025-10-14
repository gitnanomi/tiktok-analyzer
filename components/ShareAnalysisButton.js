import { useState } from 'react';

export default function ShareAnalysisButton({ result, viralScore }) {
  const [showModal, setShowModal] = useState(false);

  if (!result) return null;

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const twitterText = `Check out this viral TikTok analysis! Score: ${viralScore}/10`;
  const twitterLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(shareUrl)}`;

  return (
    <div>
      <button
        onClick={() => setShowModal(true)}
        className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-bold"
      >
        Share Analysis
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <button
              onClick={() => setShowModal(false)}
              className="float-right text-gray-500 text-xl"
            >
              ×
            </button>
            
            <h3 className="text-xl font-bold mb-4 clear-both">Share This Analysis</h3>
            
            
              href={twitterLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-4 py-2 bg-blue-500 text-white rounded text-center mb-2 hover:bg-blue-600"
            >
              Share on Twitter
            </a>
            
            <button
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
                alert('Link copied!');
              }}
              className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Copy Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
