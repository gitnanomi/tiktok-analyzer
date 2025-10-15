// lib/videoProcessor.js
import axios from 'axios';

/**
 * 从 TikTok 获取视频直链和元数据
 */
export async function getTikTokVideoUrl(tiktokUrl) {
  try {
    // 方法 1: 使用 Apify (你已经有了)
    if (process.env.APIFY_API_KEY) {
      console.log('Fetching from Apify...');
      
      const response = await axios.post(
        'https://api.apify.com/v2/acts/clockworks~free-tiktok-scraper/run-sync-get-dataset-items',
        {
          postURLs: [tiktokUrl],
          resultsPerPage: 1,
          shouldDownloadVideos: false,
          shouldDownloadCovers: true
        },
        {
          params: { token: process.env.APIFY_API_KEY },
          headers: { 'Content-Type': 'application/json' },
          timeout: 60000
        }
      );

      if (response.data && response.data[0]) {
        const item = response.data[0];
        return {
          videoUrl: item.videoUrl,
          coverUrl: item.covers?.default || item.covers?.origin,
          author: item.authorMeta?.name || 'Unknown',
          description: item.text || 'No description',
          title: item.text || 'No title',
          views: item.playCount || 0,
          likes: item.diggCount || 0,
          comments: item.commentCount || 0,
          shares: item.shareCount || 0
        };
      }
    }

    // 方法 2: 使用 TikTok oEmbed (fallback)
    console.log('Falling back to oEmbed...');
    const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(tiktokUrl)}`;
    const oembedResponse = await axios.get(oembedUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    return {
      videoUrl: null,
      coverUrl: oembedResponse.data.thumbnail_url,
      author: oembedResponse.data.author_name || 'Unknown',
      description: oembedResponse.data.title || 'No description',
      title: oembedResponse.data.title || 'No title',
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0
    };

  } catch (error) {
    console.error('Failed to get TikTok video URL:', error.message);
    throw new Error('Cannot access TikTok video. Please try another URL.');
  }
}

/**
 * 从视频中提取关键帧（可选功能）
 * 如果没有配置 SHOTSTACK_API_KEY，会返回空数组
 */
export async function extractKeyFrames(videoUrl) {
  // 如果没有 ShotStack API key，跳过帧提取
  if (!process.env.SHOTSTACK_API_KEY) {
    console.log('No SHOTSTACK_API_KEY, skipping frame extraction');
    return [];
  }

  try {
    console.log('Extracting frames with ShotStack...');
    
    // 提取 3 个帧：开头、中间、结尾
    const frames = await Promise.all([
      extractFrameAtTime(videoUrl, 0.5, process.env.SHOTSTACK_API_KEY),
      extractFrameAtTime(videoUrl, '50%', process.env.SHOTSTACK_API_KEY),
      extractFrameAtTime(videoUrl, '95%', process.env.SHOTSTACK_API_KEY)
    ]);
    
    return frames.filter(f => f !== null);

  } catch (error) {
    console.error('Frame extraction error:', error.message);
    return [];
  }
}

/**
 * Shot Stack API - 提取单个帧
 */
async function extractFrameAtTime(videoUrl, time, apiKey) {
  try {
    // 创建渲染任务
    const createResponse = await axios.post(
      'https://api.shotstack.io/v1/render',
      {
        timeline: {
          background: '#000000',
          tracks: [{
            clips: [{
              asset: {
                type: 'video',
                src: videoUrl
              },
              start: 0,
              length: 0.04
            }]
          }]
        },
        output: {
          format: 'jpg',
          resolution: 'sd'
        }
      },
      {
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    const renderId = createResponse.data.response.id;

    // 等待渲染完成（最多 30 秒）
    let status = 'queued';
    let attempts = 0;
    let frameUrl = null;

    while (status !== 'done' && attempts < 15) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const statusResponse = await axios.get(
        `https://api.shotstack.io/v1/render/${renderId}`,
        {
          headers: { 'x-api-key': apiKey },
          timeout: 5000
        }
      );

      status = statusResponse.data.response.status;
      
      if (status === 'done') {
        frameUrl = statusResponse.data.response.url;
      }
      
      attempts++;
    }

    return frameUrl;

  } catch (error) {
    console.error('ShotStack error:', error.message);
    return null;
  }
}

/**
 * 将图片 URL 转换为 base64（无需 sharp）
 */
export async function imageUrlToBase64(imageUrl) {
  try {
    console.log('Converting image to base64:', imageUrl);
    
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 30000,
      maxContentLength: 10 * 1024 * 1024, // 最大 10MB
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    // 检查图片大小
    const sizeInMB = response.data.byteLength / (1024 * 1024);
    console.log(`Image size: ${sizeInMB.toFixed(2)}MB`);

    // 如果图片太大，警告但仍然处理
    if (sizeInMB > 4) {
      console.warn('Warning: Image larger than 4MB, may cause issues with Gemini API');
    }

    // 直接转换为 base64
    const base64 = Buffer.from(response.data, 'binary').toString('base64');
    
    console.log('Image converted successfully');
    return base64;

  } catch (error) {
    console.error('Image to base64 error:', error.message);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Image download timeout');
    }
    
    if (error.response?.status === 404) {
      throw new Error('Image not found');
    }
    
    throw error;
  }
}

/**
 * 获取封面图的 base64
 */
export async function getCoverImageBase64(coverUrl) {
  if (!coverUrl) {
    console.log('No cover URL provided');
    return null;
  }

  try {
    const base64 = await imageUrlToBase64(coverUrl);
    return base64;
  } catch (error) {
    console.error('Cover image error:', error.message);
    return null;
  }
}

/**
 * 批量转换多个图片 URL 为 base64
 */
export async function convertImagesToBase64(imageUrls) {
  const results = await Promise.allSettled(
    imageUrls.map(url => imageUrlToBase64(url))
  );

  return results
    .filter(r => r.status === 'fulfilled' && r.value !== null)
    .map(r => r.value);
}

/**
 * 验证 TikTok URL 格式
 */
export function isValidTikTokUrl(url) {
  const patterns = [
    /tiktok\.com\/@[\w.-]+\/video\/\d+/,
    /vt\.tiktok\.com\/[\w-]+/,
    /vm\.tiktok\.com\/[\w-]+/,
    /tiktok\.com\/v\/\d+/
  ];
  
  return patterns.some(pattern => pattern.test(url));
}

/**
 * 清理和标准化 TikTok URL
 */
export function normalizeTikTokUrl(url) {
  // 移除查询参数
  const cleanUrl = url.split('?')[0];
  
  // 确保是 HTTPS
  if (!cleanUrl.startsWith('http')) {
    return `https://${cleanUrl}`;
  }
  
  return cleanUrl;
}

/**
 * 从错误中提取友好的错误消息
 */
export function getErrorMessage(error) {
  if (error.message?.includes('timeout')) {
    return 'Request timeout. Please try again.';
  }
  
  if (error.message?.includes('404')) {
    return 'Video not found. Please check the URL.';
  }
  
  if (error.message?.includes('rate limit')) {
    return 'Too many requests. Please wait a moment and try again.';
  }
  
  if (error.message?.includes('network')) {
    return 'Network error. Please check your connection.';
  }
  
  return error.message || 'An unexpected error occurred';
}

/**
 * 重试逻辑包装器
 */
export async function withRetry(fn, maxRetries = 3, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      const isLastAttempt = i === maxRetries - 1;
      
      if (isLastAttempt) {
        throw error;
      }
      
      console.log(`Attempt ${i + 1} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
}
