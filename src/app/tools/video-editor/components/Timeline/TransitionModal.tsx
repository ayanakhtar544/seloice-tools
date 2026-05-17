'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Clock } from 'lucide-react';
import { useEditorStore } from '../../stores/editorStore';

const TRANSITIONS = [
  { id: 'fade', name: 'Crossfade', icon: '🌫️' },
  { id: 'slide-left', name: 'Slide L', icon: '⬅️' },
  { id: 'slide-right', name: 'Slide R', icon: '➡️' },
  { id: 'slide-up', name: 'Slide U', icon: '⬆️' },
  { id: 'slide-down', name: 'Slide D', icon: '⬇️' },
  { id: 'zoom-in', name: 'Zoom In', icon: '🔍' },
  { id: 'zoom-out', name: 'Zoom Out', icon: '🔭' },
  { id: 'blur', name: 'Blur', icon: '☁️' },
  { id: 'flash', name: 'White Flash', icon: '⚡' },
  { id: 'dissolve', name: 'Dissolve', icon: '🧩' },
  { id: 'rotate', name: 'Rotate', icon: '🔄' },
  { id: 'wipe-left', name: 'Wipe L', icon: '🧹' },
  { id: 'dip-black', name: 'Black Out', icon: '🌑' },
];

export default function TransitionModal({ clipId, onClose }: { clipId: string, onClose: () => void }) {
  const { addTransition, transitions, removeTransition } = useEditorStore();
  const existing = transitions.get(clipId);
  
  const [selected, setSelected] = useState(existing?.type || 'fade');
  const [duration, setDuration] = useState(existing?.duration || 0.5);

  const handleApply = () => {
    addTransition(clipId, selected, duration);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#12121a] border border-white/10 w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-lg font-black italic uppercase text-white">Select Transition</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full"><X size={20}/></button>
        </div>

        <div className="p-6">
          {/* Duration Slider */}
          <div className="mb-6 space-y-3">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
              <span className="flex items-center gap-1"><Clock size={12}/> Duration</span>
              <span className="text-violet-400">{duration}s</span>
            </div>
            <input type="range" min="0.1" max="2.0" step="0.1" value={duration} onChange={(e) => setDuration(parseFloat(e.target.value))} 
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-violet-500" />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-3 gap-2 h-64 overflow-y-auto pr-2 no-scrollbar">
            {TRANSITIONS.map(t => (
              <button key={t.id} onClick={() => setSelected(t.id)} 
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${selected === t.id ? 'bg-violet-500/20 border-violet-500 text-white' : 'bg-white/5 border-transparent text-zinc-500 hover:border-white/10'}`}>
                <span className="text-2xl mb-2">{t.icon}</span>
                <span className="text-[10px] font-bold text-center leading-tight">{t.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 bg-white/5 flex gap-3">
          <button onClick={() => { removeTransition(clipId); onClose(); }} className="flex-1 py-3 text-xs font-black uppercase tracking-widest text-red-400 hover:bg-red-500/10 rounded-xl transition-all">Remove</button>
          <button onClick={handleApply} className="flex-1 py-3 text-xs font-black uppercase tracking-widest bg-violet-600 hover:bg-violet-500 text-white rounded-xl shadow-lg shadow-violet-600/20 transition-all flex items-center justify-center gap-2">
            <Check size={16}/> Apply
          </button>
        </div>
      </motion.div>
    </div>
  );
}