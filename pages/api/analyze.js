// pages/api/analyze.js
import { getTikTokVideoUrl, extractKeyFrames, getCoverImageBase64 } from '../../lib/videoProcessor';
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
    
    // 2. 获取封面图（最简单，最可靠）
    console.log('🖼️ Getting cover image...');
    let coverBase64 = null;
    if (videoData.coverUrl) {
      try {
        coverBase64 = await getCoverImageBase64(videoData.coverUrl);
      } catch (error) {
        console.error('Cover image failed:', error.message);
      }
    }

    // 3. 尝试提取关键帧（可选，如果有 API key）
    let frameImages = [];
    if (videoData.videoUrl && process.env.SHOTSTACK_API_KEY) {
      console.log('🎞️ Extracting key frames...');
      try {
        const frames = await extractKeyFrames(videoData.videoUrl);
        frameImages = await Promise.all(
          frames.map(async (frameUrl) => {
            if (!frameUrl) return null;
            try {
              return await imageUrlToBase64(frameUrl);
            } catch (e) {
              return null;
            }
          })
        );
        frameImages = frameImages.filter(Boolean);
      } catch (error) {
        console.error('Frame extraction failed:', error.message);
      }
    }

    // 4. 优先使用帧，如果没有就用封面
    const imagesToAnalyze = frameImages.length > 0 ? frameImages : 
                           coverBase64 ? [coverBase64] : [];

    // 5. Vision 分析
    let visionAnalysis = null;
    if (imagesToAnalyze.length > 0) {
      console.log(`🤖 Analyzing with ${imagesToAnalyze.length} image(s)...`);
      try {
        visionAnalysis = await analyzeWithGeminiVision(videoData, imagesToAnalyze);
      } catch (error) {
        console.error('Vision analysis failed:', error.message);
      }
    }

    // 6. 如果 Vision 失败，回退到文本分析
    let analysis;
    if (visionAnalysis) {
      console.log('✅ Vision analysis successful');
      analysis = visionAnalysis;
    } else {
      console.log('⚠️ Falling back to text analysis');
      analysis = await analyzeWithGeminiText(videoData);
    }

    return {
      url: url,
      ...videoData,
      analysis: analysis,
      visionUsed: !!visionAnalysis,
      analyzedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ Video analysis failed:', error);
    throw new Error(`Video analysis failed: ${error.message}`);
  }
}

/**
 * Fallback: 文本分析（当 Vision 不可用时）
 */
async function analyzeWithGeminiText(videoData) {
  if (!process.env.GEMINI_API_KEY) {
    return getBasicAnalysis(videoData);
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `Analyze this TikTok video for replication.

VIDEO INFO:
- Title: "${videoData.title || videoData.description}"
- Creator: @${videoData.author}
- Views: ${videoData.views || 'Unknown'}
- Likes: ${videoData.likes || 'Unknown'}

Provide detailed replication guide including:
1. Can a beginner replicate this? (Yes/No/With conditions)
2. Equipment needed (specific items with costs)
3. Shot-by-shot filming guide
4. Products to monetize with (3 specific examples)
5. Common mistakes to avoid
6. Replication difficulty score (1-10)
7. Expected results

Be extremely specific and actionable.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return {
      fullText: text,
      structured: {
        replicationScore: 7, // Default when can't extract
        visionUsed: false
      }
    };

  } catch (error) {
    console.error('Text analysis failed:', error);
    return getBasicAnalysis(videoData);
  }
}

/**
 * 批量视频分析（关键词搜索）
 */
async function analyzeBatchVideos(keywords) {
  console.log('🔍 Batch search for:', keywords);
  
  try {
    const videos = await searchWithApify(keywords);
    
    if (!videos || videos.length === 0) {
      return null;
    }
    
    console.log(`✅ Found ${videos.length} videos`);
    
    // 批量分析前 2 个（避免超时）
    const results = [];
    const analyzeCount = Math.min(videos.length, 2);
    
    for (let i = 0; i < analyzeCount; i++) {
      try {
        console.log(`Analyzing ${i + 1}/${analyzeCount}...`);
        
        const analysis = await Promise.race([
          analyzeWithGeminiText(videos[i]),
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

/**
 * Apify 搜索
 */
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

/**
 * Basic analysis fallback
 */
function getBasicAnalysis(video) {
  return {
    fullText: `Vision analysis not available. Configure GEMINI_API_KEY for AI-powered analysis.

Basic information:
- Video: ${video.title || video.description}
- Creator: @${video.author}
- This is a viral video format worth studying.

To get detailed replication guide with equipment list, shot-by-shot instructions, and monetization advice, please add GEMINI_API_KEY to your environment variables.`,
    structured: {
      replicationScore: null,
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
        author: 'demo_creator' 
      })
    }
  ];
}

// Vercel 配置
export const config = {
  api: { 
    responseLimit: false,
    bodyParser: { sizeLimit: '10mb' }
  },
  maxDuration: 300
};
