import OpenAI from 'openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url, videoDescription, transcript } = req.body;

  if (!url || !url.includes('tiktok.com')) {
    return res.status(400).json({ error: 'Invalid TikTok URL' });
  }

  try {
    console.log('Analyzing TikTok video:', url);
    
    // 获取视频基础信息
    let videoData = null;
    try {
      const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
      const response = await fetch(oembedUrl);
      if (response.ok) {
        videoData = await response.json();
      }
    } catch (error) {
      console.log('oEmbed fetch failed');
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // 构建详细的分析提示词
    const analysisPrompt = `
You are an expert TikTok replication analyst. Create a PRECISE, ACTIONABLE replication blueprint for this video.

**Video URL:** ${url}
**Video Title:** ${videoData?.title || 'N/A'}
**Creator:** ${videoData?.author_name || 'Unknown'}

${videoDescription ? `**Visual Description:** ${videoDescription}` : ''}
${transcript ? `**Complete Transcript:** ${transcript}` : ''}

---

# 🎬 COMPLETE VIDEO REPLICATION BLUEPRINT

## 1️⃣ HOOK ANALYSIS (0-3 seconds)

**Exact Opening:**
${transcript ? `
- Words spoken: "${transcript.split('\n')[0] || 'N/A'}"
- Visual: ${videoDescription ? videoDescription.substring(0, 200) : 'Describe the exact first frame'}
` : 'Analyze based on typical TikTok patterns'}

**Hook Type:** [Question/Shock/Pattern Interrupt/Problem/Story]

**Why It Works:**
- Psychological trigger
- Visual impact
- Audio element
- Text overlay strategy

**Your Replication:**
Shot 1 (0:00-0:03):
- Camera: [Exact position and angle]
- You say: "[Exact words]"
- You do: [Exact action]
- Background: [What's visible]
- Lighting: [Setup]

**3 Alternative Hooks:**
1. [Option 1 - exact words + visual]
2. [Option 2 - exact words + visual]
3. [Option 3 - exact words + visual]

---

## 2️⃣ SCENE-BY-SCENE BREAKDOWN

${transcript ? `
Based on the transcript, break down into scenes:

**Scene 1 (0-7 sec):**
- Dialogue: [Extract from transcript]
- Action: [What happens]
- Camera work: [Angle, movement]
- Props needed: [List]

**Scene 2 (7-15 sec):**
- Dialogue: [Extract from transcript]
- Action: [What happens]
- Camera work: [Angle, movement]
- Props needed: [List]

**Scene 3 (15-25 sec):**
- Dialogue: [Extract from transcript]
- Action: [What happens]
- Camera work: [Angle, movement]
- Props needed: [List]
` : `
Create a detailed scene breakdown based on typical structure:
- Scene 1: Hook
- Scene 2: Setup
- Scene 3: Climax
- Scene 4: CTA
`}

---

## 3️⃣ SHOT LIST (Production Ready)

**SHOT 1 - Hook (0:00-0:03)**
📹 Camera: [Front/Back] facing, [Distance] from subject
📐 Angle: [Eye level/High/Low]
🎬 Framing: [Close-up/Medium/Wide]
💡 Lighting: [Natural/Ring light/Softbox]
🎤 Audio: [On-camera mic/Lav/Voiceover]
📝 Action: [Step-by-step what you do]
💬 Line: "${transcript ? transcript.substring(0, 100) : '[Your opening line]'}"

**SHOT 2 - Setup (0:03-0:07)**
📹 Camera: [Different angle]
📐 Angle: [Change for variety]
🎬 Framing: [Adjust composition]
💡 Lighting: [Any changes]
📝 Action: [Next action]
💬 Line: "[Next dialogue]"

[Continue for all shots...]

---

## 4️⃣ COMPLETE PRODUCTION CHECKLIST

### 📦 Props & Wardrobe
${videoDescription ? `Based on video description:
- Item 1: [Specific prop]
- Item 2: [Specific prop]
- Clothing: [Exact description]
- Accessories: [List all]
` : `
- [ ] Main props (list 3-5)
- [ ] Wardrobe details
- [ ] Accessories
`}

### 📍 Location Setup
- Primary location: [Where to film]
- Background: [What should be visible]
- Space needed: [Dimensions]
- Backup location: [Alternative]

### 💡 Lighting Setup
- Key light: [Position and type]
- Fill light: [If needed]
- Natural light: [Time of day]
- Mood: [Bright/Moody/Natural]

### 🎤 Audio Setup
- Microphone: [Type]
- Background music: [Source]
- Sound effects: [List]
- Voiceover: [If needed]

---

## 5️⃣ COMPLETE SCRIPT (Word-for-Word)

${transcript ? `
**EXACT TRANSCRIPT:**
${transcript}

**YOUR VERSION (Modified for you):**
[Provide a personalized version keeping the structure]
` : `
**ESTIMATED SCRIPT:**
[Create based on typical patterns]
`}

**ON-SCREEN TEXT:**
- 0:01 - "[Text 1]" (Position: [Top/Center/Bottom])
- 0:05 - "[Text 2]" (Position: [Top/Center/Bottom])
- 0:10 - "[Text 3]" (Position: [Top/Center/Bottom])

---

## 6️⃣ EDITING TIMELINE

**0:00-0:03** Hook
- Cut 1: [Description]
- Music: Starts at 0:00, [Song name]
- Text: "[Text content]" fades in at 0:01
- Effect: [Zoom in/Flash/None]

**0:03-0:07** Setup
- Cut 2: [Description]
- Music: Beat drop at 0:05
- Text: "[Text content]" appears at 0:06
- Transition: [Swipe/Cut/Zoom]

**0:07-0:15** Main Content
- Cut 3-5: [Multiple cuts, fast paced]
- Music: Maintains energy
- Text: Key points overlaid
- Effects: [Speed ramp/B-roll inserts]

**0:15-0:25** Resolution/CTA
- Cut 6: [Back to main shot]
- Music: Outro/Fade
- Text: "[CTA text]"
- End screen: [Your logo/Follow button]

---

## 7️⃣ FILMING SCHEDULE (Step-by-Step)

**Day 1 - Preparation:**
- [ ] Review this blueprint
- [ ] Gather all props
- [ ] Scout and prepare location
- [ ] Test lighting setup
- [ ] Memorize script/key lines

**Day 2 - Production:**
- [ ] 9:00 AM - Set up location
- [ ] 9:30 AM - Film Shot 1 (5 takes)
- [ ] 10:00 AM - Film Shot 2 (3 takes)
- [ ] 10:30 AM - Film Shot 3-5
- [ ] 11:00 AM - Film B-roll/cutaways
- [ ] 11:30 AM - Review footage

**Day 3 - Post-Production:**
- [ ] Import footage to editing software
- [ ] Rough cut following timeline above
- [ ] Add music (download from TikTok/CapCut)
- [ ] Add text overlays with exact timing
- [ ] Color grade (match original)
- [ ] Export: 1080x1920, 30fps

---

## 8️⃣ PUBLISHING STRATEGY

**Caption:**
${videoData?.title || '"[Hook from video] + [value promise] + [CTA]"'}

**Hashtags (Copy these exactly):**
#fyp #foryou #viral #trending #tiktok [+ 10 niche-specific]

**Post Time:**
- Best: 7-9 AM / 12-1 PM / 7-9 PM (your timezone)
- Day: Tuesday-Thursday for max reach

**Cover Image:**
- Select frame at 0:02 (right after hook)
- Must show: Clear face + intriguing moment

---

## 9️⃣ SUCCESS METRICS

**Track These:**
- First hour views (goal: 1,000+)
- Watch time % (goal: 70%+)
- Like rate (goal: 5%+)
- Comment rate (goal: 1%+)
- Share rate (goal: 0.3%+)

**If underperforming:**
- Try different hook (use alternatives from Section 1)
- Post at different time
- Adjust caption/hashtags
- Boost engagement in first hour

---

## 🎁 FINAL CHECKLIST

Before you start filming:
- [ ] I have watched the original video 10+ times
- [ ] I understand WHY each element works
- [ ] I have all props and equipment ready
- [ ] I have memorized the script/key points
- [ ] I have tested my filming location
- [ ] I know my unique angle/twist
- [ ] I'm ready to create!

**🚀 GO CREATE YOUR VERSION NOW!**
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",  // 使用 GPT-4 获得更好的分析
      messages: [
        {
          role: "system",
          content: "You are a professional TikTok replication expert. Create extremely detailed, shot-by-shot blueprints that anyone can follow to recreate viral videos. Be specific about every detail: camera angles, exact words, props, timing, editing. Make it actionable and precise."
        },
        {
          role: "user",
          content: analysisPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    return res.status(200).json({
      success: true,
      url: url,
      videoData: videoData,
      analysis: completion.choices[0].message.content,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(500).json({ 
      error: 'Analysis failed',
      message: error.message 
    });
  }
}
