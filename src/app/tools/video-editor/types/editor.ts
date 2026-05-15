// ============================================================
// Seloice AI Video Editor — Core Type Definitions
// ============================================================

export type AspectRatio = '9:16' | '16:9' | '1:1' | '4:5';
export type ExportQuality = '720p' | '1080p' | '4K';
export type ExportFormat = 'mp4' | 'webm' | 'gif';
export type TrackType = 'video' | 'audio' | 'text' | 'effects' | 'sticker';
export type PanelTab = 'media' | 'text' | 'effects' | 'audio' | 'ai' | 'templates' | 'captions' | 'export';

export interface MediaAsset {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'image';
  mimeType: string;
  size: number;
  blob?: Blob;
  blobUrl?: string;
  thumbnailUrl?: string;
  duration?: number; // seconds
  width?: number;
  height?: number;
  metadata?: Record<string, unknown>;
  createdAt: number;
}

export interface TimelineClip {
  id: string;
  trackId: string;
  mediaId?: string;
  type: TrackType;
  name: string;
  // Position on timeline (seconds)
  startTime: number;
  endTime: number;
  // Trim within media (seconds from start/end)
  trimStart: number;
  trimEnd: number;
  // Clip properties
  speed: number;
  volume: number;
  opacity: number;
  // Transform
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  // Effects
  effects: ClipEffect[];
  // Text-specific
  text?: TextProperties;
  // Transitions
  transitionIn?: TransitionConfig;
  transitionOut?: TransitionConfig;
  // Flags
  locked: boolean;
  hidden: boolean;
}

export interface TextProperties {
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline' | 'line-through';
  textAlign: 'left' | 'center' | 'right';
  color: string;
  backgroundColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  lineHeight: number;
  letterSpacing: number;
  animation?: TextAnimation;
}

export interface TextAnimation {
  type: 'none' | 'typewriter' | 'fade' | 'slide-up' | 'slide-down' | 'scale' | 'bounce' | 'glitch' | 'wave' | 'karaoke';
  duration: number;
  delay: number;
  easing: string;
}

export interface ClipEffect {
  id: string;
  type: EffectType;
  enabled: boolean;
  intensity: number;
  params: Record<string, number | string | boolean>;
}

export type EffectType =
  | 'blur' | 'brightness' | 'contrast' | 'saturation'
  | 'hue-rotate' | 'sepia' | 'grayscale' | 'invert'
  | 'vhs' | 'glitch' | 'rgb-split' | 'noise'
  | 'glow' | 'vignette' | 'film-grain' | 'motion-blur'
  | 'cinematic' | 'vintage' | 'cool' | 'warm'
  | 'shake' | 'zoom-pulse' | 'chromatic-aberration'
  | 'green-screen' | 'color-overlay';

export interface TransitionConfig {
  type: 'none' | 'fade' | 'slide' | 'wipe' | 'zoom' | 'dissolve' | 'spin' | 'glitch';
  duration: number;
  easing: string;
}

export interface TimelineTrack {
  id: string;
  type: TrackType;
  name: string;
  order: number;
  locked: boolean;
  muted: boolean;
  visible: boolean;
  solo: boolean;
  height: number;
  clips: string[]; // clip IDs
}

export interface ProjectSettings {
  id: string;
  name: string;
  aspectRatio: AspectRatio;
  resolution: ExportQuality;
  fps: number;
  backgroundColor: string;
  createdAt: number;
  updatedAt: number;
}

export interface ExportSettings {
  format: ExportFormat;
  quality: ExportQuality;
  fps: number;
  videoBitrate: number;
  audioBitrate: number;
  platform?: 'instagram' | 'youtube' | 'tiktok' | 'twitter' | 'custom';
  watermark?: WatermarkConfig;
}

export interface WatermarkConfig {
  enabled: boolean;
  text?: string;
  imageUrl?: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  opacity: number;
  size: number;
}

export interface ExportJob {
  id: string;
  status: 'queued' | 'processing' | 'encoding' | 'done' | 'error';
  progress: number;
  stage: string;
  estimatedTimeRemaining?: number;
  outputBlob?: Blob;
  outputUrl?: string;
  error?: string;
  settings: ExportSettings;
  startedAt?: number;
  completedAt?: number;
}

export interface HistoryEntry {
  id: string;
  type: string;
  description: string;
  timestamp: number;
  before: unknown;
  after: unknown;
}

// Canvas dimensions for each aspect ratio
export const CANVAS_DIMENSIONS: Record<AspectRatio, { width: number; height: number }> = {
  '9:16': { width: 1080, height: 1920 },
  '16:9': { width: 1920, height: 1080 },
  '1:1': { width: 1080, height: 1080 },
  '4:5': { width: 1080, height: 1350 },
};

// Preview canvas scale factor
export const PREVIEW_SCALE = 0.35;

// Effect presets
export const EFFECT_PRESETS: Record<string, { name: string; effects: Partial<ClipEffect>[] }> = {
  cinematic: {
    name: 'Cinematic',
    effects: [
      { type: 'contrast', intensity: 0.15 },
      { type: 'saturation', intensity: -0.1 },
      { type: 'vignette', intensity: 0.4 },
    ],
  },
  vintage: {
    name: 'Vintage',
    effects: [
      { type: 'sepia', intensity: 0.3 },
      { type: 'contrast', intensity: 0.1 },
      { type: 'film-grain', intensity: 0.2 },
    ],
  },
  vhs: {
    name: 'VHS',
    effects: [
      { type: 'vhs', intensity: 0.6 },
      { type: 'noise', intensity: 0.15 },
      { type: 'chromatic-aberration', intensity: 0.3 },
    ],
  },
  meme: {
    name: 'Meme',
    effects: [
      { type: 'saturation', intensity: 0.3 },
      { type: 'contrast', intensity: 0.2 },
      { type: 'brightness', intensity: 0.05 },
    ],
  },
  cool: {
    name: 'Cool Tone',
    effects: [
      { type: 'cool', intensity: 0.3 },
      { type: 'contrast', intensity: 0.05 },
    ],
  },
  warm: {
    name: 'Warm Tone',
    effects: [
      { type: 'warm', intensity: 0.3 },
      { type: 'saturation', intensity: 0.1 },
    ],
  },
};

// Platform export presets
export const PLATFORM_PRESETS: Record<string, ExportSettings> = {
  instagram: {
    format: 'mp4',
    quality: '1080p',
    fps: 30,
    videoBitrate: 5000,
    audioBitrate: 128,
    platform: 'instagram',
  },
  youtube: {
    format: 'mp4',
    quality: '1080p',
    fps: 60,
    videoBitrate: 8000,
    audioBitrate: 192,
    platform: 'youtube',
  },
  tiktok: {
    format: 'mp4',
    quality: '1080p',
    fps: 30,
    videoBitrate: 4000,
    audioBitrate: 128,
    platform: 'tiktok',
  },
  twitter: {
    format: 'mp4',
    quality: '720p',
    fps: 30,
    videoBitrate: 3000,
    audioBitrate: 128,
    platform: 'twitter',
  },
};

// Text animation presets
export const TEXT_PRESETS = [
  {
    id: 'hormozi',
    name: 'Hormozi Style',
    style: {
      fontFamily: 'Inter',
      fontSize: 72,
      fontWeight: 900,
      color: '#FFFFFF',
      strokeColor: '#000000',
      strokeWidth: 4,
      textAlign: 'center' as const,
      backgroundColor: undefined,
      lineHeight: 1.1,
      letterSpacing: -2,
    },
  },
  {
    id: 'meme-top',
    name: 'Meme Caption',
    style: {
      fontFamily: 'Impact',
      fontSize: 64,
      fontWeight: 400,
      color: '#FFFFFF',
      strokeColor: '#000000',
      strokeWidth: 3,
      textAlign: 'center' as const,
      lineHeight: 1.1,
      letterSpacing: 1,
    },
  },
  {
    id: 'subtitle',
    name: 'Clean Subtitle',
    style: {
      fontFamily: 'Inter',
      fontSize: 42,
      fontWeight: 600,
      color: '#FFFFFF',
      backgroundColor: 'rgba(0,0,0,0.7)',
      textAlign: 'center' as const,
      lineHeight: 1.4,
      letterSpacing: 0,
    },
  },
  {
    id: 'neon',
    name: 'Neon Glow',
    style: {
      fontFamily: 'Inter',
      fontSize: 56,
      fontWeight: 800,
      color: '#00ff88',
      shadowColor: '#00ff88',
      shadowBlur: 20,
      textAlign: 'center' as const,
      lineHeight: 1.2,
      letterSpacing: 2,
    },
  },
  {
    id: 'gradient',
    name: 'Gradient Pop',
    style: {
      fontFamily: 'Inter',
      fontSize: 60,
      fontWeight: 900,
      color: '#FF6B6B',
      textAlign: 'center' as const,
      lineHeight: 1.1,
      letterSpacing: -1,
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    style: {
      fontFamily: 'Inter',
      fontSize: 36,
      fontWeight: 300,
      color: '#FFFFFF',
      textAlign: 'center' as const,
      lineHeight: 1.6,
      letterSpacing: 4,
    },
  },
];
