// pages/api/analyze.js - 改进版
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

export default async function handler(req, res) {
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
      // 单URL分析
      const result = await analyzeSingleVideo(input);
      return res.status(200).json({
        success: true,
        mode: 'single',
        results: [result]
      });
    } else {
      // 批量搜索
      const results = await analyzeBatchVideos(input);
      
      if (!results || results.length === 0) {
        // 返回友好的提示信息
        return res.status(200).json({
          success: true,
          mode: 'batch',
          demo: true,
          message: 'Using demo data. To enable real search, add APIFY_API_KEY to your .env.local',
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
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: error.message,
      tip: 'Check your API keys in .env.local'
    });
  }
}

// 单个视频分析
async function analyzeSingleVideo(url) {
  try {
    console.log('Analyzing single video:', url);
    const metadata = await fetchMetadata(url);
    const analysis = await analyzeWithGemini(metadata);
    
    return {
      url: url,
      ...metadata,
      analysis: analysis,
      analyzedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Single video analysis failed:', error);
    throw new Error('Unable to analyze video: ' + error.message);
  }
}

// 批量视频分析
async function analyzeBatchVideos(keywords) {
  console.log('Batch search for:', keywords);
  
  // 检查是否有 Apify API Key
  if (!process.env.APIFY_API_KEY) {
    console.log('No APIFY_API_KEY found, using demo data');
    return getDemoResults(keywords);
  }
  
  try {
    const videos = await searchWithApify(keywords);
    
    if (!videos || videos.length === 0) {
      console.log('No videos found from Apify, using demo data');
      return getDemoResults(keywords);
    }
    
    console.log(`Found ${videos.length} videos, analyzing...`);
    const results = [];
    
    // 只分析前5个
    for (let i = 0; i < Math.min(videos.length, 5); i++) {
      try {
        const analysis = await analyzeWithGemini(videos[i]);
        results.push({
          ...videos[i],
          analysis,
          analyzedAt: new Date().toISOString()
        });
      } catch (error) {
        console.error(`Failed to analyze video ${i}:`, error);
      }
    }
    
    return results.length > 0 ? results : getDemoResults(keywords);
    
  } catch (error) {
    console.error('Batch analysis error:', error);
    return getDemoResults(keywords);
  }
}

// 获取元数据
async function fetchMetadata(url) {
  try {
    const oembed = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
    const res = await axios.get(oembed, { 
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    
    return {
      title: res.data.title || 'No title',
      author: res.data.author_name || 'Unknown',
      description: res.data.title,
      thumbnail: res.data.thumbnail_url
    };
  } catch (error) {
    console.error('Metadata fetch failed:', error);
    return {
      title: 'Unable to fetch metadata',
      author: 'Unknown',
      description: 'Could not retrieve video information'
    };
  }
}

// Gemini 分析
async function analyzeWithGemini(video) {
  if (!process.env.GEMINI_API_KEY) {
    console.log('No GEMINI_API_KEY found, using basic analysis');
    return getBasicAnalysis(video);
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Analyze this TikTok video:
Title: ${video.title || video.description}
Author: @${video.author}

Return analysis in this format:
ContentType: [UGC_faceless/UGC_with_face/professional]
Category: [Tutorial/Review/Challenge/Vlog/Entertainment/Educational]
Hook: [First 3 seconds analysis]
VisualHook: [Visual elements]
Transcript: [Inferred content or "No voiceover"]
Captions: [Text overlays or "No text"]
AudioType: [Human narration/Background music/Silent]
CTA: [Call-to-action or "None"]
Tone: [High-Energy/Funny/Educational/Calming/Inspirational]
IsAd: [YES/NO]
Analysis: [Detailed success factors]`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    return parseAnalysis(text);
  } catch (error) {
    console.error('Gemini analysis error:', error);
    return getBasicAnalysis(video);
  }
}

// 解析分析结果
function parseAnalysis(text) {
  const extract = (field) => {
    const regex = new RegExp(`${field}:\\s*(.+?)(?:\\n|$)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : 'Not specified';
  };

  return {
    contentType: extract('ContentType'),
    category: extract('Category'),
    hook: extract('Hook'),
    visualHook: extract('VisualHook'),
    transcript: extract('Transcript'),
    captions: extract('Captions'),
    audioType: extract('AudioType'),
    cta: extract('CTA'),
    tone: extract('Tone'),
    isAd: extract('IsAd'),
    analysis: extract('Analysis'),
    fullText: text
  };
}

// 基础分析（无 API Key）
function getBasicAnalysis(video) {
  return {
    contentType: 'Unknown',
    category: 'Unknown',
    hook: `Based on: "${video.title || video.description}"`,
    visualHook: 'Add GEMINI_API_KEY for full analysis',
    transcript: 'AI analysis requires GEMINI_API_KEY',
    captions: 'Unknown',
    audioType: 'Unknown',
    cta: 'Unknown',
    tone: 'Unknown',
    isAd: 'Unknown',
    analysis: `📋 Basic metadata only

Title: ${video.title}
Author: @${video.author}

🔑 To unlock full AI analysis:
1. Add GEMINI_API_KEY to .env.local
2. Get free key at: https://aistudio.google.com/app/apikey

💡 Current capabilities:
✅ Video metadata extraction
✅ Basic information display
❌ AI content analysis (requires API key)`
  };
}

// Apify 搜索
async function searchWithApify(keywords) {
  try {
    console.log('Calling Apify API...');
    
    const response = await axios.post(
      'https://api.apify.com/v2/acts/clockworks~free-tiktok-scraper/run-sync-get-dataset-items',
      {
        hashtags: [keywords],
        resultsPerPage: 20,
        shouldDownloadVideos: false,
        shouldDownloadCovers: false
      },
      {
        params: { 
          token: process.env.APIFY_API_KEY 
        },
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 120000
      }
    );

    if (!response.data || response.data.length === 0) {
      console.log('Apify returned empty results');
      return null;
    }

    console.log(`Apify returned ${response.data.length} videos`);
    
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
    console.error('Apify API error:', error.message);
    return null;
  }
}

// 演示数据
function getDemoResults(keywords) {
  return [
    {
      id: 'demo1',
      url: 'https://tiktok.com/@demo/video/1',
      author: 'demo_creator_1',
      description: `Demo video about ${keywords}`,
      title: `Demo: ${keywords} tutorial`,
      views: 125000,
      likes: 9800,
      comments: 340,
      shares: 180,
      analysis: {
        contentType: 'UGC_with_face',
        category: 'Tutorial',
        hook: 'Attention-grabbing question in first 3 seconds',
        visualHook: 'Close-up face shot with bold text overlay',
        transcript: 'Demo mode - Add APIFY_API_KEY to analyze real videos',
        captions: 'Text overlays with key points',
        audioType: 'Human narration',
        cta: 'Link in bio',
        tone: 'Educational',
        isAd: 'NO',
        analysis: `🎯 Demo Analysis

This is sample data. To analyze real TikTok videos:

1. Add APIFY_API_KEY to .env.local
   Get key at: https://console.apify.com/account/integrations

2. Add GEMINI_API_KEY for AI analysis
   Get key at: https://aistudio.google.com/app/apikey

💡 Current Status:
✅ UI Working
✅ Single URL analysis (with metadata)
❌ Batch search (needs APIFY_API_KEY)
❌ AI analysis (needs GEMINI_API_KEY)`
      }
    },
    {
      id: 'demo2',
      url: 'https://tiktok.com/@demo/video/2',
      author: 'demo_creator_2',
      description: `Another demo about ${keywords}`,
      title: `${keywords} - Product showcase`,
      views: 87000,
      likes: 6500,
      comments: 220,
      shares: 95,
      analysis: {
        contentType: 'UGC_faceless',
        category: 'Review',
        hook: 'Product reveal with dynamic transition',
        visualHook: 'Fast cuts and product close-ups',
        transcript: 'Demo transcript - upgrade for real analysis',
        captions: 'Multiple animated text overlays',
        audioType: 'Background music with voiceover',
        cta: 'Check link in bio',
        tone: 'High-Energy',
        isAd: 'YES',
        analysis: `📊 Demo Analysis #2

This is demonstration data showing what you'll get with full API access.

🔑 Next Steps:
1. Get APIFY API key (for batch search)
2. Get GEMINI API key (for AI analysis)
3. Add both to .env.local
4. Restart server

Then you'll see real video analysis instead of demos!`
      }
    }
  ];
}

export const config = {
  api: {
    responseLimit: false,
  },
}
