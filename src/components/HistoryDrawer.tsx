// File: src/components/HistoryDrawer.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, X, Trash2, ArrowRight, Clock } from 'lucide-react';
import { getHistory, clearHistory, HistoryItem } from '@/lib/history';
import Link from 'next/link';

export default function HistoryDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    // Initial load
    setHistory(getHistory());

    // Listen for custom event
    const handleUpdate = () => {
      setHistory(getHistory());
    };
    window.addEventListener('history_updated', handleUpdate);
    return () => window.removeEventListener('history_updated', handleUpdate);
  }, []);

  const handleClear = () => {
    if (confirm("Are you sure you want to clear your local history?")) {
      clearHistory();
    }
  };

  const formatTime = (ts: number) => {
    const diff = Date.now() - ts;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 sm:p-2.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center relative group"
        title="Recent Activity"
      >
        <History size={16} className="sm:w-[18px] sm:h-[18px] group-hover:-rotate-45 transition-transform" />
        {history.length > 0 && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
            />

            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[400px] bg-[#0a0a0a] border-l border-white/10 z-[201] shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <History size={16} />
                  </div>
                  <h2 className="text-white font-black italic uppercase text-lg">Your History</h2>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 text-gray-500 hover:text-white rounded-full hover:bg-white/5 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                {history.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4 opacity-50">
                    <Clock size={48} className="text-gray-600" />
                    <p className="text-sm font-bold uppercase tracking-widest text-center">No recent activity.</p>
                  </div>
                ) : (
                  history.map((item) => (
                    <div key={item.id} className="bg-[#111] border border-white/5 rounded-2xl p-4 hover:border-indigo-500/30 transition-colors group">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{formatTime(item.timestamp)}</span>
                        <span className="text-[10px] bg-white/5 px-2 py-1 rounded-md text-gray-400">{item.toolName}</span>
                      </div>
                      <p className="text-gray-300 text-sm mb-4 leading-snug">{item.actionDesc}</p>
                      <Link 
                        href={`/tools/${item.toolSlug}`} 
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        Open Tool <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  ))
                )}
              </div>

              {history.length > 0 && (
                <div className="p-4 border-t border-white/5 bg-[#0a0a0a]">
                  <button 
                    onClick={handleClear}
                    className="w-full py-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 size={14} /> Clear History
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
