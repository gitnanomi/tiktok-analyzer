import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

export default async function handler(req, res) {
  console.log('=== Environment Check ===');
  console.log('GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
  console.log('APIFY_API_KEY exists:', !!process.env.APIFY_API_KEY);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { input } = req.body;

  if (!input) {
    return res.status(400).json({ error: 'Please enter a TikTok URL or keywords' });
  }

  try {
    const isTikTokURL = input.includes('tiktok.com');
    
    if (isTikTokURL) {
      console.log('📹 Single video mode:', input);
      const result = await analyzeSingleVideo(input);
      return res.status(200).json({
        success: true,
        mode: 'single',
        results: [result]
      });
    } else {
      console.log('🔍 Keyword search mode:', input);
      
      // Check if APIFY_API_KEY exists
      if (!process.env.APIFY_API_KEY) {
        return res.status(200).json({
          success: true,
          mode: 'batch',
          demo: true,
          message: 'APIFY_API_KEY not configured. Using demo data. Add APIFY_API_KEY in Vercel environment variables to enable real keyword search.',
          results: getDemoResults(input)
        });
      }
      
      const results = await analyzeBatchVideos(input);
      
      if (!results || results.length === 0) {
        return res.status(200).json({
          success: true,
          mode: 'batch',
          demo: true,
          message: `No results found for "${input}". Using demo data. Try different keywords.`,
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
    console.error('❌ API Error:', error.message);
    return res.status(500).json({ 
      error: `Analysis failed: ${error.message}. Please check your API keys or try again.`
    });
  }
}

async function analyzeSingleVideo(url) {
  try {
    console.log('📹 Analyzing single video:', url);
    const metadata = await fetchMetadata(url);
    const analysis = await analyzeWithGemini(metadata);
    
    return {
      url: url,
      ...metadata,
      analysis: analysis,
      analyzedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ Single video analysis failed:', error);
    throw new Error(`Video analysis failed: ${error.message}`);
  }
}

async function analyzeBatchVideos(keywords) {
  console.log('🔍 Batch search for:', keywords);
  
  try {
    const videos = await searchWithApify(keywords);
    
    if (!videos || videos.length === 0) {
      console.log('⚠️ No videos found, returning demo data');
      return null;
    }
    
    console.log(`✅ Found ${videos.length} videos`);
    
    const results = [];
    for (let i = 0; i < Math.min(videos.length, 5); i++) {
      try {
        console.log(`Analyzing video ${i + 1}/${Math.min(videos.length, 5)}`);
        const analysis = await analyzeWithGemini(videos[i]);
        results.push({
          ...videos[i],
          analysis,
          analyzedAt: new Date().toISOString()
        });
      } catch (error) {
        console.error(`Video ${i + 1} analysis failed:`, error.message);
        // Continue with next video
      }
    }
    
    return results.length > 0 ? results : null;
    
  } catch (error) {
    console.error('❌ Batch analysis error:', error.message);
    return null;
  }
}

async function fetchMetadata(url) {
  try {
    const oembed = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
    console.log('Fetching metadata from:', oembed);
    
    const res = await axios.get(oembed, { 
      timeout: 10000,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    
    return {
      title: res.data.title || 'No title',
      author: res.data.author_name || 'Unknown',
      description: res.data.title || 'No description',
      thumbnail: res.data.thumbnail_url,
      views: 0, // TikTok oEmbed doesn't provide view count
      likes: 0, // TikTok oEmbed doesn't provide like count
      comments: 0,
      shares: 0
    };
  } catch (error) {
    console.error('Metadata fetch failed:', error.message);
    return {
      title: 'Unable to fetch metadata',
      author: 'Unknown',
      description: 'Could not retrieve video information',
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0
    };
  }
}

async function analyzeWithGemini(video) {
  if (!process.env.GEMINI_API_KEY) {
    console.log('⚠️ GEMINI_API_KEY not found');
    return getBasicAnalysis(video);
  }

  try {
    console.log('🤖 Calling Gemini API for:', video.title?.substring(0, 50));
    
    const prompt = `You are an elite TikTok growth strategist. Analyze this video with EXTREME detail.

CRITICAL RULES:
- NO asterisks, stars, or markdown symbols anywhere
- Use bullet points with "•" character only
- Be ultra-specific and actionable
- Every statement must be concrete and detailed

Video: "${video.title || video.description}" by @${video.author}

Format EXACTLY as shown:

HOOK (First 3 Seconds)

SUMMARY:
- [Ultra-specific visual action - describe exact camera movement, framing, what's in shot]
- [Exact audio/words in first 3 seconds - quote it precisely]
- [Specific emotion triggered - be precise about the psychological trigger]
- [Why this pattern interrupt works - concrete reason]

DETAILED:
[4-5 sentences with extreme specificity about camera angles, lighting, facial expressions, timing, props, background, and the exact psychological mechanism being triggered]

---

STORY LINE

SUMMARY:
- [Specific narrative structure - not vague terms]
- [Exact pain point shown - concrete example]
- [Engagement technique - precise method with timing]
- [Emotional journey - from X to Y with specific moments]

DETAILED:
[4-5 sentences breaking down exact sequence, timing of each segment, transitions, relatability moments, editing techniques, pacing analysis]

---

SCRIPTING PROCESS

SUMMARY:
- IDEA VALIDATION: [What makes this specific idea logically sound and watch-worthy]
- HOOK CONSTRUCTION: [Exact visual and verbal elements in first 3 seconds]
- LAST LINE PLANNING: [Specific ending moment planned - reaction, statement, or reveal]
- FORESHADOWING: [Exact promise or expectation set - quote it if verbal]
- ROUGH SCRIPT: [3-4 specific beats likely planned before filming]
- FILMING APPROACH: [Single take vs multiple angles, location, props, equipment]
- EDITING DECISIONS: [Cut frequency, effects, pacing choices with timing]

DETAILED:
[6-8 sentences reverse-engineering how this was planned using backwards-scripting. Cover: idea validation reasoning, how hook was constructed to be visual-first, what the planned ending was and why, specific foreshadowing technique, bullet points in rough script, filming execution details, editing choices that support hook-to-ending structure. Be extremely specific about every decision.]

---

CALL TO ACTION (CTA)

SUMMARY:
- [Specific action requested - be precise]
- [Exact placement and delivery - when and how]
- [Implicit vs explicit - which method used]

DETAILED:
[3-4 sentences: exact timestamp, exact words used, verbal/text/both, what makes this CTA compelling, friction points removed]

---

VISUAL ELEMENTS

SUMMARY:
- CAMERA: [Specific camera work with details]
- FRAMING: [Exact composition description]
- LIGHTING: [Precise lighting setup with color temp]
- EDITING: [Specific cut rhythm with timing]
- TEXT/GRAPHICS: [Exact specs of overlays]

DETAILED:
[5-6 sentences with technical precision: camera angles, framing choices, lighting setup details, editing rhythm with timing, text overlay specs, effects/filters, color grading, how these support the content strategy]

---

SUCCESS FACTORS

1. ALGORITHM: [Specific algorithmic optimization with metric]
2. PSYCHOLOGY: [Specific psychological principle with explanation]
3. EXECUTION: [Specific production element with details]

---

REPLICABLE ELEMENTS

1. [Specific tactic with exact implementation steps]
2. [Second tactic with precise how-to]
3. [Third tactic with actionable method]

---

METADATA

CONTENT TYPE: [One word]
CATEGORY: [One word]
TONE: [One word]
IS AD: [Yes/No] - [explanation if yes]

---

AI PROMPT ENGINEERING

MIDJOURNEY PROMPT:
[Complete 60-80 word prompt with all technical details, immediately usable, no brackets]

STABLE DIFFUSION PROMPT:
[Complete 50-70 word technical prompt, immediately usable, no brackets]

PRODUCT SWAP TEMPLATE:
[Complete template with clear variable markers in CAPS]

EXAMPLE:
[Fully filled example with real product]

SHOT BREAKDOWN:

Scene 1 (0-3s):
VISUAL: [Detailed description]
AI PROMPT: [Complete 40-50 word prompt]

Scene 2 (3-10s):
VISUAL: [Detailed description]  
AI PROMPT: [Complete prompt]

Scene 3 (10-15s):
VISUAL: [Detailed description]
AI PROMPT: [Complete prompt]`;

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
    console.log('✅ Gemini analysis complete, length:', text.length);
    
    const cleanedText = text.replace(/\*/g, '');
    return parseDualVersionAnalysis(cleanedText);
    
  } catch (error) {
    console.error('❌ Gemini error:', error.message);
    return getBasicAnalysis(video);
  }
}

function parseDualVersionAnalysis(text) {
  const extractDualVersion = (sectionName) => {
    const summaryRegex = new RegExp(`${sectionName}[\\s\\S]*?SUMMARY:[\\s\\S]*?([\\s\\S]*?)(?=DETAILED:|$)`, 'i');
    const detailedRegex = new RegExp(`${sectionName}[\\s\\S]*?DETAILED:[\\s\\S]*?([\\s\\S]*?)(?=---|$)`, 'i');
    
    const summaryMatch = text.match(summaryRegex);
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
    const regex = new RegExp(`${promptName}:[\\s\\S]*?\\n([\\s\\S]*?)(?=\\n\\n[A-Z]|SHOT BREAKDOWN|Scene|$)`, 'i');
    const match = text.match(regex);
    if (!match) return '';
    let result = match[1].trim();
    result = result.replace(/^\[|\]$/g, '').replace(/^"|"$/g, '');
    return result;
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
      summary: '• Add GEMINI_API_KEY in Vercel for AI analysis\n• Professional-grade breakdown available\n• Deep insights included',
      detailed: 'Configure GEMINI_API_KEY in your Vercel environment variables to unlock professional AI-powered analysis with extreme detail and actionable insights.'
    },
    storyLine: {
      summary: '• Add GEMINI_API_KEY for narrative analysis',
      detailed: 'Unlock detailed story structure breakdown.'
    },
    scriptingProcess: {
      summary: '• Add GEMINI_API_KEY for full framework\n• Idea validation\n• Hook engineering\n• Ending strategy\n• Foreshadowing\n• Filming details\n• Editing breakdown',
      detailed: 'Add GEMINI_API_KEY to unlock complete backwards-scripting analysis showing exactly how top creators plan videos.'
    },
    cta: {
      summary: '• Add GEMINI_API_KEY for CTA analysis',
      detailed: 'Unlock call-to-action strategy breakdown.'
    },
    visualElements: {
      summary: '• Add GEMINI_API_KEY for visual analysis',
      detailed: 'Unlock technical production analysis.'
    },
    successFactors: '1. Add GEMINI_API_KEY for analysis\n2. Algorithm insights available\n3. Psychology breakdowns included',
    replicableElements: '1. Configure API keys in Vercel\n2. Get tactical insights\n3. Export full data',
    contentType: 'Unknown',
    category: 'Unknown',
    tone: 'Unknown',
    isAd: 'Unknown',
    aiPrompts: {
      midjourney: 'Add GEMINI_API_KEY for complete AI prompts',
      stableDiffusion: 'Add GEMINI_API_KEY for SD prompts',
      productTemplate: 'Add GEMINI_API_KEY for templates',
      example: 'Add GEMINI_API_KEY for examples',
      shotBreakdown: 'Add GEMINI_API_KEY for shot breakdown'
    }
  };
}

async function searchWithApify(keywords) {
  if (!process.env.APIFY_API_KEY) {
    throw new Error('APIFY_API_KEY not configured');
  }

  try {
    console.log('🔍 Searching Apify for:', keywords);
    
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
      console.log('⚠️ Apify returned no results');
      return null;
    }
    
    console.log(`✅ Apify returned ${response.data.length} videos`);
    
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
    console.error('❌ Apify error:', error.message);
    if (error.response) {
      console.error('Apify response:', error.response.status, error.response.statusText);
    }
    throw new Error(`Apify search failed: ${error.message}`);
  }
}

function getDemoResults(keywords) {
  return [
    {
      id: 'demo1',
      url: 'https://www.tiktok.com/@demo/video/demo1',
      author: 'demo_creator',
      description: `Demo analysis for "${keywords}" - Add APIFY_API_KEY for real results`,
      title: `Demo: ${keywords}`,
      views: 1250000,
      likes: 85000,
      comments: 3200,
      shares: 12000,
      analysis: getBasicAnalysis({ title: `Demo: ${keywords}`, author: 'demo_creator' })
    }
  ];
}

export const config = {
  api: { responseLimit: false }
}
