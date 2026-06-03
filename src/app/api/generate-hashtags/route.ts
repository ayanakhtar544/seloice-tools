import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { validateRequest, GenerateHashtagsRequestSchema, sanitizeInput } from '@/lib/security/validation';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const { limited, retryAfter } = await checkRateLimit(ip, "/api/generate-hashtags");
    if (limited) {
      return NextResponse.json({ error: `Rate limit exceeded. Try again in ${retryAfter} seconds.` }, { status: 429 });
    }

    const body = await request.json();
    const validated = validateRequest(GenerateHashtagsRequestSchema, body);
    
    if (!validated.success) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    const topic = sanitizeInput(validated.data.topic);

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "API key missing" }, { status: 500 });
    }

    const systemPrompt = `You are a social media SEO expert. Generate 30 viral hashtags for the given topic.
    Divide them into 3 groups of 10 hashtags each:
    1. 'viral': Broad, high-reach hashtags.
    2. 'niche': Specific to the topic.
    3. 'lowComp': Low competition hashtags (Hidden gems).
    
    Output ONLY a valid JSON object:
    {
      "viral": ["#tag1", "#tag2", ...],
      "niche": ["#tag1", "#tag2", ...],
      "lowComp": ["#tag1", "#tag2", ...]
    }`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant', 
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Topic: ${topic}` }
        ],
        temperature: 0.6,
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