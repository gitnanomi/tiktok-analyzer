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
    
    // 使用 TikTok oEmbed API 获取基础信息（免费，无需额外依赖）
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

    // 构建分析提示词
    const replicationPrompt = `
You are a professional TikTok video replication expert. Analyze this TikTok video and provide a complete, actionable replication blueprint.

**TikTok Video URL:** ${url}

${videoData ? `**Video Title:** ${videoData.title || 'N/A'}
**Creator:** ${videoData.author_name || 'Unknown'}
**Thumbnail:** ${videoData.thumbnail_url || 'N/A'}` : ''}

Since I cannot directly access the video content, please provide a COMPREHENSIVE replication blueprint framework that the creator can customize based on their specific video content.

---

# 🎯 COMPLETE VIDEO REPLICATION BLUEPRINT

## I. CRITICAL FIRST STEP
**Before following this blueprint, the creator must:**
1. Watch their target video 10+ times
2. Note down EVERY detail: words, movements, cuts, music beats
3. Screenshot key frames for reference
4. Identify the exact hook, problem, solution, and CTA

---

## II. UNIVERSAL VIRAL VIDEO STRUCTURE

### **[0-3 SECONDS] - THE HOOK (MOST CRITICAL)**

**Purpose:** Stop the scroll immediately

**Hook Formulas That Work:**
1. **Question Hook:** "Did you know...?" / "What if I told you...?"
2. **Shock Hook:** Surprising statement or visual
3. **Pattern Interrupt:** Unexpected action or sound
4. **Direct Address:** "If you're struggling with X..."
5. **Bold Claim:** "This changed my life in 30 days"

**Execution Checklist:**
- [ ] First frame must be visually striking
- [ ] Audio/music starts with impact (beat drop/sound effect)
- [ ] Face clearly visible (if showing face)
- [ ] Text overlay appears within 0.5 seconds
- [ ] Movement/action starts immediately

**Camera Setup:**
- Shot Type: Close-up or medium close-up
- Angle: Eye level or slightly above
- Framing: Center subject, minimal background distraction
- Lighting: Bright, even lighting on face

**What to Say (Templates):**
- "Stop scrolling if you want to..."
- "I can't believe I discovered..."
- "Nobody talks about this but..."
- "This is your sign to..."
- "POV: When you finally..."

---

### **[3-10 SECONDS] - SETUP/PROBLEM**

**Purpose:** Build curiosity and relatability

**Structure:**
1. Introduce the problem/situation
2. Make it relatable to target audience
3. Build tension or curiosity

**Execution:**
- [ ] Transition from hook smoothly
- [ ] Use B-roll or cutaway if needed
- [ ] Add text overlay for key points
- [ ] Keep energy high
- [ ] Sync with music beat

**Camera Techniques:**
- Shot variation: Switch angles or zoom slightly
- Movement: Slow push-in or pull-out
- Lighting: Maintain consistency

**Script Framework:**
- "So here's the problem..."
- "Most people don't know..."
- "I used to struggle with..."
- "The worst part is..."

---

### **[10-20 SECONDS] - SOLUTION/VALUE DELIVERY**

**Purpose:** Deliver the main content/value

**Content Delivery Methods:**
1. **Tutorial:** Step-by-step demonstration
2. **Story:** Personal experience narrative
3. **Reveal:** Show before/after or results
4. **List:** "3 ways to..." format
5. **Demonstration:** Show product/method in action

**Execution:**
- [ ] Clear, concise delivery
- [ ] Visual aids (text, arrows, circles)
- [ ] Fast-paced editing (cut pauses)
- [ ] Music supports the mood
- [ ] Multiple camera angles/shots

**Editing Techniques:**
- Jump cuts every 2-3 seconds
- Zoom in on key moments
- Speed ramping for emphasis
- Transitions on beat drops

---

### **[20-30 SECONDS] - CTA/CONCLUSION**

**Purpose:** Drive engagement and action

**Effective CTAs:**
1. **Engagement:** "Comment X if you agree"
2. **Follow:** "Follow for more tips like this"
3. **Share:** "Send this to someone who needs it"
4. **Save:** "Save this for later"
5. **Action:** "Try this and report back"

**Closing Formulas:**
- Loop back to hook
- Tease next video
- Ask a question
- Create urgency
- Provide value summary

---

## III. PRODUCTION SPECIFICATIONS

### **Equipment Needed:**
**Minimum:**
- [ ] Smartphone with good camera (iPhone 11+ or equivalent)
- [ ] Natural window light OR ring light
- [ ] Tripod or stable surface
- [ ] Wireless earbuds for audio playback

**Optimal:**
- [ ] Ring light (10-18 inch)
- [ ] Flexible phone tripod
- [ ] External microphone (if speaking)
- [ ] Green screen (optional)
- [ ] Remote shutter

### **Location Setup:**
**Indoor Shoot:**
- Clean, uncluttered background
- Solid color wall OR interesting backdrop
- 3-6 feet from background (for depth)
- Face the window (natural light)
- Avoid overhead harsh lighting

**Outdoor Shoot:**
- Golden hour (1 hour after sunrise/before sunset)
- Avoid direct harsh sunlight
- Interesting background (not too busy)
- Stable surface for phone

### **Camera Settings:**
- [ ] 9:16 aspect ratio (vertical)
- [ ] 1080p minimum (4K if phone supports)
- [ ] 30fps or 60fps
- [ ] Auto-focus ON
- [ ] Exposure locked (tap and hold)
- [ ] Grid lines ON for composition

---

## IV. DETAILED SHOT LIST TEMPLATE

**SHOT 1: Hook (0-3 sec)**
- Camera: [Front/back camera]
- Position: [Tripod/handheld]
- Distance: [Close-up - face fills frame]
- Angle: [Eye level/slightly above]
- Action: [Describe exact movement]
- Audio: [Music/voiceover starts]
- Text: [Text overlay content]

**SHOT 2: Transition (3-5 sec)**
- Camera: [Different angle if possible]
- Transition type: [Cut/swipe/zoom]
- Action: [Next movement or scene]

**SHOT 3-5: Main Content (5-20 sec)**
- Vary shots every 2-4 seconds
- Mix of angles (front, side, close-up, wide)
- Include inserts/cutaways if relevant
- Keep camera movement smooth

**SHOT 6: CTA/Outro (20-30 sec)**
- Return to opening angle
- Direct eye contact with camera
- Clear final message

---

## V. AUDIO STRATEGY

### **Music Selection:**
**Find Trending Audio:**
1. Open TikTok → Creative Center → Trending Sounds
2. Filter by your niche
3. Choose sounds with 50K-500K uses (sweet spot)
4. Avoid overused sounds (millions of uses)

**Music Characteristics:**
- Upbeat tempo (120-140 BPM)
- Clear beat drops for sync points
- Matches video mood/energy
- Not too distracting from message

### **Beat Syncing:**
**Critical Sync Points:**
- 0:02 - Hook moment with beat drop
- 0:05-0:07 - Transition with music change
- 0:15-0:20 - Climax with music peak
- 0:25-0:28 - Final beat for CTA

### **Voiceover Tips (if recording):**
- Record in quiet space
- Speak 10-20% faster than normal
- Emphasize key words
- Match energy to content type
- Use lapel or directional mic

---

## VI. POST-PRODUCTION EDITING WORKFLOW

### **Software:** CapCut (Free & Powerful)

### **Step-by-Step Process:**

**1. Import & Organize (5 min)**
- [ ] Import all clips to CapCut
- [ ] Arrange clips on timeline in order
- [ ] Trim dead space at start/end

**2. Rough Cut (10 min)**
- [ ] Cut out all pauses and mistakes
- [ ] Remove "um," "uh," filler words
- [ ] Ensure pacing is fast (2-3 sec per clip)
- [ ] Total length: 25-35 seconds ideal

**3. Add Music (5 min)**
- [ ] Import trending audio
- [ ] Align beat drops with key moments
- [ ] Adjust volume (music: 40-60%, voice: 100%)
- [ ] Fade in/out at start and end

**4. Text & Captions (10 min)**
- [ ] Auto-caption feature (if speaking)
- [ ] Add keyword text overlays
- [ ] Font: Bold, easy to read (Montserrat/Poppins)
- [ ] Size: Large enough for mobile viewing
- [ ] Color: High contrast with background
- [ ] Animation: Pop in with each word/phrase
- [ ] Position: Center or lower third

**5. Effects & Transitions (10 min)**
- [ ] Zoom in/out on emphasis points
- [ ] Add transitions between shots (keep subtle)
- [ ] Use effects sparingly (glitch, flash, etc.)
- [ ] Add stickers/emojis if relevant
- [ ] Arrow or circle to highlight details

**6. Color Grading (5 min)**
- [ ] Adjust brightness (+5 to +15)
- [ ] Increase contrast slightly (+10)
- [ ] Adjust saturation (+10 to +20)
- [ ] Use preset filters (try "Vibrant" or "Film")
- [ ] Ensure skin tones look natural

**7. Final Polish (5 min)**
- [ ] Watch through 3 times
- [ ] Check audio levels (no clipping)
- [ ] Verify text is readable
- [ ] Confirm hook grabs attention
- [ ] Export: 1080p, 30fps

---

## VII. CAPTION & HASHTAG STRATEGY

### **Caption Formula:**

**Option 1: Question + Value**
"[Hook Question]? Here's what most people don't know... [1-2 sentence value] 💡 [CTA]"

**Option 2: Story + Lesson**
"[Personal story opener] → [What I learned] → [Your takeaway] 🎯 [CTA]"

**Option 3: Problem + Solution**
"Struggling with [problem]? Try this instead: [brief solution] ✨ [CTA]"

**Caption Best Practices:**
- [ ] First line = Hook (shows before "more")
- [ ] 100-200 characters ideal length
- [ ] Include relevant emojis (2-4)
- [ ] Add line breaks for readability
- [ ] End with engagement question or CTA

### **Hashtag Strategy:**

**Formula: 15-20 hashtags**
- 3-5 Niche-specific (#TikTokTip #ContentCreator)
- 3-5 Trending (#FYP #ForYou #Viral)
- 2-3 Broad category (#LifeHack #Tutorial)
- 2-3 Community (#SmallBusiness #Entrepreneur)
- 1-2 Branded (your unique hashtags)

**Hashtag Research:**
1. Search your video topic on TikTok
2. Note hashtags on top performing videos
3. Mix high-use (1M+) and mid-use (100K-500K) tags
4. Update hashtag list weekly

---

## VIII. POSTING STRATEGY

### **Best Times to Post:**
**Peak Engagement Windows:**
- **6-9 AM** - Morning scroll
- **12-1 PM** - Lunch break
- **5-9 PM** - After work/school
- **9-11 PM** - Before bed scroll

**Day of Week:**
- **Best:** Tuesday, Wednesday, Thursday
- **Good:** Friday, Monday
- **Avoid:** Saturday, Sunday morning

### **Posting Checklist:**
- [ ] Video exported and saved
- [ ] Caption written and reviewed
- [ ] Hashtags copied and ready
- [ ] Thumbnail/cover selected (frame at 1-2 sec)
- [ ] Posted during peak window
- [ ] Allow comments (do NOT restrict)
- [ ] Allow duets and stitches

### **First Hour Strategy:**
- [ ] Reply to first 5-10 comments immediately
- [ ] Like all comments
- [ ] Pin best comment to top
- [ ] Share to other platforms (IG, YouTube Shorts)
- [ ] Ask friends to engage early

---

## IX. PERFORMANCE OPTIMIZATION

### **Testing Variations:**
Create 3 versions of same concept:

**Version A: Original Hook**
- Post at 8 AM Tuesday

**Version B: Different Hook**
- Same content, different opening
- Post at 6 PM Wednesday

**Version C: Different Format**
- Same topic, different delivery
- Post at 12 PM Thursday

**Analyze after 48 hours:**
- Which hook performed best?
- Which posting time worked?
- Which format resonated?

### **Engagement Tactics:**
**In First 24 Hours:**
- Respond to ALL comments
- Ask follow-up questions in replies
- Create comment threads
- Heart/like all positive comments
- Pin controversial/engaging comment

**Days 2-7:**
- Continue engaging
- Monitor analytics
- Note patterns in comments
- Plan follow-up content

---

## X. ANALYTICS TO TRACK

### **Key Metrics:**
**Must Monitor:**
- [ ] Views (first hour, 24 hour, 7 day)
- [ ] Watch time % (aim for 70%+)
- [ ] Likes (4-6% of views = good)
- [ ] Comments (1-2% of views = good)
- [ ] Shares (0.5-1% of views = viral signal)
- [ ] Follower growth per video

**Success Indicators:**
✅ Watched from beginning to end
✅ Rewatched multiple times
✅ Shared count increasing
✅ Comments asking questions
✅ Follower growth spike
✅ "For You" page views > Following views

---

## XI. COMMON MISTAKES TO AVOID

❌ **Hook too slow** - You have 0.5 seconds
❌ **Poor lighting** - Face must be clearly visible
❌ **Talking too slow** - Speed up by 1.2x if needed
❌ **Long intro** - Jump straight to value
❌ **Ignoring trends** - Use trending sounds/formats
❌ **Generic captions** - Make it specific and personal
❌ **Posting and forgetting** - Engage immediately
❌ **Too much text** - 5-7 words max per screen
❌ **Copying exactly** - Add your unique twist
❌ **Inconsistent posting** - Post 1-3x daily for growth

---

## XII. ADVANCED REPLICATION TACTICS

### **Pattern Recognition:**
Study 10 viral videos in your niche and note:
- [ ] Average video length
- [ ] Common hooks patterns
- [ ] Transition styles used
- [ ] Text overlay strategies
- [ ] Music tempo range
- [ ] Color grading/filters
- [ ] Pacing and cuts per second

### **Trend Hijacking:**
1. Identify trending format
2. Apply to your niche
3. Post within 24-48 hours
4. Add unique value/twist
5. Use trending audio

### **Psychological Triggers:**
- **Curiosity Gap:** "Wait till you see #3..."
- **FOMO:** "Everyone's doing this..."
- **Social Proof:** "10M views for a reason..."
- **Controversy:** (mild) debate topic
- **Nostalgia:** "Remember when..."

---

## XIII. IMMEDIATE ACTION PLAN

### **Next 24 Hours:**
- [ ] Watch target video 10+ times
- [ ] Screenshot every frame
- [ ] Write out complete script
- [ ] Identify exact music used
- [ ] Note all text overlays
- [ ] List all transitions
- [ ] Plan your unique twist

### **Pre-Production (Day 2):**
- [ ] Gather all props needed
- [ ] Set up filming location
- [ ] Test lighting
- [ ] Download music/audio
- [ ] Prepare outfit
- [ ] Charge phone fully

### **Production (Day 3):**
- [ ] Record 3-5 takes of each shot
- [ ] Get multiple angles
- [ ] Record extra B-roll
- [ ] Check footage quality
- [ ] Re-record if needed

### **Post-Production (Day 4):**
- [ ] Edit following workflow above
- [ ] Get feedback from 2-3 friends
- [ ] Make adjustments
- [ ] Export final version
- [ ] Write caption & hashtags

### **Launch (Day 5):**
- [ ] Post during peak time
- [ ] Engage first hour
- [ ] Cross-post to other platforms
- [ ] Monitor performance
- [ ] Plan next video

---

## XIV. SUCCESS PREDICTION FRAMEWORK

**Your Video Will Likely Succeed If:**
✅ Hook grabs attention in under 1 second
✅ Value delivered within 10 seconds
✅ Pacing is fast (no dead space)
✅ Audio is trending and relevant
✅ Text is readable and strategic
✅ Lighting is professional
✅ Caption hooks curiosity
✅ Posted during peak time
✅ Early engagement is strong

**Expected Results (If Executed Well):**
- **First Hour:** 200-1,000 views
- **24 Hours:** 1,000-10,000 views
- **7 Days:** 5,000-50,000+ views
- **Follower Growth:** 50-500 new followers
- **Engagement Rate:** 5-8%

---

## XV. FINAL CHECKLIST BEFORE POSTING

### **Content Quality:**
- [ ] Video is sharp and clear (not blurry)
- [ ] Audio is clean (no background noise)
- [ ] Lighting is bright and even
- [ ] Hook is strong and immediate
- [ ] Pacing is fast (no boring parts)
- [ ] Text is easily readable on mobile
- [ ] Music enhances the content
- [ ] Transitions are smooth
- [ ] Video length is 25-35 seconds
- [ ] Ending has clear CTA

### **Technical Specs:**
- [ ] 9:16 aspect ratio
- [ ] 1080p or higher resolution
- [ ] 30fps or 60fps
- [ ] File size under 287.6 MB
- [ ] H.264 codec
- [ ] No watermarks from other apps

### **Publishing Details:**
- [ ] Caption is engaging
- [ ] All hashtags included
- [ ] Cover frame selected
- [ ] Posting time optimized
- [ ] Notifications ON for comments
- [ ] Ready to engage immediately

---

## 🎁 BONUS: VIRAL VIDEO FORMULAS

### **Formula 1: The Tutorial**
Hook: "Here's how to [achieve result]"
Body: Step 1, Step 2, Step 3
CTA: "Save this for later!"

### **Formula 2: The Story**
Hook: "So this just happened..."
Body: Beginning → Middle → End
CTA: "Comment if you relate"

### **Formula 3: The List**
Hook: "3 things that [do something]"
Body: Thing 1 → Thing 2 → Thing 3
CTA: "Which one will you try?"

### **Formula 4: The Before/After**
Hook: "I changed [X] and this happened"
Body: Before → Process → After
CTA: "Who wants to see my method?"

### **Formula 5: The Question**
Hook: "Did you know [surprising fact]?"
Body: Explanation and proof
CTA: "Follow for more facts"

---

**🚀 YOU NOW HAVE EVERYTHING YOU NEED TO REPLICATE VIRAL VIDEOS!**

Remember: 
- **Preparation = 70% of success**
- **Execution = 20% of success**  
- **Engagement = 10% of success**

Start filming TODAY. Your first version won't be perfect, and that's okay. Each video is practice. You're not competing with the original—you're creating your own version.

**GOOD LUCK! 🎬**`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert TikTok strategist providing comprehensive, actionable replication blueprints. Be extremely detailed and practical."
        },
        {
          role: "user",
          content: replicationPrompt
        }
      ],
      temperature: 0.8,
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
