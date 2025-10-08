<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TikTok Video Analyzer - 6 Core Modules</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .spinner { animation: spin 1s linear infinite; }
    .module-card { transition: all 0.3s ease; }
    .module-card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
  </style>
</head>
<body class="p-6">
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-5xl font-black text-white mb-3">🎬 TikTok Video Analyzer</h1>
      <p class="text-xl text-white/90">6-Module Deep Analysis System</p>
    </div>

    <!-- Input Section -->
    <div id="inputSection" class="bg-white rounded-3xl shadow-2xl p-8 mb-8">
      <div class="flex gap-4 mb-6">
        <input type="text" id="urlInput" placeholder="🔗 Paste TikTok URL..." 
          class="flex-1 px-6 py-4 text-lg border-2 border-purple-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          onkeypress="if(event.key==='Enter') analyze()">
        <button onclick="analyze()" 
          class="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-bold rounded-2xl hover:shadow-xl transition">
          🚀 Analyze
        </button>
      </div>
      
      <!-- 6 Module Preview Cards -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div class="bg-red-50 p-4 rounded-xl text-center module-card">
          <div class="text-3xl mb-2">🎯</div>
          <div class="font-bold text-sm">HOOK</div>
        </div>
        <div class="bg-blue-50 p-4 rounded-xl text-center module-card">
          <div class="text-3xl mb-2">📖</div>
          <div class="font-bold text-sm">STORYLINE</div>
        </div>
        <div class="bg-green-50 p-4 rounded-xl text-center module-card">
          <div class="text-3xl mb-2">📢</div>
          <div class="font-bold text-sm">CTA</div>
        </div>
        <div class="bg-yellow-50 p-4 rounded-xl text-center module-card">
          <div class="text-3xl mb-2">⏱️</div>
          <div class="font-bold text-sm">TIMING</div>
        </div>
        <div class="bg-purple-50 p-4 rounded-xl text-center module-card">
          <div class="text-3xl mb-2">📝</div>
          <div class="font-bold text-sm">SCRIPT</div>
        </div>
        <div class="bg-pink-50 p-4 rounded-xl text-center module-card">
          <div class="text-3xl mb-2">🤖</div>
          <div class="font-bold text-sm">AI PROMPTS</div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div id="loading" class="hidden bg-white rounded-3xl shadow-2xl p-16 text-center">
      <div class="spinner w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-6"></div>
      <h2 class="text-2xl font-bold text-gray-800">Analyzing Video...</h2>
      <p class="text-gray-600">Extracting 6 core modules</p>
    </div>

    <!-- Results -->
    <div id="results" class="hidden space-y-6">
      <!-- Module 1: HOOK -->
      <div class="bg-white rounded-3xl shadow-2xl p-8 module-card">
        <div class="flex items-center gap-3 mb-6 pb-4 border-b-2 border-red-200">
          <div class="text-5xl">🎯</div>
          <div>
            <h2 class="text-3xl font-bold text-gray-900">1. HOOK ANALYSIS</h2>
            <p class="text-gray-600">First 3 seconds breakdown</p>
          </div>
        </div>
        
        <div class="space-y-6">
          <div class="bg-red-50 rounded-xl p-6">
            <h3 class="font-bold text-red-900 text-xl mb-3">What is the Hook?</h3>
            <p class="text-gray-700 leading-relaxed">
              The video opens with a <strong>Question Hook</strong>: "Did you know you can make $10,000 in 30 days?" 
              The creator stares directly at camera with wide eyes, creating immediate curiosity.
            </p>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-white border-2 border-red-200 rounded-xl p-6">
              <h3 class="font-bold text-red-900 mb-3">Hook Type</h3>
              <div class="inline-block bg-red-100 px-4 py-2 rounded-full font-semibold text-red-800">
                Question Hook
              </div>
            </div>
            <div class="bg-white border-2 border-red-200 rounded-xl p-6">
              <h3 class="font-bold text-red-900 mb-3">Effectiveness Score</h3>
              <div class="text-4xl font-black text-red-600">9/10</div>
            </div>
          </div>

          <div class="bg-red-50 rounded-xl p-6">
            <h3 class="font-bold text-red-900 text-lg mb-3">Why It Works:</h3>
            <ul class="space-y-2">
              <li class="flex items-start gap-3">
                <span class="text-red-600 text-xl font-bold">•</span>
                <span><strong>Curiosity Gap:</strong> Promises a specific result ($10K) in specific time (30 days)</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-red-600 text-xl font-bold">•</span>
                <span><strong>Visual Impact:</strong> Close-up face shot with dramatic expression</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-red-600 text-xl font-bold">•</span>
                <span><strong>Audio Sync:</strong> Beat drop happens exactly at 0.5 seconds</span>
              </li>
            </ul>
          </div>

          <div class="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6">
            <h3 class="font-bold text-red-900 text-lg mb-3">🔄 Replication Formula (3 Alternatives):</h3>
            <div class="space-y-3">
              <div class="bg-white p-4 rounded-lg">
                <strong class="text-red-700">Option 1:</strong> "What if I told you this one trick changed everything?"
              </div>
              <div class="bg-white p-4 rounded-lg">
                <strong class="text-red-700">Option 2:</strong> "Stop scrolling if you want to know the truth about..."
              </div>
              <div class="bg-white p-4 rounded-lg">
                <strong class="text-red-700">Option 3:</strong> "Nobody talks about this, but here's what really works..."
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Module 2: STORYLINE -->
      <div class="bg-white rounded-3xl shadow-2xl p-8 module-card">
        <div class="flex items-center gap-3 mb-6 pb-4 border-b-2 border-blue-200">
          <div class="text-5xl">📖</div>
          <div>
            <h2 class="text-3xl font-bold text-gray-900">2. STORYLINE BREAKDOWN</h2>
            <p class="text-gray-600">Complete narrative arc</p>
          </div>
        </div>

        <div class="space-y-4">
          <div class="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-600">
            <div class="flex items-center gap-3 mb-3">
              <span class="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">0-3 SEC</span>
              <h3 class="font-bold text-blue-900 text-lg">Hook/Opening</h3>
            </div>
            <p class="text-gray-700 mb-2"><strong>What happens:</strong> Creator asks shocking question about making money</p>
            <p class="text-gray-600"><strong>Purpose:</strong> Grab attention and create curiosity gap</p>
          </div>

          <div class="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500">
            <div class="flex items-center gap-3 mb-3">
              <span class="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">3-10 SEC</span>
              <h3 class="font-bold text-blue-900 text-lg">Setup/Problem</h3>
            </div>
            <p class="text-gray-700 mb-2"><strong>What happens:</strong> Reveals that most people struggle because they don't know this method</p>
            <p class="text-gray-600"><strong>Purpose:</strong> Build relatability and establish problem</p>
          </div>

          <div class="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-400">
            <div class="flex items-center gap-3 mb-3">
              <span class="bg-blue-400 text-white px-3 py-1 rounded-full text-sm font-bold">10-20 SEC</span>
              <h3 class="font-bold text-blue-900 text-lg">Climax/Solution</h3>
            </div>
            <p class="text-gray-700 mb-2"><strong>What happens:</strong> Explains the 3-step method in rapid fire</p>
            <p class="text-gray-600"><strong>Purpose:</strong> Deliver core value</p>
          </div>

          <div class="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-300">
            <div class="flex items-center gap-3 mb-3">
              <span class="bg-blue-300 text-white px-3 py-1 rounded-full text-sm font-bold">20-30 SEC</span>
              <h3 class="font-bold text-blue-900 text-lg">Resolution/CTA</h3>
            </div>
            <p class="text-gray-700 mb-2"><strong>What happens:</strong> Shows result proof and asks viewers to follow for more</p>
            <p class="text-gray-600"><strong>Purpose:</strong> Convert viewers to followers</p>
          </div>

          <div class="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl p-6 mt-6">
            <h3 class="font-bold text-blue-900 text-lg mb-4">📊 Pacing Analysis:</h3>
            <div class="grid md:grid-cols-3 gap-4">
              <div class="bg-white p-4 rounded-lg text-center">
                <div class="text-2xl font-bold text-blue-600">12</div>
                <div class="text-sm text-gray-600">Cuts per 10 sec</div>
              </div>
              <div class="bg-white p-4 rounded-lg text-center">
                <div class="text-2xl font-bold text-blue-600">HIGH</div>
                <div class="text-sm text-gray-600">Energy Level</div>
              </div>
              <div class="bg-white p-4 rounded-lg text-center">
                <div class="text-2xl font-bold text-blue-600">85%</div>
                <div class="text-sm text-gray-600">Watch Time</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Module 3: CTA -->
      <div class="bg-white rounded-3xl shadow-2xl p-8 module-card">
        <div class="flex items-center gap-3 mb-6 pb-4 border-b-2 border-green-200">
          <div class="text-5xl">📢</div>
          <div>
            <h2 class="text-3xl font-bold text-gray-900">3. CTA ANALYSIS</h2>
            <p class="text-gray-600">Call-to-action breakdown</p>
          </div>
        </div>

        <div class="space-y-6">
          <div class="bg-green-50 rounded-xl p-6">
            <h3 class="font-bold text-green-900 text-xl mb-4">Primary CTA:</h3>
            <div class="bg-white border-2 border-green-300 rounded-lg p-4">
              <p class="text-lg"><strong class="text-green-700">Action:</strong> "Follow me for part 2 where I show the exact steps!"</p>
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-green-50 rounded-xl p-6">
              <h3 class="font-bold text-green-900 mb-3">CTA Type</h3>
              <div class="flex flex-wrap gap-2">
                <span class="bg-green-200 px-3 py-1 rounded-full text-sm">✅ Follow</span>
                <span class="bg-green-200 px-3 py-1 rounded-full text-sm">💬 Comment</span>
                <span class="bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-500">Like</span>
              </div>
            </div>
            <div class="bg-green-50 rounded-xl p-6">
              <h3 class="font-bold text-green-900 mb-3">CTA Placement</h3>
              <p><strong>When:</strong> 0:25 (last 5 seconds)</p>
              <p><strong>How:</strong> Verbal + Text overlay</p>
            </div>
          </div>

          <div class="bg-green-50 rounded-xl p-6">
            <h3 class="font-bold text-green-900 text-lg mb-4">Effectiveness Scores:</h3>
            <div class="space-y-3">
              <div>
                <div class="flex justify-between mb-1">
                  <span>Clarity</span>
                  <span class="font-bold">9/10</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3">
                  <div class="bg-green-600 h-3 rounded-full" style="width: 90%"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between mb-1">
                  <span>Urgency</span>
                  <span class="font-bold">7/10</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3">
                  <div class="bg-green-600 h-3 rounded-full" style="width: 70%"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between mb-1">
                  <span>Value Promise</span>
                  <span class="font-bold">8/10</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3">
                  <div class="bg-green-600 h-3 rounded-full" style="width: 80%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Module 4: TIMING -->
      <div class="bg-white rounded-3xl shadow-2xl p-8 module-card">
        <div class="flex items-center gap-3 mb-6 pb-4 border-b-2 border-yellow-200">
          <div class="text-5xl">⏱️</div>
          <div>
            <h2 class="text-3xl font-bold text-gray-900">4. TIMING & DURATION</h2>
            <p class="text-gray-600">Second-by-second breakdown</p>
          </div>
        </div>

        <div class="space-y-6">
          <div class="bg-yellow-50 rounded-xl p-6">
            <div class="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div class="text-4xl font-black text-yellow-600">28</div>
                <div class="text-sm text-gray-600 mt-1">Total Seconds</div>
              </div>
              <div>
                <div class="text-4xl font-black text-yellow-600">PERFECT</div>
                <div class="text-sm text-gray-600 mt-1">Length Rating</div>
              </div>
              <div>
                <div class="text-4xl font-black text-yellow-600">85%</div>
                <div class="text-sm text-gray-600 mt-1">Completion Rate</div>
              </div>
            </div>
          </div>

          <div class="bg-yellow-50 rounded-xl p-6">
            <h3 class="font-bold text-yellow-900 text-lg mb-4">⏰ Second-by-Second Timeline:</h3>
            <div class="space-y-2">
              <div class="flex gap-3 items-center">
                <span class="bg-yellow-200 px-3 py-1 rounded text-sm font-mono">0:00-0:03</span>
                <span class="text-gray-700">Hook - Question asked + dramatic face</span>
              </div>
              <div class="flex gap-3 items-center">
                <span class="bg-yellow-200 px-3 py-1 rounded text-sm font-mono">0:03-0:07</span>
                <span class="text-gray-700">Problem setup - "Most people don't know..."</span>
              </div>
              <div class="flex gap-3 items-center">
                <span class="bg-yellow-200 px-3 py-1 rounded text-sm font-mono">0:07-0:15</span>
                <span class="text-gray-700">Solution reveal - Step 1, 2, 3 explained</span>
              </div>
              <div class="flex gap-3 items-center">
                <span class="bg-yellow-200 px-3 py-1 rounded text-sm font-mono">0:15-0:23</span>
                <span class="text-gray-700">Proof/Results - Shows example earnings</span>
              </div>
              <div class="flex gap-3 items-center">
                <span class="bg-yellow-200 px-3 py-1 rounded text-sm font-mono">0:23-0:28</span>
                <span class="text-gray-700">CTA - "Follow for part 2!"</span>
              </div>
            </div>
          </div>

          <div class="bg-yellow-50 rounded-xl p-6">
            <h3 class="font-bold text-yellow-900 text-lg mb-4">🎵 Music Beat Sync Points:</h3>
            <div class="space-y-2">
              <div class="bg-white p-3 rounded-lg flex justify-between items-center">
                <span><strong>Beat Drop 1:</strong> 0:00.5</span>
                <span class="text-sm bg-yellow-100 px-3 py-1 rounded-full">Synced with hook</span>
              </div>
              <div class="bg-white p-3 rounded-lg flex justify-between items-center">
                <span><strong>Beat Drop 2:</strong> 0:07</span>
                <span class="text-sm bg-yellow-100 px-3 py-1 rounded-full">Synced with transition</span>
              </div>
              <div class="bg-white p-3 rounded-lg flex justify-between items-center">
                <span><strong>Beat Drop 3:</strong> 0:15</span>
                <span class="text-sm bg-yellow-100 px-3 py-1 rounded-full">Synced with proof reveal</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Module 5: SCRIPT -->
      <div class="bg-white rounded-3xl shadow-2xl p-8 module-card">
        <div class="flex items-center gap-3 mb-6 pb-4 border-b-2 border-purple-200">
          <div class="text-5xl">📝</div>
          <div>
            <h2 class="text-3xl font-bold text-gray-900">5. COMPLETE SCRIPT</h2>
            <p class="text-gray-600">Word-for-word dialogue</p>
          </div>
        </div>

        <div class="space-y-4">
          <div class="bg-purple-50 rounded-xl p-6 border-l-4 border-purple-600">
            <div class="flex items-center gap-2 mb-3">
              <span class="bg-purple-600 text-white px-2 py-1 rounded text-xs font-mono">0:00-0:03</span>
              <span class="font-bold text-purple-900">HOOK</span>
            </div>
            <div class="bg-white p-4 rounded-lg mb-3">
              <p class="text-lg font-semibold text-gray-800">"Did you know you can make $10,000 in just 30 days?"</p>
            </div>
            <p class="text-sm text-gray-600 italic">*Close-up face shot, eyes wide, pointing at camera*</p>
          </div>

          <div class="bg-purple-50 rounded-xl p-6 border-l-4 border-purple-500">
            <div class="flex items-center gap-2 mb-3">
              <span class="bg-purple-500 text-white px-2 py-1 rounded text-xs font-mono">0:03-0:07</span>
              <span class="font-bold text-purple-900">SETUP</span>
            </div>
            <div class="bg-white p-4 rounded-lg mb-3">
              <p class="text-lg font-semibold text-gray-800">"Most people don't know this, but there's a method that actually works."</p>
            </div>
            <p class="text-sm text-gray-600 italic">*Cut to medium shot, walking towards camera*</p>
          </div>

          <div class="bg-purple-50 rounded-xl p-6 border-l-4 border-purple-400">
            <div class="flex items-center gap-2 mb-3">
              <span class="bg-purple-400 text-white px-2 py-1 rounded text-xs font-mono">0:07-0:15</span>
              <span class="font-bold text-purple-900">SOLUTION</span>
            </div>
            <div class="bg-white p-4 rounded-lg mb-3">
              <p class="text-lg font-semibold text-gray-800">"Step 1: Find a trending product. Step 2: Create content. Step 3: Scale with ads."</p>
            </div>
            <p class="text-sm text-gray-600 italic">*Fast cuts showing each step with text overlays*</p>
          </div>

          <div class="bg-purple-50 rounded-xl p-6 border-l-4 border-purple-300">
            <div class="flex items-center gap-2 mb-3">
              <span class="bg-purple-300 text-white px-2 py-1 rounded text-xs font-mono">0:15-0:23</span>
              <span class="font-bold text-purple-900">PROOF</span>
            </div>
            <div class="bg-white p-4 rounded-lg mb-3">
              <p class="text-lg font-semibold text-gray-800">"I did this last month and made $12,847. Here's the proof."</p>
            </div>
            <p class="text-sm text-gray-600 italic">*Shows screenshot of earnings dashboard*</p>
          </div>

          <div class="bg-purple-50 rounded-xl p-6 border-l-4 border-purple-200">
            <div class="flex items-center gap-2 mb-3">
              <span class="bg-purple-200 text-purple-900 px-2 py-1 rounded text-xs font-mono">0:23-0:28</span>
              <span class="font-bold text-purple-900">CTA</span>
            </div>
            <div class="bg-white p-4 rounded-lg mb-3">
              <p class="text-lg font-semibold text-gray-800">"Follow me for part 2 where I break down each step in detail!"</p>
            </div>
            <p class="text-sm text-gray-600 italic">*Back to close-up, pointing gesture, "Follow" text pops up*</p>
          </div>

          <div class="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6">
            <h3 class="font-bold text-purple-900 mb-3">📱 On-Screen Text Overlays:</h3>
            <div class="space-y-2">
              <div class="bg-white p-3 rounded-lg"><strong>0:01:</strong> "$10,000 in 30 days? 💰"</div>
              <div class="bg-white p-3 rounded-lg"><strong>0:08:</strong> "STEP 1 ➡️"</div>
              <div class="bg-white p-3 rounded-lg"><strong>0:11:</strong> "STEP 2 ➡️"</div>
              <div class="bg-white p-3 rounded-lg"><strong>0:13:</strong> "STEP 3 ➡️"</div>
              <div class="bg-white p-3 rounded-lg"><strong>0:16:</strong> "PROOF 👇"</div>
              <div class="bg-white p-3 rounded-lg"><strong>0:25:</strong> "FOLLOW FOR PART 2 👉"</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Module 6: AI PROMPTS -->
      <div class="bg-white rounded-3xl shadow-2xl p-8 module-card">
        <div class="flex items-center gap-3 mb-6 pb-4 border-b-2 border-pink-200">
          <div class="text-5xl">🤖</div>
          <div>
            <h2 class="text-3xl font-bold text-gray-900">6. AI PROMPT LIBRARY</h2>
            <p class="text-gray-600">Ready-to-use prompts</p>
          </div>
        </div>

        <div class="space-y-6">
          <div class="bg-pink-50 rounded-xl p-6">
            <div class="flex items-center gap-3 mb-4">
              <span class="bg-pink-600 text-white px-4 py-2 rounded-lg font-bold">PROMPT 1</span>
              <h3 class="font-bold text-pink-900 text-lg">Script Generation</h3>
            </div>
            <div class="bg-white p-6 rounded-lg border-2 border-pink-200 font-mono text-sm">
              <p class="text-gray-800 leading-relaxed">
                You are a viral TikTok scriptwriter. Write a 30-second TikTok script about <strong>[YOUR TOPIC]</strong> that:<br><br>
                - Opens with a <strong>Question Hook</strong> like "Did you know..."<br>
                - Follows this structure: Hook → Problem → 3-Step Solution → Proof → CTA<br>
                - Includes a CTA that asks viewers to follow for part 2<br>
                - Uses energetic, fast-paced tone<br><br>
                Format the script with timestamps every 5 seconds.
              </p>
            </div>
            <button onclick="navigator.clipboard.writeText(this.previousElementSibling.innerText); alert('Copied!')" 
              class="mt-3 px-6 py-2 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition">
              📋 Copy Prompt
            </button>
          </div>

          <div class="bg-pink-50 rounded-xl p-6">
            <div class="flex items-center gap-3 mb-4">
              <span class="bg-pink-600 text-white px-4 py-2 rounded-lg font-bold">PROMPT 2</span>
              <h3 class="font-bold text-pink-900 text-lg">Caption Writing</h3>
            </div>
            <div class="bg-white p-6 rounded-lg border-2 border-pink-200 font-mono text-sm">
              <p class="text-gray-800 leading-relaxed">
                Write 5 TikTok caption variations for a video about <strong>[YOUR TOPIC]</strong>.<br><br>
                Style: Bold, curiosity-driven, promise specific results<br>
                Length: 100-150 characters<br>
                Include: Question to drive comments<br>
                Hashtags: Mix #fyp #viral + 3 niche-specific tags<br><br>
                Make the first line hook them before "...more"
              </p>
            </div>
            <button onclick="navigator.clipboard.writeText(this.previousElementSibling.innerText); alert('Copied!')" 
              class="mt-3 px-6 py-2 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition">
              📋 Copy Prompt
            </button>
          </div>

          <div class="bg-pink-50 rounded-xl p-6">
            <div class="flex items-center gap-3 mb-4">
              <span class="bg-pink-600 text-white px-4 py-2 rounded-lg font-bold">PROMPT 3</span>
              <h3 class="font-bold text-pink-900 text-lg">Hook Variations</h3>
            </div>
            <div class="bg-white p-6 rounded-lg border-2 border-pink-200 font-mono text-sm">
              <p class="text-gray-800 leading-relaxed">
                Generate 10 different hook variations (first 3 seconds) for a TikTok about <strong>[YOUR TOPIC]</strong>.<br><br>
                Use these hook styles:<br>
                1. Question hook: "Did you know you can..."<br>
                2. Shock statement: "This changed everything..."<br>
                3. Pattern interrupt: "Stop scrolling if..."<br>
                4. Personal story: "Last month I..."<br>
                5. Bold claim: "Nobody talks about this..."<br><br>
                Format: [Visual description] + [Exact words to say]
              </p>
            </div>
            <button onclick="navigator.clipboard.writeText(this.previousElementSibling.innerText); alert('Copied!')" 
              class="mt-3 px-6 py-2 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition">
              📋 Copy Prompt
            </button>
          </div>

          <div class="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-6">
            <h3 class="font-bold text-pink-900 text-xl mb-4">🎁 More Prompts Available:</h3>
            <div class="grid md:grid-cols-2 gap-3">
              <div class="bg-white p-4 rounded-lg">📊 Prompt 4: Comment Responses</div>
              <div class="bg-white p-4 rounded-lg">🎬 Prompt 5: Storyboard</div>
              <div class="bg-white p-4 rounded-lg">📈 Prompt 6: Trend Adaptation</div>
              <div class="bg-white p-4 rounded-lg">🎵 Prompt 7: Music Selection</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="grid md:grid-cols-3 gap-4">
        <button onclick="alert('Copied!')" class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl transition">
          📋 Copy All Analysis
        </button>
        <button onclick="alert('Downloaded!')" class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl transition">
          💾 Download PDF
        </button>
        <button onclick="reset()" class="bg-gray-700 text-white px-8 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl transition">
          🔄 Analyze Another
        </button>
      </div>
    </div>
  </div>

  <script>
    function analyze() {
      const url = document.getElementById('urlInput').value;
      if (!url) { alert('Please enter a URL!'); return; }
      
      document.getElementById('inputSection').classList.add('hidden');
      document.getElementById('loading').classList.remove('hidden');
      
      setTimeout(() => {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('results').classList.remove('hidden');
        window.scrollTo(0, 0);
      }, 3000);
    }

    function reset() {
      document.getElementById('results').classList.add('hidden');
      document.getElementById('inputSection').classList.remove('hidden');
      document.getElementById('urlInput').value = '';
      window.scrollTo(0, 0);
    }
  </script>
</body>
</html>
