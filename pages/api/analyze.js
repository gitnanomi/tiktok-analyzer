import OpenAI from 'openai';
import TikTokScraper from 'tiktok-scraper';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

  if (!url || !url.includes('tiktok.com')) {
    return res.status(400).json({ error: 'Invalid TikTok URL' });
  }

  try {
    console.log('Fetching TikTok video data for:', url);
    
    const videoData = await TikTokScraper.getVideoMeta(url, {
      noWaterMark: false,
      hdVideo: false
    });

    if (!videoData || !videoData.collector || videoData.collector.length === 0) {
      return res.status(404).json({ error: 'Video not found or unavailable' });
    }

    const video = videoData.collector[0];
    
    const hashtags = video.hashtags ? video.hashtags.map(tag => `#${tag.name}`).join(' ') : 'None';
    
    const stats = {
      views: video.playCount || 0,
      likes: video.diggCount || 0,
      comments: video.commentCount || 0,
      shares: video.shareCount || 0
    };

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Ultra-detailed replication blueprint prompt
    const replicationPrompt = `
You are a professional TikTok video replication expert. Based on the following information, provide a complete, actionable video replication blueprint.

## Original Video Data:

**Video Caption/Description:**
${video.text || 'No description'}

**Hashtags:** ${hashtags}

**Duration:** ${video.videoMeta?.duration || 'Unknown'} seconds

**Performance Metrics:**
- 👁️ Views: ${stats.views.toLocaleString()}
- ❤️ Likes: ${stats.likes.toLocaleString()} (${((stats.likes/stats.views)*100).toFixed(2)}%)
- 💬 Comments: ${stats.comments.toLocaleString()}
- 🔄 Shares: ${stats.shares.toLocaleString()}
- 📊 Engagement Rate: ${calculateEngagementRate(stats)}%

**Background Music:** ${video.musicMeta?.musicName || 'Unknown'}
**Music Artist:** ${video.musicMeta?.musicAuthor || 'Unknown'}

**Creator:** @${video.authorMeta?.name || 'Unknown'} 
**Followers:** ${video.authorMeta?.fans?.toLocaleString() || 0}
**Posted:** ${video.createTime ? new Date(video.createTime * 1000).toLocaleString('en-US') : 'Unknown'}

---

Please provide the following complete replication blueprint:

# 🎯 I. Core Success Factors Analysis

## 1.1 Why Did This Video Go Viral?
- Key viral elements (3-5 factors)
- Target audience profile
- Emotional triggers
- Value proposition

## 1.2 Video Type Classification
Identify the type: Tutorial, Skit, Comedy, Educational, Product Review, Emotional Story, etc.

---

# 📝 II. Second-by-Second Script Breakdown (Ready to Execute)

Break down every second in this format:

**[0-3 sec] The Golden Hook**
- 🎬 Shot Type: (First-person/Third-person/Close-up/etc.)
- 📸 Visual: (Describe exactly what we see)
- 💬 Script/Dialogue: (Exact opening words)
- 🎵 Audio: (Sound effects/Music beat)
- 🎭 Expression/Action: (What the talent does)
- ⚡ Key Technique: (Why this hook works)

**[3-7 sec] Problem/Conflict Introduction**
- 🎬 Shot Type:
- 📸 Visual:
- 💬 Script/Dialogue:
- 🎵 Audio:
- 🎭 Expression/Action:
- ⚡ Transition Technique:

**[7-15 sec] Solution/Climax**
- 🎬 Shot Type:
- 📸 Visual:
- 💬 Script/Dialogue:
- 🎵 Audio:
- 🎭 Expression/Action:
- ✨ Visual Effects: (Effects/Text overlays/Stickers)

**[15-End] CTA/Conclusion**
- 🎬 Shot Type:
- 📸 Visual:
- 💬 Script/Dialogue:
- 🎵 Audio:
- 📢 Call-to-Action:

---

# 🎬 III. Production Checklist

## 3.1 Pre-Production
**Required Props:**
- Prop 1: (Specific item)
- Prop 2:
- ...

**Location Setup:**
- Location: (Indoor/Outdoor/Specific venue)
- Lighting: (Natural light/Ring light/Softbox)
- Background: (Solid color/Scene/Backdrop)

**Wardrobe & Styling:**
- Recommended outfit:
- Makeup requirements:

## 3.2 Camera Settings
- 📱 Camera Position: (Front-facing/Side angle/Top-down/Low angle)
- 📐 Aspect Ratio: 9:16 vertical
- 🎥 Distance: (Close-up/Medium/Wide shot)
- 💡 Best Time to Shoot: (Morning/Afternoon/Evening for lighting)

## 3.3 Shot List & Storyboard
**Shot 1 (0-3 sec):**
- Camera position:
- Camera movement: (Static/Push-in/Pan)
- Frame size:
- Talent position:

**Shot 2 (3-7 sec):**
- Camera position:
- Camera movement:
- Frame size:
- Talent position:

(Continue based on video length)

---

# 🎵 IV. Audio & Music Strategy

**Main Background Music:**
- Track Name: ${video.musicMeta?.musicName || 'Unknown'}
- Where to Find: (TikTok native library/CapCut/Spotify)
- Use Section: Starting from 0:X

**Key Beat Drops Timeline:**
- At X sec: Bass drop, sync with action/transition
- At X sec: Rhythm change, cut to new shot
- ...

**Additional Sound Effects:**
- SFX 1: (e.g., "ding" notification sound) at X sec
- SFX 2:
- ...

---

# ✂️ V. Post-Production Editing Guide

## 5.1 Editing Software
Recommended: CapCut / Adobe Premiere Rush / InShot

## 5.2 Step-by-Step Editing Process
1. **Import Footage**
   - X video clips
   - Arrange on timeline

2. **Add Music**
   - Start at X sec
   - Volume at X%

3. **Add Effects**
   - At X sec: Add XX effect
   - At X sec: Add text "XXX"
   - Font: XXX / Size: XX / Position: XX

4. **Transitions**
   - At X sec: Use "XX" transition (flash/swipe)
   - At X sec: Hard cut

5. **Color Grading**
   - Filter: XXX
   - Brightness: +X%
   - Contrast: +X%
   - Saturation: +X%

6. **Stickers/Emojis**
   - At X sec: Add XXX sticker

---

# 📱 VI. Publishing Strategy

## 6.1 Caption Templates
**Recommended Captions (3 options):**
1. [First compelling caption option based on the video content]
2. [Second option with different hook]
3. [Third option with question format]

## 6.2 Hashtag Strategy
**Must-Use Tags:**
${hashtags}

**Suggested Additional Trending Tags:**
#fyp #foryou #viral #trending #[niche-specific tags]

## 6.3 Posting Schedule
- Best Time Slots: 7-9 AM / 12-1 PM / 6-10 PM (local time)
- Avoid: 1-6 AM

## 6.4 Thumbnail Selection
- Select frame at X sec for cover
- Ensure: Clear face / Good expression / Eye-catching

---

# 🎯 VII. Replication Optimization Tips

## 7.1 Elements You MUST Keep
1. XXX (This is the core viral factor)
2. XXX (This hooks viewers)
3. XXX

## 7.2 Areas for Improvement
1. **Improvement 1:**
   - Original approach: XXX
   - Your better version: XXX
   - Expected result: XXX

2. **Improvement 2:**
   - Original approach: XXX
   - Your better version: XXX
   - Expected result: XXX

## 7.3 Personalization Adjustments
- Add your unique style: XXX
- Adapt for your audience: XXX
- Avoid direct copying, suggest changes: XXX

---

# 📊 VIII. Performance Prediction

**Based on original video data, if you replicate successfully:**
- Expected Views: XX,XXX - XX,XXX
- Expected Like Rate: X%
- Expected Watch Time: X%
- Expected Follower Growth: XX - XXX

**Success Probability: X/10**

**Risk Factors:**
- Factor 1: XXX
- Factor 2: XXX

**Success Boosters:**
- Booster 1: XXX
- Booster 2: XXX

---

# 🎁 IX. BONUS: Ready-to-Use Script Template

**Complete Shooting Script:**

SCENE 1 - Hook (0-3 sec)
[CAMERA: Close-up, front-facing]
[ACTION: Talent looks directly at camera with surprised expression]
[LINE: "Exact dialogue here"]
[MUSIC: Beat drop at 0:02]

SCENE 2 - Setup (3-7 sec)
[CAMERA: Medium shot, slight zoom in]
[ACTION: Describe specific action]
[LINE: "Exact dialogue here"]
[TRANSITION: Swipe left at 0:06]

(Continue for full video)

---

# 💡 X. Pro Tips for Maximum Success

1. **Authenticity:** Add your personality while keeping the formula
2. **Quality over Speed:** Take time to nail each shot
3. **Test Variations:** Try 2-3 versions with slight differences
4. **Engage Early:** Reply to first 10-20 comments immediately
5. **Cross-Platform:** Post variations on Instagram Reels, YouTube Shorts

---

**FINAL CHECKLIST:**
☐ All props gathered
☐ Location scouted
☐ Script memorized
☐ Music downloaded
☐ Editing software ready
☐ Caption & hashtags prepared
☐ Best posting time scheduled

**YOU'RE READY TO CREATE! 🚀**`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert TikTok content strategist specializing in viral video replication. Provide extremely detailed, actionable blueprints that creators can follow step-by-step to recreate successful videos. Be specific, practical, and thorough. Use clear formatting with emojis for easy scanning."
        },
        {
          role: "user",
          content: replicationPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const analysis = completion.choices[0].message.content;

    return res.status(200).json({
      success: true,
      url: url,
      videoData: {
        id: video.id,
        description: video.text,
        hashtags: video.hashtags ? video.hashtags.map(tag => tag.name) : [],
        duration: video.videoMeta?.duration,
        stats: stats,
        author: {
          username: video.authorMeta?.name,
          nickname: video.authorMeta?.nickName,
          followers: video.authorMeta?.fans,
          verified: video.authorMeta?.verified
        },
        music: {
          title: video.musicMeta?.musicName,
          author: video.musicMeta?.musicAuthor
        },
        createdAt: video.createTime ? new Date(video.createTime * 1000).toISOString() : null
      },
      analysis: analysis,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Analysis error:', error);
    
    let errorMessage = 'Analysis failed';
    
    if (error.message?.includes('video not available')) {
      errorMessage = 'Video is private or unavailable';
    } else if (error.message?.includes('rate limit')) {
      errorMessage = 'Too many requests, please try again later';
    } else if (error.message?.includes('invalid url')) {
      errorMessage = 'Invalid TikTok URL format';
    }
    
    return res.status(500).json({ 
      error: errorMessage,
      details: error.message 
    });
  }
}

function calculateEngagementRate(stats) {
  if (!stats.views || stats.views === 0) return 0;
  
  const totalEngagements = stats.likes + stats.comments + stats.shares;
  const rate = (totalEngagements / stats.views) * 100;
  
  return rate.toFixed(2);
}
