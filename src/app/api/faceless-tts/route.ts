// File: src/app/api/faceless-tts/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // 🔥 Dekh, yahan hum 'script' le rahe hain, 'topic' nahi!
    const { script, voiceType } = await req.json();

    if (!script) {
      return NextResponse.json({ error: 'Script is required' }, { status: 400 });
    }

    console.log(`[TTS-ENGINE] Booting Google TTS Hack for: ${voiceType}`);

    const voiceMap: Record<string, string> = {
      sigma_male: 'en-US',  
      reddit_guy: 'en-GB',  
      creepy_girl: 'en-AU', 
      storyteller: 'en-IN'  
    };

    const lang = voiceMap[voiceType] || 'en-US';

    let cleanScript = script
      .replace(/[#*_\[\]]/g, '') 
      .replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '') 
      .replace(/\n/g, ' ') 
      .trim();

    const chunks = cleanScript.match(/.{1,150}(?:\s|$)/g) || [cleanScript];
    let combinedArray = new Uint8Array(0);

    for (let i = 0; i < chunks.length; i++) {
      let chunk = chunks[i].trim();
      if (!chunk) continue;

      console.log(`[TTS-ENGINE] Generating Chunk ${i + 1}/${chunks.length}...`);
      
      const encodedText = encodeURIComponent(chunk);
      const apiUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${lang}&q=${encodedText}`;

      const response = await fetch(apiUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0.0.0 Safari/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`Google TTS API blocked us on chunk ${i+1}. Status: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const chunkUint8 = new Uint8Array(arrayBuffer);

      const newCombined = new Uint8Array(combinedArray.length + chunkUint8.length);
      newCombined.set(combinedArray);
      newCombined.set(chunkUint8, combinedArray.length);
      combinedArray = newCombined;
      
      if (i < chunks.length - 1) {
        await new Promise(r => setTimeout(r, 300)); 
      }
    }

    console.log('[TTS-ENGINE] All chunks successfully fused! Sending to FFmpeg.');

    return new NextResponse(combinedArray, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': combinedArray.byteLength.toString(),
      },
    });

  } catch (error: any) {
    console.error('[TTS-ENGINE ERROR]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}