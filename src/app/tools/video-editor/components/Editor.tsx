'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditorStore } from '../stores/editorStore';
import Toolbar from './Toolbar';
import PreviewCanvas from './Canvas/PreviewCanvas';
import Timeline from './Timeline/Timeline';
import MediaPanel from './Panels/MediaPanel';
import TextPanel from './Panels/TextPanel';
import EffectsPanel from './Panels/EffectsPanel';
import AudioPanel from './Panels/AudioPanel';
import AIPanel from './Panels/AIPanel';
import TemplatePanel from './Panels/TemplatePanel';
import CaptionPanel from './Panels/CaptionPanel';
import ExportPanel from './Panels/ExportPanel';
import ExportModal from './ExportModal';
import type { PanelTab } from '../types/editor';

// ─── Panel Tab Icons ─────────────────────────────────────────
const TAB_CONFIG: { id: PanelTab; label: string; icon: React.ReactNode }[] = [
  {
    id: 'media',
    label: 'Media',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="3"/><circle cx="8" cy="8" r="2"/><path d="M2 15l5-5 4 4 3-3 8 8"/></svg>,
  },
  {
    id: 'text',
    label: 'Text',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>,
  },
  {
    id: 'effects',
    label: 'Effects',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  },
  {
    id: 'audio',
    label: 'Audio',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
  },
  {
    id: 'captions',
    label: 'Captions',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 12h4m-4 4h10"/></svg>,
  },
  {
    id: 'ai',
    label: 'AI',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2a4 4 0 014 4v2a4 4 0 01-8 0V6a4 4 0 014-4z"/><path d="M16 14a4 4 0 014 4v2H4v-2a4 4 0 014-4h8z"/><circle cx="9" cy="7" r="0.5" fill="currentColor"/><circle cx="15" cy="7" r="0.5" fill="currentColor"/></svg>,
  },
  {
    id: 'templates',
    label: 'Templates',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  },
  {
    id: 'export',
    label: 'Export',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  },
];

const PANEL_COMPONENTS: Record<PanelTab, React.ComponentType> = {
  media: MediaPanel,
  text: TextPanel,
  effects: EffectsPanel,
  audio: AudioPanel,
  ai: AIPanel,
  templates: TemplatePanel,
  captions: CaptionPanel,
  export: ExportPanel,
};

export default function Editor() {
  const { activePanel, isPanelOpen, isMobileView, isFullScreen, setActivePanel, togglePanel, setMobileView, toggleFullScreen } = useEditorStore();

  // Detect mobile
  useEffect(() => {
    const check = () => setMobileView(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [setMobileView]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const { togglePlay, undo, redo, stepForward, stepBackward, toggleFullScreen } = useEditorStore.getState();

      if (e.code === 'Space') { e.preventDefault(); togglePlay(); }
      if (e.key === 'f') { e.preventDefault(); toggleFullScreen(); }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) { e.preventDefault(); redo(); }
      if (e.key === 'ArrowRight' && !e.metaKey) { e.preventDefault(); stepForward(); }
      if (e.key === 'ArrowLeft' && !e.metaKey) { e.preventDefault(); stepBackward(); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Handle body scroll locking
  useEffect(() => {
    if (isFullScreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isFullScreen]);

  const ActivePanel = PANEL_COMPONENTS[activePanel];

  return (
    <div className={`flex flex-col bg-[#060609] text-white overflow-hidden select-none transition-all duration-500 ${
      isFullScreen 
        ? 'fixed inset-0 z-[1000] h-screen w-screen' 
        : 'relative w-full h-[calc(100vh-140px)] min-h-[600px] rounded-2xl border border-white/5 shadow-2xl'
    }`}>
      {/* Main editor area */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Side Tab Bar (Desktop) */}
        {!isMobileView && (
          <div className="w-14 bg-[#08080c] border-r border-white/[0.03] flex flex-col items-center py-2 gap-0.5 flex-shrink-0">
            {TAB_CONFIG.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  if (activePanel === tab.id && isPanelOpen) togglePanel();
                  else setActivePanel(tab.id);
                }}
                className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all group relative ${
                  activePanel === tab.id && isPanelOpen
                    ? 'bg-violet-500/10 text-violet-400'
                    : 'text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.03]'
                }`}
                title={tab.label}
              >
                {tab.icon}
                <span className="text-[8px] font-medium leading-none">{tab.label}</span>
                {activePanel === tab.id && isPanelOpen && (
                  <motion.div
                    layoutId="active-tab-indicator"
                    className="absolute right-0 top-2 bottom-2 w-0.5 bg-violet-500 rounded-l"
                  />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Side Panel (Desktop) */}
        <AnimatePresence mode="wait">
          {isPanelOpen && !isMobileView && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              className="bg-[#0a0a0f] border-r border-white/[0.03] overflow-hidden flex-shrink-0"
            >
              <div className="w-[280px] h-full flex flex-col">
                {/* Panel header */}
                <div className="h-10 flex items-center justify-between px-3 border-b border-white/[0.04] flex-shrink-0">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    {TAB_CONFIG.find((t) => t.id === activePanel)?.label}
                  </span>
                  <button
                    onClick={togglePanel}
                    className="w-6 h-6 flex items-center justify-center text-zinc-600 hover:text-zinc-300 rounded transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
                {/* Panel content */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                  <ActivePanel />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center: Preview Canvas */}
        <PreviewCanvas />
      </div>

      {/* Timeline */}
      <Timeline />

      {/* Mobile Bottom Tab Bar */}
      {isMobileView && (
        <div className="h-14 bg-[#08080c] border-t border-white/[0.04] flex items-center justify-around px-1 flex-shrink-0 safe-area-bottom">
          {TAB_CONFIG.slice(0, 6).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActivePanel(tab.id)}
              className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
                activePanel === tab.id
                  ? 'text-violet-400'
                  : 'text-zinc-600'
              }`}
            >
              {tab.icon}
              <span className="text-[8px] font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Mobile Panel Overlay */}
      <AnimatePresence>
        {isMobileView && isPanelOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={togglePanel}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0f] rounded-t-2xl max-h-[70vh] flex flex-col border-t border-white/[0.06]"
            >
              <div className="flex items-center justify-center py-2">
                <div className="w-8 h-1 rounded-full bg-zinc-700" />
              </div>
              <div className="flex-1 overflow-y-auto pb-6">
                <ActivePanel />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toolbar - Now at the bottom for "Sticky Bottom" UI */}
      {!isMobileView && <Toolbar />}

      <ExportModal 
        isOpen={useEditorStore(s => s.isExportModalOpen)} 
        onClose={() => useEditorStore.getState().toggleExportModal()} 
      />

      {/* Fullscreen indicator overlay */}
      {isFullScreen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] text-zinc-400 font-bold uppercase tracking-widest pointer-events-none z-[1100]"
        >
          Press <span className="text-white px-1.5 py-0.5 rounded bg-white/10 mx-1">F</span> to exit Fullscreen
        </motion.div>
      )}
    </div>
  );
}
