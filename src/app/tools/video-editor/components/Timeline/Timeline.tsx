'use client';

import React, { useRef, useCallback, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useEditorStore } from '../../stores/editorStore';
import { formatTime, secondsToPixels, pixelsToSeconds, clamp } from '../../utils/helpers';

// ─── Icons ───────────────────────────────────────────────────
const LockIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>;
const UnlockIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 019.9-1" /></svg>;
const EyeIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>;
const EyeOffIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>;
const MuteIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>;
const SoundIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 010 14.14" /></svg>;
const PlusIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
const ScissorsIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" /><line x1="8.12" y1="8.12" x2="12" y2="12" /></svg>;
const TrashIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>;
const CopyIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>;
const ChevronUp = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15" /></svg>;
const ChevronDown = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>;

// ─── Track Color Map ─────────────────────────────────────────
const TRACK_COLORS: Record<string, { bg: string; border: string; text: string; clip: string; clipHover: string }> = {
  video: {
    bg: 'rgba(139,92,246,0.06)',
    border: 'rgba(139,92,246,0.15)',
    text: '#a78bfa',
    clip: 'linear-gradient(135deg, #7c3aed, #8b5cf6)',
    clipHover: 'linear-gradient(135deg, #6d28d9, #7c3aed)',
  },
  audio: {
    bg: 'rgba(34,211,238,0.06)',
    border: 'rgba(34,211,238,0.15)',
    text: '#22d3ee',
    clip: 'linear-gradient(135deg, #0891b2, #06b6d4)',
    clipHover: 'linear-gradient(135deg, #0e7490, #0891b2)',
  },
  text: {
    bg: 'rgba(251,191,36,0.06)',
    border: 'rgba(251,191,36,0.15)',
    text: '#fbbf24',
    clip: 'linear-gradient(135deg, #d97706, #f59e0b)',
    clipHover: 'linear-gradient(135deg, #b45309, #d97706)',
  },
  effects: {
    bg: 'rgba(244,63,94,0.06)',
    border: 'rgba(244,63,94,0.15)',
    text: '#f43f5e',
    clip: 'linear-gradient(135deg, #e11d48, #f43f5e)',
    clipHover: 'linear-gradient(135deg, #be123c, #e11d48)',
  },
  sticker: {
    bg: 'rgba(52,211,153,0.06)',
    border: 'rgba(52,211,153,0.15)',
    text: '#34d399',
    clip: 'linear-gradient(135deg, #059669, #10b981)',
    clipHover: 'linear-gradient(135deg, #047857, #059669)',
  },
};

// ─── Timeline Clip Component ─────────────────────────────────
function TimelineClipComponent({
  clipId,
  zoomLevel,
  trackType,
}: {
  clipId: string;
  zoomLevel: number;
  trackType: string;
}) {
  const clip = useEditorStore((s) => s.clips.get(clipId));
  const selectedClipIds = useEditorStore((s) => s.selectedClipIds);
  const selectClip = useEditorStore((s) => s.selectClip);
  const moveClip = useEditorStore((s) => s.moveClip);
  const trimClipStart = useEditorStore((s) => s.trimClipStart);
  const trimClipEnd = useEditorStore((s) => s.trimClipEnd);

  const [isDragging, setIsDragging] = useState(false);
  const [isTrimming, setIsTrimming] = useState<'start' | 'end' | null>(null);
  const dragStartRef = useRef({ x: 0, startTime: 0, clipStart: 0, clipEnd: 0 });

  const colors = TRACK_COLORS[trackType] || TRACK_COLORS.video;
  const isSelected = clip ? selectedClipIds.includes(clip.id) : false;

  const handleMouseDown = useCallback((e: React.MouseEvent, type: 'move' | 'trim-start' | 'trim-end') => {
    if (!clip) return;
    e.stopPropagation();
    e.preventDefault();

    if (type === 'move') {
      selectClip(clip.id, e.shiftKey);
      setIsDragging(true);
    } else {
      setIsTrimming(type === 'trim-start' ? 'start' : 'end');
    }

    dragStartRef.current = {
      x: e.clientX,
      startTime: clip.startTime,
      clipStart: clip.startTime,
      clipEnd: clip.endTime,
    };

    const handleMouseMove = (ev: MouseEvent) => {
      const dx = ev.clientX - dragStartRef.current.x;
      const dt = pixelsToSeconds(dx, zoomLevel);

      if (type === 'move') {
        const newStart = Math.max(0, dragStartRef.current.startTime + dt);
        moveClip(clip.id, newStart);
      } else if (type === 'trim-start') {
        const newStart = clamp(
          dragStartRef.current.clipStart + dt,
          0,
          dragStartRef.current.clipEnd - 0.1
        );
        trimClipStart(clip.id, newStart);
      } else {
        const newEnd = Math.max(dragStartRef.current.clipStart + 0.1, dragStartRef.current.clipEnd + dt);
        trimClipEnd(clip.id, newEnd);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsTrimming(null);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [clip, zoomLevel, selectClip, moveClip, trimClipStart, trimClipEnd]);

  if (!clip) return null;

  const left = secondsToPixels(clip.startTime, zoomLevel);
  const width = secondsToPixels(clip.endTime - clip.startTime, zoomLevel);

  return (
    <motion.div
      layout
      className={`absolute top-1 bottom-1 rounded-md cursor-grab active:cursor-grabbing group select-none ${
        isDragging ? 'z-20 shadow-xl' : 'z-10'
      } ${isSelected ? 'ring-2 ring-white/50 ring-offset-1 ring-offset-transparent' : ''}`}
      style={{
        left: `${left}px`,
        width: `${Math.max(width, 20)}px`,
        background: isDragging ? colors.clipHover : colors.clip,
      }}
      onMouseDown={(e) => handleMouseDown(e, 'move')}
    >
      {/* Trim handles */}
      <div
        className="absolute left-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-white/20 rounded-l-md z-30"
        onMouseDown={(e) => handleMouseDown(e, 'trim-start')}
        style={{ borderLeft: isTrimming === 'start' ? '2px solid #fff' : undefined }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-white/20 rounded-r-md z-30"
        onMouseDown={(e) => handleMouseDown(e, 'trim-end')}
        style={{ borderRight: isTrimming === 'end' ? '2px solid #fff' : undefined }}
      />

      {/* Clip content */}
      <div className="px-2 py-0.5 h-full flex items-center overflow-hidden">
        <span className="text-[10px] font-medium text-white/80 truncate">
          {clip.name}
        </span>
      </div>

      {/* Duration tooltip on hover */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 text-[9px] font-mono bg-black/90 text-zinc-300 rounded border border-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {formatTime(clip.endTime - clip.startTime)}
      </div>
    </motion.div>
  );
}

// ─── Timeline Track Component ────────────────────────────────
function TimelineTrackRow({ trackId, zoomLevel }: { trackId: string; zoomLevel: number }) {
  const track = useEditorStore((s) => s.tracks.find((t) => t.id === trackId));
  const toggleTrackLock = useEditorStore((s) => s.toggleTrackLock);
  const toggleTrackMute = useEditorStore((s) => s.toggleTrackMute);
  const toggleTrackVisibility = useEditorStore((s) => s.toggleTrackVisibility);

  if (!track) return null;
  const colors = TRACK_COLORS[track.type] || TRACK_COLORS.video;

  return (
    <div className="flex border-b border-white/[0.03]" style={{ minHeight: `${track.height}px` }}>
      {/* Track header */}
      <div
        className="w-[120px] md:w-[160px] flex-shrink-0 flex items-center gap-1 px-2 border-r border-white/[0.04]"
        style={{ background: colors.bg }}
      >
        <span className="text-[10px] font-semibold uppercase tracking-wider truncate flex-1" style={{ color: colors.text }}>
          {track.name}
        </span>
        <div className="flex items-center gap-0.5">
          <button onClick={() => toggleTrackLock(trackId)} className="p-0.5 rounded hover:bg-white/5" title={track.locked ? 'Unlock' : 'Lock'}>
            {track.locked ? <LockIcon /> : <UnlockIcon />}
          </button>
          {track.type !== 'text' && (
            <button onClick={() => toggleTrackMute(trackId)} className="p-0.5 rounded hover:bg-white/5" title={track.muted ? 'Unmute' : 'Mute'}>
              {track.muted ? <MuteIcon /> : <SoundIcon />}
            </button>
          )}
          <button onClick={() => toggleTrackVisibility(trackId)} className="p-0.5 rounded hover:bg-white/5" title={track.visible ? 'Hide' : 'Show'}>
            {track.visible ? <EyeIcon /> : <EyeOffIcon />}
          </button>
        </div>
      </div>

      {/* Track clips area */}
      <div className="flex-1 relative" style={{ background: colors.bg }}>
        {track.clips.map((clipId) => (
          <TimelineClipComponent key={clipId} clipId={clipId} zoomLevel={zoomLevel} trackType={track.type} />
        ))}
      </div>
    </div>
  );
}

// ─── Main Timeline Component ─────────────────────────────────
export default function Timeline() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const rulerRef = useRef<HTMLCanvasElement>(null);

  const {
    tracks, currentTime, duration, zoomLevel, isTimelineExpanded,
    selectedClipIds, snapEnabled,
    seek, addTrack, setTimelineExpanded,
    splitClip, removeClip, duplicateClip,
  } = useEditorStore();

  const sortedTracks = [...tracks].sort((a, b) => a.order - b.order);
  const timelineWidth = Math.max(secondsToPixels(duration + 10, zoomLevel), 800);
  const playheadLeft = secondsToPixels(currentTime, zoomLevel);

  // Draw ruler
  useEffect(() => {
    const canvas = rulerRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = timelineWidth * dpr;
    canvas.height = 28 * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${timelineWidth}px`;
    canvas.style.height = '28px';

    ctx.clearRect(0, 0, timelineWidth, 28);

    // Calculate interval based on zoom
    let interval = 1;
    if (zoomLevel < 0.3) interval = 10;
    else if (zoomLevel < 0.7) interval = 5;
    else if (zoomLevel < 1.5) interval = 2;
    else if (zoomLevel > 3) interval = 0.5;

    const totalSeconds = duration + 10;
    for (let t = 0; t <= totalSeconds; t += interval) {
      const x = secondsToPixels(t, zoomLevel);
      const isMajor = t % (interval * 5) === 0 || interval >= 5;

      ctx.beginPath();
      ctx.moveTo(x, isMajor ? 12 : 18);
      ctx.lineTo(x, 28);
      ctx.strokeStyle = isMajor ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      ctx.stroke();

      if (isMajor) {
        ctx.font = '10px "SF Mono", "Fira Code", monospace';
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.textAlign = 'center';
        ctx.fillText(formatTime(t), x, 10);
      }
    }
  }, [timelineWidth, zoomLevel, duration]);

  // Ruler click to seek
  const handleRulerClick = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left + (timelineRef.current?.scrollLeft || 0);
    seek(pixelsToSeconds(x, zoomLevel));
  }, [zoomLevel, seek]);

  // Keyboard shortcuts for selected clips
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      selectedClipIds.forEach((id) => removeClip(id));
    }
    if (e.key === 's' && !e.metaKey && !e.ctrlKey) {
      selectedClipIds.forEach((id) => splitClip(id, currentTime));
    }
    if (e.key === 'd' && !e.metaKey && !e.ctrlKey) {
      selectedClipIds.forEach((id) => duplicateClip(id));
    }
  }, [selectedClipIds, currentTime, removeClip, splitClip, duplicateClip]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0a0a0f] border-t border-white/[0.04] flex flex-col"
      style={{ height: isTimelineExpanded ? 'auto' : '40px', minHeight: isTimelineExpanded ? '180px' : '40px', maxHeight: '350px' }}
    >
      {/* Timeline header */}
      <div className="h-10 flex items-center justify-between px-3 border-b border-white/[0.04] flex-shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTimelineExpanded(!isTimelineExpanded)}
            className="w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-white transition-colors rounded"
          >
            {isTimelineExpanded ? <ChevronDown /> : <ChevronUp />}
          </button>
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Timeline</span>
          {snapEnabled && (
            <span className="px-1.5 py-0.5 text-[9px] font-medium text-violet-400 bg-violet-500/10 rounded border border-violet-500/20">
              SNAP
            </span>
          )}
        </div>

        {/* Clip actions */}
        <div className="flex items-center gap-0.5">
          {selectedClipIds.length > 0 && (
            <>
              <button
                onClick={() => selectedClipIds.forEach((id) => splitClip(id, currentTime))}
                className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-zinc-400 hover:text-white hover:bg-white/5 rounded transition-colors"
                title="Split at playhead (S)"
              >
                <ScissorsIcon /> Split
              </button>
              <button
                onClick={() => selectedClipIds.forEach((id) => duplicateClip(id))}
                className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-zinc-400 hover:text-white hover:bg-white/5 rounded transition-colors"
                title="Duplicate (D)"
              >
                <CopyIcon /> Duplicate
              </button>
              <button
                onClick={() => selectedClipIds.forEach((id) => removeClip(id))}
                className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                title="Delete (Del)"
              >
                <TrashIcon /> Delete
              </button>
            </>
          )}

          <div className="h-4 w-px bg-white/5 mx-1" />

          {/* Add Track buttons */}
          <button
            onClick={() => addTrack('video')}
            className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-violet-400 hover:bg-violet-500/10 rounded transition-colors"
          >
            <PlusIcon /> Video
          </button>
          <button
            onClick={() => addTrack('audio')}
            className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-cyan-400 hover:bg-cyan-500/10 rounded transition-colors"
          >
            <PlusIcon /> Audio
          </button>
          <button
            onClick={() => addTrack('text')}
            className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-amber-400 hover:bg-amber-500/10 rounded transition-colors"
          >
            <PlusIcon /> Text
          </button>
        </div>
      </div>

      {/* Timeline body */}
      {isTimelineExpanded && (
        <div ref={timelineRef} className="flex-1 overflow-auto relative">
          {/* Ruler */}
          <div className="sticky top-0 z-30 flex border-b border-white/[0.04] bg-[#0a0a0f]">
            <div className="w-[120px] md:w-[160px] flex-shrink-0 border-r border-white/[0.04]" />
            <div className="flex-1 cursor-pointer" onClick={handleRulerClick}>
              <canvas ref={rulerRef} />
            </div>
          </div>

          {/* Tracks */}
          <div className="relative" style={{ minWidth: `${timelineWidth + 160}px` }}>
            {sortedTracks.length === 0 ? (
              <div className="flex items-center justify-center h-24 text-zinc-600 text-xs">
                <div className="text-center">
                  <p className="mb-1">No tracks yet</p>
                  <p className="text-[10px] text-zinc-700">Add a video, audio, or text track to get started</p>
                </div>
              </div>
            ) : (
              sortedTracks.map((track) => (
                <TimelineTrackRow key={track.id} trackId={track.id} zoomLevel={zoomLevel} />
              ))
            )}

            {/* Playhead */}
            <div
              className="absolute top-0 bottom-0 w-px bg-red-500 z-40 pointer-events-none"
              style={{ left: `${playheadLeft + 160}px` }}
            >
              <div className="absolute -top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full border-2 border-red-400 shadow-lg shadow-red-500/30" />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
