// lib/geminiVision.js
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function analyzeWithGeminiVision(videoData, frameImages) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  console.log('🤖 Gemini Vision starting...');
  console.log('- Video:', videoData.title?.substring(0, 50));
  console.log('- Images count:', frameImages.length);
  console.log('- First image length:', frameImages[0]?.length);

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.0-flash-exp'
  });

  try {
    const imageParts = frameImages
      .filter(img => img && img.length > 100) // 确保有效
      .map(base64 => ({
        inlineData: {
          data: base64,
          mimeType: 'image/jpeg'
        }
      }));

    console.log('✅ Prepared', imageParts.length, 'images for Gemini');

    if (imageParts.length === 0) {
      throw new Error('No valid images to analyze');
    }

    const prompt = `You are analyzing a TikTok video to help someone replicate it and make money.

VIDEO INFO:
- Title: "${videoData.title || videoData.description}"
- Creator: @${videoData.author}
- Views: ${videoData.views?.toLocaleString() || 'Unknown'}

I'm showing you ${imageParts.length} image(s) from this video.

CRITICAL: You MUST analyze what you SEE in the images. DO NOT say you need more information.

---

## VISUAL ANALYSIS

**What I see in the image(s):**

1. **Main Subject:**
   - Person/product/scene: [Describe]
   - Position in frame: [Left/center/right]
   - Size: [Close-up/medium/wide]

2. **Camera Setup:**
   - Angle: [Eye-level/above/below]
   - Distance: [Estimate in feet]
   - Device: [Phone/camera - can you tell?]

3. **Lighting:**
   - Source: [Window/ring light/overhead]
   - Direction: [Front/side/back]
   - Quality: [Harsh/soft/natural]
   - Color: [Warm/cool/neutral]

4. **Background:**
   - Location: [Bedroom/kitchen/outdoor/etc]
   - Details: [Specific items visible]
   - Clean or cluttered: [Describe]

5. **Props/Objects:**
   - In hands: [What exactly]
   - On surfaces: [What's visible]
   - Brand/product visible: [Yes/no, what]

6. **Person (if visible):**
   - Clothing: [Color, style]
   - Expression: [Emotion]
   - Action: [What they're doing]
   - Looking: [At camera/away/down]

7. **Text Overlays:**
   - Visible text: "[Quote exactly]"
   - Font: [Style]
   - Position: [Where]

8. **Colors & Mood:**
   - Dominant colors: [List]
   - Filter/grade: [Warm/cool/saturated/desaturated]
   - Overall vibe: [Professional/casual/raw]

---

## REPLICATION GUIDE

**Equipment Shopping List:**
1. Camera: [Specific device] - $[X]
2. Lighting: [Specific item] - $[X]
3. Props: [List each] - $[X each]
4. **Total: $[X]**

**Setup Instructions:**
1. Camera placement: [Exactly where, how high]
2. Lighting setup: [Where to position]
3. Background: [How to prepare]
4. Props arrangement: [Where to place]

**Shot-by-Shot:**

Shot 1:
- Duration: [X seconds]
- Camera: [Position]
- You: [Action]
- Say: "[Script]"
- Focus on: [What's important]

Shot 2:
[Same structure]

**Difficulty:**
- Equipment: [X/10] - Why: [Reason]
- Acting: [X/10] - Why: [Reason]
- Setup: [X/10] - Why: [Reason]
- **Overall: [X/10]**

**Budget: $[X]**

**Can beginners do this?**
✅ YES - [Why]
⚠️ YES BUT - [Requirements]
❌ NO - [Why not]

**Monetization:**
This works for:
1. [Product category] - Commission: [X%] - Example: [Specific products]
2. [Product category] - Commission: [X%] - Example: [Specific products]

**Expected earnings first month: $[X-Y]**

---

IMPORTANT: Base EVERYTHING on what you SEE in the images. Be ultra-specific.`;

    console.log('📤 Sending to Gemini Vision API...');

    const result = await model.generateContent([
      prompt,
      ...imageParts
    ]);

    const response = await result.response;
    const analysisText = response.text();

    console.log('✅ Gemini response received, length:', analysisText.length);
    console.log('First 100 chars:', analysisText.substring(0, 100));

    return {
      fullText: analysisText,
      structured: {
        replicationScore: extractScore(analysisText),
        difficulty: extractDifficulty(analysisText),
        budget: extractBudget(analysisText),
        canBeginneerDoIt: extractBeginnerAssessment(analysisText)
      }
    };

  } catch (error) {
    console.error('❌ Gemini Vision error:', error);
    
    if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      console.log('⚠️ Vision API quota exceeded');
    }
    
    throw error;
  }
}

function extractScore(text) {
  const match = text.match(/Overall[:\s]*(\d+)\/10|Replication[:\s]*(\d+)\/10/i);
  return match ? parseInt(match[1] || match[2]) : 7;
}

function extractDifficulty(text) {
  const match = text.match(/Difficulty[:\s]*(\d+)\/10/i);
  return match ? parseInt(match[1]) : 5;
}

function extractBudget(text) {
  const match = text.match(/Total[:\s]*\$(\d+)|Budget[:\s]*\$(\d+)/i);
  return match ? parseInt(match[1] || match[2]) : 50;
}

function extractBeginnerAssessment(text) {
  if (text.includes('✅ YES') && !text.includes('YES BUT')) return 'yes';
  if (text.includes('⚠️ YES BUT') || text.includes('YES -')) return 'yes-with-conditions';
  if (text.includes('❌ NO')) return 'no';
  return 'yes-with-conditions';
}
