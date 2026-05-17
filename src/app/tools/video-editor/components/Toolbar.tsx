// File: src/app/tools/video-editor/components/Toolbar.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useEditorStore } from '../stores/editorStore';
import { IconButton, Tooltip, SegmentedControl } from './shared/UIComponents';
import type { AspectRatio } from '../types/editor';

// SVG Icons as inline components for zero-dependency
const Icons = {
  Undo: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6" /><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6.69 3L3 13" /></svg>,
  Redo: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7v6h-6" /><path d="M3 17a9 9 0 019-9 9 9 0 016.69 3L21 13" /></svg>,
  ZoomIn: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35M11 8v6M8 11h6" /></svg>,
  ZoomOut: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35M8 11h6" /></svg>,
  SafeZone: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><rect x="7" y="7" width="10" height="10" rx="1" strokeDasharray="3 2" /></svg>,
  Settings: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" /></svg>,
  Export: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>,
  Snap: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 14h-4m4-4h-4m-6 8v4m0-16V2m8 10H5a2 2 0 01-2-2V5a2 2 0 012-2h6a2 2 0 012 2v5a2 2 0 01-2 2z" /></svg>,
  Back: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>,
  Fullscreen: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" /></svg>,
};

export default function Toolbar() {
  const {
    project, undoStack, redoStack, zoomLevel, snapEnabled, showSafeZone, isFullScreen, isMobileView,
    undo, redo, setAspectRatio, setZoomLevel, toggleSnapEnabled, toggleSafeZone, toggleFullScreen,
  } = useEditorStore();

  const aspectOptions: { value: AspectRatio; label: string }[] = [
    { value: '9:16', label: '9:16' },
    { value: '16:9', label: '16:9' },
    { value: '1:1', label: '1:1' },
    { value: '4:5', label: '4:5' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-14 bg-[#0c0c0f]/95 backdrop-blur-xl border-b border-white/[0.04] flex items-center justify-between px-3 md:px-6 gap-2 z-50 shadow-xl"
    >
      {/* Left: Back + Project Name + Undo/Redo */}
      <div className="flex items-center gap-2 min-w-0">
        {!isFullScreen && (
          <a href="/tools" className="flex items-center justify-center w-8 h-8 rounded-full text-zinc-500 hover:text-white bg-white/5 hover:bg-white/10 transition-colors shadow-inner border border-white/5">
            <Icons.Back />
          </a>
        )}

        <div className="hidden sm:flex items-center gap-2 ml-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
          <span className="text-xs font-black uppercase tracking-widest text-zinc-300 truncate max-w-[180px]">
            {project.name}
          </span>
        </div>

        <div className="h-6 w-px bg-white/10 mx-1 hidden sm:block" />

        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 bg-black/40 rounded-lg p-1 border border-white/5">
          <Tooltip content="Undo (⌘Z)">
            <IconButton icon={<Icons.Undo />} onClick={undo} disabled={undoStack.length === 0} size="sm" />
          </Tooltip>
          <Tooltip content="Redo (⌘⇧Z)">
            <IconButton icon={<Icons.Redo />} onClick={redo} disabled={redoStack.length === 0} size="sm" />
          </Tooltip>
        </div>
      </div>

      {/* Center: Aspect Ratio */}
      <div className="flex-1 flex justify-center">
        <SegmentedControl options={aspectOptions} value={project.aspectRatio} onChange={setAspectRatio} />
      </div>

      {/* Right: Zoom + Tools + Settings + Export */}
      <div className="flex items-center gap-1.5">
        
        {/* Zoom Controls - Hidden on very small screens */}
        <div className="hidden md:flex items-center gap-0.5">
          <Tooltip content="Zoom Out"><IconButton icon={<Icons.ZoomOut />} onClick={() => setZoomLevel(zoomLevel / 1.3)} size="sm" /></Tooltip>
          <span className="text-[10px] text-zinc-500 font-bold w-10 text-center">{Math.round(zoomLevel * 100)}%</span>
          <Tooltip content="Zoom In"><IconButton icon={<Icons.ZoomIn />} onClick={() => setZoomLevel(zoomLevel * 1.3)} size="sm" /></Tooltip>
        </div>

        <div className="h-6 w-px bg-white/10 mx-1 hidden md:block" />

        {/* Action icons hidden on mobile to save space, but ALL kept for desktop! */}
        {!isMobileView && (
          <>
            <Tooltip content="Toggle Fullscreen (F)">
              <IconButton icon={<Icons.Fullscreen />} onClick={toggleFullScreen} active={isFullScreen} size="sm" />
            </Tooltip>
            <Tooltip content={`Snap ${snapEnabled ? 'On' : 'Off'}`}>
              <IconButton icon={<Icons.Snap />} onClick={toggleSnapEnabled} active={snapEnabled} size="sm" />
            </Tooltip>
            <Tooltip content="Safe Zone">
              <IconButton icon={<Icons.SafeZone />} onClick={toggleSafeZone} active={showSafeZone} size="sm" />
            </Tooltip>
            <Tooltip content="Project Settings">
              <IconButton icon={<Icons.Settings />} onClick={() => console.log('Settings opened')} size="sm" />
            </Tooltip>
          </>
        )}

        {/* Big Export Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => useEditorStore.getState().toggleExportModal()}
          className="flex items-center gap-1.5 h-9 px-4 ml-1 rounded-full text-[10px] font-black uppercase tracking-widest
            bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all"
        >
          <Icons.Export />
          <span className="hidden sm:inline">Export</span>
        </motion.button>
      </div>
    </motion.div>
  );
}