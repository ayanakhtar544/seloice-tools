// File: src/app/api/generate-hooks/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { topic } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: "Please enter a topic" }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "Groq API key is missing" }, { status: 500 });
    }

    // 🔥 SENIOR DEV MAGIC: Strict Prompt Engineering for JSON output
    const systemPrompt = `You are an elite social media strategist who creates viral 3-second hooks for TikTok, Instagram Reels, and YouTube Shorts. 
    The user will give you a topic. You must generate 9 highly engaging hooks divided into 3 categories:
    1. 'curiosity' (Make them wonder what happens next)
    2. 'fomo' (Fear Of Missing Out - make them feel they will lose something if they don't watch)
    3. 'story' (Relatable or crazy personal story starts)
    
    You MUST output ONLY a valid JSON object matching this exact structure, with no markdown, no intro, no outro:
    {
      "curiosity": ["hook 1", "hook 2", "hook 3"],
      "fomo": ["hook 1", "hook 2", "hook 3"],
      "story": ["hook 1", "hook 2", "hook 3"]
    }`;

    // Groq Text Completion API call 
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // 🔥 FIX YAHAN HAI: Naya aur supported model use kiya hai
        model: 'llama-3.1-8b-instant', 
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Topic: ${topic}` }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" } // Force Groq to return JSON
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: errorText }, { status: response.status });
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;
    
    // Parse the JSON string from AI into a real JS object
    const hooksData = JSON.parse(generatedContent);

    return NextResponse.json(hooksData, { status: 200 });

  } catch (error: any) {
    console.error("Hook Generation Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate hooks" }, { status: 500 });
  }
}