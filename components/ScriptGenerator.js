import { useState } from 'react';

export default function ScriptGenerator({ analysisData, result }) {
  const [loading, setLoading] = useState(false);
  const [generatedScript, setGeneratedScript] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    productName: '',
    productDescription: '',
    targetAudience: 'Women 25-35',
    uniqueSellingPoint: '',
    videoLength: '15',
    tone: 'Authentic UGC'
  });

  const handleGenerate = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysisData,
          ...formData
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setGeneratedScript(data.script);
      } else {
        alert('Failed to generate script: ' + data.error);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadScript = () => {
    const content = generatedScript.fullText;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `script-${formData.productName.replace(/\s+/g, '-')}.txt`;
    a.click();
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-300">
      <h3 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
        <span className="text-3xl">🤖</span>
        AI SCRIPT GENERATOR V2
      </h3>
      
      <p className="text-gray-700 mb-6">
        Generate a complete, production-ready script customized for your product
      </p>

      {!showForm && !generatedScript && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition font-bold text-lg"
        >
          Generate Custom Script
        </button>
      )}

      {showForm && !generatedScript && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              value={formData.productName}
              onChange={(e) => setFormData({...formData, productName: e.target.value})}
              placeholder="e.g., Vitamin C Serum"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Product Description *
            </label>
            <textarea
              value={formData.productDescription}
              onChange={(e) => setFormData({...formData, productDescription: e.target.value})}
              placeholder="What does your product do? What problem does it solve?"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent h-24"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Target Audience
              </label>
              <select
                value={formData.targetAudience}
                onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
              >
                <option>Women 18-24</option>
                <option>Women 25-35</option>
                <option>Women 35-50</option>
                <option>Men 18-24</option>
                <option>Men 25-35</option>
                <option>Men 35-50</option>
                <option>General audience</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Video Length
              </label>
              <select
                value={formData.videoLength}
                onChange={(e) => setFormData({...formData, videoLength: e.target.value})}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
              >
                <option value="10">10 seconds</option>
                <option value="15">15 seconds</option>
                <option value="20">20 seconds</option>
                <option value="30">30 seconds</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Unique Selling Point *
            </label>
            <input
              type="text"
              value={formData.uniqueSellingPoint}
              onChange={(e) => setFormData({...formData, uniqueSellingPoint: e.target.value})}
              placeholder="e.g., Works in 3 days, 100% natural ingredients"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Tone
            </label>
            <select
              value={formData.tone}
              onChange={(e) => setFormData({...formData, tone: e.target.value})}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
            >
              <option>Authentic UGC</option>
              <option>Educational</option>
              <option>Energetic / Hype</option>
              <option>Calm / ASMR</option>
              <option>Funny / Entertaining</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleGenerate}
              disabled={loading || !formData.productName || !formData.productDescription || !formData.uniqueSellingPoint}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition font-bold text-lg disabled:opacity-50"
            >
              {loading ? '🤖 Generating...' : '✨ Generate Script'}
            </button>
            
            <button
              onClick={() => setShowForm(false)}
              className="px-6 py-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-bold"
            >
              Cancel
            </button>
          </div>

          {loading && (
            <div className="text-center text-sm text-gray-600">
              <p>🤖 AI is analyzing the viral video and creating your custom script...</p>
              <p className="mt-2">This may take 30-60 seconds</p>
            </div>
          )}
        </div>
      )}

      {generatedScript && (
        <div className="space-y-6">
          <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-green-800">✅ Script Generated!</div>
                <div className="text-sm text-green-700">Complete production-ready script for {formData.productName}</div>
              </div>
              <button
                onClick={downloadScript}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-bold"
              >
                📥 Download
              </button>
            </div>
          </div>

          {/* Master Script */}
          <div className="bg-white rounded-xl p-6 border-2 border-indigo-200">
            <h4 className="text-xl font-bold text-gray-900 mb-3">📋 Master Script</h4>
            <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm whitespace-pre-line max-h-96 overflow-y-auto">
              {generatedScript.masterScript}
            </div>
          </div>

          {/* Shot List */}
          <div className="bg-white rounded-xl p-6 border-2 border-purple-200">
            <h4 className="text-xl font-bold text-gray-900 mb-3">🎬 Shot List</h4>
            <div className="bg-gray-50 p-4 rounded-lg text-sm whitespace-pre-line max-h-96 overflow-y-auto">
              {generatedScript.shotList}
            </div>
          </div>

          {/* Dialogue */}
          <div className="bg-white rounded-xl p-6 border-2 border-pink-200">
            <h4 className="text-xl font-bold text-gray-900 mb-3">💬 Dialogue Script</h4>
            <div className="bg-gray-50 p-4 rounded-lg text-sm whitespace-pre-line max-h-64 overflow-y-auto">
              {generatedScript.dialogueScript}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setGeneratedScript(null);
                setShowForm(false);
              }}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-bold"
            >
              Generate Another Script
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
