// File: src/app/tools/shorts-maker/engine/clipper.ts
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

// 🔥 OPTIMIZATION 1: Singleton Pattern
// Isse FFmpeg core baar-baar load nahi hoga, browser freeze hone se bachega.
let ffmpegInstance: FFmpeg | null = null;

export const initFFmpeg = async (): Promise<FFmpeg> => {
  if (ffmpegInstance) return ffmpegInstance;
  
  ffmpegInstance = new FFmpeg();
  
  try {
    console.log('[FFMPEG-ENGINE] Booting WebAssembly Core...');
    await ffmpegInstance.load({
      coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js',
      wasmURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm',
    });
    console.log('[FFMPEG-ENGINE] Core Online & Ready!');
    return ffmpegInstance;
  } catch (error) {
    console.error('[FFMPEG-CRITICAL] Core loading failed:', error);
    ffmpegInstance = null; // Reset on failure so it can retry
    throw new Error('Video engine failed to load. Please refresh the page.');
  }
};

// 🔥 OPTIMIZATION 2: Single-Load Master Memory
// Poori podcast ko sirf ek baar memory me fetch karo. Baar-baar network request nahi jayegi.
export const loadVideoToMemory = async (file: File | Blob, fileName: string): Promise<FFmpeg> => {
  try {
    const ff = await initFFmpeg();
    console.log(`[FFMPEG-ENGINE] Locking ${fileName} into virtual RAM...`);
    const videoData = await fetchFile(file);
    await ff.writeFile(fileName, videoData);
    return ff;
  } catch (error) {
    console.error('[FFMPEG-CRITICAL] Failed to write master file to memory:', error);
    throw new Error('Video processing memory overload. Try a smaller file.');
  }
};

// 🔥 OPTIMIZATION 3: Deep Cleanup
// Jab saare clips ban jayein, toh Master file ko memory se uda do.
export const cleanupVideoFromMemory = async (fileName: string): Promise<void> => {
  try {
    const ff = await initFFmpeg();
    await ff.deleteFile(fileName);
    console.log(`[FFMPEG-ENGINE] Virtual RAM cleared for ${fileName}`);
  } catch (error) {
    console.warn('[FFMPEG-WARN] Cleanup skipped (file already deleted or missing).');
  }
};

// 🔥 OPTIMIZATION 4: The "Flash Cut" Algorithm
export const cutClipFast = async (
  masterFileName: string, 
  startTime: number, 
  duration: number,
  clipIndex: number,
  onLog?: (msg: string) => void
): Promise<string> => {
  let logCallback: (({ message }: { message: string }) => void) | null = null;

  try {
    const ff = await initFFmpeg();
    
    // Memory leak rokne ke liye safely event listener attach karo
    if (onLog) {
      logCallback = ({ message }) => onLog(message);
      ff.on('log', logCallback);
    }

    const outputName = `viral_cut_${clipIndex}_${Date.now()}.mp4`;

    console.log(`[FFMPEG-ENGINE] Executing Flash Cut for Clip ${clipIndex} at ${startTime}s...`);

    // ==========================================
    // THE GOD-TIER FFMPEG COMMAND
    // ==========================================
    await ff.exec([
      // 1. FAST SEEK: -ss input (-i) se pehle hona lazmi hai ultra-speed ke liye.
      '-ss', String(startTime),
      
      // 2. INPUT FILE: Jo humne loadVideoToMemory me pehle hi save kar di thi.
      '-i', masterFileName,
      
      // 3. DURATION: Kitna lamba clip chahiye.
      '-t', String(duration),
      
      // 4. STREAM COPY: 'copy' matlab zero-encoding. Ye video data ko decode nahi karta, 
      // seedha bytes copy karta hai. Rendering time drop from minutes to SECONDS.
      '-c', 'copy',
      
      // 5. AVOID ERRORS: Force overwrite if file exists.
      '-y', 
      
      outputName
    ]);

    // Read the processed clip from virtual memory
    const data = await ff.readFile(outputName);
    
    // Create a local blob URL for the browser to play/download
    const blob = new Blob([data as any], { type: 'video/mp4' });
    const url = URL.createObjectURL(blob);

    // 🔥 OPTIMIZATION 5: Micro-Cleanup
    // Jaise hi URL ban jaye, output file ko memory se uda do.
    await ff.deleteFile(outputName);
    
    return url;

  } catch (error) {
    console.error(`[FFMPEG-CRITICAL] Clip ${clipIndex} cutting failed:`, error);
    throw new Error(`Failed to generate clip ${clipIndex}`);
  } finally {
    // 🧹 SAFETY NET: Hamesha event listener remove karo varna log duplicate hote rahenge
    if (logCallback) {
      try {
        const ff = await initFFmpeg();
        ff.off('log', logCallback);
      } catch (e) {}
    }
  }
};