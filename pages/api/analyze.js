import OpenAI from 'openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

  if (!url || !url.includes('tiktok.com')) {
    return res.status(400).json({ error: 'Invalid TikTok URL' });
  }

  try {
    console.log('Analyzing TikTok video:', url);
    
    // Get basic video info using oEmbed API
    let videoData = null;
    try {
      const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
      const response = await fetch(oembedUrl);
      if (response.ok) {
        videoData = await response.json();
      }
    } catch (error) {
      console.log('oEmbed fetch failed, continuing with URL analysis');
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Ultra-focused analysis prompt for 6 core modules
    const analysisPrompt = `
You are an expert TikTok video analyst. Analyze this TikTok video and provide a detailed breakdown in EXACTLY these 6 sections:

**TikTok Video URL:** ${url}

${videoData ? `**Video Title:** ${videoData.title || 'N/A'}
**Creator:** ${videoData.author_name || 'Unknown'}` : ''}

---

# 🎯 COMPLETE VIDEO ANALYSIS - 6 CORE MODULES

## 1️⃣ HOOK ANALYSIS

**What is the Hook?**
Describe the exact opening (first 3 seconds) of this video. What makes viewers stop scrolling?

**Hook Type:**
Identify which type: Question Hook / Shock Hook / Pattern Interrupt / Problem Statement / Bold Claim / Story Opening

**Why It Works:**
- Psychological trigger used (curiosity/fear/desire/FOMO)
- Visual element that grabs attention
- Audio element (music/sound effect/voice tone)
- Text overlay strategy (if any)

**Hook Effectiveness Score:** X/10

**Replication Formula:**
Provide 3 alternative hook variations for this same concept:
1. [Hook Option 1]
2. [Hook Option 2]
3. [Hook Option 3]

---

## 2️⃣ STORYLINE BREAKDOWN

**Story Structure:**
Map out the complete narrative arc:

**[0-3 sec] Hook/Opening:**
- What happens: [describe]
- Purpose: Grab attention

**[3-10 sec] Setup/Problem:**
- What happens: [describe]
- Purpose: Build curiosity/relatability

**[10-20 sec] Climax/Solution:**
- What happens: [describe]
- Purpose: Deliver value/entertainment

**[20-30 sec] Resolution/CTA:**
- What happens: [describe]
- Purpose: Call to action

**Story Elements:**
- Main Character: [who]
- Conflict/Problem: [what]
- Resolution: [how]
- Emotional Journey: [feelings triggered]

**Pacing Analysis:**
- Cuts per 10 seconds: [estimate]
- Energy level: High/Medium/Low
- Retention tactics used: [list]

---

## 3️⃣ CTA (CALL-TO-ACTION) ANALYSIS

**Primary CTA:**
What action does the creator want viewers to take?
- [ ] Follow the account
- [ ] Like the video
- [ ] Comment a response
- [ ] Share with friends
- [ ] Save for later
- [ ] Click link in bio
- [ ] Try the method/product
- [ ] Duet/Stitch
- [ ] Other: [specify]

**CTA Placement:**
- When: [timestamp]
- How: Verbal / Text overlay / Caption / Implied

**CTA Effectiveness:**
- Clarity: How clear is the ask? (1-10)
- Urgency: Does it create FOMO? (1-10)
- Value: What's in it for the viewer? [explain]

**Engagement Triggers:**
- Question asked: [yes/no - if yes, what question?]
- Controversy/debate created: [yes/no]
- Tag a friend prompt: [yes/no]
- Challenge/trend participation: [yes/no]

**Optimization Suggestions:**
1. [Specific CTA improvement]
2. [Specific CTA improvement]
3. [Specific CTA improvement]

---

## 4️⃣ TIMING & DURATION ANALYSIS

**Video Length:** [estimated seconds]

**Optimal Length Analysis:**
- Is this the right length? YES / NO - should be [X] seconds
- Why: [explain reasoning]

**Second-by-Second Breakdown:**

**0:00-0:01** - [What happens]
**0:01-0:02** - [What happens]
**0:02-0:03** - [What happens - end of hook]
**0:03-0:05** - [What happens]
**0:05-0:07** - [What happens]
**0:07-0:10** - [What happens]
**0:10-0:15** - [What happens]
**0:15-0:20** - [What happens]
**0:20-0:25** - [What happens]
**0:25-0:30** - [What happens]

**Key Timestamps:**
- Hook ends: 0:03
- Problem introduced: 0:XX
- Solution revealed: 0:XX
- CTA appears: 0:XX
- Video ends: 0:XX

**Music Beat Drops/Sync Points:**
- Beat 1: 0:XX - synced with [action]
- Beat 2: 0:XX - synced with [action]
- Beat 3: 0:XX - synced with [action]

**Pacing Recommendations:**
- Speed up: [which sections]
- Slow down: [which sections]
- Cut completely: [what to remove]

---

## 5️⃣ COMPLETE SCRIPT (Word-for-Word)

**VOICEOVER/DIALOGUE SCRIPT:**

[0:00-0:03] HOOK:
"[Exact words spoken or text shown]"
*[Describe what's happening visually]*

[0:03-0:07] SETUP:
"[Exact words spoken or text shown]"
*[Describe what's happening visually]*

[0:07-0:15] MAIN CONTENT:
"[Exact words spoken or text shown]"
*[Describe what's happening visually]*

[0:15-0:25] CLIMAX/SOLUTION:
"[Exact words spoken or text shown]"
*[Describe what's happening visually]*

[0:25-0:30] CTA/OUTRO:
"[Exact words spoken or text shown]"
*[Describe what's happening visually]*

**ON-SCREEN TEXT:**
- Text 1 (appears at 0:XX): "[text content]"
- Text 2 (appears at 0:XX): "[text content]"
- Text 3 (appears at 0:XX): "[text content]"

**CAPTION/DESCRIPTION:**
"[What's written in the video caption]"

**HASHTAGS USED:**
#tag1 #tag2 #tag3 [list all]

**REPLICATION SCRIPT (Your Version):**
Here's how YOU should script your version:

[0:00-0:03] YOUR HOOK:
"[Modified opening that fits your style]"
*[What you'll do visually]*

[Continue for full script...]

---

## 6️⃣ AI PROMPT LIBRARY (Ready to Use)

**For Creating Similar Content:**

### 📝 PROMPT 1: Script Generation
\`\`\`
You are a viral TikTok scriptwriter. Write a 30-second TikTok script about [YOUR TOPIC] that:
- Opens with: [THIS VIDEO'S HOOK STYLE]
- Follows this structure: [STORYLINE STRUCTURE FROM SECTION 2]
- Includes a CTA that: [CTA TYPE FROM SECTION 3]
- Uses this tone: [DESCRIBE TONE]

Format the script with timestamps.
\`\`\`

### 🎨 PROMPT 2: Caption Writing
\`\`\`
Write 5 TikTok caption variations for a video about [YOUR TOPIC].

Style: [DESCRIBE STYLE FROM THIS VIDEO]
Length: 100-150 characters
Include: Question to drive comments
Hashtags: Mix of trending + niche (15 total)

Make the first line hook them before "...more"
\`\`\`

### 🎯 PROMPT 3: Hook Variations
\`\`\`
Generate 10 different hook variations (first 3 seconds) for a TikTok about [YOUR TOPIC].

Use these hook styles:
1. Question hook (like: "[EXAMPLE FROM THIS VIDEO]")
2. Shock statement
3. Pattern interrupt
4. Personal story opening
5. Bold claim

Format: [Visual description] + [Exact words to say]
\`\`\`

### 💬 PROMPT 4: Comment Response Ideas
\`\`\`
Generate 20 engaging comment responses for a TikTok video about [YOUR TOPIC].

Video context: [BRIEF SUMMARY OF THIS VIDEO]

Include:
- 5 responses that spark debate
- 5 responses that ask follow-up questions
- 5 responses that provide additional value
- 5 responses that encourage sharing

Make them authentic and conversational.
\`\`\`

### 🎬 PROMPT 5: Storyboard Generation
\`\`\`
Create a detailed storyboard for a [LENGTH]-second TikTok about [YOUR TOPIC].

Use this structure: [STORYLINE FROM SECTION 2]

For each shot, specify:
- Timestamp
- Camera angle
- What viewer sees
- What is said/shown as text
- Transition type

Make it filmable with just a smartphone.
\`\`\`

### 📊 PROMPT 6: Trend Adaptation
\`\`\`
Adapt this trending TikTok format to my niche: [YOUR NICHE]

Original format: [DESCRIBE THIS VIDEO'S FORMAT]
Original hook: [THIS VIDEO'S HOOK]
Original structure: [THIS VIDEO'S STRUCTURE]

Keep the viral formula but make it about [YOUR SPECIFIC TOPIC].
Provide 3 adaptation ideas.
\`\`\`

### 🎵 PROMPT 7: Music Selection
\`\`\`
Recommend 10 TikTok sounds/songs for a video about [YOUR TOPIC].

Video style: [DESCRIBE THIS VIDEO'S STYLE]
Video energy: [HIGH/MEDIUM/LOW]
Target audience: [WHO]

For each sound, explain:
- Why it fits
- What emotion it creates
- How trending it currently is
\`\`\`

---

## 🎁 BONUS: QUICK WIN CHECKLIST

Before filming your version, ensure you have:

**PRE-PRODUCTION:**
- [ ] Identified your unique hook (from AI Prompt 3)
- [ ] Written complete script (from AI Prompt 1)
- [ ] Selected trending audio
- [ ] Planned shot list (from AI Prompt 5)
- [ ] Prepared props/location
- [ ] Set up lighting

**PRODUCTION:**
- [ ] Film hook 5 different ways (choose best)
- [ ] Record 3 takes of each segment
- [ ] Capture B-roll/cutaways
- [ ] Film in 9:16 vertical format
- [ ] Ensure audio is clean

**POST-PRODUCTION:**
- [ ] Cut to [OPTIMAL LENGTH FROM SECTION 4]
- [ ] Add text overlays every 2-3 seconds
- [ ] Sync cuts with music beats
- [ ] Color grade for brightness/saturation
- [ ] Add trending sound effects

**PUBLISHING:**
- [ ] Write caption using AI Prompt 2
- [ ] Add 15-20 strategic hashtags
- [ ] Choose eye-catching cover frame
- [ ] Post during peak hours (7-9AM, 12-1PM, 7-10PM)
- [ ] Reply to first 20 comments immediately

**SUCCESS METRICS TO TRACK:**
- Watch time % (goal: 70%+)
- Like rate (goal: 5%+)
- Comment rate (goal: 1%+)
- Share rate (goal: 0.5%+)
- Follower growth per video

---

**🚀 YOUR ACTION PLAN:**

1. **Today:** Watch target video 10+ times, study each section above
2. **Tomorrow:** Write your script using AI Prompt 1, plan shots using AI Prompt 5
3. **Day 3:** Film your version following the structure from Section 2
4. **Day 4:** Edit using timing from Section 4, add CTA from Section 3
5. **Day 5:** Post at optimal time, engage with comments

**Expected Results:**
Based on this analysis, your video should achieve:
- Views: [estimate range]
- Engagement rate: [estimate %]
- Follower growth: [estimate range]

**Success Probability: X/10**

Good luck! 🎬`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert TikTok analyst specializing in viral video deconstruction. Provide extremely detailed, actionable analysis across these 6 core modules: HOOK, STORYLINE, CTA, TIMING, SCRIPT, and AI PROMPTS. Be specific, practical, and thorough."
        },
        {
          role: "user",
          content: analysisPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const analysis = completion.choices[0].message.content;

    return res.status(200).json({
      success: true,
      url: url,
      videoData: videoData ? {
        title: videoData.title,
        author: videoData.author_name,
        thumbnail: videoData.thumbnail_url
      } : null,
      analysis: analysis,
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
