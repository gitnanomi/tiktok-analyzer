// 在 handleAnalyze 函数中修改
const [transcript, setTranscript] = useState('');
const [description, setDescription] = useState('');

// 修改 API 调用
const response = await fetch('/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    url, 
    transcript, 
    videoDescription: description 
  }),
});

// 在界面中添加可选输入
<textarea
  value={transcript}
  onChange={(e) => setTranscript(e.target.value)}
  placeholder="📝 Optional: Paste video transcript for more accurate analysis..."
  className="w-full px-6 py-4 text-lg border-2 border-purple-300 rounded-2xl mb-4 min-h-[100px]"
/>

<textarea
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  placeholder="🎬 Optional: Describe what happens in the video (person, actions, scene)..."
  className="w-full px-6 py-4 text-lg border-2 border-purple-300 rounded-2xl mb-4 min-h-[100px]"
/>
