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
    
    const prompt = `You are an elite TikTok growth strategist who has scaled 50+ accounts to 1M+ followers. Analyze this video with EXTREME detail and specificity. Every point must be actionable and concrete.

CRITICAL FORMATTING RULES - FOLLOW EXACTLY:
- NEVER use asterisks, stars, or any markdown symbols
- Use only bullet points with the "•" character (ALT+0149)
- Use numbered lists with plain numbers: 1. 2. 3.
- NO bold, italic, or any special formatting
- Be EXTREMELY specific - no vague statements

Video: "${video.title || video.description}" by @${video.author}

Provide TWO versions for each section: SUMMARY (bullets) and DETAILED (full analysis)

---

HOOK (First 3 Seconds)

SUMMARY:
- [Exact visual action in first frame - be specific: "camera zooms into product on marble counter" not "shows product"]
- [Exact audio/text in first 3 seconds - quote it or describe precisely]
- [Specific emotion triggered - not just "curiosity" but "FOMO about missing a life hack"]
- [Why this specific pattern interrupt works for this audience]

DETAILED:
[Write 4-5 sentences with EXTREME specificity. Describe: exact camera movement, exact framing (close-up/medium/wide), what the creator is wearing if visible, background elements, lighting quality (harsh/soft/natural), exact facial expression, hand gestures, props visible, and the psychological trigger being activated. Example level of detail: "Opens with a tight close-up of the creator's face filling 80% of frame, natural window lighting from camera left creating soft shadows, wearing a casual gray hoodie, direct eye contact with camera, raises one eyebrow while asking 'Why is nobody talking about this?' The question format plus eyebrow raise triggers pattern interrupt and creates information gap."]

---

STORY LINE

SUMMARY:
- [Specific narrative structure used - not "builds tension" but "uses before/after contrast structure"]
- [Exact pain point shown - be concrete: "shows struggling to wake up at 5am for 3 days straight"]
- [How creator maintains engagement - specific technique like "rapid 2-second cuts between scenes"]
- [Emotional journey arc - from X feeling to Y feeling with specific moments]

DETAILED:
[Write 4-5 sentences analyzing the story structure with precision. Break down the exact sequence of events, timing of each segment, how the creator transitions between points, specific examples of relatability moments, exact editing techniques used (jump cuts/transitions/overlays), pacing analysis (fast/medium/slow and where), and how each segment connects to the next. Be so specific that someone could recreate the narrative structure.]

---

SCRIPTING PROCESS

SUMMARY:
- IDEA VALIDATION: [How this specific idea was likely validated - what makes it logically sound and watch-worthy]
- HOOK CONSTRUCTION: [Specific visual and verbal elements engineered for first 3 seconds]
- LAST LINE PLANNING: [What ending moment was planned - the specific reaction, statement, or reveal]
- FORESHADOWING: [Exact promise or expectation set after the hook - quote it]
- ROUGH SCRIPT: [Key bullet points likely planned before filming - list 3-4 specific beats]
- FILMING: [Specific shooting approach - single take vs multiple angles, location choices, props needed]
- EDITING: [Key editing decisions - cut frequency, effects used, pacing choices]

DETAILED:
[Write 6-8 sentences doing a deep reverse-engineering of how this video was planned using the backwards-scripting method. Start with analyzing what made this idea worth pursuing. Then detail exactly how the hook was constructed to be visual-first and simple. Explain what the planned ending was and why ending there maximizes retention. Describe the specific foreshadowing technique used (verbal promise, text overlay, visual preview). Break down the likely bullet points in the rough script before filming. Analyze the filming execution - was this one continuous take or multiple setups, what equipment was likely used. Finally, detail the editing choices that support the hook-to-ending structure. Be extremely specific about timing, cuts, and flow.]

---

CALL TO ACTION (CTA)

SUMMARY:
- [Specific action requested - not "engagement" but "comment your experience" or "click link"]
- [Exact placement and delivery method - when and how in the video]
- [Implicit vs explicit approach used]

DETAILED:
[Write 3-4 sentences describing the exact CTA strategy. Where in the video does it appear (timestamp if possible), what are the exact words used, is it verbal/text/both, what makes this CTA compelling for this specific content, and what friction points are removed to increase conversion.]

---

VISUAL ELEMENTS

SUMMARY:
- CAMERA: [Specific camera work - "handheld selfie style with slight movement" not just "selfie"]
- FRAMING: [Exact composition - "rule of thirds with subject on right third, product left"]
- LIGHTING: [Precise lighting description - "soft natural window light, 2700K warm tone, no harsh shadows"]
- EDITING: [Specific edit style - "1.5 second average shot length, hard cuts, no transitions"]
- TEXT/GRAPHICS: [Exact overlay details - "yellow sans-serif captions, bottom third, 3-word max per screen"]

DETAILED:
[Write 5-6 sentences with technical precision about production. Describe exact camera angles (overhead/eye-level/low), specific framing choices and why they work, detailed lighting setup (direction, quality, color temperature), editing rhythm with specific timing, text overlay specs (font style, color, animation, placement), any special effects or filters, color grading choices, and how these technical decisions support the content strategy. Be so detailed that a video editor could replicate the look.]

---

SUCCESS FACTORS

List EXACTLY 3 specific reasons with deep explanation:

1. ALGORITHM FACTOR: [Specific algorithmic element this video optimizes - e.g., "Watch time optimization through abrupt ending keeps AVD above 85%"]

2. PSYCHOLOGY FACTOR: [Specific psychological principle exploited - e.g., "Uses social proof by showing 10 people failing before revealing the solution, triggering bandwagon effect"]

3. EXECUTION FACTOR: [Specific production or delivery element - e.g., "Rapid-fire pacing with 2-second shot average matches audience attention span and prevents scroll"]

---

REPLICABLE ELEMENTS

List EXACTLY 3 tactical elements with implementation details:

1. [Specific tactic with exact how-to - e.g., "Open with a question that challenges common belief: film in one take, direct eye contact, pause 0.5 seconds after question for emphasis"]

2. [Second specific tactic - must include exact execution method]

3. [Third specific tactic - must be immediately actionable]

---

METADATA

CONTENT TYPE: [One word: UGC-style / Faceless / Professional / Hybrid]
CATEGORY: [One word: Tutorial / Review / Challenge / Vlog / Entertainment / Educational / Story]
TONE: [One word: High-Energy / Calm / Emotional / Humorous / Educational / Inspirational]
IS AD: [Yes or No] - [If yes, what product and integration method]

---

AI PROMPT ENGINEERING

MIDJOURNEY PROMPT:
[Write a 60-80 word detailed prompt with ZERO brackets or placeholders. Include: exact subject description, specific environment/setting with details, precise lighting description (direction, quality, color temp), exact camera angle and framing, specific mood/atmosphere, style references, technical specs like "shot on iPhone 14 Pro", color grading notes, depth of field specs. Make it copy-paste ready. Example quality: "Close-up product shot of amber glass serum bottle on white marble bathroom counter, soft diffused morning light from left window creating gentle shadows, overhead 45-degree angle showing product label clearly, clean minimalist spa aesthetic, shot on iPhone 14 Pro in portrait mode, 3000K warm lighting, f/2.8 aperture creating subtle background blur, professional commercial photography style, high-end skincare editorial look"]

STABLE DIFFUSION PROMPT:
[Write a 50-70 word technical prompt optimized for SD. Include: photorealistic quality terms, resolution specs, detailed lighting setup, camera specifications, post-processing notes, artistic style. Example: "photorealistic product photography, 8k resolution, professional studio lighting setup with key light at 45 degrees, fill light at 1:2 ratio, shallow depth of field f/2.8, bokeh background, commercial photography style, color graded with warm tones, high detail and sharpness, shot on full-frame camera, professional retouching, advertising quality"]

PRODUCT SWAP TEMPLATE:
[Write a complete template with specific variables clearly marked in ALL CAPS. Example: "YOUR-PRODUCT-NAME on SURFACE-TYPE, LIGHTING-DIRECTION and QUALITY, CAMERA-ANGLE shot, MOOD-AESTHETIC, shot on DEVICE-NAME, COLOR-TEMP Kelvin, f/APERTURE-NUMBER, BACKGROUND-DESCRIPTION"]

EXAMPLE:
[Give a fully filled-out example with a real product. Example: "Ceramic coffee mug on rustic wooden kitchen table, natural window light from right side with soft diffusion, eye-level straight-on shot, cozy morning aesthetic, shot on iPhone 13, 2800K warm lighting, f/2.2, blurred kitchen background with hanging plants visible"]

SHOT BREAKDOWN:

Scene 1 (0-3s):
VISUAL: [Extremely detailed description of what's on screen - composition, subject, action, text]
AI PROMPT: [Complete 40-50 word prompt for generating this exact shot]

Scene 2 (3-10s):
VISUAL: [Detailed middle section description]
AI PROMPT: [Complete prompt for this shot]

Scene 3 (10-15s):
VISUAL: [Detailed ending description]
AI PROMPT: [Complete prompt for final shot]

---

REMEMBER: Be insanely specific. No vague terms. Every statement should teach something concrete. No asterisks or markdown symbols anywhere.`;

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
    
    // Remove any asterisks that might have slipped through
    const cleanedText = text.replace(/\*/g, '');
    
    return parseDualVersionAnalysis(cleanedText);
    
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
    // Remove brackets and quotes
    result = result.replace(/^\[|\]$/g, '').replace(/^"|"$/g, '');
    return result;
  };

  const extractShotBreakdown = () => {
    const regex = /SHOT BREAKDOWN:[\s\S]*?(Scene 1[\s\S]*?)(?=---|REMEMBER|$)/i;
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
      summary: '• Add GEMINI_API_KEY for detailed analysis\n• Full AI-powered breakdown available\n• Deep scripting insights included',
      detailed: 'Add GEMINI_API_KEY in your Vercel environment variables to unlock professional-grade analysis with extreme specificity and actionable insights.'
    },
    storyLine: {
      summary: '• Add GEMINI_API_KEY for story analysis',
      detailed: 'Unlock detailed narrative structure analysis.'
    },
    scriptingProcess: {
      summary: '• Add GEMINI_API_KEY for 7-step framework\n• Idea validation analysis\n• Hook construction details\n• Last line strategy\n• Foreshadowing techniques\n• Filming execution\n• Editing decisions',
      detailed: 'Add GEMINI_API_KEY to unlock the complete backwards-scripting framework analysis showing exactly how top creators engineer videos from ending to beginning.'
    },
    cta: {
      summary: '• Add GEMINI_API_KEY for CTA analysis',
      detailed: 'Unlock detailed call-to-action strategy breakdown.'
    },
    visualElements: {
      summary: '• Add GEMINI_API_KEY for visual analysis',
      detailed: 'Unlock detailed technical production analysis.'
    },
    successFactors: '1. Add GEMINI_API_KEY\n2. Unlock algorithm insights\n3. Get psychology breakdowns',
    replicableElements: '1. Add API keys in Vercel\n2. Get tactical insights\n3. Access full features',
    contentType: 'Unknown',
    category: 'Unknown',
    tone: 'Unknown',
    isAd: 'Unknown',
    aiPrompts: {
      midjourney: 'Add GEMINI_API_KEY for complete AI prompts',
      stableDiffusion: 'Add GEMINI_API_KEY for SD prompts',
      productTemplate: 'Add GEMINI_API_KEY for product templates',
      example: 'Add GEMINI_API_KEY for examples',
      shotBreakdown: 'Add GEMINI_API_KEY for shot-by-shot breakdown'
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
          summary: '• Quick jump cut to creator holding product at eye level\n• Opens with "Wait, this actually works?" in surprised tone\n• Creates immediate curiosity gap about product effectiveness\n• Pattern interrupt through unexpected positive reaction',
          detailed: 'Opens with sharp jump cut from black screen to medium close-up of creator in natural bedroom setting, holding product bottle at camera-center eye level filling 30% of frame. Natural window lighting from left creates soft highlights on product label. Creator wears casual white t-shirt, direct eye contact with camera, eyebrows raised in genuine surprise expression. Opens mouth saying "Wait, this actually works?" with emphasis on "actually" - voice inflection rises at end creating question energy. Background shows slightly blurred bookshelf adding authenticity. The surprise-question combo triggers pattern interrupt while "actually works" creates information gap demanding resolution.'
        },
        storyLine: {
          summary: '• Uses classic before-after-reveal structure over 15 seconds\n• Shows 3-day struggle montage with relatable morning routine fails\n• Maintains engagement through rapid 2-second cuts between timeframes\n• Emotional journey: frustration to skepticism to relief',
          detailed: 'Narrative follows problem-solution structure compressed into 15 seconds. Opens establishing pain: 3-second montage of creator struggling to wake up at 6am across three mornings (2sec, 2sec, 2sec cuts - alarm clock, hitting snooze, groggy face). Transitions using simple swipe to product introduction (3 seconds). Middle section shows skeptical testing phase with jump cuts every 1.5 seconds showing different days, maintaining visual variety. Final 4 seconds reveal successful morning routine with energetic creator. Each segment connects through consistent bedroom location and lighting, creating cohesive narrative despite time jumps. Pacing accelerates toward end, building momentum into payoff.'
        },
        scriptingProcess: {
          summary: '• IDEA VALIDATION: Morning routine struggle is universally relatable, solution-focused content performs well\n• HOOK CONSTRUCTION: Surprise emotion plus questioning tone engineered for scroll-stop\n• LAST LINE PLANNING: Energetic "Okay I am actually awake" reaction planned as abrupt ending\n• FORESHADOWING: "Let me show you what happened" promise sets clear payoff expectation\n• ROUGH SCRIPT: Day 1 struggle, Day 2 struggle, Day 3 struggle, Product intro, Testing montage, Success reaction\n• FILMING: Multiple takes across 4 actual days, consistent bedroom location, same outfit for continuity\n• EDITING: Hard cuts every 2 seconds average, no transitions for authenticity, natural audio mix',
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
    }
  ];
}

export const config = {
  api: { responseLimit: false }
}
