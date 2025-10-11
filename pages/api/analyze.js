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
    
    const prompt = `You're analyzing TikTok content. Provide TWO versions for each section: SUMMARY (bullet points) and DETAILED (full paragraphs).

CRITICAL FORMAT RULES:
- NO asterisks anywhere
- Use simple bullet points with "•" character
- Each section must have both SUMMARY and DETAILED versions
- SUMMARY: 2-4 bullet points max
- DETAILED: 2-4 full sentences

Video: "${video.title || video.description}" by @${video.author}

Provide analysis in this EXACT format:

HOOK (First 3 Seconds)

SUMMARY:
- [First key point about the hook]
- [Second key point]
- [Third key point if needed]

DETAILED:
[Full 2-3 sentence paragraph explaining the hook in detail]

---

STORY LINE

SUMMARY:
- [Main narrative point]
- [How tension builds]
- [Key engagement technique]

DETAILED:
[Full 2-3 sentence paragraph about the story arc]

---

SCRIPTING PROCESS

SUMMARY:
- [How video was structured]
- [Hook to ending approach]
- [Key planning elements]

DETAILED:
[Full 2-3 sentence paragraph analyzing how the creator planned this video backwards - starting with the idea, locking in the hook, planning the ending/last line, and adding foreshadowing]

---

CALL TO ACTION (CTA)

SUMMARY:
- [What action is requested]
- [How it's set up]

DETAILED:
[Full 2 sentence paragraph about the CTA]

---

VISUAL ELEMENTS

SUMMARY:
- [Camera technique]
- [Editing style]
- [Key visual choices]

DETAILED:
[Full 2-3 sentence paragraph about visual production]

---

SUCCESS FACTORS

List exactly 3 reasons (no more, no less):
1. [First reason]
2. [Second reason]
3. [Third reason]

---

REPLICABLE ELEMENTS

List exactly 3 tactics (no more, no less):
1. [First tactic]
2. [Second tactic]
3. [Third tactic]

---

METADATA

CONTENT TYPE: [UGC-style / Faceless / Professional / Hybrid]
CATEGORY: [Tutorial / Review / Challenge / Vlog / Entertainment / Educational / Story]
TONE: [High-Energy / Calm / Emotional / Humorous / Educational / Inspirational]
IS AD: [Yes / No] - [brief explanation if yes]

---

AI PROMPT ENGINEERING

MIDJOURNEY PROMPT:
[Write a complete, detailed prompt describing the exact visual style, lighting, composition, camera angle, mood, color palette, and aesthetic. Make it 40-60 words and immediately usable in Midjourney. Be very specific about visual details like "shot on iPhone 14 Pro, natural window lighting from left side, warm color temperature 2700K, shallow depth of field f/1.8, subject in foreground sharp with blurred background, UGC authentic style"]

STABLE DIFFUSION PROMPT:
[Write the same concept but optimized for Stable Diffusion with technical terms: "photorealistic, 8k resolution, natural lighting, shallow depth of field, bokeh effect, professional color grading, cinematic composition, rule of thirds, golden hour lighting, soft shadows, high detail, sharp focus on subject"]

PRODUCT SWAP TEMPLATE:
[YOUR PRODUCT] in [specific setting from original video], [exact lighting description], [camera angle and framing], [mood and aesthetic style], [specific technical specs like shot on iPhone, color temp, etc]

EXAMPLE:
[Give a concrete example with a real product category, like: "Skincare serum bottle in minimalist bathroom counter, soft morning light from window, overhead 45-degree angle, clean spa aesthetic, shot on iPhone 14, 3000K warm lighting, f/2.8 aperture, product centered with blurred marble background"]

SHOT BREAKDOWN:

Scene 1 (0-3s):
Visual: [Describe exact first 3 seconds]
AI Prompt: [Specific prompt for generating this exact shot]

Scene 2 (3-10s):
Visual: [Describe middle section]
AI Prompt: [Specific prompt for this shot]

Scene 3 (10-15s):
Visual: [Describe ending]
AI Prompt: [Specific prompt for final shot]

---

Remember: 
- NO asterisks
- Use bullet points with "•"
- Provide both SUMMARY and DETAILED for each main section
- AI prompts must be complete and immediately usable, not templates`;

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
    return parseDualVersionAnalysis(text);
    
  } catch (error) {
    console.error('Gemini error:', error.message);
    if (error.response) {
      console.error('Error details:', JSON.stringify(error.response.data));
    }
    return getBasicAnalysis(video);
  }
}

function parseDualVersionAnalysis(text) {
  const extractDualVersion = (sectionName) => {
    const sectionRegex = new RegExp(`${sectionName}[\\s\\S]*?SUMMARY:[\\s\\S]*?([\\s\\S]*?)(?=DETAILED:|$)`, 'i');
    const detailedRegex = new RegExp(`${sectionName}[\\s\\S]*?DETAILED:[\\s\\S]*?([\\s\\S]*?)(?=---|$)`, 'i');
    
    const summaryMatch = text.match(sectionRegex);
    const detailedMatch = text.match(detailedRegex);
    
    return {
      summary: summaryMatch ? summaryMatch[1].trim() : '',
      detailed: detailedMatch ? detailedMatch[1].trim() : ''
    };
  };

  const extractList = (header) => {
    const regex = new RegExp(`${header}[\\s\\S]*?([\\s\\S]*?)(?=---|METADATA|AI PROMPT|$)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  };

  const extractMetadata = (field) => {
    const regex = new RegExp(`${field}:[\\s]*([^\\n]+)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : 'Not specified';
  };

  const extractAIPrompt = (promptName) => {
    const regex = new RegExp(`${promptName}:[\\s\\S]*?\\n([\\s\\S]*?)(?=\\n\\n[A-Z]|SHOT BREAKDOWN|$)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim().replace(/^\[|\]$/g, '') : '';
  };

  const extractShotBreakdown = () => {
    const regex = /SHOT BREAKDOWN:[\s\S]*?(Scene 1[\s\S]*?)(?=---|$)/i;
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  };

  return {
    hook: extractDualVersion('HOOK \\(First 3 Seconds\\)'),
    storyLine: extractDualVersion('STORY LINE'),
    scriptingProcess: extractDualVersion('SCRIPTING PROCESS'),
    cta: extractDualVersion('CALL TO ACTION'),
    visualElements: extractDualVersion('VISUAL ELEMENTS'),
    
    successFactors: extractList('SUCCESS FACTORS'),
    replicableElements: extractList('REPLICABLE ELEMENTS'),
    
    contentType: extractMetadata('CONTENT TYPE'),
    category: extractMetadata('CATEGORY'),
    tone: extractMetadata('TONE'),
    isAd: extractMetadata('IS AD'),
    
    aiPrompts: {
      midjourney: extractAIPrompt('MIDJOURNEY PROMPT'),
      stableDiffusion: extractAIPrompt('STABLE DIFFUSION PROMPT'),
      productTemplate: extractAIPrompt('PRODUCT SWAP TEMPLATE'),
      example: extractAIPrompt('EXAMPLE'),
      shotBreakdown: extractShotBreakdown()
    },
    
    fullText: text
  };
}

function getBasicAnalysis(video) {
  return {
    hook: {
      summary: '• Add GEMINI_API_KEY for analysis\n• Limited data available',
      detailed: 'Add GEMINI_API_KEY in Vercel environment variables to unlock full AI-powered analysis.'
    },
    storyLine: {
      summary: '• Add GEMINI_API_KEY for analysis',
      detailed: 'Add GEMINI_API_KEY for detailed story analysis.'
    },
    scriptingProcess: {
      summary: '• Add GEMINI_API_KEY for analysis',
      detailed: 'Add GEMINI_API_KEY for scripting process analysis.'
    },
    cta: {
      summary: '• Add GEMINI_API_KEY for analysis',
      detailed: 'Add GEMINI_API_KEY for CTA analysis.'
    },
    visualElements: {
      summary: '• Add GEMINI_API_KEY for analysis',
      detailed: 'Add GEMINI_API_KEY for visual analysis.'
    },
    successFactors: '1. Add GEMINI_API_KEY\n2. To unlock analysis\n3. Full features available',
    replicableElements: '1. Add API keys\n2. Get insights\n3. Export data',
    contentType: 'Unknown',
    category: 'Unknown',
    tone: 'Unknown',
    isAd: 'Unknown',
    aiPrompts: {
      midjourney: 'Add GEMINI_API_KEY for AI prompts',
      stableDiffusion: 'Add GEMINI_API_KEY for AI prompts',
      productTemplate: 'Add GEMINI_API_KEY for templates',
      example: 'Add GEMINI_API_KEY for examples',
      shotBreakdown: 'Add GEMINI_API_KEY for shot breakdown'
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
        hook: {
          summary: '• Quick visual intro\n• Direct address to viewer\n• Curiosity trigger',
          detailed: 'The hook uses a fast-paced visual cut combined with direct eye contact and a question that creates immediate curiosity about the outcome.'
        },
        storyLine: {
          summary: '• Problem presentation\n• Journey through struggle\n• Resolution setup',
          detailed: 'The narrative builds by showing relatable challenges, taking viewers through the emotional journey, and setting up anticipation for the solution.'
        },
        scriptingProcess: {
          summary: '• Idea validated first\n• Hook and ending planned\n• Foreshadowing added',
          detailed: 'This video was structured backwards - the creator locked in the core idea, crafted a strong hook, planned the final reaction shot, then added foreshadowing to set viewer expectations.'
        },
        cta: {
          summary: '• Link in bio mention\n• Comment engagement request',
          detailed: 'The CTA is implicit through the final statement and explicit with a "link in bio" call during the closing moment.'
        },
        visualElements: {
          summary: '• Selfie camera style\n• Natural lighting\n• Fast cuts for pacing',
          detailed: 'Shot primarily in selfie mode with natural lighting, using quick cuts to maintain energy and authentic UGC aesthetic throughout.'
        },
        successFactors: '1. Strong pattern interrupt in first 3 seconds\n2. Relatable pain point that resonates with target audience\n3. Clear payoff that delivers on the hook promise',
        replicableElements: '1. Use direct-to-camera address in opening\n2. Build curiosity gap between hook and resolution\n3. End abruptly after delivering value',
        contentType: 'UGC-style',
        category: 'Tutorial',
        tone: 'Educational',
        isAd: 'No',
        aiPrompts: {
          midjourney: 'Close-up selfie shot of person in natural home setting, soft window lighting from left, warm color temperature, authentic UGC style, shot on iPhone, slightly grainy texture, shallow depth of field, casual background blur',
          stableDiffusion: 'photorealistic portrait, 8k resolution, natural window lighting, shallow depth of field f/1.8, bokeh background, warm color grading, UGC authentic style, high detail on face, soft shadows, iPhone photography aesthetic',
          productTemplate: '[YOUR PRODUCT] held in hand or placed on surface, natural home lighting from window, close-up shot 45-degree angle, warm authentic vibe, shot on iPhone 14, 2700K color temp, f/2.2 aperture, UGC style with natural background',
          example: 'Skincare serum bottle on bathroom counter, morning natural light from window, overhead 45-degree shot, clean minimalist aesthetic, shot on iPhone 14 Pro, 3000K lighting, f/2.8, marble background softly blurred',
          shotBreakdown: 'Scene 1 (0-3s): Direct eye contact selfie, question posed\nAI Prompt: Close-up portrait, direct gaze, natural lighting, questioning expression\n\nScene 2 (3-10s): Product demonstration, hands in frame\nAI Prompt: Medium shot showing hands with product, natural setting\n\nScene 3 (10-15s): Final result or reaction\nAI Prompt: Same framing as opening, satisfied expression, natural conclusion'
        }
      }
    }
  ];
}

export const config = {
  api: { responseLimit: false }
}
