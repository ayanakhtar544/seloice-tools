// ============================================================
// Seloice AI Video Editor — Utility Functions
// ============================================================

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}m ${secs}s`;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function snapToGrid(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize;
}

export function secondsToPixels(seconds: number, zoom: number, pixelsPerSecond: number = 100): number {
  return seconds * pixelsPerSecond * zoom;
}

export function pixelsToSeconds(pixels: number, zoom: number, pixelsPerSecond: number = 100): number {
  return pixels / (pixelsPerSecond * zoom);
}

export function getMediaType(mimeType: string): 'video' | 'audio' | 'image' {
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  return 'image';
}

export function createBlobUrl(blob: Blob): string {
  return URL.createObjectURL(blob);
}

export function revokeBlobUrl(url: string): void {
  try { URL.revokeObjectURL(url); } catch { /* ignore */ }
}

export async function getVideoDuration(blob: Blob): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      resolve(video.duration);
      URL.revokeObjectURL(video.src);
    };
    video.onerror = () => {
      reject(new Error('Failed to load video metadata'));
      URL.revokeObjectURL(video.src);
    };
    video.src = URL.createObjectURL(blob);
  });
}

export async function getVideoMetadata(blob: Blob): Promise<{
  duration: number;
  width: number;
  height: number;
}> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      resolve({
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
      });
      URL.revokeObjectURL(video.src);
    };
    video.onerror = () => {
      reject(new Error('Failed to load video metadata'));
      URL.revokeObjectURL(video.src);
    };
    video.src = URL.createObjectURL(blob);
  });
}

export async function getAudioDuration(blob: Blob): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = document.createElement('audio');
    audio.preload = 'metadata';
    audio.onloadedmetadata = () => {
      resolve(audio.duration);
      URL.revokeObjectURL(audio.src);
    };
    audio.onerror = () => {
      reject(new Error('Failed to load audio metadata'));
      URL.revokeObjectURL(audio.src);
    };
    audio.src = URL.createObjectURL(blob);
  });
}

export async function generateVideoThumbnail(blob: Blob, time: number = 0.5): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    video.playsInline = true;

    video.onloadeddata = () => {
      video.currentTime = Math.min(time, video.duration);
    };

    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 160;
      canvas.height = 90;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('No canvas context')); return; }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/webp', 0.6));
      URL.revokeObjectURL(video.src);
    };

    video.onerror = () => {
      reject(new Error('Failed to generate thumbnail'));
      URL.revokeObjectURL(video.src);
    };

    video.src = URL.createObjectURL(blob);
  });
}

// IndexedDB wrapper for project persistence
const DB_NAME = 'seloice-video-editor';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('projects')) {
        db.createObjectStore('projects', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('media')) {
        db.createObjectStore('media', { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveToIDB(store: string, data: Record<string, unknown>): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    tx.objectStore(store).put(data);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function loadFromIDB(store: string, id: string): Promise<Record<string, unknown> | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readonly');
    const request = tx.objectStore(store).get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteFromIDB(store: string, id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    tx.objectStore(store).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// Throttle utility
export function throttle<T extends (...args: unknown[]) => unknown>(fn: T, ms: number): T {
  let lastCall = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;
  return ((...args: unknown[]) => {
    const now = Date.now();
    if (now - lastCall >= ms) {
      lastCall = now;
      fn(...args);
    } else {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        lastCall = Date.now();
        fn(...args);
      }, ms - (now - lastCall));
    }
  }) as T;
}
