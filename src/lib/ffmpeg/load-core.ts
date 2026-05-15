import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

const FFMPEG_CORE_VERSION = '0.12.6';
const CDN_BASE = `https://unpkg.com/@ffmpeg/core@${FFMPEG_CORE_VERSION}/dist/umd`;

let loadPromise: Promise<FFmpeg> | null = null;

/** Load FFmpeg once per session — lazy, deduped, COEP-safe via toBlobURL. */
export async function loadFfmpegCore(): Promise<FFmpeg> {
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const ffmpeg = new FFmpeg();
    await ffmpeg.load({
      coreURL: await toBlobURL(`${CDN_BASE}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${CDN_BASE}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    return ffmpeg;
  })();

  return loadPromise;
}

export function logFfmpegLoadError(context: string, error: unknown): void {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[FFmpeg] ${context}:`, error);
  }
}
