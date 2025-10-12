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
    
    // 添加单个视频分析的超时保护
    const analysis = await Promise.race([
      analyzeWithGemini(metadata),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Analysis timeout - video too complex')), 90000)
      )
    ]);
    
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
    // 减少批量分析数量，从 5 改为 2（避免超时）
    const analyzeCount = Math.min(videos.length, 2);
    
    for (let i = 0; i < analyzeCount; i++) {
      try {
        console.log(`Analyzing video ${i + 1}/${analyzeCount}: ${videos[i].title?.substring(0, 50)}...`);
        
        // 为每个视频添加独立的超时保护（90秒）
        const analysis = await Promise.race([
          analyzeWithGemini(videos[i]),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Single video timeout')), 90000)
          )
        ]);
        
        results.push({
          ...videos[i],
          analysis,
          analyzedAt: new Date().toISOString()
        });
        
        console.log(`✅ Video ${i + 1} analyzed successfully`);
        
        // 在视频之间添加小延迟，避免API限流
        if (i < analyzeCount - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
      } catch (error) {
        console.error(`❌ Video ${i + 1} analysis failed:`, error.message);
        // 继续处理下一个视频，不中断整个流程
        // 但添加失败的视频信息，使用基本分析
        results.push({
          ...videos[i],
          analysis: getBasicAnalysis(videos[i]),
          analyzedAt: new Date().toISOString(),
          analysisError: error.message
        });
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
    console.log('Fetching metadata from TikTok oEmbed...');
    
    const res = await axios.get(oembed, { 
      timeout: 10000,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    
    return {
      title: res.data.title || 'No title',
      author: res.data.author_name || 'Unknown',
      description: res.data.title || 'No description',
      thumbnail: res.data.thumbnail_url,
      views: 0,
      likes: 0,
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
    const videoTitle = video.title?.substring(0, 100) || 'Unknown';
    console.log('🤖 Calling Gemini API for:', videoTitle);
    
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
        timeout: 90000  // 增加到90秒
      }
    );

    const text = response.data.candidates[0].content.parts[0].text;
    console.log('✅ Gemini analysis complete, length:', text.length);
    
    // 移除任何星号
    const cleanedText = text.replace(/\*/g, '');
    return parseDualVersionAnalysis(cleanedText);
    
  } catch (error) {
    console.error('❌ Gemini error:', error.message);
    if (error.code === 'ECONNABORTED') {
      console.error('Timeout error - Gemini took too long to respond');
    }
    if (error.response) {
      console.error('Gemini API response error:', error.response.status);
    }
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
      analysis: {
        hook: {
          summary: '• Quick jump cut to creator holding product at eye level\n• Opens with "Wait, this actually works?" in surprised tone\n• Creates immediate curiosity gap about product effectiveness\n• Pattern interrupt through unexpected positive reaction',
          detailed: 'Opens with sharp jump cut from black screen to medium close-up of creator in natural bedroom setting, holding product bottle at camera-center eye level filling 30% of frame. Natural window lighting from left creates soft highlights on product label. Creator wears casual white t-shirt, direct eye contact with camera, eyebrows raised in genuine surprise expression. Opens mouth saying "Wait, this actually works?" with emphasis on "actually" - voice inflection rises at end creating question energy. Background shows slightly blurred bookshelf adding authenticity. The surprise-question combo triggers pattern interrupt while "actually works" creates information gap demanding resolution.'
        },
        storyLine: {
          summary: '• Uses classic before-after-reveal structure over 15 seconds\n• Shows 3-day struggle montage with relatable morning routine fails\n• Maintains engagement through rapid 2-second cuts between timeframes\n• Emotional journey: frustration to skepticism to relief',
          detailed: 'Narrative follows problem-solution structure compressed into 15 seconds. Opens establishing pain: 3-second montage of creator struggling to wake up at 6am across three mornings (2sec, 2sec, 2sec cuts - alarm clock, hitting snooze, groggy face). Transitions using simple swipe to product introduction (3 seconds). Middle section shows skeptical testing phase with jump cuts every 1.5 seconds showing different days, maintaining visual variety. Final 4 seconds reveal successful morning routine with energetic creator. Each segment connects through consistent bedroom location and lighting, creating cohesive narrative despite time jumps. Pacing accelerates toward end, building momentum into payoff.'
        },
        scriptingProcess: {
          summary: '• IDEA VALIDATION: Morning routine struggle is universally relatable, solution-focused content performs well\n• HOOK CONSTRUCTION: Surprise emotion plus questioning tone engineered for scroll-stop\n• LAST LINE PLANNING: Energetic "Okay I am actually awake" reaction planned as abrupt ending\n• FORESHADOWING: "Let me show you what happened" promise sets clear payoff expectation\n• ROUGH SCRIPT: Day 1 struggle, Day 2 struggle, Day 3 struggle, Product intro, Testing montage, Success reaction\n• FILMING APPROACH: Multiple takes across 4 actual days, consistent bedroom location, same outfit for continuity\n• EDITING DECISIONS: Hard cuts every 2 seconds average, no transitions for authenticity, natural audio mix',
          detailed: 'This video was engineered backwards using proven framework. Started with idea validation: morning routine struggle resonates with 18-35 demographic (proven by 100M+ views in niche), solution-based content drives shares. Hook constructed to be purely visual - product-in-hand plus surprise expression works without audio, engineered specifically to stop scroll in first 0.8 seconds. Ending planned upfront: abrupt cut after energetic "Okay I am actually awake" reaction to maximize retention by ending on emotional high without trailing off. Foreshadowing deployed at 3-second mark: "Let me show you what happened over 3 days" sets clear expectation and viewing contract. Rough script likely outlined 6 beats: establish problem (3 mornings), introduce product, show testing process, reveal results, close on high energy. Filming required 4-day commitment shooting same bedroom angle each morning, wearing same outfit for visual consistency. Editing choices support structure: hard cuts maintain energy, 2-second average shot length matches TikTok optimal retention rate, no fancy transitions keep UGC authenticity, natural audio mix (no music) preserves genuine feel. Every decision flows from hook-to-ending framework.'
        },
        cta: {
          summary: '• Implicit CTA through enthusiastic result demonstration\n• Final frame holds for 0.5 seconds showing product clearly before cut\n• No verbal ask but visual framing directs to profile/link',
          detailed: 'CTA strategy is implicit rather than explicit. At 14-second mark, creator shows product label clearly in final frame before abrupt cut, holding for 0.5 seconds allowing pause for screenshot or mental note. No verbal "link in bio" which would reduce authenticity. Instead, enthusiastic result demonstration creates natural desire to know product details, organically driving profile clicks. The abrupt ending (cutting mid-energy) creates incompleteness that subconsciously encourages comment section engagement. This soft-sell approach maintains UGC authenticity while still converting through strategic visual emphasis and social proof of visible results.'
        },
        visualElements: {
          summary: '• CAMERA: Handheld iPhone front-facing camera with natural slight shake\n• FRAMING: Medium close-up rule of thirds, subject on right third, 40% negative space left\n• LIGHTING: Soft natural window light from left, 2800K warm tone, no harsh shadows\n• EDITING: 1.8 second average shot length, hard jump cuts, zero transitions or effects\n• TEXT/GRAPHICS: White sans-serif captions, bottom third placement, 3-4 words per screen max',
          detailed: 'Shot entirely on iPhone 14 front camera in bedroom setting. Camera work features authentic handheld slight movement (not stabilized) adding UGC realism. Framing consistently uses rule of thirds with creator positioned on right third, product held in left-third space creating balanced composition. Eye-level angle (camera at subject eye-height) establishes peer-to-peer connection rather than top-down authority. Lighting is exclusively natural - soft diffused window light from camera-left creates flattering highlights on face and product, 2800K warm color temperature matches morning golden hour feel. No supplemental lighting preserves authentic bedroom aesthetic. Editing rhythm maintains 1.8-second average shot length (verified across 15-second runtime: 8 cuts total). All transitions are hard jump cuts - no fades, wipes, or effects that would signal "produced" content. Color grading minimal: slight saturation boost (+10%) and warm tone emphasis. Text overlays use simple white sans-serif font, positioned in bottom third to avoid covering face, limited to 3-4 words per screen matching audio. No graphics, stickers, or animations - pure content focus. These technical choices create cohesive UGC aesthetic that builds trust while maintaining professional enough quality for product credibility.'
        },
        successFactors: '1. ALGORITHM FACTOR: Abrupt ending at 15-second mark keeps average view duration above 92%, maximizing completion rate which TikTok algorithm prioritizes heavily, plus comment section incompleteness drives engagement signals\n\n2. PSYCHOLOGY FACTOR: Leverages social proof through visual demonstration of real results rather than claims, activating mirror neurons as viewers mentally experience the transformation, combined with relatable pain point (morning struggle) creating instant connection with 80%+ of target demographic\n\n3. EXECUTION FACTOR: Perfect balance of authenticity (UGC shooting style, natural lighting, handheld camera) with strategic production (2-second cut rhythm matching attention span, rule of thirds framing, strategic product placement), making it feel genuine while delivering clear value proposition',
        replicableElements: '1. SURPRISE-QUESTION HOOK: Film in one continuous take, hold product at eye level filling 25-30% of frame, make direct eye contact, raise eyebrows naturally, deliver question with rising vocal inflection on last word, pause 0.3 seconds after question before cut for emphasis\n\n2. THREE-DAY MONTAGE STRUCTURE: Shoot same scenario across 3 consecutive days wearing same outfit, keep each clip exactly 2 seconds, use hard jump cuts between days, maintain consistent camera angle and lighting for cohesive feel, compress time visually while text overlay shows progression\n\n3. ABRUPT HIGH-ENERGY ENDING: Plan your final frame to be peak emotional moment (excitement/relief/surprise), cut immediately after that moment without wind-down or transition, hold final frame exactly 0.5 seconds showing product clearly before cut, resist urge to add outro or verbal CTA which reduces retention',
        contentType: 'UGC-style',
        category: 'Tutorial',
        tone: 'Educational',
        isAd: 'No',
        aiPrompts: {
          midjourney: 'Medium close-up shot of person holding amber glass supplement bottle at eye level in natural bedroom setting, soft diffused morning window light from left side creating gentle highlights on face and product label, warm 2800K color temperature, slight handheld camera shake for authenticity, subject positioned on right third of frame with product in left third space, blurred bookshelf visible in background, casual white t-shirt, genuine surprised expression with raised eyebrows, direct eye contact with camera, shot on iPhone 14 Pro front camera, shallow depth of field f/2.2, natural UGC aesthetic with minimal color grading, professional but authentic feel',
          stableDiffusion: 'photorealistic portrait photography, 8k resolution, natural window lighting from left at 45-degree angle, soft diffused light quality, warm color temperature 2800K, shallow depth of field f/2.2 creating bokeh background blur, medium close-up framing, rule of thirds composition, subject on right third, handheld camera aesthetic with slight natural movement, shot on iPhone 14 Pro, minimal color grading with slight saturation boost, UGC authentic style, professional quality with genuine expression, high detail on product label, soft shadows on face, natural skin texture, casual home setting',
          productTemplate: 'YOUR-PRODUCT-NAME held at eye level in HAND-LEFT-OR-RIGHT, ROOM-TYPE setting with BACKGROUND-ELEMENTS, NATURAL-OR-ARTIFICIAL light from DIRECTION creating SHADOW-QUALITY, WARM-OR-COOL-NUMBER-K color temperature, CAMERA-ANGLE shot, subject positioned on RIGHT-OR-LEFT third of frame, shot on DEVICE-NAME, f/APERTURE-NUMBER aperture, UGC authentic style with SLIGHT-OR-HEAVY color grading',
          example: 'Ceramic skincare cream jar held at eye level in right hand, minimalist bathroom setting with marble counter visible, natural window light from left creating soft shadows, 3000K warm color temperature, eye-level straight-on shot, subject positioned on right third with product on left third, shot on iPhone 13 Pro, f/2.8 aperture creating subtle background blur of bathroom plants, UGC authentic style with minimal color grading showing natural skin texture and genuine expression',
          shotBreakdown: 'Scene 1 (0-3s):\nVISUAL: Jump cut from black to medium close-up of creator in white t-shirt, bedroom background, holding product bottle at camera center, surprised expression, eyebrows raised, morning window light from left\nAI PROMPT: Medium shot of person holding product at eye level, natural bedroom setting, soft morning window light from left, warm 2800K tone, surprised expression with raised eyebrows, direct camera eye contact, shot on iPhone 14, f/2.2, casual white t-shirt, blurred bookshelf background\n\nScene 2 (3-10s):\nVISUAL: Rapid montage of 2-second clips showing morning struggle - alarm clock (2s), hitting snooze (2s), groggy face (2s), then product on nightstand (2s), consistent bedroom angle\nAI PROMPT: Series of quick lifestyle shots in bedroom, natural morning lighting, same camera angle throughout, showing morning routine struggle, alarm clock visible, casual setting, authentic UGC style, shot on iPhone, natural color grading\n\nScene 3 (10-15s):\nVISUAL: Return to original framing, creator now energetic and awake, big smile, holding product, saying "Okay I am actually awake", cuts abruptly mid-enthusiasm\nAI PROMPT: Medium close-up of person with energetic happy expression, same bedroom setting as opening, morning natural light, holding product visible, genuine smile, direct eye contact, shot on iPhone 14, f/2.2, warm tones, authentic energy, UGC style'
        }
      }
    },
    {
      id: 'demo2',
      url: 'https://www.tiktok.com/@demo2/video/demo2',
      author: 'demo_creator_2',
      description: `Demo analysis #2 for "${keywords}" - Configure API keys for live data`,
      title: `Demo Example 2: ${keywords}`,
      views: 890000,
      likes: 42000,
      comments: 1800,
      shares: 5600,
      analysis: getBasicAnalysis({ title: `Demo 2: ${keywords}`, author: 'demo_creator_2' })
    }
  ];
}

// Vercel 配置 - 增加超时时间（仅 Pro plan 可用）
export const config = {
  api: { 
    responseLimit: false,
    bodyParser: {
      sizeLimit: '10mb'
    }
  },
  maxDuration: 300  // 5分钟（Pro plan），Free plan 最多10秒
}
