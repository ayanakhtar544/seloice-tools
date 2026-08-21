import Groq from 'groq-sdk';
import { NextResponse } from 'next/server';

export const maxDuration = 300; // 5 mins max Vercel timeout

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;
    const timeOffset = parseFloat((formData.get('timeOffset') as string) || '0');

    if (!audioFile || audioFile.size === 0) {
      return NextResponse.json({ error: 'Valid audio chunk is required' }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'Server configuration error: GROQ_API_KEY missing' }, { status: 500 });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    
    let transcription: any;
    let retries = 3;
    let lastError: any;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`[API-CHUNK] Transcribing chunk at offset ${timeOffset}s (Attempt ${attempt})...`);
        transcription = await groq.audio.transcriptions.create({
          file: audioFile,
          model: "whisper-large-v3",
          response_format: "verbose_json", 
        });
        break; // Success
      } catch (error: any) {
        lastError = error;
        console.warn(`[API-CHUNK] Attempt ${attempt} failed for offset ${timeOffset}s:`, error.message);
        
        if (error.message && error.message.includes('429')) {
           break; // Stop retrying immediately on rate limits
        }

        if (attempt === retries) break;
        // Wait before retrying
        await new Promise(res => setTimeout(res, 2000 * attempt));
      }
    }

    if (!transcription) {
      throw lastError || new Error("Failed to transcribe after retries.");
    }

    const typedTranscription = transcription as any;
    
    // Format segments with adjusted time offsets
    const segmentsText = typedTranscription.segments.map((seg: any) => 
      `[${(seg.start + timeOffset).toFixed(1)}s - ${(seg.end + timeOffset).toFixed(1)}s] ${seg.text}`
    ).join('\n');

    return NextResponse.json({ success: true, text: segmentsText, rawDuration: typedTranscription.duration || 0 });
    
  } catch (error: any) {
    console.error('[API-CHUNK] Error:', error);
    let errorMessage = error.message || 'Chunk processing failed';
    
    if (errorMessage.includes('429') || errorMessage.includes('Rate limit')) {
      try {
        const jsonStr = errorMessage.substring(errorMessage.indexOf('{'));
        const parsed = JSON.parse(jsonStr);
        if (parsed.error && parsed.error.message) {
          errorMessage = `Groq API Quota: ${parsed.error.message}`;
        }
      } catch (e) {
        errorMessage = 'API Rate Limit Exceeded. Please wait a few minutes and try again.';
      }
    }
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
