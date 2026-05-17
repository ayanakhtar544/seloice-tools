// File: src/app/tools/video-editor/components/Canvas/PreviewCanvas.tsx
'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditorStore } from '../../stores/editorStore';
import { CANVAS_DIMENSIONS } from '../../types/editor';
import { formatTime } from '../../utils/helpers';
import { Maximize, Minimize, RotateCw } from 'lucide-react';

// --- PREMIUM SVG ICONS ---
const PlayIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>;
const PauseIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>;
const SkipBackIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="19 20 9 12 19 4 19 20" /><line x1="5" y1="19" x2="5" y2="5" /></svg>;
const SkipForwardIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="5 4 15 12 5 20 5 4" /><line x1="19" y1="5" x2="19" y2="19" /></svg>;
const VolumeIcon = ({ muted }: { muted: boolean }) => (
  muted ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" /></svg>
);

export default function PreviewCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const lastTimeRef = useRef(0);
  
  // High-performance caching
  const imgCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const vidCacheRef = useRef<Map<string, HTMLVideoElement | HTMLAudioElement>>(new Map());

  // Store variables
  const project = useEditorStore((s) => s.project);
  const currentTime = useEditorStore((s) => s.currentTime);
  const duration = useEditorStore((s) => s.duration);
  const isPlaying = useEditorStore((s) => s.isPlaying);
  const isMuted = useEditorStore((s) => s.isMuted);
  const volume = useEditorStore((s) => s.volume);
  const clips = useEditorStore((s) => s.clips);
  const mediaAssets = useEditorStore((s) => s.mediaAssets);
  const tracks = useEditorStore((s) => s.tracks);
  const showSafeZone = useEditorStore((s) => s.showSafeZone);
  const isFullScreen = useEditorStore((s) => s.isFullScreen);
  const togglePlay = useEditorStore((s) => s.togglePlay);
  const seek = useEditorStore((s) => s.seek);
  const toggleMute = useEditorStore((s) => s.toggleMute);
  const setVolume = useEditorStore((s) => s.setVolume);
  const stepForward = useEditorStore((s) => s.stepForward);
  const stepBackward = useEditorStore((s) => s.stepBackward);
  const toggleFullScreen = useEditorStore((s) => s.toggleFullScreen);

  // Interaction State
  const selectedClipIds = useEditorStore((s) => s.selectedClipIds);
  const selectClip = useEditorStore((s) => s.selectClip);
  const updateClip = useEditorStore((s) => s.updateClip);
  
  const [canvasSize, setCanvasSize] = useState({ width: 360, height: 640 });
  const [isDragging, setIsDragging] = useState(false);
  
  // Alignment Guides (Center Snapping Logic)
  const [showCenterGuideX, setShowCenterGuideX] = useState(false);
  const [showCenterGuideY, setShowCenterGuideY] = useState(false);

  const dimensions = CANVAS_DIMENSIONS[project.aspectRatio];

  const activeClips = Array.from(clips.values()).filter((c) => c.startTime <= currentTime && c.endTime > currentTime && !c.hidden);
  activeClips.sort((a, b) => {
    const trackA = tracks.find(t => t.id === a.trackId);
    const trackB = tracks.find(t => t.id === b.trackId);
    return (trackA?.order ?? 0) - (trackB?.order ?? 0);
  });

  // 🚀 ADVANCED RESIZE OBSERVER (With High-DPI Support)
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: containerW, height: containerH } = entry.contentRect;
        const padding = isFullScreen ? 0 : 24; 
        const availW = containerW - padding; 
        const availH = containerH - padding;
        const ratio = dimensions.width / dimensions.height;
        
        let w = availW; 
        let h = w / ratio;
        if (h > availH) { h = availH; w = h * ratio; }
        
        setCanvasSize({ width: Math.round(Math.max(w, 100)), height: Math.round(Math.max(h, 100)) });
      }
    });
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [dimensions, isFullScreen]);

  // 🎬 THE IMMORTAL RENDER ENGINE
  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Retina Display Sharpness Magic
    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== canvasSize.width * dpr) {
      canvas.width = canvasSize.width * dpr;
      canvas.height = canvasSize.height * dpr;
      ctx.scale(dpr, dpr);
    }

    ctx.fillStyle = project.backgroundColor;
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

    const state = useEditorStore.getState();
    const time = state.currentTime;
    const transitions = state.transitions || new Map();
    
    // 🎨 DRAW CLIP ENGINE
    const drawClip = (clip: any, opacity: number = 1, offsetX = 0, transScale = 1) => {
      if (!clip || clip.hidden) return;
      ctx.save();
      ctx.globalAlpha = clip.opacity * opacity;
      
      const sX = canvasSize.width / dimensions.width; 
      const sY = canvasSize.height / dimensions.height;

      const w = clip.width * sX;
      const h = clip.height * sY;
      
      const cx = (clip.x * sX) + (w / 2);
      const cy = (clip.y * sY) + (h / 2);

      // Translation & Rotation
      ctx.translate(cx + (offsetX * canvasSize.width), cy);
      ctx.rotate((clip.rotation || 0) * Math.PI / 180);
      
      const totalScaleX = (clip.scaleX || 1) * transScale;
      const totalScaleY = (clip.scaleY || 1) * transScale;
      ctx.scale(totalScaleX, totalScaleY);

      const drawX = -w / 2;
      const drawY = -h / 2;

      // 🔥 VISUAL EFFECTS ENGINE (VFX + ADJUSTMENTS)
      let filterStr = '';
      clip.effects?.forEach((eff: any) => {
        if (eff.name === 'Brightness') filterStr += ` brightness(${100 + eff.value}%)`;
        if (eff.name === 'Contrast') filterStr += ` contrast(${100 + eff.value}%)`;
        if (eff.name === 'Saturation') filterStr += ` saturate(${100 + eff.value}%)`;
        if (eff.name === 'B & W') filterStr += ' grayscale(100%)';
        if (eff.name === 'Sepia') filterStr += ' sepia(100%)';
        if (eff.name === 'Vintage 90s') filterStr += ' sepia(50%) contrast(120%) saturate(80%)';
        if (eff.name === 'Cinematic') filterStr += ' contrast(110%) saturate(120%) brightness(95%)';
        if (eff.name === 'Cyberpunk') filterStr += ' saturate(150%) hue-rotate(45deg) contrast(120%)';
        if (eff.name === 'Lens Blur') filterStr += ' blur(4px)';
        if (eff.name === 'RGB Split') filterStr += ' drop-shadow(3px 0 0 rgba(255,0,0,0.6)) drop-shadow(-3px 0 0 rgba(0,255,255,0.6))';
        if (eff.name === 'Glitch') filterStr += ' contrast(160%) saturate(200%) hue-rotate(90deg)';
      });
      if (filterStr) ctx.filter = filterStr.trim();

      const asset = clip.mediaId ? mediaAssets.get(clip.mediaId) : null;

      // 🎵 AUDIO HANDLING (Hidden)
      if (clip.type === 'audio' && asset?.blobUrl) {
         let aud = vidCacheRef.current.get(clip.id) as HTMLAudioElement;
         if (!aud) {
           aud = document.createElement('audio'); aud.src = asset.blobUrl; aud.load();
           vidCacheRef.current.set(clip.id, aud);
         }
         aud.volume = state.volume; aud.muted = state.isMuted;
         const localTime = (time - clip.startTime) * clip.speed + clip.trimStart;
         if (state.isPlaying) {
            if (aud.paused) aud.play().catch(() => {});
            if (Math.abs(aud.currentTime - localTime) > 0.25) aud.currentTime = localTime;
         } else {
            if (!aud.paused) aud.pause();
            if (Math.abs(aud.currentTime - localTime) > 0.05) aud.currentTime = localTime;
         }
      }

      // 📸 MEDIA HANDLING
      if (clip.type === 'video' || clip.type === 'sticker' || clip.type === 'image') {
        if (asset?.type === 'image' && asset.blobUrl) {
          let img = imgCacheRef.current.get(asset.blobUrl);
          if (!img) { img = new Image(); img.src = asset.blobUrl; imgCacheRef.current.set(asset.blobUrl, img); }
          if (img.complete) ctx.drawImage(img, drawX, drawY, w, h);
        }
        
        if (asset?.type === 'video' && asset.blobUrl) {
          let vid = vidCacheRef.current.get(clip.id) as HTMLVideoElement;
          if (!vid) {
            vid = document.createElement('video'); vid.src = asset.blobUrl; vid.playsInline = true; vid.muted = true; vid.load();
            vidCacheRef.current.set(clip.id, vid);
          }
          vid.volume = state.volume; vid.muted = state.isMuted;
          const localTime = (time - clip.startTime) * clip.speed + clip.trimStart;
          if (state.isPlaying) {
             if (vid.paused) vid.play().catch(() => {});
             if (Math.abs(vid.currentTime - localTime) > 0.25) vid.currentTime = localTime;
          } else {
             if (!vid.paused) vid.pause();
             if (Math.abs(vid.currentTime - localTime) > 0.05) vid.currentTime = localTime;
          }
          if (vid.readyState >= 2) ctx.drawImage(vid, drawX, drawY, w, h);
        }
      }

      // 📝 ADVANCED MULTILINE TEXT ENGINE
      if (clip.type === 'text' && clip.text) {
        const fontSize = clip.text.fontSize * sX;
        ctx.font = `${clip.text.fontWeight} ${clip.text.fontStyle} ${fontSize}px ${clip.text.fontFamily}`;
        ctx.textAlign = clip.text.textAlign as CanvasTextAlign; 
        ctx.textBaseline = 'top';

        // Split text by \n for multiline support
        const lines = clip.text.content.split('\n');
        const lineHeight = fontSize * (clip.text.lineHeight || 1.2);
        const totalTextHeight = lines.length * lineHeight;
        
        // Vertically center the text block within its bounding box
        const startY = drawY + (h / 2) - (totalTextHeight / 2);
        
        lines.forEach((line: string, index: number) => {
            const lineY = startY + (index * lineHeight);
            let textX = 0; // Center relative to pivot
            if (ctx.textAlign === 'left') textX = drawX;
            if (ctx.textAlign === 'right') textX = drawX + w;

            // Background Highlight
            if (clip.text.backgroundColor) {
              const metrics = ctx.measureText(line); 
              const textWidth = metrics.width; 
              ctx.fillStyle = clip.text.backgroundColor; 
              
              let bgX = textX - textWidth / 2;
              if (ctx.textAlign === 'left') bgX = textX;
              if (ctx.textAlign === 'right') bgX = textX - textWidth;
              
              ctx.fillRect(bgX - 8, lineY - 4, textWidth + 16, lineHeight + 4);
            }
            
            // Drop Shadow
            if (clip.text.shadowColor) {
              ctx.shadowColor = clip.text.shadowColor; 
              ctx.shadowBlur = (clip.text.shadowBlur || 0) * sX; 
              ctx.shadowOffsetX = (clip.text.shadowOffsetX || 0) * sX; 
              ctx.shadowOffsetY = (clip.text.shadowOffsetY || 0) * sX;
            } else {
              ctx.shadowColor = 'transparent'; // Reset
            }

            // Stroke (Outline)
            if (clip.text.strokeColor && clip.text.strokeWidth) {
              ctx.strokeStyle = clip.text.strokeColor; 
              ctx.lineWidth = clip.text.strokeWidth * sX; 
              ctx.lineJoin = 'round'; 
              ctx.strokeText(line, textX, lineY);
            }

            // Fill
            ctx.fillStyle = clip.text.color; 
            ctx.fillText(line, textX, lineY); 
        });
      }
      ctx.restore();
    };

    let isTransitionActive = false;

    // Transition Renderer
    for (const t of Array.from(transitions.values())) {
      const cA = clips.get(t.afterClipId);
      if (cA) {
        const transStart = cA.endTime - (t.duration / 2);
        const transEnd = cA.endTime + (t.duration / 2);
        if (time >= transStart && time <= transEnd) {
          const track = tracks.find(tr => tr.id === cA.trackId);
          if (track) {
             const idx = track.clips.indexOf(cA.id);
             if (idx !== -1 && idx < track.clips.length - 1) {
                const cB = clips.get(track.clips[idx + 1]);
                if (cB) {
                   isTransitionActive = true;
                   const progress = (time - transStart) / t.duration;
                   switch(t.type) {
                     case 'fade':
                       drawClip(cA, 1 - progress); drawClip(cB, progress); break;
                     case 'slide-left':
                       drawClip(cA, 1, -progress); drawClip(cB, 1, 1 - progress); break;
                     case 'zoom-in':
                       drawClip(cA, 1 - progress, 0, 1 + progress); drawClip(cB, progress, 0, 0.5 + progress * 0.5); break;
                     default:
                       drawClip(cA, 1 - progress); drawClip(cB, progress);
                   }
                   break; 
                }
             }
          }
        }
      }
    }

    if (!isTransitionActive) {
      for (const clip of activeClips) drawClip(clip);
    }

    // 📐 DRAW ALIGNMENT GUIDES (During Drag)
    if (isDragging) {
      ctx.strokeStyle = '#ec4899'; // Pink/Fuchsia Guides
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);

      if (showCenterGuideX) {
        ctx.beginPath(); ctx.moveTo(canvasSize.width / 2, 0); ctx.lineTo(canvasSize.width / 2, canvasSize.height); ctx.stroke();
      }
      if (showCenterGuideY) {
        ctx.beginPath(); ctx.moveTo(0, canvasSize.height / 2); ctx.lineTo(canvasSize.width, canvasSize.height / 2); ctx.stroke();
      }
      ctx.setLineDash([]);
    }

    // SAFE ZONES
    if (showSafeZone) {
      ctx.strokeStyle = 'rgba(255,255,0,0.4)'; ctx.lineWidth = 1; ctx.setLineDash([6, 4]);
      const inset = canvasSize.width * 0.05; ctx.strokeRect(inset, inset, canvasSize.width - inset * 2, canvasSize.height - inset * 2);
      ctx.strokeStyle = 'rgba(0,255,0,0.3)'; const innerInset = canvasSize.width * 0.1; ctx.strokeRect(innerInset, innerInset, canvasSize.width - innerInset * 2, canvasSize.height - innerInset * 2);
      ctx.setLineDash([]);
    }

  }, [canvasSize, clips, mediaAssets, tracks, project, showSafeZone, dimensions, currentTime, showCenterGuideX, showCenterGuideY, isDragging]);

  useEffect(() => {
    return () => {
      mediaAssets.forEach((asset) => {
        if (asset.blobUrl && asset.blobUrl.startsWith('blob:')) URL.revokeObjectURL(asset.blobUrl);
      });
    };
  }, [mediaAssets]);

  // Request Animation Frame Loop
  useEffect(() => {
    lastTimeRef.current = performance.now();
    const loop = (now: number) => {
      const state = useEditorStore.getState();
      const delta = (now - lastTimeRef.current) / 1000; 
      lastTimeRef.current = now;

      if (state.isPlaying) {
        const nextTime = state.currentTime + delta * state.playbackRate;
        if (nextTime >= state.duration) { 
            state.pause(); state.seek(0); 
        } else {
            state.seek(nextTime);
        }
      }
      renderFrame();
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [renderFrame]);

  // 🔥 INTERACTIVE DRAG, ROTATE & RESIZE ENGINE
  const dragRef = useRef({ startX: 0, startY: 0, origX: 0, origY: 0, origScale: 1, origRotation: 0, cx: 0, cy: 0 });

  const handleClipInteraction = (e: React.PointerEvent, clip: any, mode: 'move' | 'resize' | 'rotate') => {
    e.stopPropagation();
    if (!selectedClipIds.includes(clip.id)) selectClip(clip.id);

    const target = e.target as HTMLElement;
    target.setPointerCapture(e.pointerId);
    setIsDragging(true);

    const rect = containerRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
    const sX = canvasSize.width / dimensions.width; 
    const sY = canvasSize.height / dimensions.height;

    // Calculate absolute center for rotation math
    const cx = (clip.x + clip.width / 2) * sX + rect.left;
    const cy = (clip.y + clip.height / 2) * sY + rect.top;

    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: clip.x,
      origY: clip.y,
      origScale: clip.scaleX || 1,
      origRotation: clip.rotation || 0,
      cx, cy
    };

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - dragRef.current.startX;
      const dy = ev.clientY - dragRef.current.startY;
      
      const scaleXFactor = dimensions.width / canvasSize.width;
      const scaleYFactor = dimensions.height / canvasSize.height;

      if (mode === 'move') {
        let newX = dragRef.current.origX + dx * scaleXFactor;
        let newY = dragRef.current.origY + dy * scaleYFactor;

        // Smart Snapping Logic (Center X and Center Y)
        const snapThreshold = 20; 
        const centerX = dimensions.width / 2;
        const centerY = dimensions.height / 2;
        const clipCenterX = newX + clip.width / 2;
        const clipCenterY = newY + clip.height / 2;

        let snappedX = false;
        let snappedY = false;

        if (Math.abs(clipCenterX - centerX) < snapThreshold) {
          newX = centerX - clip.width / 2;
          snappedX = true;
        }
        if (Math.abs(clipCenterY - centerY) < snapThreshold) {
          newY = centerY - clip.height / 2;
          snappedY = true;
        }

        setShowCenterGuideX(snappedX);
        setShowCenterGuideY(snappedY);

        updateClip(clip.id, { x: newX, y: newY });
      } 
      
      else if (mode === 'resize') {
        const currentDisplayedWidth = clip.width * (canvasSize.width / dimensions.width);
        const scaleDelta = dx / currentDisplayedWidth;
        const newScale = Math.max(0.1, dragRef.current.origScale + scaleDelta);
        updateClip(clip.id, { scaleX: newScale, scaleY: newScale });
      }

      else if (mode === 'rotate') {
        const rad = Math.atan2(ev.clientY - dragRef.current.cy, ev.clientX - dragRef.current.cx);
        const deg = (rad * 180) / Math.PI;
        // Offset by 90 because handle is at the top
        updateClip(clip.id, { rotation: (deg + 90) % 360 }); 
      }
    };

    const onUp = () => {
      target.releasePointerCapture(e.pointerId);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      setIsDragging(false);
      setShowCenterGuideX(false);
      setShowCenterGuideY(false);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  // Timeline Progress Scrubber
  const handleProgressPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault(); const rect = e.currentTarget.getBoundingClientRect();
    const seekTo = (clientX: number) => { const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)); seek(pct * duration); };
    seekTo(e.clientX);
    const onMove = (ev: PointerEvent) => seekTo(ev.clientX);
    const onUp = () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); };
    window.addEventListener('pointermove', onMove); window.addEventListener('pointerup', onUp);
  }, [duration, seek]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div ref={containerRef} className={`flex-1 flex flex-col items-center justify-center bg-[#080810] relative overflow-hidden min-h-0 ${isFullScreen ? 'absolute inset-0 z-[999] bg-black' : ''}`}>
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      
      {/* FULLSCREEN CLOSE BUTTON */}
      {isFullScreen && (
        <button onClick={toggleFullScreen} className="absolute top-6 right-6 z-50 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all">
          <Minimize size={20} />
        </button>
      )}

      <div className="relative flex items-center justify-center flex-1 min-h-0 w-full p-3">
        
        <div className="relative shadow-[0_20px_60px_rgba(0,0,0,0.8)] rounded-xl overflow-hidden ring-1 ring-white/10" style={{ width: canvasSize.width, height: canvasSize.height }}>
          <canvas id="preview-canvas" ref={canvasRef} className="w-full h-full bg-black" style={{ imageRendering: 'auto' }} />
          
          {/* 🔥 INTERACTIVE OVERLAYS FOR MOVE, RESIZE & ROTATE */}
          {activeClips.map(clip => {
            if (clip.type === 'audio') return null;
            const isSelected = selectedClipIds.includes(clip.id);
            const sX = canvasSize.width / dimensions.width;
            const sY = canvasSize.height / dimensions.height;

            return (
              <div
                key={clip.id}
                className={`absolute z-30 transition-[border,box-shadow] ${isSelected ? 'border-[1.5px] border-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.3)] bg-violet-500/5' : 'border border-transparent hover:border-white/30'}`}
                style={{
                  left: clip.x * sX,
                  top: clip.y * sY,
                  width: clip.width * sX,
                  height: clip.height * sY,
                  transform: `scale(${clip.scaleX || 1}, ${clip.scaleY || 1}) rotate(${clip.rotation || 0}deg)`,
                  transformOrigin: 'center center',
                  cursor: isSelected ? 'move' : 'pointer',
                  touchAction: 'none'
                }}
                onPointerDown={(e) => handleClipInteraction(e, clip, 'move')}
              >
                {isSelected && (
                  <>
                    {/* ROTATE HANDLE (Top Center) */}
                    <div 
                      className="absolute -top-8 left-1/2 -translate-x-1/2 w-6 h-6 bg-zinc-900 border border-violet-500 text-violet-400 rounded-full cursor-grab flex items-center justify-center shadow-lg hover:scale-110 hover:text-white hover:bg-violet-600 transition-all"
                      onPointerDown={(e) => handleClipInteraction(e, clip, 'rotate')}
                    >
                      <RotateCw size={12} />
                    </div>
                    {/* Rotation Handle Connector Line */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-px h-2 bg-violet-500 pointer-events-none" />

                    {/* RESIZE HANDLE (Bottom Right) */}
                    <div
                      className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-[3px] border-violet-600 rounded-full cursor-nwse-resize shadow-[0_0_10px_rgba(0,0,0,0.5)] hover:scale-125 transition-transform"
                      onPointerDown={(e) => handleClipInteraction(e, clip, 'resize')}
                    />
                    
                    {/* OTHER CORNER DOTS (Visual Only) */}
                    <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-violet-600 rounded-full pointer-events-none" />
                    <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-violet-600 rounded-full pointer-events-none" />
                    <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-violet-600 rounded-full pointer-events-none" />
                  </>
                )}
              </div>
            );
          })}

          <div className="absolute top-3 left-3 px-2 py-1 text-[10px] font-mono text-zinc-300 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 pointer-events-none z-40 shadow-xl">
            {project.aspectRatio} <span className="opacity-50 mx-1">|</span> {dimensions.width}×{dimensions.height}
          </div>
          
          <button onClick={togglePlay} className="absolute inset-0 flex items-center justify-center group cursor-pointer z-10">
            {!isPlaying && clips.size > 0 && (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white group-hover:bg-violet-600/50 group-hover:border-violet-400 group-hover:scale-110 transition-all shadow-2xl pointer-events-none">
                <PlayIcon />
              </motion.div>
            )}
          </button>

          {clips.size === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pointer-events-none">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/20 flex items-center justify-center mb-6 mx-auto shadow-[0_0_30px_rgba(139,92,246,0.15)] relative">
                <div className="absolute inset-0 bg-violet-500/20 rounded-3xl animate-ping opacity-20" />
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-violet-400"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
              </div>
              <h3 className="text-lg font-black uppercase tracking-widest text-white mb-2 drop-shadow-md">Canvas is Empty</h3>
              <p className="text-xs text-zinc-400 max-w-[220px] mx-auto font-medium">Drag & Drop media here or use the Media Panel to start creating.</p>
            </div>
          )}
        </div>
      </div>

      <div className={`w-full px-4 pb-3 space-y-2 z-20 relative flex-shrink-0 ${isFullScreen ? 'max-w-4xl mx-auto mb-6' : ''}`}>
        <div className="w-full h-2.5 bg-zinc-900 border border-white/5 rounded-full cursor-pointer group relative shadow-inner" style={{ touchAction: 'none' }} onPointerDown={handleProgressPointerDown}>
          <div className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full relative pointer-events-none shadow-[0_0_10px_rgba(139,92,246,0.5)]" style={{ width: `${progress}%` }}>
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity ring-2 ring-violet-500" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button onClick={stepBackward} className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-white transition-colors rounded-xl hover:bg-white/10"><SkipBackIcon /></button>
            <button onClick={togglePlay} className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-black hover:bg-violet-100 hover:scale-105 transition-all shadow-lg">{isPlaying ? <PauseIcon /> : <PlayIcon />}</button>
            <button onClick={stepForward} className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-white transition-colors rounded-xl hover:bg-white/10"><SkipForwardIcon /></button>
          </div>
          <div className="text-sm font-mono font-bold tracking-wider text-zinc-500 bg-zinc-900/50 px-3 py-1.5 rounded-lg border border-white/5"><span className="text-white">{formatTime(currentTime)}</span> <span className="mx-1 opacity-50">/</span> <span>{formatTime(duration)}</span></div>
          <div className="flex items-center gap-2">
            <button onClick={toggleMute} className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-white transition-colors rounded-xl hover:bg-white/10"><VolumeIcon muted={isMuted} /></button>
            <input type="range" min={0} max={1} step={0.05} value={isMuted ? 0 : volume} onChange={(e) => setVolume(Number(e.target.value))} className="w-20 h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer hidden sm:block [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md" />
            
            <div className="w-px h-5 bg-white/10 mx-1 hidden sm:block" />
            
            <button onClick={toggleFullScreen} className="hidden sm:flex w-9 h-9 items-center justify-center text-zinc-400 hover:text-white transition-colors rounded-xl hover:bg-white/10">
               <Maximize size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}