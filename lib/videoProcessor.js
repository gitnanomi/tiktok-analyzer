export async function getCoverImageBase64(coverUrl) {
  if (!coverUrl) {
    console.log('❌ No cover URL provided');
    return null;
  }

  console.log('🖼️ Processing cover URL:', coverUrl);

  try {
    // 尝试方法 1：直接下载
    const base64 = await imageUrlToBase64(coverUrl);
    console.log('✅ Method 1 success: Direct download');
    return base64;
  } catch (error1) {
    console.log('⚠️ Method 1 failed:', error1.message);
    
    try {
      // 尝试方法 2：添加更多 headers
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
