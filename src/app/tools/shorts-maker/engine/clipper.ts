// File: src/app/tools/shorts-maker/engine/clipper.ts
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

// Singleton instance taaki FFmpeg baar-baar load na ho
let ffmpeg: FFmpeg | null = null;

export async function initFFmpeg(onProgress?: (progress: number) => void) {
  if (ffmpeg) return ffmpeg; // Agar pehle se loaded hai toh wahi use karo

  ffmpeg = new FFmpeg();
  
  if (onProgress) {
    ffmpeg.on('progress', ({ progress }) => {
      onProgress(Math.round(progress * 100));
    });
  }

  // FFmpeg ke core files ko CDN se load kar rahe hain
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
  
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });

  return ffmpeg;
}

/**
 * Ye function video ko cut aur crop karke naya URL return karega
 */
export async function createShortClip(
    videoUrl: string, 
    startTime: number, // Seconds mein (e.g., 60 for 1 minute)
    duration: number,  // Kitne second ki clip chahiye (e.g., 30)
    onLog?: (msg: string) => void
) {
  const ff = await initFFmpeg();
  
  if (onLog) {
    ff.on('log', ({ message }) => onLog(message));
  }

  // 1. File ko memory filesystem me likho
  const inputName = 'input_video.mp4';
  const outputName = 'output_short.mp4';
  
  await ff.writeFile(inputName, await fetchFile(videoUrl));

  // 2. The FFmpeg Command (Magic is here)
  // -ss = start time, -t = duration
  // -vf "crop=ih*(9/16):ih" = Height ke hisaab se width ko 9:16 ratio me crop karo (Center se)
  await ff.exec([
    '-i', inputName,
    '-ss', startTime.toString(),
    '-t', duration.toString(),
    
    // Naya Filter: Pehle crop karega (9:16), fir usko 720x1280 (HD) par scale kar dega taaki render fast ho
    '-vf', 'crop=ih*(9/16):ih,scale=720:1280', 
    
    '-c:v', 'libx264',       // Universal video codec
    '-preset', 'ultrafast',  // 🔥 THE SPEED BOOSTER
    '-crf', '28',            // Quality vs Speed ratio (28 is perfect for fast web processing)
    '-threads', '0',         // Multi-threading enable
    
    '-c:a', 'aac',           // Audio codec
    '-b:a', '128k',          // Normal audio quality
    outputName
  ]);

  // 3. Output file ko read karo
  const data = await ff.readFile(outputName);
  
  // 4. Memory cleanup taaki browser crash na ho
  await ff.deleteFile(inputName);
  await ff.deleteFile(outputName);

  // 5. Nayi video ka URL bana kar return karo
  const uint8 = data as Uint8Array;
  const blob = new Blob([uint8.slice().buffer as ArrayBuffer], { type: 'video/mp4' });
  return URL.createObjectURL(blob);
}
