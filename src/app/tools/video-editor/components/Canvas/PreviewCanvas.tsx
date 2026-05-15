'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useEditorStore } from '../../stores/editorStore';
import { CANVAS_DIMENSIONS } from '../../types/editor';
import { formatTime } from '../../utils/helpers';

// ─── Playback Icons ──────────────────────────────────────────
const PlayIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
);
const PauseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
);
const SkipBackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="19 20 9 12 19 4 19 20" /><line x1="5" y1="19" x2="5" y2="5" /></svg>
);
const SkipForwardIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="5 4 15 12 5 20 5 4" /><line x1="19" y1="5" x2="19" y2="19" /></svg>
);
const VolumeIcon = ({ muted }: { muted: boolean }) => (
  muted ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
    </svg>
  )
);

export default function PreviewCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const animRef = useRef<number>(0);
  
  const {
    project, currentTime, duration, isPlaying, isMuted, volume,
    clips, mediaAssets, tracks, showSafeZone,
    play, pause, togglePlay, seek, toggleMute, setVolume,
    stepForward, stepBackward,
  } = useEditorStore();

  const [canvasSize, setCanvasSize] = useState({ width: 360, height: 640 });
  const dimensions = CANVAS_DIMENSIONS[project.aspectRatio];

  // Calculate canvas size to fit container
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: containerW, height: containerH } = entry.contentRect;
        const padding = 40;
        const availW = containerW - padding;
        const availH = containerH - padding;
        const ratio = dimensions.width / dimensions.height;
        
        let w = availW;
        let h = w / ratio;
        if (h > availH) {
          h = availH;
          w = h * ratio;
        }
        setCanvasSize({ width: Math.round(w), height: Math.round(h) });
      }
    });

    if (containerRef.current) resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [dimensions]);

  // Render loop
  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    // Clear with background
    ctx.fillStyle = project.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render active video/image clips
    const activeClips = Array.from(clips.values()).filter(
      (c) => c.startTime <= currentTime && c.endTime > currentTime && !c.hidden
    );

    activeClips.sort((a, b) => {
      const trackA = tracks.find(t => t.id === a.trackId);
      const trackB = tracks.find(t => t.id === b.trackId);
      return (trackA?.order ?? 0) - (trackB?.order ?? 0);
    });

    for (const clip of activeClips) {
      if (clip.type === 'video' || clip.type === 'sticker') {
        const asset = clip.mediaId ? mediaAssets.get(clip.mediaId) : null;
        if (asset?.type === 'image' && asset.blobUrl) {
          // Draw image clips
          const img = new Image();
          img.src = asset.blobUrl;
          const scaleX = canvasSize.width / dimensions.width;
          const scaleY = canvasSize.height / dimensions.height;
          ctx.globalAlpha = clip.opacity;
          ctx.drawImage(
            img,
            clip.x * scaleX,
            clip.y * scaleY,
            clip.width * scaleX,
            clip.height * scaleY
          );
          ctx.globalAlpha = 1;
        }
      }

      if (clip.type === 'text' && clip.text) {
        const scaleX = canvasSize.width / dimensions.width;
        const scaleY = canvasSize.height / dimensions.height;
        const fontSize = clip.text.fontSize * scaleX;
        
        ctx.save();
        ctx.globalAlpha = clip.opacity;
        ctx.font = `${clip.text.fontWeight} ${clip.text.fontStyle} ${fontSize}px ${clip.text.fontFamily}`;
        ctx.textAlign = clip.text.textAlign as CanvasTextAlign;
        ctx.textBaseline = 'top';

        const x = clip.x * scaleX + (clip.width * scaleX) / 2;
        const y = clip.y * scaleY;

        // Background
        if (clip.text.backgroundColor) {
          const metrics = ctx.measureText(clip.text.content);
          const textWidth = metrics.width;
          const textHeight = fontSize * clip.text.lineHeight;
          ctx.fillStyle = clip.text.backgroundColor;
          ctx.fillRect(x - textWidth / 2 - 8, y - 4, textWidth + 16, textHeight + 8);
        }

        // Stroke
        if (clip.text.strokeColor && clip.text.strokeWidth) {
          ctx.strokeStyle = clip.text.strokeColor;
          ctx.lineWidth = clip.text.strokeWidth * scaleX;
          ctx.lineJoin = 'round';
          ctx.strokeText(clip.text.content, x, y);
        }

        // Shadow
        if (clip.text.shadowColor) {
          ctx.shadowColor = clip.text.shadowColor;
          ctx.shadowBlur = (clip.text.shadowBlur || 0) * scaleX;
          ctx.shadowOffsetX = (clip.text.shadowOffsetX || 0) * scaleX;
          ctx.shadowOffsetY = (clip.text.shadowOffsetY || 0) * scaleX;
        }

        // Fill
        ctx.fillStyle = clip.text.color;
        ctx.fillText(clip.text.content, x, y);
        ctx.restore();
      }
    }

    // Safe zone overlay
    if (showSafeZone) {
      ctx.strokeStyle = 'rgba(255,255,0,0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 4]);
      const inset = canvasSize.width * 0.05;
      ctx.strokeRect(inset, inset, canvasSize.width - inset * 2, canvasSize.height - inset * 2);
      // Title safe (inner)
      const innerInset = canvasSize.width * 0.1;
      ctx.strokeStyle = 'rgba(0,255,0,0.3)';
      ctx.strokeRect(innerInset, innerInset, canvasSize.width - innerInset * 2, canvasSize.height - innerInset * 2);
      ctx.setLineDash([]);
    }
  }, [canvasSize, currentTime, clips, mediaAssets, tracks, project, showSafeZone, dimensions]);

  // --- MEMORY CLEANUP: REVOKE BLOB URLS ---
  useEffect(() => {
    return () => {
      // Cleanup all media assets on unmount
      mediaAssets.forEach((asset) => {
        if (asset.blobUrl && asset.blobUrl.startsWith('blob:')) {
          URL.revokeObjectURL(asset.blobUrl);
        }
      });
    };
  }, [mediaAssets]);

  useEffect(() => {
    renderFrame();
  }, [renderFrame]);

  // Playback timer
  useEffect(() => {
    if (!isPlaying) {
      cancelAnimationFrame(animRef.current);
      return;
    }
    let lastTime = performance.now();
    const tick = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      const state = useEditorStore.getState();
      const nextTime = state.currentTime + delta * state.playbackRate;
      if (nextTime >= state.duration) {
        state.pause();
        state.seek(0);
        return;
      }
      state.seek(nextTime);
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying]);

  // Progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    seek(pct * duration);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div ref={containerRef} className="flex-1 flex flex-col items-center justify-center bg-[#080810] relative overflow-hidden min-h-0">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Canvas Container */}
      <div className="relative flex items-center justify-center flex-1 min-h-0 w-full p-4">
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative shadow-2xl shadow-black/50 rounded-lg overflow-hidden"
          style={{ width: canvasSize.width, height: canvasSize.height }}
        >
          {/* Hidden video element for playback */}
          <video ref={videoRef} className="hidden" muted={isMuted} playsInline />
          
          {/* Main canvas */}
          <canvas
            id="preview-canvas"
            ref={canvasRef}
            className="w-full h-full bg-black"
            style={{ imageRendering: 'auto' }}
          />

          {/* Aspect ratio badge */}
          <div className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-mono text-zinc-400 bg-black/60 backdrop-blur-sm rounded-md border border-white/5">
            {project.aspectRatio} · {dimensions.width}×{dimensions.height}
          </div>

          {/* Click to play/pause overlay */}
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center group cursor-pointer"
          >
            {!isPlaying && clips.size > 0 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white group-hover:bg-white/20 transition-colors"
              >
                <PlayIcon />
              </motion.div>
            )}
          </button>

          {/* Empty state */}
          {clips.size === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/20 flex items-center justify-center mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-violet-400">
                  <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-zinc-300 mb-1">Import media to start</h3>
              <p className="text-xs text-zinc-600 max-w-[200px]">
                Drag & drop video, images, or audio to begin editing
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Playback Controls Bar */}
      <div className="w-full px-4 pb-3 space-y-1.5 z-10 relative">
        {/* Progress Bar */}
        <div
          className="w-full h-1 bg-zinc-800 rounded-full cursor-pointer group relative"
          onClick={handleProgressClick}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button onClick={stepBackward} className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
              <SkipBackIcon />
            </button>

            <button
              onClick={togglePlay}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors border border-white/5"
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>

            <button onClick={stepForward} className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
              <SkipForwardIcon />
            </button>
          </div>

          {/* Time Display */}
          <div className="text-xs font-mono text-zinc-500">
            <span className="text-zinc-300">{formatTime(currentTime)}</span>
            <span className="mx-1">/</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-1">
            <button onClick={toggleMute} className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
              <VolumeIcon muted={isMuted} />
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-16 h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer hidden md:block
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5
                [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
