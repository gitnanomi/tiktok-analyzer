import axios from 'axios';

/**
 * 从 TikTok URL 获取视频数据
 * 支持多种 TikTok URL 格式
 */
export async function getTikTokVideoUrl(url) {
  console.log('🎬 Processing TikTok URL:', url);

  try {
    // 清理 URL
    const cleanUrl = url.trim();
    
    // 使用 Apify 的 TikTok Scraper
    if (process.env.APIFY_API_KEY) {
      return await getTikTokDataFromApify(cleanUrl);
    }
    
    // 如果没有 Apify，返回基础数据
    console.log('⚠️ No APIFY_API_KEY, returning basic data');
    return {
      url: cleanUrl,
      author: 'demo_user',
      title: 'Demo video - Configure APIFY_API_KEY for real data',
      description: 'Demo video - Configure APIFY_API_KEY for real data',
      coverUrl: null,
      views: 1000000,
      likes: 50000,
      comments: 1000,
      shares: 500
    };

  } catch (error) {
    console.error('❌ getTikTokVideoUrl error:', error);
    throw new Error(`Failed to fetch TikTok video: ${error.message}`);
  }
}

/**
 * 使用 Apify 获取 TikTok 视频数据
 */
async function getTikTokDataFromApify(url) {
  console.log('📡 Fetching from Apify...');
  
  try {
    // 提取视频 ID
    const videoId = extractVideoId(url);
    if (!videoId) {
      throw new Error('Could not extract video ID from URL');
    }

    // 调用 Apify API
    const response = await axios.post(
      'https://api.apify.com/v2/acts/clockworks~free-tiktok-scraper/run-sync-get-dataset-items',
      {
        postURLs: [url],
        resultsPerPage: 1,
        shouldDownloadVideos: false,
        shouldDownloadCovers: true,
        shouldDownloadSubtitles: false
      },
      {
        params: {
          token: process.env.APIFY_API_KEY
        },
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 90000 // 90 seconds
      }
    );

    console.log('✅ Apify response received');

    if (!response.data || response.data.length === 0) {
      throw new Error('No data returned from Apify');
    }

    const videoData = response.data[0];
    
    // 格式化数据
    return {
      id: videoData.id || videoId,
      url: url,
      author: videoData.authorMeta?.name || videoData.author || 'Unknown',
      title: videoData.text || videoData.desc || 'No title',
      description: videoData.text || videoData.desc || 'No description',
      thumbnail: videoData.covers?.default || videoData.covers?.origin || videoData.videoMeta?.coverUrl,
      coverUrl: videoData.covers?.default || videoData.covers?.origin || videoData.videoMeta?.coverUrl,
      views: videoData.playCount || videoData.stats?.playCount || 0,
      likes: videoData.diggCount || videoData.stats?.diggCount || 0,
      comments: videoData.commentCount || videoData.stats?.commentCount || 0,
      shares: videoData.shareCount || videoData.stats?.shareCount || 0,
      musicName: videoData.musicMeta?.musicName,
      musicAuthor: videoData.musicMeta?.musicAuthor
    };

  } catch (error) {
    console.error('❌ Apify error:', error.message);
    
    // 如果 Apify 失败，返回基础数据而不是完全失败
    return {
      url: url,
      author: 'unknown',
      title: 'Video analysis available - API issue',
      description: 'Video analysis available - API issue',
      coverUrl: null,
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      _note: 'Apify failed, showing basic analysis only'
    };
  }
}

/**
 * 从 TikTok URL 提取视频 ID
 */
function extractVideoId(url) {
  // TikTok URL 格式示例:
  // https://www.tiktok.com/@username/video/1234567890123456789
  // https://vm.tiktok.com/ZMxxx/
  // https://vt.tiktok.com/ZSxxx/
  
  const patterns = [
    /\/video\/(\d+)/,           // Standard format
    /\/v\/(\d+)/,               // Short format
    /tiktok\.com\/(\d+)/,       // Direct ID
    /vm\.tiktok\.com\/([A-Za-z0-9]+)/, // Short link
    /vt\.tiktok\.com\/([A-Za-z0-9]+)/  // Short link v2
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * 获取封面图并转换为 base64
 */
export async function getCoverImageBase64(coverUrl) {
  if (!coverUrl) {
    console.log('❌ No cover URL provided');
    return null;
  }

  console.log('🖼️ Processing cover URL:', coverUrl);

  try {
    // 方法 1：直接下载
    const base64 = await imageUrlToBase64(coverUrl);
    console.log('✅ Method 1 success: Direct download');
    return base64;
  } catch (error1) {
    console.log('⚠️ Method 1 failed:', error1.message);
    
    try {
      // 方法 2：添加更多 headers
      const response = await axios.get(coverUrl, {
        responseType: 'arraybuffer',
        timeout: 20000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
          'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
          'Referer': 'https://www.tiktok.com/',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      });
      
      const base64 = Buffer.from(response.data, 'binary').toString('base64');
      console.log('✅ Method 2 success: With extra headers');
      return base64;
    } catch (error2) {
      console.log('⚠️ Method 2 failed:', error2.message);
      
      // 方法 3：使用代理服务
      try {
        const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(coverUrl)}`;
        console.log('🔄 Trying proxy:', proxyUrl);
        
        const response = await axios.get(proxyUrl, {
          responseType: 'arraybuffer',
          timeout: 20000
        });
        
        const base64 = Buffer.from(response.data, 'binary').toString('base64');
        console.log('✅ Method 3 success: Via proxy');
        return base64;
      } catch (error3) {
        console.error('❌ All methods failed:', error3.message);
        return null;
      }
    }
  }
}

/**
 * 将图片 URL 转换为 base64
 */
async function imageUrlToBase64(url) {
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
    timeout: 15000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  
  return Buffer.from(response.data, 'binary').toString('base64');
}

/**
 * 验证 TikTok URL 格式
 */
export function isValidTikTokUrl(url) {
  const tiktokPatterns = [
    /tiktok\.com\/@[\w.-]+\/video\/\d+/,
    /vm\.tiktok\.com\/[A-Za-z0-9]+/,
    /vt\.tiktok\.com\/[A-Za-z0-9]+/,
    /tiktok\.com\/\d+/
  ];

  return tiktokPatterns.some(pattern => pattern.test(url));
}
