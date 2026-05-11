// File: src/app/api/transcribe/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: "Koi file nahi mili bhai!" }, { status: 400 });
    }

    // Yahan apni GROQ API Key daalni hai (Step 3 me bataunga kaise milegi)
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
      return NextResponse.json({ error: "GROQ API Key nahi mila!" }, { status: 500 });
    }

    // Groq ko bhejne ke liye data prepare kar rahe hain
    const groqFormData = new FormData();
    groqFormData.append('file', file);
    groqFormData.append('model', 'whisper-large-v3'); // Duniya ka sabse best free transcription model

    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: groqFormData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Groq API se error aaya hai");
    }

    // Transcription success! Text wapas bhej rahe hain
    return NextResponse.json({ text: data.text });
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}