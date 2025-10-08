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
    // 步骤 1: 使用 tiktok-scraper 获取视频信息
    console.log('Fetching TikTok video data for:', url);
    
    const videoData = await TikTokScraper.getVideoMeta(url, {
      noWaterMark: false,
      hdVideo: false
    });

    if (!videoData || !videoData.collector || videoData.collector.length === 0) {
      return res.status(404).json({ error: 'Video not found or unavailable' });
    }

    const video = videoData.collector[0];
    
    console.log('Video data retrieved:', {
      id: video.id,
      text: video.text?.substring(0, 50),
      author: video.authorMeta?.name
    });

    // 步骤 2: 使用 OpenAI 分析视频数据
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // 提取 hashtags
    const hashtags = video.hashtags ? video.hashtags.map(tag => `#${tag.name}`).join(' ') : 'None';
    
    // 格式化统计数据
    const stats = {
      views: video.playCount || 0,
      likes: video.diggCount || 0,
      comments: video.commentCount || 0,
      shares: video.shareCount || 0
    };

    const analysisPrompt = `
Analyze this TikTok video based on the following information:

**Video Description:** 
${video.text || 'No description available'}

**Hashtags:** ${hashtags}

**Duration:** ${video.videoMeta?.duration || 'Unknown'} seconds

**Performance Stats:**
- 👁️ Views: ${stats.views.toLocaleString()}
- ❤️ Likes: ${stats.likes.toLocaleString()}
- 💬 Comments: ${stats.comments.toLocaleString()}
- 🔄 Shares: ${stats.shares.toLocaleString()}
- 📊 Engagement Rate: ${calculateEngagementRate(stats)}%

**Music:** ${video.musicMeta?.musicName || 'Unknown'}

**Creator:** @${video.authorMeta?.name || 'Unknown'} (${video.authorMeta?.fans?.toLocaleString() || 0} followers)

**Posted:** ${video.createTime ? new Date(video.createTime * 1000).toLocaleDateString() : 'Unknown'}

Please provide a comprehensive analysis in this format:

## 🎯 Hook & Opening Analysis
Analyze the first 3 seconds based on the description and context. What makes viewers stop scrolling?

## 📝 Content Strategy
Evaluate the overall content approach, theme, and messaging.

## 💬 Caption & Hashtag Strategy
Analyze the effectiveness of the caption and hashtag selection.

## 🎵 Audio Strategy
Comment on the music choice and its relevance to the content.

## 📊 Performance Analysis
Based on the metrics, evaluate:
- Engagement quality (likes, comments, shares ratio)
- Audience reception
- What's working well

## 🎬 Call-to-Action (CTA)
Identify any CTAs and evaluate their effectiveness.

## ⭐ Key Strengths
List 3-5 things this video does really well.

## 🚀 Improvement Recommendations
Provide 3-5 specific, actionable suggestions to boost performance.

## 🔥 Viral Potential Score: X/10
Rate the viral potential and explain the reasoning.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert TikTok content strategist and viral video analyst. Provide detailed, actionable insights based on video metadata, description, and performance metrics. Be specific and practical."
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

    // 返回完整数据
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
    
    // 更详细的错误信息
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

// 计算互动率
function calculateEngagementRate(stats) {
  if (!stats.views || stats.views === 0) return 0;
  
  const totalEngagements = stats.likes + stats.comments + stats.shares;
  const rate = (totalEngagements / stats.views) * 100;
  
  return rate.toFixed(2);
}
