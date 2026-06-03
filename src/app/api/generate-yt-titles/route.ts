import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { validateRequest, GenerateTitlesRequestSchema, sanitizeInput } from '@/lib/security/validation';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const { limited, retryAfter } = await checkRateLimit(ip, "/api/generate-yt-titles");
    if (limited) {
      return NextResponse.json({ error: `Rate limit exceeded. Try again in ${retryAfter} seconds.` }, { status: 429 });
    }

    const body = await request.json();
    const validated = validateRequest(GenerateTitlesRequestSchema, body);
    
    if (!validated.success) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    const topic = sanitizeInput(validated.data.topic);

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "API key missing" }, { status: 500 });
    }

    // 🔥 SENIOR DEV PROMPT: Hum AI ko exactly bata rahe hain ki kaisa title chahiye
    const systemPrompt = `You are an expert YouTube strategist specializing in high Click-Through Rate (CTR) titles.
    Generate 9 YouTube titles for the given topic, divided into 3 categories:
    1. 'clickbait': High curiosity, irresistible to click (but not misleading).
    2. 'seo': Optimized for YouTube Search with strong keywords.
    3. 'emotional': Story-driven, emotional, or shocking.
    
    Output ONLY a valid JSON object:
    {
      "clickbait": ["Title 1", "Title 2", "Title 3"],
      "seo": ["Title 1", "Title 2", "Title 3"],
      "emotional": ["Title 1", "Title 2", "Title 3"]
    }`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant', // Latest fast model
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Video Topic: ${topic}` }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(JSON.parse(data.choices[0].message.content), { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}