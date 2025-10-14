import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { 
    analysisData,
    productName,
    productDescription,
    targetAudience,
    uniqueSellingPoint,
    videoLength,
    tone
  } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `You are an expert TikTok video scriptwriter. Create a complete, production-ready script based on this viral video analysis.

ORIGINAL VIRAL VIDEO ANALYSIS:
${JSON.stringify(analysisData.hook, null, 2)}

USER'S PRODUCT DETAILS:
- Product: ${productName}
- Description: ${productDescription}
- Target Audience: ${targetAudience}
- Unique Selling Point: ${uniqueSellingPoint}
- Desired Length: ${videoLength} seconds
- Tone: ${tone}

CREATE A COMPLETE SCRIPT WITH:

1. MASTER SCRIPT (Second-by-Second Breakdown)
Format each second like this:

0:00-0:03 [HOOK]
VISUAL: [Exact camera shot, framing, what's visible]
ACTION: [Your specific movements, expressions]
AUDIO/DIALOGUE: "[Exact words to say]"
WHY: [Psychology trigger being used]

[Continue for every 3-second segment]

2. SHOT LIST (Production Details)
Shot 1 - Hook (0-3s)
- Camera: Front-facing iPhone, eye-level
- Framing: Medium close-up, rule of thirds
- Lighting: Natural window light from left
- Props: ${productName} held at chest level
- Expression: Surprised, eyebrows raised
- Movement: Slight lean forward at 2s mark
- Text Overlay: None (rely on facial expression)

[Continue for all shots]

3. DIALOGUE SCRIPT (Word-for-Word)
[Full transcript with emotional cues]
"[Word] (emphasis)" 
*pause 0.5s*
"[Next phrase] (excited tone)"

4. DIRECTOR'S NOTES
- Pre-shoot checklist
- Backup dialogue variations
- Common mistakes to avoid
- Post-production tips

5. THREE ALTERNATIVE VERSIONS
Version A: [Main script above]
Version B: [More direct/sales-focused variation]
Version C: [More story/emotional variation]

CRITICAL RULES:
- Every second must be accounted for
- All dialogue must be conversational and natural
- Visual descriptions must be specific enough to recreate
- Include exact timing for pauses and emphasis
- Reference the viral video's successful patterns
- Adapt the hook structure but customize for ${productName}

Generate a complete, production-ready script now:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse and structure the response
    const structuredScript = parseScriptResponse(text);

    return res.status(200).json({
      success: true,
      script: structuredScript,
      rawScript: text
    });

  } catch (error) {
    console.error('Script generation error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate script',
      details: error.message 
    });
  }
}

function parseScriptResponse(text) {
  // Basic parsing - can be enhanced
  return {
    masterScript: extractSection(text, 'MASTER SCRIPT', 'SHOT LIST'),
    shotList: extractSection(text, 'SHOT LIST', 'DIALOGUE SCRIPT'),
    dialogueScript: extractSection(text, 'DIALOGUE SCRIPT', 'DIRECTOR\'S NOTES'),
    directorsNotes: extractSection(text, 'DIRECTOR\'S NOTES', 'THREE ALTERNATIVE'),
    alternatives: extractSection(text, 'THREE ALTERNATIVE', null),
    fullText: text
  };
}

function extractSection(text, startMarker, endMarker) {
  const startIndex = text.indexOf(startMarker);
  if (startIndex === -1) return '';
  
  const contentStart = startIndex + startMarker.length;
  
  if (!endMarker) {
    return text.substring(contentStart).trim();
  }
  
  const endIndex = text.indexOf(endMarker, contentStart);
  if (endIndex === -1) {
    return text.substring(contentStart).trim();
  }
  
  return text.substring(contentStart, endIndex).trim();
}
