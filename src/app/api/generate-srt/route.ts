// File: src/app/api/generate-srt/route.ts
import { NextResponse } from 'next/server';

function formatTime(secNum: number) {
  const hours = Math.floor(secNum / 3600);
  const minutes = Math.floor((secNum - (hours * 3600)) / 60);
  const seconds = Math.floor(secNum - (hours * 3600) - (minutes * 60));
  const milliseconds = Math.floor((secNum % 1) * 1000);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')},${String(milliseconds).padStart(3, '0')}`;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as Blob | null;
    const language = formData.get('language') as string | null; // 🔥 Naya Language parameter catch kiya

    if (!file) return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    if (!process.env.GROQ_API_KEY) return NextResponse.json({ error: "API key is missing" }, { status: 500 });

    const groqFormData = new FormData();
    groqFormData.append('file', file, 'audio.mp3');
    groqFormData.append('model', 'whisper-large-v3');
    groqFormData.append('response_format', 'verbose_json'); 

    // 🔥 Agar user ne koi specific language select ki hai, toh Groq ko batao
    if (language && language !== 'auto') {
      groqFormData.append('language', language);
    }

    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` },
      body: groqFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: errorText }, { status: response.status });
    }

    const data = await response.json();
    
    if (!data.segments || data.segments.length === 0) {
       return NextResponse.json({ error: "No speech detected in video" }, { status: 400 });
    }

    let srtText = "";
    data.segments.forEach((segment: any, index: number) => {
       const start = formatTime(segment.start);
       const end = formatTime(segment.end);
       srtText += `${index + 1}\n${start} --> ${end}\n${segment.text.trim()}\n\n`;
    });

    return new NextResponse(srtText.trim(), { 
      status: 200, 
      headers: { 'Content-Type': 'text/plain' } 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}