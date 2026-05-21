// File: src/app/api/faceless-story/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { topic, language } = await req.json();

    if (!topic) {
      return NextResponse.json({ success: false, error: 'Topic is required' }, { status: 400 });
    }

    console.log(`[STORY-ENGINE] Generating ${language} script for: "${topic}"`);

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      throw new Error('GROQ_API_KEY is missing in .env file');
    }

    // 🔥 THE STRICT ALGO + LANGUAGE PROMPT 🔥
    const systemPrompt = `You are an elite Instagram Reels and TikTok growth hacker. Write a highly viral script.

CRITICAL RULES:
1. THE HOOK (0-3 Seconds): Start with a controversial or shocking hook.
2. PACING: Fast, no fluff, high retention.
3. LENGTH: 60 to 80 words exactly.
4. FORMAT: ONLY raw spoken text. No emojis, no brackets, no [Intro] tags.

🛑 STRICT LANGUAGE MANDATE: 
You are strictly forbidden from writing in any other language except ${language}.
- If Language is "Hindi (Pure)": Write ONLY in pure Hindi script (Devanagari). Example: "क्या आप जानते हैं..."
- If Language is "Hinglish (WhatsApp Style)": Write Hindi using the English alphabet (Roman Hindi). Use Gen-Z slang. Example: "Bhai kya aapko pata hai ek aisi jagah..."
- If Language is "English": Write in fluent English.

Do NOT mix languages unless using natural loan words.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant', 
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            // User prompt mein bhi forcefully repeat kiya taaki AI bhule na
            content: `Write a viral script about: "${topic}". \nWARNING: You MUST write this entirely in ${language}!` 
          }
        ],
        temperature: 0.85, 
        max_tokens: 200,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to generate story from AI');
    }

    const generatedScript = data.choices[0].message.content.trim();

    return NextResponse.json({ 
      success: true, 
      script: generatedScript 
    });

  } catch (error: any) {
    console.error('[STORY-ENGINE ERROR]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}