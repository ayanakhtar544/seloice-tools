'use client';

import React, { useRef, useCallback, useState, memo } from 'react';
import { useEditorStore } from '../../stores/editorStore';
import { secondsToPixels, pixelsToSeconds, clamp, snapToValue, getSnapTargets } from '../../utils/helpers';
import { formatTime } from '../../utils/helpers';

const TRACK_COLORS: Record<string, { clip: string; clipHover: string }> = {
  video: { clip: 'linear-gradient(135deg, #7c3aed, #8b5cf6)', clipHover: 'linear-gradient(135deg, #6d28d9, #7c3aed)' },
  audio: { clip: 'linear-gradient(135deg, #0891b2, #06b6d4)', clipHover: 'linear-gradient(135deg, #0e7490, #0891b2)' },
  text: { clip: 'linear-gradient(135deg, #d97706, #f59e0b)', clipHover: 'linear-gradient(135deg, #b45309, #d97706)' },
  effects: { clip: 'linear-gradient(135deg, #e11d48, #f43f5e)', clipHover: 'linear-gradient(135deg, #be123c, #e11d48)' },
  sticker: { clip: 'linear-gradient(135deg, #059669, #10b981)', clipHover: 'linear-gradient(135deg, #047857, #059669)' },
};

const SNAP_THRESHOLD_PX = 8;
const MIN_CLIP_DURATION = 0.1;

function TimelineClipItem({ clipId, zoomLevel, trackType }: { clipId: string; zoomLevel: number; trackType: string }) {
  const clip = useEditorStore((s) => s.clips.get(clipId));
  const isSelected = useEditorStore((s) => s.selectedClipIds.includes(clipId));
  const selectClip = useEditorStore((s) => s.selectClip);
  const moveClip = useEditorStore((s) => s.moveClip);
  const trimClipStart = useEditorStore((s) => s.trimClipStart);
  const trimClipEnd = useEditorStore((s) => s.trimClipEnd);
  const snapEnabled = useEditorStore((s) => s.snapEnabled);

  const [isDragging, setIsDragging] = useState(false);
  const [isTrimming, setIsTrimming] = useState<'start' | 'end' | null>(null);
  const dragRef = useRef({ startX: 0, origStart: 0, origEnd: 0 });

  const colors = TRACK_COLORS[trackType] || TRACK_COLORS.video;

  const handlePointerDown = useCallback((e: React.PointerEvent, mode: 'move' | 'trim-start' | 'trim-end') => {
    if (!clip) return;
    e.stopPropagation();
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    dragRef.current = { startX: e.clientX, origStart: clip.startTime, origEnd: clip.endTime };

    if (mode === 'move') {
      selectClip(clip.id, e.shiftKey);
      setIsDragging(true);
    } else {
      setIsTrimming(mode === 'trim-start' ? 'start' : 'end');
    }

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - dragRef.current.startX;
      const dt = pixelsToSeconds(dx, zoomLevel);
      const clips = useEditorStore.getState().clips;
      const snapTargets = snapEnabled ? getSnapTargets(clips as any, new Set([clip.id])) : [];
      const snapThresholdSec = pixelsToSeconds(SNAP_THRESHOLD_PX, zoomLevel);

      if (mode === 'move') {
        let newStart = Math.max(0, dragRef.current.origStart + dt);
        const dur = dragRef.current.origEnd - dragRef.current.origStart;
        if (snapEnabled) {
          newStart = snapToValue(newStart, snapTargets, snapThresholdSec);
          const snappedEnd = snapToValue(newStart + dur, snapTargets, snapThresholdSec);
          if (Math.abs(snappedEnd - (newStart + dur)) < snapThresholdSec) {
            newStart = snappedEnd - dur;
          }
        }
        newStart = Math.max(0, newStart);
        moveClip(clip.id, newStart);
      } else if (mode === 'trim-start') {
        let newStart = clamp(dragRef.current.origStart + dt, 0, dragRef.current.origEnd - MIN_CLIP_DURATION);
        if (snapEnabled) newStart = snapToValue(newStart, snapTargets, snapThresholdSec);
        newStart = clamp(newStart, 0, dragRef.current.origEnd - MIN_CLIP_DURATION);
        trimClipStart(clip.id, newStart);
      } else {
        let newEnd = Math.max(dragRef.current.origStart + MIN_CLIP_DURATION, dragRef.current.origEnd + dt);
        if (snapEnabled) newEnd = snapToValue(newEnd, snapTargets, snapThresholdSec);
        newEnd = Math.max(dragRef.current.origStart + MIN_CLIP_DURATION, newEnd);
        trimClipEnd(clip.id, newEnd);
      }
    };

    const onUp = () => {
      setIsDragging(false);
      setIsTrimming(null);
      useEditorStore.getState().recalculateDuration();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, [clip, zoomLevel, selectClip, moveClip, trimClipStart, trimClipEnd, snapEnabled]);

  if (!clip) return null;

  const left = secondsToPixels(clip.startTime, zoomLevel);
  const width = secondsToPixels(clip.endTime - clip.startTime, zoomLevel);

  return (
    <div
      className={`absolute top-1 bottom-1 rounded-md select-none group ${
        isDragging ? 'z-20 shadow-xl cursor-grabbing' : 'z-10 cursor-grab'
      } ${isSelected ? 'ring-2 ring-white/50' : ''}`}
      style={{
        left: `${left}px`,
        width: `${Math.max(width, 24)}px`,
        background: isDragging ? colors.clipHover : colors.clip,
        touchAction: 'none',
      }}
      onPointerDown={(e) => handlePointerDown(e, 'move')}
    >
      {/* Left trim handle */}
      <div
        className="absolute left-0 top-0 bottom-0 w-3 cursor-col-resize z-30 flex items-center justify-center hover:bg-white/20 rounded-l-md"
        onPointerDown={(e) => handlePointerDown(e, 'trim-start')}
        style={{ touchAction: 'none' }}
      >
        <div className={`w-0.5 h-3 rounded-full ${isTrimming === 'start' ? 'bg-white' : 'bg-white/30 group-hover:bg-white/60'}`} />
      </div>

      {/* Right trim handle */}
      <div
        className="absolute right-0 top-0 bottom-0 w-3 cursor-col-resize z-30 flex items-center justify-center hover:bg-white/20 rounded-r-md"
        onPointerDown={(e) => handlePointerDown(e, 'trim-end')}
        style={{ touchAction: 'none' }}
      >
        <div className={`w-0.5 h-3 rounded-full ${isTrimming === 'end' ? 'bg-white' : 'bg-white/30 group-hover:bg-white/60'}`} />
      </div>

      {/* Clip label */}
      <div className="px-3 h-full flex items-center overflow-hidden pointer-events-none">
        <span className="text-[10px] font-medium text-white/80 truncate">{clip.name}</span>
      </div>

      {/* Duration tooltip */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 text-[9px] font-mono bg-black/90 text-zinc-300 rounded border border-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {formatTime(clip.endTime - clip.startTime)}
      </div>
    </div>
  );
}

export default memo(TimelineClipItem);
