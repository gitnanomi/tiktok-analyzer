export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-purple-600 mb-4">
          🎬 TikTok Creator Platform
        </h1>
        <p className="text-gray-600 mb-6">
          AI-Powered Video Analysis Tool - Now Live! 🎉
        </p>
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
          <input
            type="text"
            placeholder="Paste TikTok video URL..."
            className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none mb-4"
          />
          <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
            Analyze Video
          </button>
        </div>
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <p className="text-green-800 text-sm">
            ✅ <strong>Success!</strong> Platform deployed and running.
          </p>
        </div>
      </div>
    </div>
  )
}
