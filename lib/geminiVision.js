// lib/geminiVision.js
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * 使用 Gemini Vision 分析视频帧
 */
export async function analyzeWithGeminiVision(videoData, frameImages) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.0-flash-exp' 
  });

  try {
    // 准备图片数据
    const imageParts = frameImages
      .filter(img => img) // 过滤掉失败的图片
      .map(base64 => ({
        inlineData: {
          data: base64,
          mimeType: 'image/jpeg'
        }
      }));

    if (imageParts.length === 0) {
      throw new Error('No valid images to analyze');
    }

    // 超详细的 Vision Prompt
    const prompt = `You are analyzing a viral TikTok video to help someone replicate it EXACTLY.

VIDEO METADATA:
- Title: "${videoData.title || videoData.description}"
- Creator: @${videoData.author}
- Views: ${videoData.views?.toLocaleString() || 'Unknown'}
- Likes: ${videoData.likes?.toLocaleString() || 'Unknown'}

I'm showing you ${imageParts.length} frame(s) from the video. Analyze EVERY visual detail.

---

## PART 1: VISUAL INVENTORY (What you SEE in the images)

### Frame Analysis:
For EACH image, describe:

**FRAME ${imageParts.length > 1 ? '1 (Opening)' : 'ONLY'}:**
- Main Subject: [person/product/scene - be specific]
- Camera Angle: [straight-on/slightly above/below/side angle - exact degrees if you can tell]
- Distance: [extreme close-up/close-up/medium/medium-wide/wide shot]
- Subject Position: [left third/center/right third of frame]
- Background: [specific details - bedroom/gym/outdoor/car - what's visible?]
- Lighting:
  * Direction: [front/side/back - from which angle?]
  * Quality: [harsh/soft/natural/artificial]
  * Color temperature: [warm/cool/neutral]
  * Shadows: [hard/soft/none]
- Props/Objects Visible:
  * In hands: [what exactly?]
  * On surface: [what's on table/desk/counter?]
  * In background: [posters/furniture/equipment?]
- Person Details (if applicable):
  * Clothing: [exact description - color, style, brand if visible]
  * Hair: [style, length, color]
  * Facial expression: [specific emotion, mouth open/closed, eye direction]
  * Body language: [posture, gesture, energy level]
  * Makeup/accessories: [visible details]
- Text Overlays:
  * Exact text: "[quote it]"
  * Font: [bold/thin, serif/sans-serif]
  * Color: [specific]
  * Position: [top/middle/bottom, left/center/right]
  * Animation: [static/animated - how?]
- Color Grading:
  * Overall tone: [warm/cool/desaturated/vibrant]
  * Filters: [vintage/bright/dark/natural]

${imageParts.length > 1 ? `
**FRAME 2 (Middle):**
[Same analysis structure...]
- What CHANGED from Frame 1?
- New props introduced?
- Camera movement evident?
- Scene transition?

**FRAME 3 (Ending):**
[Same analysis structure...]
- Final shot composition?
- Call-to-action visible?
- Product showcased?
` : ''}

---

## PART 2: REPLICATION GUIDE (How to COPY this)

### Equipment Needed:
**Camera/Phone:**
- Device type: [iPhone/Android/Camera - can you tell from quality?]
- Mounting: [handheld/tripod/someone else holding - how can you tell?]
- Stability: [shaky/stable/gimbal smooth]
- Quality: [professional/high-end phone/budget phone]

**Lighting Setup:**
- Main light: [window/ring light/softbox/none]
- Fill light: [yes/no]
- Practical lights: [lamps/LEDs visible in shot?]
- Cost estimate: [$0 (natural) / $20-50 / $100+]

**Props/Products:**
List EVERY item that needs to be acquired:
1. [Item 1] - Where to get: [Amazon/local store/already have]
2. [Item 2] - Estimated cost: $X
3. [Item 3] - Essential or optional?

**Location:**
- Type: [indoor/outdoor, specific room]
- Size needed: [small corner/full room/large space]
- Background requirements: [clean wall/decorated/natural setting]
- Easy to access: [yes/no - why?]

---

## PART 3: SHOT-BY-SHOT REPLICATION

### Setup Instructions:
**Camera Placement:**
- Distance from subject: [estimate in feet/meters]
- Height: [eye level/chest level/floor level]
- Angle: [straight/tilted up X degrees/tilted down]
- Orientation: [portrait/landscape - though TikTok is always portrait]

**Your Position:**
- Stand: [where relative to camera]
- Face: [directly at camera/slight angle]
- Body: [centered/off-center]
- Distance: [how far from camera]

**Shot Sequence:**
${imageParts.length > 1 ? `
SHOT 1 (0-3 seconds):
` : 'SINGLE SHOT:'}
- Starting position: [exact description]
- Action: [what movement/gesture to make]
- Expression: [replicate the exact face]
- Props: [hold what, where, how]
- Timing: [quick/slow/pause]

${imageParts.length > 1 ? `
SHOT 2 (3-8 seconds):
- Transition: [cut/pan/zoom - how?]
- New elements: [what appears]
- Action: [what to do]
- Maintain: [what stays the same]

SHOT 3 (8-15 seconds):
- Final composition: [end position]
- Key focus: [what must be visible]
- Energy: [building/calm/explosive]
- End: [abrupt cut/fade/hold]
` : ''}

---

## PART 4: PRODUCTION DIFFICULTY ASSESSMENT

### Complexity Scores (1-10):
- Camera work: [X/10] - Why: [reason]
- Acting/Performance: [X/10] - Why: [requires what skill?]
- Props/Setup: [X/10] - Why: [how hard to get/arrange?]
- Lighting: [X/10] - Why: [natural vs complex setup]
- Editing: [X/10] - Why: [simple cut vs effects]
- Location: [X/10] - Why: [accessible or not]

**Overall Difficulty: [X/10]**

### Budget Estimate:
- Equipment: $[X] - [list big items]
- Props: $[X] - [list]
- Location: $[X] - [if rental needed]
- **Total: $[X]**

### Time Estimate:
- Setup time: [X minutes/hours]
- Filming time: [X minutes/hours]
- Takes needed: [estimate number]
- Editing time: [X minutes/hours]

---

## PART 5: REPLICATION READINESS

### Can a Beginner Do This?
✅ YES because:
- [Reason 1]
- [Reason 2]

⚠️ YES BUT needs:
- [Requirement 1]
- [Requirement 2]

❌ NO because:
- [Blocking issue 1]
- [Blocking issue 2]

### Required Skills:
- Acting: [none/basic/intermediate/advanced] - Why?
- Editing: [none/basic/intermediate/advanced] - Why?
- Equipment: [phone only/basic gear/professional] - What?

### Common Beginner Mistakes to Avoid:
1. ❌ [Mistake] → ✅ [Solution]
2. ❌ [Mistake] → ✅ [Solution]
3. ❌ [Mistake] → ✅ [Solution]

---

## PART 6: WHY THIS WORKS (The Psychology)

### Hook Elements:
- Pattern Interrupt: [what grabs attention in first second]
- Curiosity Gap: [what question does it create]
- Relatability: [why audience connects]
- Visual Contrast: [what's unexpected]

### Retention Tactics:
- Pacing: [fast/slow - why it works]
- Payoff: [what's the reward for watching]
- Emotional Journey: [what feeling arc]

### Virality Factors:
- Shareability: [why people would share this]
- Comment Bait: [what makes people comment]
- Rewatchability: [why watch again]

---

## PART 7: MONETIZATION MATCH

### This Format Works For:
1. **Product Category 1:** [specific niche]
   - Example products: [3 specific items with brands]
   - Why it fits: [reason]
   - Commission range: [X-Y%]

2. **Product Category 2:** [another niche]
   - Example products: [3 items]
   - Why it fits: [reason]

3. **Product Category 3:** [third option]
   - Example products: [3 items]
   - Why it fits: [reason]

### NOT Good For:
- [Product type 1] because [reason]
- [Product type 2] because [reason]

---

## PART 8: ALTERNATIVES & MODIFICATIONS

### If You Can't Get [Expensive Prop]:
→ Use: [cheaper alternative]
→ Modify shot to: [adjustment]

### If You Don't Have [Specific Location]:
→ Alternative: [other location]
→ Adapt by: [change this]

### If You Can't [Specific Action]:
→ Instead: [different approach]
→ Still works because: [reason]

---

## PART 9: FINAL RECOMMENDATION

**Replication Score: [X/10]**

**Verdict:**
⭐⭐⭐⭐⭐ COPY THIS NOW - [why]
⭐⭐⭐⭐ GOOD CHOICE IF - [condition]
⭐⭐⭐ TRY IT IF - [condition]
⭐⭐ SKIP UNLESS - [condition]
⭐ DON'T BOTHER - [why]

**Reasoning:**
[2-3 sentences explaining your recommendation based on everything analyzed]

**Success Probability for Beginner:** [X%]
**Expected Timeline:** [X days to film and post]
**Expected First Week Views:** [range]

---

## PART 10: IMMEDIATE NEXT STEPS

If you decide to replicate:

[ ] Step 1: [Most important first action]
[ ] Step 2: [Second action]
[ ] Step 3: [Third action]

Do NOT skip Step 1. It's the foundation.

**CRITICAL:** Before you start filming, [most important warning].

---

Remember: Be ULTRA specific. The person reading this should be able to replicate the video with ZERO guessing.`;

    // 调用 Gemini Vision
    const result = await model.generateContent([
      prompt,
      ...imageParts
    ]);

    const response = await result.response;
    const analysisText = response.text();

    // 解析结构化数据
    const structuredAnalysis = parseVisionAnalysis(analysisText);

    return {
      fullText: analysisText,
      structured: structuredAnalysis
    };

  } catch (error) {
    console.error('Gemini Vision error:', error);
    
    // 如果 Vision 失败，回退到文本分析
    if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      console.log('Vision API quota exceeded, falling back to text analysis');
      return null; // 让主函数处理 fallback
    }
    
    throw error;
  }
}

/**
 * 解析 Vision 分析为结构化数据
 */
function parseVisionAnalysis(text) {
  return {
    replicationScore: extractScore(text),
    difficulty: extractDifficulty(text),
    equipment: extractEquipment(text),
    budget: extractBudget(text),
    timeEstimate: extractTimeEstimate(text),
    canBeginneerDoIt: extractBeginnerAssessment(text),
    recommendation: extractRecommendation(text),
    monetization: extractMonetization(text),
    immediateSteps: extractImmediateSteps(text)
  };
}

// 辅助解析函数
function extractScore(text) {
  const match = text.match(/Replication Score:\s*(\d+)\/10/i);
  return match ? parseInt(match[1]) : null;
}

function extractDifficulty(text) {
  const match = text.match(/Overall Difficulty:\s*(\d+)\/10/i);
  return match ? parseInt(match[1]) : null;
}

function extractEquipment(text) {
  const section = text.match(/Equipment Needed:([\s\S]*?)(?=\n\n##|\n\n---)/);
  return section ? section[1].trim() : null;
}

function extractBudget(text) {
  const match = text.match(/Total:\s*\$(\d+)/i);
  return match ? parseInt(match[1]) : null;
}

function extractTimeEstimate(text) {
  const filming = text.match(/Filming time:\s*([^\n]+)/i);
  return filming ? filming[1].trim() : null;
}

function extractBeginnerAssessment(text) {
  if (text.includes('✅ YES because:')) return 'yes';
  if (text.includes('⚠️ YES BUT needs:')) return 'yes-with-conditions';
  if (text.includes('❌ NO because:')) return 'no';
  return 'unknown';
}

function extractRecommendation(text) {
  const section = text.match(/Verdict:([\s\S]*?)(?=\*\*Reasoning)/);
  return section ? section[1].trim() : null;
}

function extractMonetization(text) {
  const section = text.match(/This Format Works For:([\s\S]*?)(?=\n\n##|\n\n---)/);
  return section ? section[1].trim() : null;
}

function extractImmediateSteps(text) {
  const section = text.match(/IMMEDIATE NEXT STEPS([\s\S]*?)(?=\n\n##|$)/);
  if (!section) return [];
  
  const steps = section[1].match(/\[ \] Step \d+: ([^\n]+)/g);
  return steps ? steps.map(s => s.replace(/\[ \] Step \d+: /, '').trim()) : [];
}

export { parseVisionAnalysis };
