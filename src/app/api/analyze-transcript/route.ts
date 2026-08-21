import Groq from 'groq-sdk';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export const maxDuration = 300; // Vercel function timeout

// Advanced schema for validating AI output
const ClipSchema = z.object({
  id: z.string(),
  startTime: z.number().min(0),
  duration: z.number().min(15).max(90),
  title: z.string(),
  hookText: z.string(),
  score: z.number().min(0).max(100),
  metrics: z.object({
    hookStrength: z.number().min(0).max(10),
    emotion: z.number().min(0).max(10),
    retentionPotential: z.number().min(0).max(10)
  }).optional()
});

const ApiResponseSchema = z.array(ClipSchema);

type Clip = z.infer<typeof ClipSchema>;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { transcript, clipCount = 5, totalDuration } = body;

    if (!transcript) {
      return NextResponse.json({ error: 'Transcript text is required' }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'Server configuration error: GROQ_API_KEY missing' }, { status: 500 });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    
    console.log(`[API-BRAIN] 🧠 Analyzing full transcript of ${totalDuration}s. Sending to LLM...`);

    const prompt = `
      You are an elite short-form video producer, trained by analyzing thousands of viral TikToks and YouTube Shorts.
      Analyze this transcribed audio track with timestamps.
      Extract EXACTLY ${clipCount} highly engaging, standalone segments that can go viral.

      Transcript:
      ${transcript}
      
      EXTRACTION CRITERIA:
      - The Hook (0-3s): Must start with a strong, curiosity-inducing statement or high energy. Do not start with filler words like "um", "so", or "yeah".
      - Context: The clip MUST make sense on its own.
      - Emotion: Look for strong emotional reactions, contrarian opinions, or surprising facts.
      
      RULES:
      1. Each segment duration MUST be between 15 seconds and 90 seconds.
      2. The 'startTime' + 'duration' MUST NOT exceed the total audio length (${totalDuration}s).
      3. Return ONLY a valid JSON array. No markdown blocks, no explanations.
      4. Format strictly like this example:
      [
        { 
          "id": "clip-1", 
          "startTime": 12.5, 
          "duration": 45.0, 
          "title": "The Hidden Truth About...", 
          "hookText": "Did you know that...",
          "score": 95,
          "metrics": {
            "hookStrength": 9,
            "emotion": 8,
            "retentionPotential": 10
          }
        }
      ]
    `;

    const modelsToTry = [
      'llama-3.3-70b-versatile',
      'llama-3.1-70b-versatile',
      'mixtral-8x7b-32768'
    ];

    let validClips: Clip[] = [];
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      let attempts = 0;
      const maxAttempts = 2; // Try each model up to 2 times

      while (attempts < maxAttempts && validClips.length === 0) {
        try {
          attempts++;
          console.log(`[API-BRAIN] Attempting model: ${modelName} (Attempt ${attempts}/${maxAttempts})...`);
          
          const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: modelName,
            temperature: 0.2 + (attempts * 0.1), // Slightly increase creativity on retries
          });

          const responseText = chatCompletion.choices[0]?.message?.content || "[]";
          
          // Robust JSON Parsing
          let rawJson = [];
          const jsonMatch = responseText.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            rawJson = JSON.parse(jsonMatch[0]);
          } else {
            rawJson = JSON.parse(responseText);
          }

          // Validation with Zod
          const parsedClips = ApiResponseSchema.parse(rawJson);
          
          // Advanced Timestamp Verification & Filtering
          validClips = parsedClips.filter((clip) => {
            if (clip.startTime < 0 || clip.startTime + clip.duration > totalDuration + 5) { // 5s tolerance
               console.warn(`[API-BRAIN] Rejecting clip ${clip.id}: Out of bounds. Start: ${clip.startTime}, Dur: ${clip.duration}, Total: ${totalDuration}`);
               return false;
            }
            if (clip.score < 70) {
               console.warn(`[API-BRAIN] Rejecting clip ${clip.id}: Low score (${clip.score}).`);
               return false;
            }
            return true;
          });

          // Resolve overlaps by keeping the higher scored clip
          validClips.sort((a, b) => b.score - a.score);
          const finalNonOverlappingClips: Clip[] = [];
          
          for (const clip of validClips) {
            const isOverlapping = finalNonOverlappingClips.some(
              (c) => Math.max(0, Math.min(clip.startTime + clip.duration, c.startTime + c.duration) - Math.max(clip.startTime, c.startTime)) > 5 // more than 5s overlap
            );
            if (!isOverlapping) {
              finalNonOverlappingClips.push(clip);
            }
          }
          
          validClips = finalNonOverlappingClips;

          if (validClips.length > 0) {
            console.log(`[API-BRAIN] 🚀 SUCCESS with model ${modelName}! Valid clips: ${validClips.length}`);
            break; // Break the while loop
          } else {
            console.warn(`[API-BRAIN] Model ${modelName} returned 0 valid clips after filtering.`);
            lastError = new Error("All generated clips failed validation criteria.");
          }

        } catch (error: any) {
          console.warn(`[API-BRAIN] Model ${modelName} attempt ${attempts} failed: ${error.message}`);
          lastError = error;
        }
      }
      
      if (validClips.length > 0) break; // Break the outer model loop if we got valid clips
    }

    if (validClips.length === 0) {
      throw new Error(`Pipeline exhausted. Last error: ${lastError?.message}`);
    }

    return NextResponse.json({ success: true, clips: validClips }); 

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Processing failed' }, { status: 500 });
  }
}
