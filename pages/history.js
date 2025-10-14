import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const data = JSON.parse(localStorage.getItem('recentAnalyses') || '[]');
      setHistory(data);
    }
  }, []);

  return (
    <div>
      <Head>
        <title>Analysis History</title>
      </Head>

      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow p-8">
            <h1 className="text-3xl font-bold mb-6">Your Analysis History</h1>

            {history.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No analyses yet</p>
                <a href="/" className="text-blue-600 hover:underline">
                  Analyze your first video
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((item, i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <div className="font-bold">@{item.creator}</div>
                    <div className="text-sm text-gray-600">
                      Score: {item.score}/10
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
