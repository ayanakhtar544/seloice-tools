// File: src/components/HistoryDrawer.tsx
'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Trash2, ExternalLink, Activity } from 'lucide-react';

interface HistoryItem {
  id: string;
  title: string;
  date: string;
  type: string;
  url?: string;
}

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  // Jab tera asli data aaye, toh is type ko update kar lena
  historyItems?: HistoryItem[]; 
  onClearAll?: () => void;
}

export default function HistoryDrawer({ 
  isOpen, 
  onClose, 
  historyItems = [], 
  onClearAll 
}: HistoryDrawerProps) {

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Dummy data just for UI preview (Isko baad me remove kar dena)
  const previewData: HistoryItem[] = historyItems.length > 0 ? historyItems : [
    { id: '1', title: 'Faceless Viral Short', type: 'Video Export', date: '2 mins ago', url: '#' },
    { id: '2', title: 'Reddit Story Script', type: 'AI Generation', date: '1 hour ago', url: '#' },
    { id: '3', title: 'Sigma Male Voiceover', type: 'TTS Audio', date: 'Yesterday', url: '#' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKDROP BLUR */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-opacity"
          />

          {/* DRAWER PANEL */}
          <motion.div
            initial={{ x: '100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.5 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-[101] h-full w-full md:w-[420px] bg-[#0a0a0f]/95 border-l border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col backdrop-blur-xl"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-500/10 rounded-xl border border-rose-500/20">
                  <Clock size={20} className="text-rose-400" />
                </div>
                <div>
                  <h2 className="text-lg font-black uppercase tracking-widest text-white">Activity Log</h2>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Your recent generations</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* SCROLLABLE HISTORY LIST */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {previewData.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
                  <Activity size={48} className="text-zinc-600" />
                  <p className="text-sm font-medium text-zinc-400">No recent activity found.<br/>Start creating magic! ✨</p>
                </div>
              ) : (
                previewData.map((item) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-rose-500/30 hover:bg-white/[0.02] transition-all cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="relative z-10 flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full inline-block mb-2">
                          {item.type}
                        </span>
                        <h4 className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors line-clamp-1">
                          {item.title}
                        </h4>
                        <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
                          {item.date}
                        </p>
                      </div>
                      
                      {item.url && (
                        <button className="p-2 bg-white/5 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white text-zinc-400">
                          <ExternalLink size={14} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* FOOTER ACTIONS */}
            {previewData.length > 0 && (
              <div className="p-6 border-t border-white/10 shrink-0 bg-black/20">
                <button 
                  onClick={onClearAll}
                  className="w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors border border-transparent hover:border-rose-500/20"
                >
                  <Trash2 size={16} /> Clear All History
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}