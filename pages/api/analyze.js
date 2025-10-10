// pages/api/analyze.js - 完整修复版
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

  // 调试：检查环境变量
  console.log('=== 环境变量状态 ===');
  console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✅ 存在' : '❌ 缺失');
  console.log('APIFY_API_KEY:', process.env.APIFY_API_KEY ? '✅ 存在' : '❌ 缺失');

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
    console.log('🤖 调用 Gemini API...');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

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
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Gemini 成功！长度:', text.length);
    return parseAnalysis(text);
    
  } catch (error) {
    console.error('❌ Gemini 错误:', error.message);
    return getBasicAnalysis(video);
  }
}

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
    analysis: extract('Analysis')
  };
}

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
    analysis: `📋 Basic metadata only. Add GEMINI_API_KEY to .env.local for AI analysis.`
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
        hook: 'Attention-grabbing question',
        visualHook: 'Close-up shot with text overlay',
        transcript: 'Demo mode - Add API keys for real analysis',
        captions: 'Text overlays',
        audioType: 'Human narration',
        cta: 'Link in bio',
        tone: 'Educational',
        isAd: 'NO',
        analysis: '🎯 Demo Analysis - Add API keys in .env.local for real results'
      }
    }
  ];
}

export const config = {
  api: { responseLimit: false }
}
