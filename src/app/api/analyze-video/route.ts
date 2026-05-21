// File: src/app/api/analyze-video/route.ts
import Groq from 'groq-sdk';
import { NextResponse } from 'next/server';

export const maxDuration = 300;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;
    const clipCount = formData.get('clipCount') || '5';

    if (!audioFile) {
      return NextResponse.json({ error: 'Audio file missing bhai!' }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'GROQ_API_KEY .env.local me nahi mili!' }, { status: 500 });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    console.log('[API-BRAIN] 🎙️ Sending audio to Groq Whisper for timestamps...');

    // 1. Transcribe Audio
    const transcription = await groq.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-large-v3",
      response_format: "verbose_json", 
    });

    const segments = (transcription as any).segments.map((seg: any) => 
      `[${seg.start.toFixed(1)}s - ${seg.end.toFixed(1)}s] ${seg.text}`
    ).join('\n');

    console.log('[API-BRAIN] 🧠 Whisper done! Sending transcript to LLM...');

    // 2. The Advance Prompt
    const prompt = `
      You are an elite short-form video producer, trained by analyzing thousands of viral TikToks and YouTube Shorts.
      Analyze this transcribed audio track with timestamps.
      Extract EXACTLY ${clipCount} highly engaging, standalone segments that can go viral.

      Transcript:
      ${segments}
      
      EXTRACTION CRITERIA:
      - The Hook (0-3s): Must start with a strong, curiosity-inducing statement or high energy.
      - Context: The clip MUST make sense on its own.
      
      RULES:
      1. Each segment duration MUST be between 15 seconds and 90 seconds.
      2. Return ONLY a valid JSON array. No markdown, no explanations.
      3. Format strictly:
      [
        { "id": "clip-1", "startTime": number, "duration": number, "title": "Catchy Hook Title", "score": number }
      ]
    `;

    // 3. Model Fallback Engine
    const modelsToTry = [
      'llama-3.3-70b-versatile',
      'llama-3.1-70b-versatile',
      'mixtral-8x7b-32768'
    ];

    let responseText = "";
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        console.log(`[API-BRAIN] Attempting model: ${modelName}...`);
        
        const chatCompletion = await groq.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: modelName,
          temperature: 0.2, 
        });

        responseText = chatCompletion.choices[0]?.message?.content || "[]";
        console.log(`[API-BRAIN] 🚀 SUCCESS with model ${modelName}!`);
        break; 
      } catch (error: any) {
        console.warn(`[API-BRAIN] Model ${modelName} failed. Trying next...`);
        lastError = error;
      }
    }

    if (!responseText) {
      throw new Error(`Saare models fail ho gaye! Last error: ${lastError?.message}`);
    }
    
    // 4. JSON Parsing
    let clips = [];
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      clips = JSON.parse(jsonMatch[0]);
    } else {
      clips = JSON.parse(responseText);
    }

    return NextResponse.json({ success: true, clips }); 

  } catch (error: any) {
    console.error('Groq API Error:', error);
    return NextResponse.json({ error: error.message || 'Groq processing failed' }, { status: 500 });
  }
}