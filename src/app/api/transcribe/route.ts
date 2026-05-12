// File: src/app/api/transcribe/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as Blob | null;

    if (!file) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY is missing in environment variables.");
      return NextResponse.json({ error: "API key is missing in .env.local" }, { status: 500 });
    }

    const groqFormData = new FormData();
    // 🔥 SENIOR DEV FIX: Next.js file name hata deta hai, hum manually 'audio.mp3' bhejenge
    groqFormData.append('file', file, 'audio.mp3'); 
    groqFormData.append('model', 'whisper-large-v3');
    groqFormData.append('response_format', 'json');

    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: groqFormData,
    });

    if (!response.ok) {
      // Ye humein exact error batayega ki Groq ne reject kyun kiya
      const errorText = await response.text();
      console.error("Groq API Error DETAILS:", errorText);
      return NextResponse.json({ error: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ text: data.text }, { status: 200 });

  } catch (error: any) {
    console.error("Server Crash Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}