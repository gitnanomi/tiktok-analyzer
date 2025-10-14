import { useState } from 'react';

export default function ShareAnalysisButton({ result, viralScore }) {
  const [showModal, setShowModal] = useState(false);

  if (!result) return null;

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const twitterLink = `https://twitter.com/intent/tweet?text=Check out this TikTok analysis!&url=${encodeURIComponent(shareUrl)}`;

  return (
    <div>
      <button
        onClick={() => setShowModal(true)}
        className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-bold">
        Share Analysis
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Share Analysis</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl">
                ×
              </button>
            </div>
            
            <div className="space-y-3">
              
                href={twitterLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-4 py-3 bg-blue-500 text-white text-center rounded-lg hover:bg-blue-600 font-semibold">
                Share on Twitter
              </a>
              
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  alert('Link copied!');
                }}
                className="w-full px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold">
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
