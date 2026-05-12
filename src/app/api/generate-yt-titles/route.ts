// File: src/app/api/generate-yt-titles/route.ts
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