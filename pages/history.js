export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const analysisHistory = JSON.parse(localStorage.getItem('analysisHistory') || '[]');
    setHistory(analysisHistory.reverse()); // 最新的在前
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-black text-gray-900 mb-6">
            📊 Your Analysis History
          </h1>

          {history.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-600 text-lg">No analyses yet</p>
              <a href="/" className="text-purple-600 hover:underline mt-2 inline-block">
                Analyze your first video →
              </a>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {history.map((item, i) => (
                <div key={i} className="border-2 border-gray-200 rounded-xl p-6 hover:border-purple-300 transition">
                  <div className="flex items-start gap-4">
                    {item.thumbnail && (
                      <img src={item.thumbnail} alt="" className="w-20 h-20 rounded-lg object-cover" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">@{item.author}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">{item.description}</p>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="font-bold text-purple-600">{item.viralScore}/10</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-500">{new Date(item.analyzedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <button className="mt-4 w-full px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition font-semibold text-sm">
                    View Analysis
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
