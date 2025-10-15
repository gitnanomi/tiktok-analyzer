import axios from 'axios';
import FormData from 'form-data';
import sharp from 'sharp';

export async function getTikTokVideoUrl(tiktokUrl) {
  try {

    if (process.env.APIFY_API_KEY) {
      const response = await axios.post(
        'https://api.apify.com/v2/acts/clockworks~free-tiktok-scraper/run-sync-get-dataset-items',
        {
          postURLs: [tiktokUrl],
          resultsPerPage: 1
        },
        {
          params: { token: process.env.APIFY_API_KEY },
          headers: { 'Content-Type': 'application/json' },
          timeout: 60000
        }
      );

      if (response.data && response.data[0]) {
        return {
          videoUrl: response.data[0].videoUrl,
          coverUrl: response.data[0].covers?.default || response.data[0].covers?.origin,
          author: response.data[0].authorMeta?.name,
          description: response.data[0].text
        };
      }
    }

    // 方法 2: 使用 TikTok oEmbed (fallback)
    const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(tiktokUrl)}`;
    const oembedResponse = await axios.get(oembedUrl);
    
    return {
      videoUrl: null, // oEmbed 不提供视频直链
      coverUrl: oembedResponse.data.thumbnail_url,
      author: oembedResponse.data.author_name,
      description: oembedResponse.data.title
    };

  } catch (error) {
    console.error('Failed to get TikTok video URL:', error);
    throw new Error('Cannot access TikTok video. Please try another URL.');
  }
}


export async function extractKeyFrames(videoUrl) {
  try {

    const shotstackKey = process.env.SHOTSTACK_API_KEY;
    
    if (shotstackKey) {
      const frames = await Promise.all([
        extractFrameAtTime(videoUrl, 0.5, shotstackKey),
        extractFrameAtTime(videoUrl, '50%', shotstackKey),
        extractFrameAtTime(videoUrl, '95%', shotstackKey)
      ]);
      
      return frames;
    }

 
    console.log('Using thumbnail service as fallback...');
    return await extractFramesWithThumbnailService(videoUrl);

  } catch (error) {
    console.error('Frame extraction error:', error);
    throw error;
  }
}


async function extractFrameAtTime(videoUrl, time, apiKey) {
  try {
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
              length: 0.04 // 1帧
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
        }
      }
    );

    const renderId = createResponse.data.response.id;

    let status = 'queued';
    let attempts = 0;
    let frameUrl = null;

    while (status !== 'done' && attempts < 30) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const statusResponse = await axios.get(
        `https://api.shotstack.io/v1/render/${renderId}`,
        {
          headers: { 'x-api-key': apiKey }
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
    console.error('ShotStack error:', error);
    return null;
  }
}

async function extractFramesWithThumbnailService(videoUrl) {
  try {

    const baseUrl = 'https://image.thum.io/get/width/400/crop/800/noanimate/';

    return [videoUrl + '?frame=1', videoUrl + '?frame=50', videoUrl + '?frame=95'];
    
  } catch (error) {
    console.error('Thumbnail service error:', error);
    return [];
  }
}

export async function imageUrlToBase64(imageUrl) {
  try {
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const compressed = await sharp(response.data)
      .resize(800, 800, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 80 })
      .toBuffer();

    return compressed.toString('base64');

  } catch (error) {
    console.error('Image to base64 error:', error);
    throw error;
  }
}

export async function getCoverImageBase64(coverUrl) {
  try {
    const base64 = await imageUrlToBase64(coverUrl);
    return base64;
  } catch (error) {
    console.error('Cover image error:', error);
    return null;
  }
}
