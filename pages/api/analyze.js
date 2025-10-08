import OpenAI from 'openai';
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

  if (!url || !url.includes('tiktok.com')) {
    return res.status(400).json({ error: 'Invalid TikTok URL' });
  }

  try {
    // 步骤 1: 从 URL 提取视频 ID
    const videoId = extractVideoId(url);
    if (!videoId) {
      return res.status(400).json({ error: 'Could not extract video ID from URL' });
    }

    // 步骤 2: 获取 TikTok 视频元数据
    const videoData = await getTikTokVideoData(videoId);
    
    if (!videoData) {
      return res.status(404).json({ error: 'Video not found or unavailable' });
    }

    // 步骤 3: 使用 OpenAI 分析视频数据
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const analysisPrompt = `
Analyze this TikTok video based on the following information:

**Video Title/Description:** ${videoData.description || 'No description'}

**Hashtags:** ${videoData.hashtags ? videoData.hashtags.join(', ') : 'None'}

**Duration:** ${videoData.duration || 'Unknown'} seconds

**Stats:**
- Views: ${videoData.viewCount || 0}
- Likes: ${videoData.likeCount || 0}
- Comments: ${videoData.commentCount || 0}
- Shares: ${videoData.shareCount || 0}

**Music:** ${videoData.musicTitle || 'Unknown'}

**Creator:** @${videoData.authorUsername || 'Unknown'}

Please provide a comprehensive analysis in the following format:

## 🎯 Hook Analysis
[Analyze the opening/hook based on the description and title]

## 📝 Content Structure
[Analyze how the content is structured]

## 💬 Script & Messaging
[Analyze the text, hashtags, and messaging strategy]

## 🎵 Audio Strategy
[Comment on the music choice]

## 📊 Performance Insights
[Analyze the engagement metrics and what they indicate]

## 🎬 Call-to-Action (CTA)
[Identify any CTAs in the description or hashtags]

## ⭐ Key Recommendations
[Provide 3-5 actionable recommendations for improvement]

## 🔥 Viral Potential Score
[Rate the viral potential 1-10 and explain why]
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert TikTok content strategist and video analyst. Provide detailed, actionable insights based on video metadata and performance metrics."
        },
        {
          role: "user",
          content: analysisPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const analysis = completion.choices[0].message.content;

    return res.status(200).json({
      success: true,
      url: url,
      videoData: {
        description: videoData.description,
        hashtags: videoData.hashtags,
        stats: {
          views: videoData.viewCount,
          likes: videoData.likeCount,
          comments: videoData.commentCount,
          shares: videoData.shareCount
        },
        author: videoData.authorUsername,
        music: videoData.musicTitle
      },
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

// 提取 TikTok 视频 ID
function extractVideoId(url) {
  // 支持多种 TikTok URL 格式
  const patterns = [
    /tiktok\.com\/@[\w.-]+\/video\/(\d+)/,  // 标准格式
    /tiktok\.com\/v\/(\d+)/,                 // 短链接
    /vm\.tiktok\.com\/(\w+)/,                // 移动端短链接
    /vt\.tiktok\.com\/(\w+)/                 // 另一种短链接
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

// 获取 TikTok 视频数据
async function getTikTokVideoData(videoId) {
  try {
    // 方法 1: 使用 RapidAPI 的 TikTok API
    // 你需要在 https://rapidapi.com/ 注册并获取 API key
    const options = {
      method: 'GET',
      url: 'https://tiktok-video-no-watermark2.p.rapidapi.com/detail',
      params: { video_id: videoId },
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY, // 需要在 Vercel 环境变量中添加
        'X-RapidAPI-Host': 'tiktok-video-no-watermark2.p.rapidapi.com'
      }
    };

    const response = await axios.request(options);
    const data = response.data;

    if (data && data.data) {
      const video = data.data;
      return {
        description: video.title || video.desc,
        hashtags: video.textExtra ? video.textExtra.map(tag => tag.hashtagName) : [],
        duration: video.duration,
        viewCount: video.stats?.playCount || 0,
        likeCount: video.stats?.diggCount || 0,
        commentCount: video.stats?.commentCount || 0,
        shareCount: video.stats?.shareCount || 0,
        musicTitle: video.music?.title,
        authorUsername: video.author?.uniqueId
      };
    }

    // 方法 2: 备用方案 - 使用 TikTok 的 oEmbed API（有限的数据）
    return await getTikTokOembedData(videoId);

  } catch (error) {
    console.error('Error fetching TikTok data:', error);
    // 如果 RapidAPI 失败，尝试备用方案
    return await getTikTokOembedData(videoId);
  }
}

// 备用方案：使用 TikTok oEmbed API
async function getTikTokOembedData(videoId) {
  try {
    const url = `https://www.tiktok.com/oembed?url=https://www.tiktok.com/@user/video/${videoId}`;
    const response = await axios.get(url);
    
    if (response.data) {
      return {
        description: response.data.title,
        hashtags: [],
        duration: 0,
        viewCount: 0,
        likeCount: 0,
        commentCount: 0,
        shareCount: 0,
        musicTitle: null,
        authorUsername: response.data.author_name
      };
    }
  } catch (error) {
    console.error('oEmbed fallback failed:', error);
  }
  
  return null;
}
