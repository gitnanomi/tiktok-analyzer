import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { input, count = 20 } = req.body;

  try {
    // 🎯 智能识别输入类型
    const isTikTokURL = input.includes('tiktok.com');
    
    if (isTikTokURL) {
      // 场景1: 单URL分析
      console.log('🔗 Single URL Analysis Mode');
      const result = await analyzeSingleVideo(input);
      return res.status(200).json({
        success: true,
        mode: 'single',
        results: [result]
      });
    } else {
      // 场景2: 批量关键词搜索
      console.log('📊 Batch Analysis Mode');
      const results = await analyzeBatchVideos(input, count);
      return res.status(200).json({
        success: true,
        mode: 'batch',
        total: results.length,
        results: results
      });
    }

  } catch (error) {
    console.error('❌ Analysis error:', error);
    return res.status(500).json({ 
      error: 'Analysis failed',
      message: error.message
    });
  }
}

// ============================================
// 单个URL分析
// ============================================
async function analyzeSingleVideo(url) {
  console.log('🔍 Step 1: Fetching video metadata...');
  
  // 获取元数据
  const metadata = await fetchVideoMetadata(url);
  
  // 尝试获取视频URL
  let videoUrl = null;
  try {
    videoUrl = await getVideoDownloadUrl(url);
  } catch (error) {
    console.log('⚠️ Could not get video URL, will use metadata only');
  }

  console.log('🤖 Step 2: Analyzing with Gemini...');
  
  // 如果有视频URL，使用视频分析；否则用文本分析
  const analysis = videoUrl 
    ? await analyzeVideoWithGemini({ ...metadata, videoUrl })
    : await analyzeTextWithGemini(metadata);

  return {
    url: url,
    ...metadata,
    analysis: analysis,
    analyzedAt: new Date().toISOString()
  };
}

// ============================================
// 批量关键词分析
// ============================================
async function analyzeBatchVideos(keywords, maxCount) {
  console.log(`🔍 Step 1: Searching TikTok for "${keywords}"...`);
  
  // 使用Apify搜索
  const videos = await searchTikTokVideos(keywords, maxCount);
  
  if (!videos || videos.length === 0) {
    throw new Error('No videos found');
  }

  console.log(`✅ Found ${videos.length} videos`);
  console.log('🎬 Step 2: Analyzing videos...');

  // 批量分析（限制前5个以节省时间/成本）
  const results = [];
  const analyzeCount = Math.min(videos.length, 5);
  
  for (let i = 0; i < analyzeCount; i++) {
    const video = videos[i];
    console.log(`  Processing ${i + 1}/${analyzeCount}: ${video.id}`);
    
    try {
      const analysis = await analyzeVideoWithGemini(video);
      results.push({
        ...video,
        analysis,
        analyzedAt: new Date().toISOString()
      });
      
      // 避免rate limit
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`  ❌ Failed: ${error.message}`);
      results.push({
        ...video,
        analysis: {
          error: 'Analysis failed',
          message: error.message
        }
      });
    }
  }

  console.log('✅ Batch analysis complete!');
  return results;
}

// ============================================
// 核心功能：Gemini视频分析
// ============================================
async function analyzeVideoWithGemini(video) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash-exp" 
  });

  try {
    // Step 1: 下载视频
    console.log('    📥 Downloading video...');
    const videoResponse = await axios.get(video.videoUrl, {
      responseType: 'arraybuffer',
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    // Step 2: 上传到Gemini Files API
    console.log('    ☁️ Uploading to Gemini...');
    const uploadResult = await uploadVideoToGemini(
      videoResponse.data, 
      video.id || 'video'
    );

    // Step 3: 等待处理
    console.log('    ⏳ Waiting for processing...');
    await new Promise(resolve => setTimeout(resolve, 10000));

    // Step 4: AI分析
    console.log('    🤖 Analyzing...');
    const prompt = createAnalysisPrompt(video);

    const result = await model.generateContent([
      {
        fileData: {
          mimeType: "video/mp4",
          fileUri: uploadResult.file.uri
        }
      },
      { text: prompt }
    ]);

    const analysisText = result.response.text();
    return parseGeminiResponse(analysisText);

  } catch (error) {
    console.error('    ❌ Gemini analysis failed:', error.message);
    
    // 降级：如果视频分析失败，尝试文本分析
    console.log('    🔄 Falling back to text analysis...');
    return await analyzeTextWithGemini(video);
  }
}

// ============================================
// 降级方案：纯文本分析
// ============================================
async function analyzeTextWithGemini(video) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash" 
  });

  const prompt = createAnalysisPrompt(video);
  const result = await model.generateContent(prompt);
  
  return parseGeminiResponse(result.response.text());
}

// ============================================
// 辅助函数
// ============================================

// 搜索TikTok视频（Apify）
async function searchTikTokVideos(keywords, maxItems) {
  try {
    const response = await axios.post(
      'https://api.apify.com/v2/acts/clockworks~free-tiktok-scraper/run-sync-get-dataset-items',
      {
        hashtags: [keywords],
        resultsPerPage: maxItems,
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

    return response.data.map(item => ({
      id: item.id,
      url: item.webVideoUrl,
      videoUrl: item.videoUrl,
      author: item.authorMeta?.name,
      description: item.text,
      views: item.playCount,
      likes: item.diggCount,
      comments: item.commentCount,
      shares: item.shareCount,
      hashtags: item.hashtags?.map(h => h.name),
      musicTitle: item.musicMeta?.musicName,
      duration: item.videoMeta?.duration,
      createdAt: item.createTime
    }));
  } catch (error) {
    // 如果Apify失败，返回空数组
    console.error('Apify error:', error.message);
    return [];
  }
}

// 获取视频元数据（oEmbed）
async function fetchVideoMetadata(url) {
  try {
    const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
    const response = await axios.get(oembedUrl, { timeout: 10000 });
    
    return {
      title: response.data.title,
      author: response.data.author_name,
      thumbnail: response.data.thumbnail_url,
      description: response.data.title
    };
  } catch (error) {
    return {
      title: 'Unable to fetch',
      author: 'Unknown',
      description: 'Metadata unavailable'
    };
  }
}

// 获取视频下载URL
async function getVideoDownloadUrl(url) {
  // 这里可以使用各种TikTok下载API
  // 示例：使用第三方服务或直接解析
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    // 从HTML中提取视频URL
    const videoUrlMatch = response.data.match(/"downloadAddr":"([^"]+)"/);
    if (videoUrlMatch) {
      return videoUrlMatch[1].replace(/\\u002F/g, '/');
    }
    
    throw new Error('Could not extract video URL');
  } catch (error) {
    throw new Error('Failed to get video download URL');
  }
}

// 上传视频到Gemini
async function uploadVideoToGemini(videoBuffer, videoId) {
  const FormData = require('form-data');
  const form = new FormData();
  
  form.append('file', videoBuffer, {
    filename: `${videoId}.mp4`,
    contentType: 'video/mp4'
  });

  const response = await axios.post(
    'https://generativelanguage.googleapis.com/upload/v1beta/files',
    form,
    {
      params: {
        key: process.env.GEMINI_API_KEY
      },
      headers: {
        ...form.getHeaders()
      },
      timeout: 60000
    }
  );

  return response.data;
}

// 创建分析Prompt
function createAnalysisPrompt(video) {
  return `Analyze this TikTok video in detail:

VIDEO METADATA:
- Description: "${video.description || video.title}"
- Author: @${video.author}
${video.views ? `- Views: ${video.views.toLocaleString()}` : ''}
${video.likes ? `- Likes: ${video.likes.toLocaleString()}` : ''}
${video.hashtags ? `- Hashtags: ${video.hashtags.join(', ')}` : ''}

Return analysis in this EXACT format:

ContentType: [UGC_faceless/UGC_with_face/professional]
Category: [Tutorial/Review/Challenge/Vlog/Entertainment/Educational/Other]
Hook: [First 3 seconds analysis]
VisualHook: [Visual elements that attract viewers]
Transcript: [Complete voiceover or "No voiceover"]
Captions: [Text overlays or "No text"]
AudioType: [Human narration/Background music/Silent]
CTA: [Call-to-action or "None"]
Tone: [High-Energy/Funny/Educational/Calming/Inspirational/etc]
IsAd: [YES/NO]
Analysis: [Key success factors - be specific and detailed]

Be precise and base analysis on what you actually see/hear in the video.`;
}

// 解析Gemini返回结果
function parseGeminiResponse(text) {
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
