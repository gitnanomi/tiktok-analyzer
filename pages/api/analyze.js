// pages/api/analyze.js
import { getTikTokVideoUrl, getCoverImageBase64 } from '../../lib/videoProcessor';
import { analyzeWithGeminiVision } from '../../lib/geminiVision';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

export default async function handler(req, res) {
  console.log('=== Analysis Request ===');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { input, userProfile } = req.body;

  if (!input) {
    return res.status(400).json({ error: 'Please enter a TikTok URL or keywords' });
  }

  try {
    const isTikTokURL = input.includes('tiktok.com');
    
    if (isTikTokURL) {
      console.log('📹 Single video mode with Vision:', input);
      const result = await analyzeSingleVideoWithVision(input, userProfile);
      return res.status(200).json({
        success: true,
        mode: 'single',
        results: [result],
        visionEnabled: true
      });
    } else {
      console.log('🔍 Keyword search mode:', input);
      
      if (!process.env.APIFY_API_KEY) {
        return res.status(200).json({
          success: true,
          mode: 'batch',
          demo: true,
          message: 'APIFY_API_KEY not configured. Using demo data.',
          results: getDemoResults(input)
        });
      }
      
      const results = await analyzeBatchVideos(input);
      
      return res.status(200).json({
        success: true,
        mode: 'batch',
        results: results || getDemoResults(input)
      });
    }
  } catch (error) {
    console.error('❌ API Error:', error.message);
    return res.status(500).json({ 
      error: `Analysis failed: ${error.message}`
    });
  }
}

/**
 * 单个视频分析（带 Vision）
 */
async function analyzeSingleVideoWithVision(url, userProfile) {
  console.log('🎬 Starting Vision analysis...');
  
  try {
    // 1. 获取视频数据
    console.log('📥 Fetching TikTok data...');
    const videoData = await getTikTokVideoUrl(url);
    
    console.log('✅ Video data received:', {
      author: videoData.author,
      title: videoData.title?.substring(0, 50) + '...',
      hasCover: !!videoData.coverUrl,
      views: videoData.views
    });

    // 2. 获取封面图（最可靠的方式）
    let coverBase64 = null;
    if (videoData.coverUrl) {
      console.log('🖼️ Fetching cover image from:', videoData.coverUrl);
      try {
        coverBase64 = await getCoverImageBase64(videoData.coverUrl);
        console.log('✅ Cover image converted to base64, length:', coverBase64?.length);
      } catch (error) {
        console.error('❌ Cover image failed:', error.message);
      }
    } else {
      console.log('⚠️ No cover URL available');
    }

    // 3. 准备分析
    let analysis = null;
    let visionUsed = false;

    // 如果有封面图，尝试 Vision 分析
    if (coverBase64) {
      console.log('🤖 Attempting Vision analysis...');
      try {
        const visionResult = await analyzeWithGeminiVision(videoData, [coverBase64]);
        
        // 检查 Vision 是否真正工作（不是返回"需要更多信息"）
        if (visionResult?.fullText && 
            !visionResult.fullText.includes('need more information') &&
            !visionResult.fullText.includes('I need a')) {
          console.log('✅ Vision analysis successful!');
          analysis = visionResult;
          visionUsed = true;
        } else {
          console.log('⚠️ Vision returned placeholder text, falling back to text analysis');
          analysis = await analyzeWithEnhancedText(videoData);
        }
      } catch (error) {
        console.error('❌ Vision analysis error:', error.message);
        console.log('📝 Falling back to text analysis');
        analysis = await analyzeWithEnhancedText(videoData);
      }
    } else {
      console.log('📝 No image available, using text analysis');
      analysis = await analyzeWithEnhancedText(videoData);
    }

    return {
      url: url,
      ...videoData,
      analysis: analysis,
      visionUsed: visionUsed,
      analyzedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ Video analysis failed:', error);
    throw new Error(`Video analysis failed: ${error.message}`);
  }
}

/**
 * 增强的文本分析（当 Vision 不可用时）
 */
async function analyzeWithEnhancedText(videoData) {
  if (!process.env.GEMINI_API_KEY) {
    console.log('⚠️ No GEMINI_API_KEY, returning basic analysis');
    return getBasicAnalysis(videoData);
  }

  try {
    console.log('🤖 Running enhanced text analysis...');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `You are analyzing a viral TikTok video to help someone replicate it and make money.

VIDEO INFO:
- Title/Description: "${videoData.title || videoData.description}"
- Creator: @${videoData.author}
- Views: ${videoData.views?.toLocaleString() || 'Unknown'}
- Likes: ${videoData.likes?.toLocaleString() || 'Unknown'}
- Comments: ${videoData.comments?.toLocaleString() || 'Unknown'}

YOUR TASK: Provide an ULTRA-DETAILED replication guide based on this information.

Even though you don't have the video frames, analyze the title/description and provide:

---

## PART 1: FORMAT ANALYSIS

Based on the title/description, what format is this?
- UGC product review?
- Tutorial/How-to?
- Before/after transformation?
- Reaction video?
- Storytelling?
- Demonstration?

**Inferred Format:** [Your best guess]
**Why:** [Evidence from title/description]

---

## PART 2: EQUIPMENT NEEDED

**Camera:**
- Device: iPhone/Android (front or back camera - guess based on format)
- Mounting: Handheld/Tripod/Someone filming
- Estimated cost: $[X]

**Lighting:**
- Type: Natural window light/Ring light/None needed
- Setup: [Describe]
- Cost: $[X]

**Props:**
- Based on title/description, what props are likely needed?
- List each item with estimated cost
- Total props budget: $[X]

**Location:**
- Type: [Bedroom/Kitchen/Outdoor/Car - infer from content]
- Requirements: [Space, background, etc.]

**TOTAL BUDGET:** $[X]

---

## PART 3: SCRIPT TEMPLATE

Based on the video description, create a replication script:

**HOOK (0-3 seconds):**
"[Opening line that grabs attention]"
→ Action: [What to do physically]
→ Why it works: [Psychology]

**SETUP (3-8 seconds):**
"[Build context]"
→ Action: [Movement/gesture]
→ Visual: [What to show]

**MAIN CONTENT (8-15 seconds):**
"[Key points]"
→ Action: [Demo/show result]
→ Pacing: [Fast/slow]

**CTA (Last 2 seconds):**
"[Call to action]"
→ Action: [Final frame]

---

## PART 4: SHOT BREAKDOWN

**Shot 1 (Opening):**
- Camera position: [Describe]
- You're doing: [Action]
- You're holding: [What]
- Expression: [Face]
- Duration: [X seconds]

**Shot 2:**
[Same structure...]

**Shot 3:**
[Same structure...]

---

## PART 5: FILMING CHECKLIST

**Pre-Production:**
☐ Script memorized
☐ Props gathered
☐ Location prepared
☐ Lighting tested

**Production:**
☐ Film 3+ takes of each shot
☐ Check focus/exposure each take
☐ Maintain consistent framing

**Post-Production:**
☐ Edit with [recommended app]
☐ Add captions/text
☐ Color grade: [settings]
☐ Export: 1080x1920, 30fps

---

## PART 6: MONETIZATION

**This format works for:**

1. **Product Category 1:** [Specific type]
   - Example products: [3 specific items]
   - Where to find: [Amazon/AliExpress]
   - Commission: [X%]
   - Expected earnings: $[X]

2. **Product Category 2:**
   [Same structure]

3. **Product Category 3:**
   [Same structure]

**Estimated first month earnings:** $[X-Y]

---

## PART 7: SUCCESS FACTORS

Why this video went viral:
1. [Factor 1]
2. [Factor 2]
3. [Factor 3]

**You can replicate:**
- [Specific element 1]
- [Specific element 2]

**Difficulty score:** [X/10]
- Equipment: [X/10]
- Acting: [X/10]
- Editing: [X/10]

---

## PART 8: COMMON MISTAKES

❌ Don't: [Mistake 1]
✅ Instead: [Solution]

❌ Don't: [Mistake 2]
✅ Instead: [Solution]

❌ Don't: [Mistake 3]
✅ Instead: [Solution]

---

## PART 9: STEP-BY-STEP ACTION PLAN

**Day 1:** [Specific tasks]
**Day 2:** [Specific tasks]
**Day 3:** [Film]
**Day 4:** [Edit]
**Day 5:** [Post]

---

## PART 10: FINAL VERDICT

**Replication Score:** [X/10]

**Recommendation:**
⭐⭐⭐⭐⭐ COPY THIS NOW - [Why]
⭐⭐⭐⭐ GOOD IF - [Condition]
⭐⭐⭐ MAYBE IF - [Condition]
⭐⭐ SKIP UNLESS - [Condition]
⭐ DON'T WASTE TIME - [Why]

**Your verdict:** [Stars]
**Why:** [2-3 sentence explanation]

**Success probability:** [X%]
**Expected timeline:** [X days]
**Expected first week views:** [X-Y]

---

REMEMBER: Be ULTRA specific. The person should be able to film this video TODAY after reading your guide.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    console.log('✅ Enhanced text analysis complete, length:', text.length);

    return {
      fullText: text,
      structured: {
        replicationScore: extractScore(text) || 7,
        difficulty: extractDifficulty(text) || 5,
        budget: extractBudget(text) || 50,
        canBeginneerDoIt: extractBeginnerFriendly(text) || 'yes-with-conditions',
        visionUsed: false
      }
    };

  } catch (error) {
    console.error('❌ Enhanced text analysis failed:', error);
    return getBasicAnalysis(videoData);
  }
}

// Helper functions for extraction
function extractScore(text) {
  const match = text.match(/Replication Score[:\s]*(\d+)\/10/i);
  return match ? parseInt(match[1]) : null;
}

function extractDifficulty(text) {
  const match = text.match(/Difficulty score[:\s]*(\d+)\/10/i);
  return match ? parseInt(match[1]) : null;
}

function extractBudget(text) {
  const match = text.match(/TOTAL BUDGET[:\s]*\$(\d+)/i);
  return match ? parseInt(match[1]) : null;
}

function extractBeginnerFriendly(text) {
  if (text.includes('⭐⭐⭐⭐⭐') || text.includes('COPY THIS NOW')) return 'yes';
  if (text.includes('⭐⭐⭐⭐') || text.includes('GOOD IF')) return 'yes-with-conditions';
  return 'no';
}

/**
 * 批量视频分析
 */
async function analyzeBatchVideos(keywords) {
  console.log('🔍 Batch search for:', keywords);
  
  try {
    const videos = await searchWithApify(keywords);
    
    if (!videos || videos.length === 0) {
      return null;
    }
    
    console.log(`✅ Found ${videos.length} videos`);
    
    const results = [];
    const analyzeCount = Math.min(videos.length, 2);
    
    for (let i = 0; i < analyzeCount; i++) {
      try {
        console.log(`Analyzing ${i + 1}/${analyzeCount}...`);
        
        const analysis = await Promise.race([
          analyzeWithEnhancedText(videos[i]),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 90000)
          )
        ]);
        
        results.push({
          ...videos[i],
          analysis,
          analyzedAt: new Date().toISOString()
        });
        
      } catch (error) {
        console.error(`Video ${i + 1} failed:`, error.message);
        results.push({
          ...videos[i],
          analysis: getBasicAnalysis(videos[i]),
          analyzedAt: new Date().toISOString()
        });
      }
    }
    
    return results.length > 0 ? results : null;
    
  } catch (error) {
    console.error('Batch analysis error:', error);
    return null;
  }
}

async function searchWithApify(keywords) {
  if (!process.env.APIFY_API_KEY) {
    throw new Error('APIFY_API_KEY not configured');
  }

  const response = await axios.post(
    'https://api.apify.com/v2/acts/clockworks~free-tiktok-scraper/run-sync-get-dataset-items',
    {
      hashtags: [keywords],
      resultsPerPage: 20,
      shouldDownloadVideos: false,
      shouldDownloadCovers: true
    },
    {
      params: { token: process.env.APIFY_API_KEY },
      headers: { 'Content-Type': 'application/json' },
      timeout: 120000
    }
  );

  if (!response.data || response.data.length === 0) {
    return null;
  }
  
  return response.data.map(item => ({
    id: item.id,
    url: item.webVideoUrl,
    author: item.authorMeta?.name || 'Unknown',
    description: item.text || 'No description',
    title: item.text || 'No title',
    coverUrl: item.covers?.default || item.covers?.origin,
    views: item.playCount || 0,
    likes: item.diggCount || 0,
    comments: item.commentCount || 0,
    shares: item.shareCount || 0
  }));
}

function getBasicAnalysis(video) {
  return {
    fullText: `## Analysis for @${video.author}

**Video:** ${video.title || video.description}

This video has ${video.views?.toLocaleString() || '0'} views and ${video.likes?.toLocaleString() || '0'} likes.

**To get a detailed AI-powered replication guide:**
1. Configure your GEMINI_API_KEY in Vercel environment variables
2. Or upgrade to Pro plan for unlimited AI analyses

**Basic Insights:**
- This is a viral format worth studying
- Focus on the first 3 seconds (the hook)
- Keep it authentic and relatable
- Use natural lighting when possible
- Edit tightly - 2 second average cuts`,
    structured: {
      replicationScore: 7,
      difficulty: 5,
      budget: 50,
      canBeginneerDoIt: 'yes-with-conditions',
      visionUsed: false
    }
  };
}

function getDemoResults(keywords) {
  return [
    {
      id: 'demo1',
      url: 'https://www.tiktok.com/@demo/video/demo1',
      author: 'demo_creator',
      description: `Demo: "${keywords}" - Add API keys for real analysis`,
      title: `Demo: ${keywords}`,
      views: 1250000,
      likes: 85000,
      analysis: getBasicAnalysis({ 
        title: `Demo: ${keywords}`, 
        author: 'demo_creator',
        views: 1250000,
        likes: 85000
      })
    }
  ];
}

export const config = {
  api: { 
    responseLimit: false,
    bodyParser: { sizeLimit: '10mb' }
  },
  maxDuration: 300
};
