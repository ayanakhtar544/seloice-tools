import { NextResponse } from 'next/server';
import { transcribeWithGroq } from '@/lib/server/groq-transcription';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as Blob | null;

    if (!file) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    if (file.size === 0) {
      return NextResponse.json({ error: "Uploaded audio file is empty." }, { status: 400 });
    }

    const data = await transcribeWithGroq(file, {
      filename: 'audio.mp3',
      responseFormat: 'json',
    });

    return NextResponse.json({ text: data.text || '' }, { status: 200 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
