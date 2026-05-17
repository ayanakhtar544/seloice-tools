// File: src/app/tools/video-editor/components/Timeline/TimelineClipItem.tsx
'use client';

import React, { useRef, useCallback, useState, useEffect, memo } from 'react';
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

const WAVEFORM_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Crect x='2' y='8' width='2' height='8' fill='rgba(255,255,255,0.25)' rx='1'/%3E%3Crect x='6' y='4' width='2' height='16' fill='rgba(255,255,255,0.25)' rx='1'/%3E%3Crect x='10' y='10' width='2' height='4' fill='rgba(255,255,255,0.25)' rx='1'/%3E%3Crect x='14' y='6' width='2' height='12' fill='rgba(255,255,255,0.25)' rx='1'/%3E%3Crect x='18' y='11' width='2' height='6' fill='rgba(255,255,255,0.25)' rx='1'/%3E%3Crect x='22' y='5' width='2' height='14' fill='rgba(255,255,255,0.25)' rx='1'/%3E%3C/svg%3E")`;

function TimelineClipItem({ clipId, zoomLevel, trackType }: { clipId: string; zoomLevel: number; trackType: string }) {
  const clip = useEditorStore((s) => s.clips.get(clipId));
  const isSelected = useEditorStore((s) => s.selectedClipIds.includes(clipId));
  const selectClip = useEditorStore((s) => s.selectClip);
  const moveClip = useEditorStore((s) => s.moveClip);
  const trimClipStart = useEditorStore((s) => s.trimClipStart);
  const trimClipEnd = useEditorStore((s) => s.trimClipEnd);
  
  // 🔥 ACTION FOR SAVING TEXT
  const updateClipText = useEditorStore((s) => s.updateClipText);

  const magneticEnabled = useEditorStore((s) => s.magneticEnabled);
  const snapEnabled = useEditorStore((s) => s.snapEnabled);

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0); 
  const [isTrimming, setIsTrimming] = useState<'start' | 'end' | null>(null);
  
  // 🔥 STATES FOR EDITING
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(clip?.text?.content || '');
  const inputRef = useRef<HTMLInputElement>(null);

  const dragRef = useRef({ startX: 0, origStart: 0, origEnd: 0 });

  const colors = TRACK_COLORS[trackType] || TRACK_COLORS.video;
  const isMediaTrack = trackType === 'video' || trackType === 'audio';

  // 🔥 Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handlePointerDown = useCallback((e: React.PointerEvent, mode: 'move' | 'trim-start' | 'trim-end') => {
    // 🔥 Prevent dragging if currently editing text
    if (isEditing) return;
    if (!clip) return;
    
    e.stopPropagation(); e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    dragRef.current = { startX: e.clientX, origStart: clip.startTime, origEnd: clip.endTime };

    if (mode === 'move') { selectClip(clip.id, e.shiftKey); setIsDragging(true); setDragOffset(0); } 
    else { setIsTrimming(mode === 'trim-start' ? 'start' : 'end'); }

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - dragRef.current.startX;
      const dt = pixelsToSeconds(dx, zoomLevel);
      const clips = useEditorStore.getState().clips;
      const snapTargets = snapEnabled ? getSnapTargets(clips as any, new Set([clip.id])) : [];
      const snapThresholdSec = pixelsToSeconds(SNAP_THRESHOLD_PX, zoomLevel);

      if (mode === 'move') {
        let newStart = Math.max(0, dragRef.current.origStart + dt);
        const dur = dragRef.current.origEnd - dragRef.current.origStart;
        if (useEditorStore.getState().magneticEnabled) { setDragOffset(dx); return; }
        if (snapEnabled) {
          newStart = snapToValue(newStart, snapTargets, snapThresholdSec);
          const snappedEnd = snapToValue(newStart + dur, snapTargets, snapThresholdSec);
          if (Math.abs(snappedEnd - (newStart + dur)) < snapThresholdSec) newStart = snappedEnd - dur;
        }
        newStart = Math.max(0, newStart);
        moveClip(clip.id, newStart);
      } else if (mode === 'trim-start') {
        let newStart = clamp(dragRef.current.origStart + dt, 0, dragRef.current.origEnd - MIN_CLIP_DURATION);
        if (snapEnabled && !useEditorStore.getState().magneticEnabled) newStart = snapToValue(newStart, snapTargets, snapThresholdSec);
        newStart = clamp(newStart, 0, dragRef.current.origStart + MIN_CLIP_DURATION);
        trimClipStart(clip.id, newStart);
      } else {
        let newEnd = Math.max(dragRef.current.origStart + MIN_CLIP_DURATION, dragRef.current.origEnd + dt);
        if (snapEnabled && !useEditorStore.getState().magneticEnabled) newEnd = snapToValue(newEnd, snapTargets, snapThresholdSec);
        newEnd = Math.max(dragRef.current.origStart + MIN_CLIP_DURATION, newEnd);
        trimClipEnd(clip.id, newEnd);
      }
    };

    const onUp = (ev: PointerEvent) => {
      if (mode === 'move' && useEditorStore.getState().magneticEnabled) {
         const dx = ev.clientX - dragRef.current.startX;
         const dt = pixelsToSeconds(dx, zoomLevel);
         let newStart = Math.max(0, dragRef.current.origStart + dt);
         moveClip(clip.id, newStart);
         setDragOffset(0);
      }
      setIsDragging(false); setIsTrimming(null);
      useEditorStore.getState().recalculateDuration();
      window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove); window.addEventListener('pointerup', onUp);
  }, [clip, zoomLevel, selectClip, moveClip, trimClipStart, trimClipEnd, snapEnabled, isEditing]);

  // 🔥 SAVE TEXT CHANGES
  const handleSaveText = useCallback(() => {
    if (trackType === 'text' && clip) {
      updateClipText(clipId, { content: editText });
      // Update clip name too to match
      useEditorStore.getState().updateClip(clipId, { name: editText.substring(0, 15) });
    }
    setIsEditing(false);
  }, [editText, clip, clipId, trackType, updateClipText]);

  if (!clip) return null;

  const baseLeft = secondsToPixels(clip.startTime, zoomLevel);
  const visualLeft = isDragging && magneticEnabled ? baseLeft + dragOffset : baseLeft;
  const width = secondsToPixels(clip.endTime - clip.startTime, zoomLevel);

  return (
    <div
      className={`absolute top-1 bottom-1 rounded-md select-none group transition-[transform,shadow,border] duration-100 overflow-hidden ${
        isDragging ? 'z-50 shadow-2xl scale-[1.02] opacity-80 cursor-grabbing' : 'z-10 cursor-grab hover:brightness-110'
      } ${isSelected ? 'ring-2 ring-white/80' : 'ring-1 ring-black/20'} ${
        // 🔥 Highlight when editing
        isEditing ? 'ring-2 ring-amber-400 bg-amber-950 shadow-lg scale-[1.01]' : ''
      }`}
      style={{ left: `${visualLeft}px`, width: `${Math.max(width, 24)}px`, background: isDragging ? colors.clipHover : colors.clip, touchAction: 'none' }}
      onPointerDown={(e) => handlePointerDown(e, 'move')}
      // 🔥 THE FIX: Inline Editing Trigger
      onDoubleClick={(e) => {
        if (trackType === 'text' && !isDragging) {
          e.stopPropagation();
          setEditText(clip.text?.content || '');
          setIsEditing(true);
        }
      }}
    >
      {/* Waveform Background */}
      {isMediaTrack && (
        <div className="absolute inset-x-0 bottom-0 top-0 opacity-40 mix-blend-overlay pointer-events-none"
             style={{ backgroundImage: WAVEFORM_SVG, backgroundRepeat: 'repeat-x', backgroundPosition: 'center', backgroundSize: 'auto 60%' }} />
      )}

      {/* Handles — Hide when editing */}
      {!isEditing && (
        <>
          <div className="absolute left-0 top-0 bottom-0 w-3 cursor-col-resize z-30 flex items-center justify-center hover:bg-white/20 rounded-l-md" onPointerDown={(e) => handlePointerDown(e, 'trim-start')} style={{ touchAction: 'none' }}>
            <div className={`w-0.5 h-3 rounded-full ${isTrimming === 'start' ? 'bg-white' : 'bg-white/30 group-hover:bg-white/60'}`} />
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-3 cursor-col-resize z-30 flex items-center justify-center hover:bg-white/20 rounded-r-md" onPointerDown={(e) => handlePointerDown(e, 'trim-end')} style={{ touchAction: 'none' }}>
            <div className={`w-0.5 h-3 rounded-full ${isTrimming === 'end' ? 'bg-white' : 'bg-white/30 group-hover:bg-white/60'}`} />
          </div>
        </>
      )}

      {/* Clip label / Input field */}
      <div className={`px-3 h-full flex items-center relative z-20 ${isEditing ? '' : 'pointer-events-none'}`}>
        {isEditing ? (
          // 🔥 EDITABLE INPUT FIELD
          <input
            ref={inputRef}
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleSaveText} // Save on loss of focus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveText();
              if (e.key === 'Escape') setIsEditing(false); // Cancel on ESC
              e.stopPropagation(); // Don't trigger timeline shortcuts
            }}
            className="w-full bg-white/10 text-white text-[10px] font-bold px-1.5 py-0.5 rounded border border-white/20 focus:outline-none focus:border-amber-400 focus:bg-white/20"
            onClick={(e) => e.stopPropagation()} // Prevent deselection
          />
        ) : (
          <span className="text-[10px] font-bold text-white shadow-black/50 drop-shadow-md truncate">{clip.name}</span>
        )}
      </div>

      {/* Tooltip */}
      {!isEditing && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 text-[9px] font-black tracking-widest bg-black/90 text-white rounded border border-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {formatTime(clip.endTime - clip.startTime)}
        </div>
      )}
    </div>
  );
}

export default memo(TimelineClipItem);