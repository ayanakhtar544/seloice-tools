// File: src/app/tools/video-editor/components/Editor.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditorStore } from '../stores/editorStore';
import Toolbar from './Toolbar';
import PreviewCanvas from './Canvas/PreviewCanvas';
import Timeline from './Timeline/Timeline';
import MediaPanel from './Panels/MediaPanel';
import AudioPanel from './Panels/AudioPanel';
import TextPanel from './Panels/TextPanel';
import EffectsPanel from './Panels/EffectsPanel';
import CaptionPanel from './Panels/CaptionPanel';
import ExportModal from './ExportModal';
import { PanelTab } from '../types/editor';
import { useShortcuts } from '../hooks/useShortcuts';
import { Film, Type, Sparkles, MessageSquare, Music, ChevronLeft, ChevronRight, UploadCloud, Loader2 } from 'lucide-react';

const TABS: { id: PanelTab; label: string; icon: React.ReactNode }[] = [
  { id: 'media', label: 'MEDIAS', icon: <Film size={16} /> },
  { id: 'audio', label: 'Audio', icon: <Music size={16} /> },
  { id: 'text', label: 'Text', icon: <Type size={16} /> },
  { id: 'effects', label: 'Effects', icon: <Sparkles size={16} /> },
  { id: 'captions', label: 'Captions', icon: <MessageSquare size={16} /> },
];

export default function Editor() {
  const isPanelOpen = useEditorStore((s) => s.isPanelOpen);
  const activePanel = useEditorStore((s) => s.activePanel);
  const isMobile = useEditorStore((s) => s.isMobileView);
  const setMobileView = useEditorStore((s) => s.setMobileView);
  const setActivePanel = useEditorStore((s) => s.setActivePanel);
  const isFullScreen = useEditorStore((s) => s.isFullScreen);
  const isExportModalOpen = useEditorStore((s) => s.isExportModalOpen);
  const togglePanel = useEditorStore((s) => s.togglePanel);
  
  const restoreMediaAssets = useEditorStore((s) => s.restoreMediaAssets);

  const [isBooting, setIsBooting] = useState(true);
  const [isGlobalDragging, setIsGlobalDragging] = useState(false);

  useEffect(() => {
    restoreMediaAssets().finally(() => {
      setTimeout(() => setIsBooting(false), 800);
    });
  }, [restoreMediaAssets]);

  useShortcuts();

  useEffect(() => {
    const handleResize = () => setMobileView(window.innerWidth < 768);
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setMobileView]);

  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (!isGlobalDragging) setIsGlobalDragging(true);
    };
    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      if (e.clientX === 0 || e.clientY === 0) setIsGlobalDragging(false);
    };
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsGlobalDragging(false);
      if (e.dataTransfer?.files?.length) {
        if (!isPanelOpen) togglePanel();
        setActivePanel('media');
      }
    };

    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
    };
  }, [isGlobalDragging, isPanelOpen, togglePanel, setActivePanel]);

  const renderPanel = () => {
    switch (activePanel) {
      case 'media': return <MediaPanel />;
      case 'audio': return <AudioPanel />;
      case 'text': return <TextPanel />;
      case 'effects': return <EffectsPanel />;
      case 'captions': return <CaptionPanel />;
      default: return null;
    }
  };

 // 🔥 FIX 1: Ghost Click & Event Capture Protection
  const handleMobileTabClick = (tabId: PanelTab, e: React.SyntheticEvent) => {
    e.preventDefault();   // Mobile zoom/scroll rokega
    e.stopPropagation();  // Clicks ko canvas tak leak hone se rokega

    const store = useEditorStore.getState();

    if (store.activePanel === tabId && store.isPanelOpen) {
      // Same tab par tap kiya -> Close kar do
      store.togglePanel();
    } else {
      // Naya tab -> Active karo aur panel kholo
      store.setActivePanel(tabId);
      if (!store.isPanelOpen) {
        store.togglePanel();
      }
    }
  };

  return (
    <div tabIndex={0} className="flex flex-col h-[100dvh] bg-[#060609] overflow-hidden text-white font-sans outline-none relative">
      
      <div className="absolute inset-0 pointer-events-none opacity-[0.015] z-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

      {!isFullScreen && <Toolbar />}

      <div className="flex-1 flex overflow-hidden relative z-10">
        
        {/* DESKTOP SIDEBAR */}
        {!isMobile && !isFullScreen && (
          <div className="flex relative">
            <AnimatePresence initial={false}>
              {isPanelOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0, x: -20 }} 
                  animate={{ width: 340, opacity: 1, x: 0 }} 
                  exit={{ width: 0, opacity: 0, x: -20 }}
                  transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                  className="flex-shrink-0 bg-[#0a0a0f] border-r border-white/[0.04] flex flex-col z-20 shadow-2xl relative"
                >
                  <div className="flex p-2 gap-1 border-b border-white/[0.04] overflow-x-auto no-scrollbar">
                    {TABS.map((tab) => (
                      <button 
                        key={tab.id} 
                        onClick={() => setActivePanel(tab.id)}
                        className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl transition-all duration-200 ${
                          activePanel === tab.id 
                            ? 'bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 text-white shadow-lg border border-violet-500/30' 
                            : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300 border border-transparent'
                        }`}
                      >
                        {tab.icon}
                        <span className="text-[9px] font-black uppercase tracking-widest">{tab.label}</span>
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex-1 overflow-y-auto no-scrollbar p-4 relative">
                    {renderPanel()}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              onClick={togglePanel}
              className="absolute top-1/2 -right-3 -translate-y-1/2 z-30 w-6 h-12 bg-[#1a1a24] border border-white/10 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-violet-600/20 hover:border-violet-500/50 transition-all shadow-xl"
            >
              {isPanelOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
          </div>
        )}

        {/* WORKSPACE */}
        <div className="flex-1 flex flex-col min-w-0 relative z-10">
          <PreviewCanvas />
          <Timeline />
        </div>

        {/* ======================================================= */}
        {/* 🔥 FIX: MOBILE SLIDE-UP PANEL 🔥 */}
        {/* ======================================================= */}
        <AnimatePresence>
          {isMobile && isPanelOpen && (
            <>
              {/* BACKDROP - Panel ko band karne ke liye */}
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                // z-index bohot high hona chahiye taaki Canvas ke upar click na ho
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99990]"
                onClick={togglePanel} 
              />
              
              {/* SLIDING PANEL */}
              <motion.div
                initial={{ y: '100%' }} 
                animate={{ y: 0 }} 
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                // Bottom margin diya taaki floating navbar na chupe
                className="fixed bottom-[80px] left-0 right-0 bg-[#0c0c0f]/95 backdrop-blur-3xl border-t border-white/10 rounded-t-[2rem] z-[99995] flex flex-col shadow-[0_-10px_50px_rgba(0,0,0,0.8)]"
                style={{ height: '70dvh' }}
              >
                <div className="w-full flex justify-center pt-4 pb-2 cursor-pointer" onClick={togglePanel}>
                  <div className="w-12 h-1.5 bg-white/20 hover:bg-white/40 transition-colors rounded-full" />
                </div>

                <div className="p-5 flex-1 overflow-y-auto no-scrollbar pb-8 relative">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="p-2 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/20 text-violet-400 rounded-xl shadow-lg shadow-violet-500/10">
                      {TABS.find(t => t.id === activePanel)?.icon}
                    </span>
                    <h2 className="text-xl font-black uppercase italic tracking-widest text-white drop-shadow-md">
                      {TABS.find(t => t.id === activePanel)?.label}
                    </h2>
                  </div>
                  {renderPanel()}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

     {/* ======================================================= */}
      {/* 🔥 FIX 2: MOBILE NAVBAR (Ghost-Click Proof) 🔥 */}
      {/* ======================================================= */}
      {isMobile && !isFullScreen && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[99999] w-[90%] max-w-[340px] pointer-events-auto">
          <div className="bg-[#050505]/95 backdrop-blur-3xl border border-white/15 p-1.5 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex justify-between items-center relative overflow-hidden">
            
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-transparent to-fuchsia-500/10 pointer-events-none" />
            
            {TABS.map((tab) => {
              const isActive = activePanel === tab.id && isPanelOpen;
              return (
                <button
                  key={tab.id}
                  // 🔥 MAIN JADOO YAHAN HAI: onClickCapture pehle hit hota hai
                  onClickCapture={(e) => handleMobileTabClick(tab.id, e)}
                  className={`relative flex flex-col items-center justify-center w-14 h-12 rounded-full transition-all duration-300 z-10 cursor-pointer touch-manipulation ${
                    isActive ? 'text-white' : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="mobileNavBubble" 
                      className="absolute inset-0 bg-white/10 rounded-full border border-white/20 shadow-[inset_0_0_15px_rgba(255,255,255,0.1)] pointer-events-none" 
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} 
                    />
                  )}
                  <motion.div 
                    animate={{ scale: isActive ? 1.15 : 1, y: isActive ? -2 : 0 }} 
                    className="relative z-10 pointer-events-none"
                  >
                    {tab.icon}
                  </motion.div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* DRAG & DROP & MODAL */}
      <AnimatePresence>
        {isGlobalDragging && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-violet-900/40 backdrop-blur-sm border-[6px] border-dashed border-violet-500 flex flex-col items-center justify-center pointer-events-none"
          >
            <div className="bg-black/50 p-8 rounded-3xl flex flex-col items-center shadow-2xl backdrop-blur-xl">
              <UploadCloud size={64} className="text-violet-400 mb-4 animate-bounce" />
              <h2 className="text-3xl font-black uppercase tracking-widest text-white drop-shadow-lg">Drop to Import</h2>
              <p className="text-zinc-300 mt-2 font-medium">Video, Audio, or Images</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isExportModalOpen && <ExportModal onClose={() => useEditorStore.getState().toggleExportModal()} isOpen={isExportModalOpen} />}
      </AnimatePresence>
      
    </div>
  );
}