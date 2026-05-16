'use client';

import React, { useRef, useCallback, useEffect, memo } from 'react';
import { useEditorStore } from '../../stores/editorStore';
import { formatTime, secondsToPixels, pixelsToSeconds } from '../../utils/helpers';
import TimelineClipItem from './TimelineClipItem';

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

const TRACK_BG: Record<string, string> = {
  video: 'rgba(139,92,246,0.06)',
  audio: 'rgba(34,211,238,0.06)',
  text: 'rgba(251,191,36,0.06)',
  effects: 'rgba(244,63,94,0.06)',
  sticker: 'rgba(52,211,153,0.06)',
};

const TRACK_TEXT_COLOR: Record<string, string> = {
  video: '#a78bfa', audio: '#22d3ee', text: '#fbbf24', effects: '#f43f5e', sticker: '#34d399',
};

const HEADER_W = 120;
const HEADER_W_MD = 160;

// ─── Track Row ───────────────────────────────────────────────
const TrackRow = memo(function TrackRow({ trackId, zoomLevel, headerWidth }: { trackId: string; zoomLevel: number; headerWidth: number }) {
  const track = useEditorStore((s) => s.tracks.find((t) => t.id === trackId));
  const toggleTrackLock = useEditorStore((s) => s.toggleTrackLock);
  const toggleTrackMute = useEditorStore((s) => s.toggleTrackMute);
  const toggleTrackVisibility = useEditorStore((s) => s.toggleTrackVisibility);

  if (!track) return null;
  const bg = TRACK_BG[track.type] || TRACK_BG.video;
  const color = TRACK_TEXT_COLOR[track.type] || TRACK_TEXT_COLOR.video;

  return (
    <div className="flex border-b border-white/[0.03]" style={{ minHeight: `${track.height}px` }}>
      <div
        className="flex-shrink-0 flex items-center gap-1 px-2 border-r border-white/[0.04]"
        style={{ width: headerWidth, background: bg }}
      >
        <span className="text-[10px] font-semibold uppercase tracking-wider truncate flex-1" style={{ color }}>{track.name}</span>
        <div className="flex items-center gap-0.5">
          <button onClick={() => toggleTrackLock(trackId)} className="p-0.5 rounded hover:bg-white/5" title={track.locked ? 'Unlock' : 'Lock'}>
            {track.locked ? <LockIcon /> : <UnlockIcon />}
          </button>
          {track.type !== 'text' && (
            <button onClick={() => toggleTrackMute(trackId)} className="p-0.5 rounded hover:bg-white/5">
              {track.muted ? <MuteIcon /> : <SoundIcon />}
            </button>
          )}
          <button onClick={() => toggleTrackVisibility(trackId)} className="p-0.5 rounded hover:bg-white/5">
            {track.visible ? <EyeIcon /> : <EyeOffIcon />}
          </button>
        </div>
      </div>
      <div className="flex-1 relative" style={{ background: bg }}>
        {track.clips.map((clipId) => (
          <TimelineClipItem key={clipId} clipId={clipId} zoomLevel={zoomLevel} trackType={track.type} />
        ))}
      </div>
    </div>
  );
});

// ─── Main Timeline ───────────────────────────────────────────
export default function Timeline() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const rulerRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useEditorStore((s) => s.isMobileView);

  const tracks = useEditorStore((s) => s.tracks);
  const currentTime = useEditorStore((s) => s.currentTime);
  const duration = useEditorStore((s) => s.duration);
  const zoomLevel = useEditorStore((s) => s.zoomLevel);
  const isTimelineExpanded = useEditorStore((s) => s.isTimelineExpanded);
  const selectedClipIds = useEditorStore((s) => s.selectedClipIds);
  const snapEnabled = useEditorStore((s) => s.snapEnabled);
  const seek = useEditorStore((s) => s.seek);
  const addTrack = useEditorStore((s) => s.addTrack);
  const setTimelineExpanded = useEditorStore((s) => s.setTimelineExpanded);
  const splitClip = useEditorStore((s) => s.splitClip);
  const removeClip = useEditorStore((s) => s.removeClip);
  const duplicateClip = useEditorStore((s) => s.duplicateClip);

  const sortedTracks = [...tracks].sort((a, b) => a.order - b.order);
  const headerWidth = isMobile ? HEADER_W : HEADER_W_MD;
  const timelineWidth = Math.max(secondsToPixels(duration + 10, zoomLevel), 600);
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

  // Ruler click/tap to seek — uses pointer events for touch
  const handleRulerPointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const seekTo = (clientX: number) => {
      const x = clientX - rect.left + (timelineRef.current?.scrollLeft || 0);
      seek(Math.max(0, pixelsToSeconds(x, zoomLevel)));
    };
    seekTo(e.clientX);

    const onMove = (ev: PointerEvent) => seekTo(ev.clientX);
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, [zoomLevel, seek]);

  // Keyboard shortcuts for selected clips
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const ids = useEditorStore.getState().selectedClipIds;
      const ct = useEditorStore.getState().currentTime;
      if (e.key === 'Delete' || e.key === 'Backspace') {
        ids.forEach((id) => removeClip(id));
      }
      if (e.key === 's' && !e.metaKey && !e.ctrlKey) {
        ids.forEach((id) => splitClip(id, ct));
      }
      if (e.key === 'd' && !e.metaKey && !e.ctrlKey) {
        ids.forEach((id) => duplicateClip(id));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [removeClip, splitClip, duplicateClip]);

  const timelineHeight = isMobile ? '140px' : '200px';

  return (
    <div
      className="bg-[#0a0a0f] border-t border-white/[0.04] flex flex-col flex-shrink-0"
      style={{
        height: isTimelineExpanded ? timelineHeight : '36px',
        minHeight: isTimelineExpanded ? (isMobile ? '120px' : '160px') : '36px',
        maxHeight: isMobile ? '200px' : '350px',
      }}
    >
      {/* Timeline header */}
      <div className="h-9 flex items-center justify-between px-2 md:px-3 border-b border-white/[0.04] flex-shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTimelineExpanded(!isTimelineExpanded)}
            className="w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-white transition-colors rounded"
          >
            {isTimelineExpanded ? <ChevronDown /> : <ChevronUp />}
          </button>
          <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Timeline</span>
          {snapEnabled && (
            <span className="px-1.5 py-0.5 text-[8px] font-medium text-violet-400 bg-violet-500/10 rounded border border-violet-500/20">SNAP</span>
          )}
        </div>

        <div className="flex items-center gap-0.5">
          {selectedClipIds.length > 0 && (
            <>
              <button onClick={() => selectedClipIds.forEach((id) => splitClip(id, currentTime))}
                className="flex items-center gap-1 px-1.5 py-1 text-[10px] font-medium text-zinc-400 hover:text-white hover:bg-white/5 rounded transition-colors" title="Split (S)">
                <ScissorsIcon />{!isMobile && ' Split'}
              </button>
              <button onClick={() => selectedClipIds.forEach((id) => duplicateClip(id))}
                className="flex items-center gap-1 px-1.5 py-1 text-[10px] font-medium text-zinc-400 hover:text-white hover:bg-white/5 rounded transition-colors" title="Duplicate (D)">
                <CopyIcon />{!isMobile && ' Dup'}
              </button>
              <button onClick={() => selectedClipIds.forEach((id) => removeClip(id))}
                className="flex items-center gap-1 px-1.5 py-1 text-[10px] font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors" title="Delete">
                <TrashIcon />{!isMobile && ' Del'}
              </button>
            </>
          )}
          <div className="h-4 w-px bg-white/5 mx-0.5" />
          <button onClick={() => addTrack('video')} className="flex items-center gap-0.5 px-1.5 py-1 text-[10px] font-medium text-violet-400 hover:bg-violet-500/10 rounded transition-colors">
            <PlusIcon />{!isMobile && 'V'}
          </button>
          <button onClick={() => addTrack('audio')} className="flex items-center gap-0.5 px-1.5 py-1 text-[10px] font-medium text-cyan-400 hover:bg-cyan-500/10 rounded transition-colors">
            <PlusIcon />{!isMobile && 'A'}
          </button>
          <button onClick={() => addTrack('text')} className="flex items-center gap-0.5 px-1.5 py-1 text-[10px] font-medium text-amber-400 hover:bg-amber-500/10 rounded transition-colors">
            <PlusIcon />{!isMobile && 'T'}
          </button>
        </div>
      </div>

      {/* Timeline body */}
      {isTimelineExpanded && (
        <div ref={timelineRef} className="flex-1 overflow-auto relative overscroll-x-contain" style={{ touchAction: 'pan-x pan-y' }}>
          {/* Ruler */}
          <div className="sticky top-0 z-30 flex border-b border-white/[0.04] bg-[#0a0a0f]">
            <div className="flex-shrink-0 border-r border-white/[0.04]" style={{ width: headerWidth }} />
            <div className="flex-1 cursor-pointer" style={{ touchAction: 'none' }} onPointerDown={handleRulerPointerDown}>
              <canvas ref={rulerRef} />
            </div>
          </div>

          {/* Tracks */}
          <div className="relative" style={{ minWidth: `${timelineWidth + headerWidth}px` }}>
            {sortedTracks.length === 0 ? (
              <div className="flex items-center justify-center h-20 text-zinc-600 text-xs">
                <div className="text-center">
                  <p className="mb-1">No tracks yet</p>
                  <p className="text-[10px] text-zinc-700">Add a video, audio, or text track</p>
                </div>
              </div>
            ) : (
              sortedTracks.map((track) => (
                <TrackRow key={track.id} trackId={track.id} zoomLevel={zoomLevel} headerWidth={headerWidth} />
              ))
            )}

            {/* Playhead — positioned relative to track area, offset by header */}
            <div
              className="absolute top-0 bottom-0 w-px bg-red-500 z-40 pointer-events-none"
              style={{ left: `${playheadLeft + headerWidth}px` }}
            >
              <div className="absolute -top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full border-2 border-red-400 shadow-lg shadow-red-500/30" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
