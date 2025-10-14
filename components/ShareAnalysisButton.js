import { useState } from 'react';

export default function ShareAnalysisButton({ result, viralScore }) {
  const [show, setShow] = useState(false);

  if (!result) return null;

  const url = typeof window !== 'undefined' ? window.location.href : '';
  const twitter = `https://twitter.com/intent/tweet?text=TikTok Analysis&url=${encodeURIComponent(url)}`;

  return (
    <div>
      <button onClick={() => setShow(true)} className="px-6 py-3 bg-blue-500 text-white rounded-xl font-bold">
        Share
      </button>

      {show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-bold">Share</h3>
              <button onClick={() => setShow(false)} className="text-2xl">×</button>
            </div>
            
            <a href={twitter} target="_blank" rel="noopener noreferrer" className="block w-full px-4 py-2 mb-2 bg-blue-500 text-white text-center rounded">
              Twitter
            </a>
            
            <button onClick={() => { navigator.clipboard.writeText(url); alert('Copied!'); }} className="w-full px-4 py-2 bg-gray-200 rounded">
              Copy Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
