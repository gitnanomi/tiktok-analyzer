import OpenAI from 'openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

  if (!url || !url.includes('tiktok.com')) {
    return res.status(400).json({ error: 'Invalid TikTok URL' });
  }

  try {
    console.log('Researching viral video:', url);
    
    // 获取视频元数据
    let videoData = null;
    try {
      const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
      const response = await fetch(oembedUrl);
      if (response.ok) {
        videoData = await response.json();
      }
    } catch (error) {
      console.log('oEmbed fetch failed');
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // 市场调研专用分析提示词
    const researchPrompt = `
You are a viral TikTok content researcher following Steven's "Million Dollar App Playbook" methodology.

Analyze this viral TikTok video for market research purposes:

**Video URL:** ${url}
**Title/Description:** ${videoData?.title || 'N/A'}
**Creator:** ${videoData?.author_name || 'Unknown'}

---

# VIRAL VIDEO ANALYSIS - Market Research Format

Provide analysis in this EXACT structured format for easy spreadsheet entry:

## 1. HOOK (First 3 Seconds)

**Opening Line/Sound:**
[Exact words spoken OR describe the sound/music]

**Visual Hook:**
[Describe exactly what you see: person's action, camera movement, setting, any props]
Example: "Person walking toward camera", "Sitting in front of 6 glasses of water", "Close-up of frustrated face"

**Hook Type:**
[One of: Question | Shock Statement | Pattern Interrupt | Personal Story | Problem Statement | Visual Surprise]

**Why It Works:**
[1-2 sentences explaining the psychological trigger]

**Small Details That Matter:**
[Note ANY small details that might contribute to virality: specific gestures, facial expressions, text overlays, background elements]

---

## 2. STORYLINE / PAIN POINTS

**Personal Story/Journey:**
[How does the creator tell their story? What personal history do they share?]
Example: "Creator shares their 10-year smoking journey"

**Pain Points Described:**
[List specific pain points or negative emotions mentioned]
Example:
- Feeling irritable without cigarettes
- Lack of motivation
- Physical symptoms (coughing, feeling terrible)
- Emotional struggles (crying in bed)

**Emotional Journey:**
[Map the emotional arc: Where they started → struggles → turning point → where they are now]

**Relatability Factor:**
[What makes viewers say "that's me" or feel understood?]

**Content Format:**
[Tutorial | Story Time | Before/After | Day in Life | Problem-Solution | Comedy Skit | Educational]

---

## 3. CALL TO ACTION / SOLUTION

**The Solution Presented:**
[What is the actual solution or recommendation?]
Example: "Chewing gum", "Eating mints", "Reading this specific audiobook"

**Is This An Ad?**
[YES/NO - Even if it feels "super organic"]

**Product/Service Mentioned:**
[Specific product name, book title, app name, service, etc.]

**How Solution Is Presented:**
[Direct recommendation | Subtle mention | Product shown for 2 seconds | Link in bio | Organic integration]

**CTA Type:**
- [ ] Try this product/method
- [ ] Follow for more tips
- [ ] Comment your experience
- [ ] Share with someone who needs this
- [ ] Click link in bio
- [ ] Join a community/challenge
- [ ] No explicit CTA (just product presence)

**CTA Placement:**
[When does it appear? Beginning | Middle | End | Throughout]

**Why This CTA Works:**
[Is it subtle? Does it provide value first? How is it non-salesy?]

---

## ADDITIONAL RESEARCH NOTES

**Engagement Strategy:**
[What makes people want to comment, share, or rewatch?]

**Hook Formula:**
[Can you identify a repeatable pattern? E.g., "I quit [bad habit] by doing [surprising thing]"]

**Content Gaps:**
[What questions are left unanswered that could spark a series?]

**Replication Potential:**
[How easy would it be to adapt this format to your niche? Rate 1-10]

**Key Takeaways For Your Content:**
[3 specific things you can apply to your own videos]
1. [Takeaway 1]
2. [Takeaway 2]
3. [Takeaway 3]

---

IMPORTANT: Be specific and detailed. The goal is to understand WHY this video went viral so we can learn from it, NOT to copy it directly.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a viral content researcher analyzing TikTok videos for market research. Focus on extracting actionable insights about hooks, pain points, and CTAs. Be specific and detail-oriented. This data will be used to build a content strategy spreadsheet."
        },
        {
          role: "user",
          content: researchPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const analysis = completion.choices[0].message.content;

    // 解析分析结果为结构化数据
    const structuredData = parseAnalysisToStructured(analysis, url, videoData);

    return res.status(200).json({
      success: true,
      url: url,
      videoData: videoData,
      analysis: analysis,
      structured: structuredData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Research error:', error);
    return res.status(500).json({ 
      error: 'Analysis failed',
      message: error.message 
    });
  }
}

// 解析分析文本为结构化数据（用于导出CSV）
function parseAnalysisToStructured(analysis, url, videoData) {
  // 提取关键信息
  const hookMatch = analysis.match(/\*\*Opening Line\/Sound:\*\*\s*\n(.+)/);
  const painPointsMatch = analysis.match(/\*\*Pain Points Described:\*\*\s*\n([\s\S]+?)\n\n/);
  const solutionMatch = analysis.match(/\*\*The Solution Presented:\*\*\s*\n(.+)/);
  const isAdMatch = analysis.match(/\*\*Is This An Ad\?\*\*\s*\n(.+)/);
  
  return {
    url: url,
    title: videoData?.title || '',
    creator: videoData?.author_name || '',
    date_analyzed: new Date().toISOString().split('T')[0],
    
    // Hook分析
    hook_opening: hookMatch ? hookMatch[1].trim() : '',
    hook_visual: extractSection(analysis, 'Visual Hook:'),
    hook_type: extractSection(analysis, 'Hook Type:'),
    hook_why_works: extractSection(analysis, 'Why It Works:'),
    
    // Storyline/Pain Points
    storyline: extractSection(analysis, 'Personal Story/Journey:'),
    pain_points: painPointsMatch ? painPointsMatch[1].trim() : '',
    emotional_journey: extractSection(analysis, 'Emotional Journey:'),
    content_format: extractSection(analysis, 'Content Format:'),
    
    // CTA/Solution
    solution: solutionMatch ? solutionMatch[1].trim() : '',
    is_ad: isAdMatch ? isAdMatch[1].trim() : '',
    product_mentioned: extractSection(analysis, 'Product/Service Mentioned:'),
    cta_type: extractSection(analysis, 'How Solution Is Presented:'),
    
    // Additional notes
    key_takeaways: extractSection(analysis, 'Key Takeaways For Your Content:'),
    replication_potential: extractSection(analysis, 'Replication Potential:')
  };
}

function extractSection(text, sectionName) {
  const regex = new RegExp(`\\*\\*${sectionName}\\*\\*\\s*\\n(.+?)(?=\\n\\n|\\*\\*|$)`, 's');
  const match = text.match(regex);
  return match ? match[1].trim() : '';
}
