// ========== 最顶部：import 语句 ==========
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

// ========== 主函数 ==========
export default async function handler(req, res) {
  // 🔍 调试代码
  console.log('=== 环境变量调试 ===');
  console.log('GEMINI_API_KEY 存在?', !!process.env.GEMINI_API_KEY);
  console.log('GEMINI_API_KEY 长度:', process.env.GEMINI_API_KEY?.length);
  console.log('APIFY_API_KEY 存在?', !!process.env.APIFY_API_KEY);
  console.log('==================');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { input } = req.body;

  if (!input) {
    return res.status(400).json({ error: 'Input required' });
  }

  try {
    const isTikTokURL = input.includes('tiktok.com');
    
    if (isTikTokURL) {
      const result = await analyzeSingleVideo(input);
      return res.status(200).json({
        success: true,
        mode: 'single',
        results: [result]
      });
    } else {
      const results = await analyzeBatchVideos(input);
      
      if (!results || results.length === 0) {
        return res.status(200).json({
          success: true,
          mode: 'batch',
          demo: true,
          results: getDemoResults(input)
        });
      }
      
      return res.status(200).json({
        success: true,
        mode: 'batch',
        results: results
      });
    }
  } catch (error) {
    console.error('❌ API Error:', error);
    return res.status(500).json({ 
      error: error.message
    });
  }
}

// ========== 辅助函数 ==========
async function analyzeSingleVideo(url) {
  try {
    console.log('📹 分析单个视频:', url);
    const metadata = await fetchMetadata(url);
    const analysis = await analyzeWithGemini(metadata);
    
    return {
      url: url,
      ...metadata,
      analysis: analysis,
      analyzedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('分析失败:', error);
    throw new Error('Unable to analyze video: ' + error.message);
  }
}

async function analyzeBatchVideos(keywords) {
  console.log('🔍 批量搜索:', keywords);
  
  if (!process.env.APIFY_API_KEY) {
    console.log('⚠️  无 APIFY_API_KEY，使用演示数据');
    return getDemoResults(keywords);
  }
  
  try {
    const videos = await searchWithApify(keywords);
    
    if (!videos || videos.length === 0) {
      return getDemoResults(keywords);
    }
    
    const results = [];
    for (let i = 0; i < Math.min(videos.length, 5); i++) {
      try {
        const analysis = await analyzeWithGemini(videos[i]);
        results.push({
          ...videos[i],
          analysis,
          analyzedAt: new Date().toISOString()
        });
      } catch (error) {
        console.error(`视频 ${i} 分析失败:`, error);
      }
    }
    
    return results.length > 0 ? results : getDemoResults(keywords);
    
  } catch (error) {
    console.error('批量分析错误:', error);
    return getDemoResults(keywords);
  }
}

async function fetchMetadata(url) {
  try {
    const oembed = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
    const res = await axios.get(oembed, { 
      timeout: 10000,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    
    return {
      title: res.data.title || 'No title',
      author: res.data.author_name || 'Unknown',
      description: res.data.title,
      thumbnail: res.data.thumbnail_url
    };
  } catch (error) {
    console.error('获取元数据失败:', error);
    return {
      title: 'Unable to fetch metadata',
      author: 'Unknown',
      description: 'Could not retrieve video information'
    };
  }
}

async function analyzeWithGemini(video) {
  if (!process.env.GEMINI_API_KEY) {
    console.log('⚠️  无 GEMINI_API_KEY');
    return getBasicAnalysis(video);
  }

  try {
    console.log('🤖 使用 REST API 调用 Gemini...');
    
    const prompt = `You are a TikTok viral content analyst AND an AI image generation prompt expert. Analyze this video following Steven's 7-day market research framework, and ALSO generate AI prompts for recreating the visual style.

Video Information:
- Title: ${video.title || video.description}
- Author: @${video.author}

Provide a DETAILED analysis in this EXACT format:

ContentType: [Choose ONE: UGC_faceless / UGC_with_face / professional / hybrid]

Category: [Choose ONE: Tutorial / Review / Challenge / Vlog / Entertainment / Educational / Story / Transformation]

🎯 HOOK (First 3 Seconds):
- Opening Line: [Exact words or concept used in first 3 seconds]
- Visual Action: [What happens visually - walking, putting down camera, close-up, etc.]
- Emotion: [What emotion is conveyed - surprise, curiosity, shock, etc.]
- Why It Works: [Why this hook grabs attention]

📖 STORY LINE (Pain Points & Journey):
- Main Pain Point: [What problem or struggle is highlighted]
- User Experience: [Specific experiences or emotions described]
- Emotional Resonance: [How it connects with the audience]
- Key Phrases: [Memorable quotes or statements]

🎬 CALL TO ACTION / SOLUTION:
- Ending: [How the video concludes]
- Recommendation: [What product, method, or solution is suggested]
- User Action: [What viewers are expected to do - click link, try method, comment, etc.]

🎨 VISUAL ELEMENTS:
- Filming Style: [Selfie, walking shot, static, montage, etc.]
- Scene Setting: [Location, background, lighting]
- Color Palette: [Dominant colors - warm/cool/vibrant/muted]
- Composition: [Framing, rule of thirds, close-up, wide shot]
- Lighting: [Natural, studio, dramatic, soft, harsh]
- Text Overlays: [Any on-screen text, captions, or graphics]
- Visual Effects: [Filters, transitions, speed changes]

🎵 AUDIO TYPE:
[Human narration / Background music with text / Trending audio / Silent with captions / Voice-over]

💡 TONE & ENERGY:
[High-Energy / Calm & Informative / Emotional / Humorous / Inspirational / Urgent]

💰 IS AD:
[YES / NO] - If YES, explain what is being promoted and how

🔥 SUCCESS FACTORS (Why It Goes Viral):
1. [First key success factor]
2. [Second key success factor]
3. [Third key success factor]

📋 REPLICABLE ELEMENTS:
- [Element 1 you can copy]
- [Element 2 you can copy]
- [Element 3 you can copy]

🤖 AI PROMPT ENGINEERING:

**STEP 1 - Reference Image Analysis:**
Based on the visual elements above, here's the AI prompt to recreate this video's style:

Midjourney/DALL-E Prompt:
[Detailed prompt describing: subject, setting, lighting, color palette, camera angle, mood, style. Example: "A close-up selfie shot of a person in natural lighting, soft focus background, warm color grading, authentic UGC style, shot on iPhone, slightly grainy texture, casual home setting"]

Stable Diffusion Prompt:
[Similar but optimized for SD: include technical details like "photorealistic, 8k, natural lighting, shallow depth of field, bokeh effect"]

**STEP 2 - Product Replacement Strategy:**
To recreate this visual style with YOUR product:

Original Subject: [What was shown in the video]
Your Product Placement: [How to position your product in similar style]

Combined AI Prompt Template:
"[YOUR PRODUCT] + [scene setting from Step 1] + [lighting and composition] + [style and mood]"

Example: If original was "person holding vape pen in bedroom", your prompt could be:
"[YOUR PRODUCT NAME] held in hand, cozy bedroom setting, natural window lighting from left, warm color grading 2700K, authentic UGC aesthetic, shot on iPhone 14, slightly grainy texture, close-up composition, soft focus background, shallow depth of field"

**STEP 3 - Shot-by-Shot Breakdown:**
Scene 1 (0-3s): [First 3 seconds visual description + specific AI prompt for this shot]
Scene 2 (3-10s): [Middle section visual + AI prompt]
Scene 3 (10-15s): [Ending visual + AI prompt]

🎯 VISUAL REPLICATION GUIDE:
- Camera Settings to Mimic: [Phone/DSLR, Portrait mode, specific settings]
- Editing Style: [Filters used, color grading specifics, transitions]
- Props/Background: [What objects or settings to include]
- Timing: [Duration of each shot, pacing]
- Text Style: [Font, animation, placement if applicable]

🎬 CONTENT STRATEGY INSIGHTS:
[2-3 sentences on how this content format can be replicated for other products/niches, and why this approach works for viral content]`;

    // 🎯 使用 REST API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
        }
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 60000
      }
    );

    const text = response.data.candidates[0].content.parts[0].text;
    console.log('✅ Gemini 成功！长度:', text.length);
    return parseDetailedAnalysis(text);
    
  } catch (error) {
    console.error('❌ Gemini 错误:', error.message);
    if (error.response) {
      console.error('错误详情:', JSON.stringify(error.response.data));
    }
    return getBasicAnalysis(video);
  }
}

function parseDetailedAnalysis(text) {
  const extractSection = (header) => {
    const regex = new RegExp(`${header}[:\\s]*([\\s\\S]*?)(?=\\n\\n[🎯📖🎬🎨🎵💡💰🔥📋🤖🎬]|$)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  };

  const extractSimple = (field) => {
    const regex = new RegExp(`${field}:\\s*(.+?)(?:\\n|$)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : 'Not specified';
  };

  // 提取 AI 提示词的各个步骤
  const extractAIPrompt = () => {
    const aiSection = extractSection('🤖 AI PROMPT ENGINEERING') || extractSection('AI PROMPT');
    
    // 提取 Step 1 - 参考图提示词
    const mjMatch = aiSection.match(/Midjourney\/DALL-E Prompt[:\s]*([\s\S]*?)(?=Stable Diffusion|STEP 2|$)/i);
    const mjPrompt = mjMatch ? mjMatch[1].trim().replace(/^\[|\]$/g, '').replace(/^"|"$/g, '') : '';
    
    const sdMatch = aiSection.match(/Stable Diffusion Prompt[:\s]*([\s\S]*?)(?=\*\*STEP 2|$)/i);
    const sdPrompt = sdMatch ? sdMatch[1].trim().replace(/^\[|\]$/g, '').replace(/^"|"$/g, '') : '';
    
    // 提取 Step 2 - 产品替换策略
    const templateMatch = aiSection.match(/Combined AI Prompt Template[:\s]*([\s\S]*?)(?=Example:|STEP 3|$)/i);
    const combinedTemplate = templateMatch ? templateMatch[1].trim().replace(/^"|"$/g, '') : '';
    
    const exampleMatch = aiSection.match(/Example:[\s\S]*?your prompt could be[:\s]*([\s\S]*?)(?=\*\*STEP 3|$)/i);
    const example = exampleMatch ? exampleMatch[1].trim().replace(/^"|"$/g, '') : '';
    
    // 提取 Step 3 - 分镜头
    const step3Match = aiSection.match(/\*\*STEP 3[\s\S]*?:([\s\S]*?)(?=🎯|$)/i);
    const shotBreakdown = step3Match ? step3Match[1].trim() : '';
    
    return {
      step1: {
        midjourneyPrompt: mjPrompt,
        stableDiffusionPrompt: sdPrompt
      },
      step2: {
        template: combinedTemplate,
        example: example
      },
      step3: {
        breakdown: shotBreakdown
      }
    };
  };

  return {
    contentType: extractSimple('ContentType'),
    category: extractSimple('Category'),
    hook: extractSection('🎯 HOOK') || extractSection('HOOK'),
    storyLine: extractSection('📖 STORY LINE') || extractSection('STORY LINE'),
    cta: extractSection('🎬 CALL TO ACTION') || extractSection('CALL TO ACTION'),
    visualElements: extractSection('🎨 VISUAL ELEMENTS') || extractSection('VISUAL ELEMENTS'),
    audioType: extractSection('🎵 AUDIO TYPE') || extractSection('AUDIO TYPE'),
    tone: extractSection('💡 TONE') || extractSimple('TONE'),
    isAd: extractSimple('IS AD'),
    successFactors: extractSection('🔥 SUCCESS FACTORS') || extractSection('SUCCESS FACTORS'),
    replicableElements: extractSection('📋 REPLICABLE ELEMENTS') || extractSection('REPLICABLE ELEMENTS'),
    
    // 🎨 AI 提示词
    aiPrompts: extractAIPrompt(),
    visualReplicationGuide: extractSection('🎯 VISUAL REPLICATION GUIDE'),
    
    strategyInsights: extractSection('🎬 CONTENT STRATEGY INSIGHTS') || extractSection('CONTENT STRATEGY INSIGHTS'),
    fullAnalysis: text
  };
}

function getBasicAnalysis(video) {
  return {
    contentType: 'Unknown',
    category: 'Unknown',
    hook: `Based on: "${video.title || video.description}"`,
    visualElements: 'Add GEMINI_API_KEY for full analysis',
    audioType: 'Unknown',
    tone: 'Unknown',
    isAd: 'Unknown',
    successFactors: '📋 Basic metadata only. Add GEMINI_API_KEY for AI analysis.',
    aiPrompts: {
      step1: {
        midjourneyPrompt: 'AI analysis requires GEMINI_API_KEY',
        stableDiffusionPrompt: 'AI analysis requires GEMINI_API_KEY'
      },
      step2: {
        template: 'Please add GEMINI_API_KEY to unlock AI prompt generation',
        example: ''
      },
      step3: {
        breakdown: ''
      }
    }
  };
}

async function searchWithApify(keywords) {
  try {
    const response = await axios.post(
      'https://api.apify.com/v2/acts/clockworks~free-tiktok-scraper/run-sync-get-dataset-items',
      {
        hashtags: [keywords],
        resultsPerPage: 20,
        shouldDownloadVideos: false,
        shouldDownloadCovers: false
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
      views: item.playCount || 0,
      likes: item.diggCount || 0,
      comments: item.commentCount || 0,
      shares: item.shareCount || 0
    }));
    
  } catch (error) {
    console.error('Apify 错误:', error.message);
    return null;
  }
}

function getDemoResults(keywords) {
  return [
    {
      id: 'demo1',
      url: 'https://tiktok.com/@demo/video/1',
      author: 'demo_creator',
      description: `Demo video about ${keywords}`,
      title: `Demo: ${keywords}`,
      views: 100000,
      likes: 5000,
      comments: 200,
      shares: 100,
      analysis: {
        contentType: 'UGC_with_face',
        category: 'Tutorial',
        hook: 'Attention-grabbing question in first 3 seconds',
        visualElements: 'Close-up shot with text overlay',
        audioType: 'Human narration',
        tone: 'Educational',
        isAd: 'NO',
        successFactors: '🎯 Demo Analysis - Add API keys in Vercel for real results',
        aiPrompts: {
          step1: {
            midjourneyPrompt: 'Demo mode - Add GEMINI_API_KEY for AI prompts',
            stableDiffusionPrompt: 'Demo mode - Add GEMINI_API_KEY for AI prompts'
          },
          step2: {
            template: 'Add API keys to unlock this feature',
            example: ''
          },
          step3: {
            breakdown: ''
          }
        }
      }
    }
  ];
}

export const config = {
  api: { responseLimit: false }
}
