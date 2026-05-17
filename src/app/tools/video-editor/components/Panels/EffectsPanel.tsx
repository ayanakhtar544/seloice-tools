// File: src/app/tools/video-editor/components/Panels/EffectsPanel.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditorStore } from '../../stores/editorStore';
import { PanelSection, Slider } from '../shared/UIComponents';
import { Sparkles, SlidersHorizontal, Wand2, MonitorPlay, Zap, Droplets, Palette } from 'lucide-react';
import { generateId } from '../../utils/helpers';

const FILTERS = [
  { id: 'f-cine', name: 'Cinematic', color: 'from-orange-500/40 to-blue-900/40' },
  { id: 'f-cyber', name: 'Cyberpunk', color: 'from-pink-500/40 to-cyan-500/40' },
  { id: 'f-retro', name: 'Vintage 90s', color: 'from-yellow-600/40 to-amber-900/40' },
  { id: 'f-bw', name: 'B & W', color: 'from-zinc-500/40 to-zinc-800/40' },
  { id: 'f-sepia', name: 'Sepia', color: 'from-amber-700/40 to-yellow-900/40' },
];

const VFX = [
  { id: 'v-glitch', name: 'Glitch', icon: <Zap size={18} /> },
  { id: 'v-vhs', name: 'VHS Tape', icon: <MonitorPlay size={18} /> },
  { id: 'v-rgb', name: 'RGB Split', icon: <Wand2 size={18} /> },
  { id: 'v-blur', name: 'Lens Blur', icon: <Droplets size={18} /> },
];

export default function EffectsPanel() {
  const { selectedClipIds, clips, addEffectToClip, removeEffectFromClip, updateClip } = useEditorStore();
  const [activeTab, setActiveTab] = useState<'filters' | 'vfx' | 'adjust'>('filters');

  const selectedClipId = selectedClipIds[0];
  const selectedClip = selectedClipId ? clips.get(selectedClipId) : null;
  
  // 🔥 FIX 1: Added 'as string' to tell TypeScript to chill out
  const isVideoOrImage = selectedClip?.type === 'video' || (selectedClip?.type as string) === 'image';

  // 🔥 GET CURRENT VALUE FROM CLIP
  const getEffectValue = (name: string, defaultVal: number) => {
    return selectedClip?.effects?.find(e => e.name === name)?.value ?? defaultVal;
  };

  // 🔥 SET ADJUSTMENT VALUE
  const setEffectValue = (name: string, val: number) => {
    if (!selectedClipId || !selectedClip) return;
    const existing = selectedClip.effects?.find(e => e.name === name);
    if (existing) {
      const newEffects = selectedClip.effects.map(e => e.name === name ? { ...e, value: val } : e);
      updateClip(selectedClipId, { effects: newEffects });
    } else {
      addEffectToClip(selectedClipId, { id: generateId(), type: 'adjust', name, value: val });
    }
  };

  // 🔥 APPLY FILTER (Only 1 filter at a time)
  const handleApplyFilter = (filterName: string) => {
    if (!selectedClipId || !selectedClip) return;
    // FIX 2: Added safety fallback `(selectedClip.effects || [])`
    const cleanEffects = (selectedClip.effects || []).filter(e => e.type !== 'filter'); 
    updateClip(selectedClipId, { effects: [...cleanEffects, { id: generateId(), type: 'filter', name: filterName, value: 100 }] });
  };

  // 🔥 VFX Actions
  const handleApplyVFX = (effectName: string) => {
    if (!selectedClipId) return;
    addEffectToClip(selectedClipId, { id: generateId(), type: 'vfx', name: effectName, value: 100 });
  };
  const handleRemoveVFX = (effectId: string) => {
    if (!selectedClipId) return;
    removeEffectFromClip(selectedClipId, effectId);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      
      {/* TABS */}
      <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
        <button onClick={() => setActiveTab('filters')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'filters' ? 'bg-violet-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}><Palette size={14} /> Filters</button>
        <button onClick={() => setActiveTab('vfx')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'vfx' ? 'bg-fuchsia-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}><Sparkles size={14} /> VFX</button>
        <button onClick={() => setActiveTab('adjust')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'adjust' ? 'bg-cyan-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}><SlidersHorizontal size={14} /> Adjust</button>
      </div>

      {!isVideoOrImage ? (
        <div className="flex flex-col items-center justify-center h-48 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl p-6 text-center">
          <Wand2 size={32} className="text-zinc-600 mb-3" />
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">No Clip Selected</p>
          <p className="text-[10px] text-zinc-600 mt-2">Tap on a video or image to apply magic.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
          <AnimatePresence mode="wait">
            
            {/* 🎨 TAB 1: FILTERS */}
            {activeTab === 'filters' && (
              <motion.div key="filters" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-2 gap-2">
                {FILTERS.map((filter) => {
                  const isActive = selectedClip?.effects?.some(e => e.name === filter.name);
                  return (
                    <button key={filter.id} onClick={() => handleApplyFilter(filter.name)} className={`relative h-20 rounded-xl overflow-hidden group transition-all ${isActive ? 'border-2 border-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.5)]' : 'border border-white/10 hover:border-violet-500'}`}>
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80')] bg-cover bg-center" />
                      <div className={`absolute inset-0 bg-gradient-to-br ${filter.color} mix-blend-overlay`} />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                      <span className="absolute bottom-1.5 left-2 text-[10px] font-black text-white drop-shadow-md z-10">{filter.name}</span>
                    </button>
                  );
                })}
                <button onClick={() => updateClip(selectedClipId, { effects: (selectedClip?.effects || []).filter(e => e.type !== 'filter') })} className="col-span-2 mt-2 py-2 bg-zinc-900 border border-white/10 text-xs text-white rounded-lg hover:bg-zinc-800">Clear Filter</button>
              </motion.div>
            )}

            {/* ✨ TAB 2: VFX */}
            {activeTab === 'vfx' && (
              <motion.div key="vfx" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                {selectedClip?.effects?.some(e => e.type === 'vfx') && (
                  <PanelSection title="Applied VFX" defaultOpen={true}>
                    <div className="space-y-2">
                      {(selectedClip?.effects || []).filter(e => e.type === 'vfx').map(eff => (
                        <div key={eff.id} className="flex items-center justify-between bg-fuchsia-500/10 border border-fuchsia-500/20 p-2 rounded-lg">
                          <span className="text-[10px] font-bold text-fuchsia-300">{eff.name}</span>
                          <button onClick={() => handleRemoveVFX(eff.id)} className="text-fuchsia-400 hover:text-white text-[10px] font-bold bg-fuchsia-500/20 px-2 py-1 rounded">Remove</button>
                        </div>
                      ))}
                    </div>
                  </PanelSection>
                )}
                <div className="grid grid-cols-3 gap-2">
                  {VFX.map((vfx) => (
                    <button key={vfx.id} onClick={() => handleApplyVFX(vfx.name)} className="flex flex-col items-center justify-center gap-2 p-3 bg-zinc-900/50 hover:bg-fuchsia-500/20 border border-white/5 hover:border-fuchsia-500/50 rounded-xl transition-all group">
                      <div className="text-zinc-500 group-hover:text-fuchsia-400 transition-colors">{vfx.icon}</div>
                      <span className="text-[9px] font-bold text-zinc-300 group-hover:text-white text-center leading-tight">{vfx.name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 🎚️ TAB 3: ADJUSTMENTS */}
            {activeTab === 'adjust' && (
              <motion.div key="adjust" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 bg-zinc-900/30 p-4 rounded-xl border border-white/5">
                <Slider label="Brightness" value={getEffectValue('Brightness', 0)} min={-100} max={100} step={1} onChange={(val) => setEffectValue('Brightness', val)} formatValue={v => `${v > 0 ? '+' : ''}${v}`} />
                <Slider label="Contrast" value={getEffectValue('Contrast', 0)} min={-100} max={100} step={1} onChange={(val) => setEffectValue('Contrast', val)} formatValue={v => `${v > 0 ? '+' : ''}${v}`} />
                <Slider label="Saturation" value={getEffectValue('Saturation', 0)} min={-100} max={100} step={1} onChange={(val) => setEffectValue('Saturation', val)} formatValue={v => `${v > 0 ? '+' : ''}${v}`} />
                <button onClick={() => updateClip(selectedClipId, { effects: (selectedClip?.effects || []).filter(e => e.type !== 'adjust') })} className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-xl transition-colors border border-red-500/20">
                  Reset All Adjustments
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}