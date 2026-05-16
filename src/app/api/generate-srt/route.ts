import { NextResponse } from 'next/server';
import {
  type VerboseTranscriptionResponse,
  transcribeWithGroq,
} from '@/lib/server/groq-transcription';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

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
    const language = formData.get('language') as string | null;

    if (!file) return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    if (file.size === 0) {
      return NextResponse.json({ error: 'Uploaded audio file is empty.' }, { status: 400 });
    }
    
    const data = (await transcribeWithGroq(file, {
      filename: 'audio.mp3',
      language: language ?? undefined,
      responseFormat: 'verbose_json',
    })) as VerboseTranscriptionResponse;
    
    if (!data.segments || data.segments.length === 0) {
       return NextResponse.json({ error: "No speech detected in video" }, { status: 400 });
    }

    let srtText = "";
    data.segments.forEach((segment, index: number) => {
       const start = formatTime(segment.start);
       const end = formatTime(segment.end);
       srtText += `${index + 1}\n${start} --> ${end}\n${segment.text.trim()}\n\n`;
    });

    return new NextResponse(srtText.trim(), { 
      status: 200, 
      headers: { 'Content-Type': 'text/plain' } 
    });

  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
