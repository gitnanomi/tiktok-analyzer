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
    
    const prompt = `You're analyzing TikTok content like a pro growth strategist. Write in plain English - NO asterisks, NO markdown symbols, NO bullet points with stars. Use numbered lists or line breaks only.

Video: "${video.title || video.description}" by @${video.author}

Provide DETAILED analysis using these EXACT sections:

HOOK (First 3 Seconds)
Describe the opening in detail. What visual action happens? What's said? What emotion does it trigger? Why does it stop the scroll? Be specific and write in paragraph form.

STORY LINE
Explain the narrative arc. How does the creator build tension or curiosity? What pain points or relatable moments are highlighted? How do they maintain engagement? Write this as flowing paragraphs.

CALL TO ACTION (CTA)
What action does the creator want? How is it set up? Is it explicit or implied? Describe the technique.

VISUAL ELEMENTS
Camera work, editing pace, composition, text overlays, transitions. What production choices stand out? Describe the visual style in detail.

JENNY HOYOS FILMING FRAMEWORK
Reverse-engineer this video using Jenny Hoyos' proven structure:

1. THE IDEA VALIDATION
   What's the core concept? Why does it work logically? Would viewers actually want to watch this?

2. THE HOOK CONSTRUCTION
   Describe how the hook is purely visual and simple. Could you understand it without sound? How does it grab attention in under 3 seconds?

3. THE LAST LINE STRATEGY
   What's the planned ending? Even if it's left as reaction [blank], what's the setup for the final moment? How does this create an abrupt ending to maximize retention?

4. THE FORESHADOWING TECHNIQUE
   Right after the hook, what expectation is set? What does the creator promise will happen by the end? How does this verbal or visual foreshadowing create a mechanism that drives viewers to watch until the end?

5. THE ROUGH SCRIPT APPROACH
   Based on what you see, what were likely the bullet points or rough script elements planned before filming? What's the conceptual flow from hook to ending?

6. THE FILMING EXECUTION
   How was this actually shot? Single take? Multiple angles? What filming choices support the structure?

7. THE EDIT DECISIONS
   What editing choices reinforce the hook-foreshadow-ending structure? Where are the cuts? How does pacing support retention?

This Jenny Hoyos framework shows how top creators engineer videos backwards - starting with how to hook and how to end, then filling the middle.

SUCCESS FACTORS
List 3-5 specific reasons this video works from both algorithm and psychology perspectives. Write as numbered paragraphs without using asterisks.

CONTENT TYPE
UGC-style / Faceless / Professional / Hybrid

CATEGORY
Tutorial / Review / Challenge / Vlog / Entertainment / Educational / Story

TONE
High-Energy / Calm / Emotional / Humorous / Educational / Inspirational

IS AD
Yes / No (explain if yes)

AI PROMPT ENGINEERING

Midjourney/DALL-E Prompt:
[Write detailed prompt for recreating the visual style - no brackets in final output]

Stable Diffusion Prompt:
[Technical prompt with details like photorealistic, 8k, lighting specs - no brackets in final output]

Product Swap Template:
[YOUR PRODUCT] + [scene setting] + [lighting] + [camera style]

Example:
[Specific example showing how to adapt template]

REPLICABLE ELEMENTS
List 3-5 concrete tactics marketers can steal. Write as numbered items without asterisks.

Remember: NO asterisks anywhere. Use clear paragraph breaks and numbered lists only. Write like you're explaining to a marketing team in a meeting.`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
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
    return parseDetailedAnalysis(text);
    
  } catch (error) {
    console.error('Gemini error:', error.message);
    if (error.response) {
      console.error('Error details:', JSON.stringify(error.response.data));
    }
    return getBasicAnalysis(video);
  }
}

function parseDetailedAnalysis(text) {
  const extractSection = (header) => {
    const patterns = [
      new RegExp(`${header}[:\\s]*([\\s\\S]*?)(?=\\n\\n[A-Z][A-Z]|$)`, 'i'),
      new RegExp(`${header}\\n([\\s\\S]*?)(?=\\n\\n[A-Z]|$)`, 'i')
    ];
    
    for (const regex of patterns) {
      const match = text.match(regex);
      if (match) return match[1].trim();
    }
    return '';
  };

  const extractField = (field) => {
    const regex = new RegExp(`${field}[:\\s]*(.+?)(?=\\n|$)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : 'Not specified';
  };

  // Extract Jenny Hoyos Framework
  const jennyFramework = extractSection('JENNY HOYOS FILMING FRAMEWORK');

  // Extract AI prompts
  const mjMatch = text.match(/Midjourney\/DALL-E Prompt:[\s\S]*?\n([\s\S]*?)(?=Stable Diffusion|$)/i);
  const sdMatch = text.match(/Stable Diffusion Prompt:[\s\S]*?\n([\s\S]*?)(?=Product Swap|$)/i);
  const templateMatch = text.match(/Product Swap Template:[\s\S]*?\n([\s\S]*?)(?=Example:|$)/i);
  const exampleMatch = text.match(/Example:[\s\S]*?\n([\s\S]*?)(?=REPLICABLE|$)/i);

  return {
    hook: extractSection('HOOK \\(First 3 Seconds\\)') || extractSection('HOOK'),
    storyLine: extractSection('STORY LINE'),
    cta: extractSection('CALL TO ACTION \\(CTA\\)') || extractSection('CALL TO ACTION'),
    visualElements: extractSection('VISUAL ELEMENTS'),
    jennyFramework: jennyFramework,
    successFactors: extractSection('SUCCESS FACTORS'),
    contentType: extractField('CONTENT TYPE'),
    category: extractField('CATEGORY'),
    tone: extractField('TONE'),
    isAd: extractField('IS AD'),
    replicableElements: extractSection('REPLICABLE ELEMENTS'),
    
    aiPrompts: {
      midjourney: mjMatch ? mjMatch[1].trim().replace(/^\[|\]$/g, '').replace(/^"|"$/g, '') : '',
      stableDiffusion: sdMatch ? sdMatch[1].trim().replace(/^\[|\]$/g, '').replace(/^"|"$/g, '') : '',
      template: templateMatch ? templateMatch[1].trim().replace(/^"|"$/g, '') : '',
      example: exampleMatch ? exampleMatch[1].trim() : ''
    },
    
    fullText: text
  };
}

function getBasicAnalysis(video) {
  return {
    hook: `Analyzing: "${video.title || video.description}"`,
    storyLine: 'Add GEMINI_API_KEY for full analysis',
    cta: 'Add GEMINI_API_KEY for full analysis',
    visualElements: 'Add GEMINI_API_KEY for full analysis',
    jennyFramework: 'Add GEMINI_API_KEY to unlock Jenny Hoyos framework analysis',
    successFactors: 'Add GEMINI_API_KEY to unlock detailed breakdown',
    contentType: 'Unknown',
    category: 'Unknown',
    tone: 'Unknown',
    isAd: 'Unknown',
    replicableElements: 'Add GEMINI_API_KEY to see actionable insights',
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
        storyLine: 'This is sample data showing what you will get',
        cta: 'Add API keys to unlock full features',
        visualElements: 'Real analysis will show detailed visual breakdown',
        jennyFramework: 'Add GEMINI_API_KEY to see Jenny Hoyos framework analysis',
        successFactors: 'Add GEMINI_API_KEY to see why videos go viral',
        contentType: 'UGC',
        category: 'Tutorial',
        tone: 'Educational',
        isAd: 'No',
        replicableElements: 'Add API keys to see actionable insights',
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
