import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

export default async function handler(req, res) {
  console.log('=== Environment Check ===');
  console.log('GEMINI_API_KEY:', !!process.env.GEMINI_API_KEY);
  console.log('APIFY_API_KEY:', !!process.env.APIFY_API_KEY);

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
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: error.message
    });
  }
}

async function analyzeSingleVideo(url) {
  try {
    console.log('Analyzing video:', url);
    const metadata = await fetchMetadata(url);
    const analysis = await analyzeWithGemini(metadata);
    
    return {
      url: url,
      ...metadata,
      analysis: analysis,
      analyzedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Analysis failed:', error);
    throw new Error('Unable to analyze video: ' + error.message);
  }
}

async function analyzeBatchVideos(keywords) {
  console.log('Batch search:', keywords);
  
  if (!process.env.APIFY_API_KEY) {
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
        console.error(`Video ${i} failed:`, error);
      }
    }
    
    return results.length > 0 ? results : getDemoResults(keywords);
    
  } catch (error) {
    console.error('Batch error:', error);
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
    console.error('Metadata fetch failed:', error);
    return {
      title: 'Unable to fetch metadata',
      author: 'Unknown',
      description: 'Could not retrieve video information'
    };
  }
}

async function analyzeWithGemini(video) {
  if (!process.env.GEMINI_API_KEY) {
    return getBasicAnalysis(video);
  }

  try {
    console.log('Calling Gemini API...');
    
    const prompt = `Act as a sharp, experienced TikTok growth strategist who's scaled multiple accounts to 1M+ followers. Analyze this video like you're briefing a client's marketing team.

Video: "${video.title || video.description}" by @${video.author}

Write your analysis in a DIRECT, conversational style. No fluff. Talk like a real marketer in a strategy meeting.

Format (use EXACTLY these headers):

**HOOK BREAKDOWN**
What happens in the first 3 seconds and why it stops the scroll. Be specific about what you SEE and HEAR.

**THE STORY**
Walk through how this creator takes viewers on a journey. What's the main tension or curiosity gap? How do they keep you watching?

**THE ASK**
What does the creator want you to do? How do they set it up?

**VISUAL STRATEGY**
Camera work, editing choices, text on screen - the stuff that actually matters for production.

**WHY THIS WORKS**
3 specific reasons this video gets traction. Think algorithm + human psychology.

**CONTENT TYPE**
UGC-style / Faceless / Professional / Hybrid

**CATEGORY**
Tutorial / Review / Challenge / Vlog / Entertainment / Educational / Story

**TONE**
High-energy / Chill / Emotional / Funny / Educational

**SPONSORED?**
Yes / No (and what if yes)

**AI RECREATION GUIDE**

If you wanted to recreate this look for product shots or thumbnails:

**Midjourney Prompt:**
[Write a detailed prompt capturing the visual vibe, lighting, composition. Make it copy-pastable.]

**Stable Diffusion Prompt:**
[Same but optimized for SD - more technical details like "8k, photorealistic, shallow DOF"]

**Product Swap Template:**
"[YOUR PRODUCT] + [the scene/setting] + [the lighting/mood] + [camera angle/style]"

Example: "[Your skincare bottle] in soft morning light, minimal white marble background, shot from above at 45 degrees, clean aesthetic, iPhone photography style"

**QUICK WINS**
3 things you can steal for your own content RIGHT NOW.

Keep it real. No corporate speak. Write like you're texting your cofounder.`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 8192,
        }
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 60000
      }
    );

    const text = response.data.candidates[0].content.parts[0].text;
    console.log('Gemini success! Length:', text.length);
    return parseMarketingAnalysis(text);
    
  } catch (error) {
    console.error('Gemini error:', error.message);
    if (error.response) {
      console.error('Error details:', JSON.stringify(error.response.data));
    }
    return getBasicAnalysis(video);
  }
}

function parseMarketingAnalysis(text) {
  const extractSection = (header) => {
    const patterns = [
      new RegExp(`\\*\\*${header}\\*\\*[:\\s]*([\\s\\S]*?)(?=\\n\\n\\*\\*|$)`, 'i'),
      new RegExp(`${header}[:\\s]*([\\s\\S]*?)(?=\\n\\n[A-Z]|$)`, 'i')
    ];
    
    for (const regex of patterns) {
      const match = text.match(regex);
      if (match) return match[1].trim();
    }
    return '';
  };

  const extractField = (field) => {
    const regex = new RegExp(`\\*\\*${field}\\*\\*[:\\s]*(.+?)(?=\\n|$)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : 'Not specified';
  };

  // Extract AI prompts
  const mjMatch = text.match(/\*\*Midjourney Prompt:\*\*[\s\S]*?\n([\s\S]*?)(?=\*\*Stable Diffusion|$)/i);
  const sdMatch = text.match(/\*\*Stable Diffusion Prompt:\*\*[\s\S]*?\n([\s\S]*?)(?=\*\*Product Swap|$)/i);
  const templateMatch = text.match(/\*\*Product Swap Template:\*\*[\s\S]*?\n([\s\S]*?)(?=Example:|$)/i);
  const exampleMatch = text.match(/Example:([\s\S]*?)(?=\*\*QUICK WINS|$)/i);

  return {
    hook: extractSection('HOOK BREAKDOWN'),
    story: extractSection('THE STORY'),
    cta: extractSection('THE ASK'),
    visuals: extractSection('VISUAL STRATEGY'),
    whyItWorks: extractSection('WHY THIS WORKS'),
    contentType: extractField('CONTENT TYPE'),
    category: extractField('CATEGORY'),
    tone: extractField('TONE'),
    isAd: extractField('SPONSORED'),
    quickWins: extractSection('QUICK WINS'),
    
    aiPrompts: {
      midjourney: mjMatch ? mjMatch[1].trim().replace(/^\[|\]$/g, '') : '',
      stableDiffusion: sdMatch ? sdMatch[1].trim().replace(/^\[|\]$/g, '') : '',
      template: templateMatch ? templateMatch[1].trim().replace(/^"|"$/g, '') : '',
      example: exampleMatch ? exampleMatch[1].trim() : ''
    },
    
    fullText: text
  };
}

function getBasicAnalysis(video) {
  return {
    hook: `Analyzing: "${video.title || video.description}"`,
    story: 'Add GEMINI_API_KEY for full analysis',
    cta: 'Add GEMINI_API_KEY for full analysis',
    visuals: 'Add GEMINI_API_KEY for full analysis',
    whyItWorks: 'Add GEMINI_API_KEY to unlock detailed breakdown',
    contentType: 'Unknown',
    category: 'Unknown',
    tone: 'Unknown',
    isAd: 'Unknown',
    quickWins: 'Add GEMINI_API_KEY to see actionable tips',
    aiPrompts: {
      midjourney: 'Add GEMINI_API_KEY for AI prompts',
      stableDiffusion: 'Add GEMINI_API_KEY for AI prompts',
      template: 'Add GEMINI_API_KEY for templates',
      example: ''
    }
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
    console.error('Apify error:', error.message);
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
        hook: 'Demo mode - Add GEMINI_API_KEY for real analysis',
        story: 'This is sample data showing what you\'ll get',
        cta: 'Add API keys to unlock full features',
        visuals: 'Real analysis will show detailed visual breakdown',
        whyItWorks: 'Add GEMINI_API_KEY to see why videos go viral',
        contentType: 'UGC',
        category: 'Tutorial',
        tone: 'Educational',
        isAd: 'No',
        quickWins: 'Add API keys to see actionable tips',
        aiPrompts: {
          midjourney: 'Add GEMINI_API_KEY for AI prompts',
          stableDiffusion: 'Add GEMINI_API_KEY for AI prompts',
          template: 'Add API keys to unlock',
          example: ''
        }
      }
    }
  ];
}

export const config = {
  api: { responseLimit: false }
}
