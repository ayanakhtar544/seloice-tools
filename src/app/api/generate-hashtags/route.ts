// File: src/app/api/generate-hashtags/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { topic } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

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