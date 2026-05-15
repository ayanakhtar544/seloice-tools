'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useEditorStore } from '../../stores/editorStore';
import { PanelSection, Slider } from '../shared/UIComponents';

const MusicIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>;
const MicIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" /><path d="M19 10v2a7 7 0 01-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>;
const WaveIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12h2l3-9 4 18 4-18 3 9h2" /></svg>;

const MUSIC_CATEGORIES = [
  { id: 'trending', name: '🔥 Trending', count: 'Popular' },
  { id: 'chill', name: '🎧 Chill', count: 'Lo-fi & Ambient' },
  { id: 'upbeat', name: '⚡ Upbeat', count: 'Energetic' },
  { id: 'cinematic', name: '🎬 Cinematic', count: 'Epic & Drama' },
  { id: 'comedy', name: '😂 Comedy', count: 'Funny & Meme' },
  { id: 'hiphop', name: '🎤 Hip Hop', count: 'Beats & Rap' },
];

const SOUND_EFFECTS = [
  { id: 'whoosh', name: 'Whoosh', icon: '💨' },
  { id: 'pop', name: 'Pop', icon: '🫧' },
  { id: 'ding', name: 'Ding', icon: '🔔' },
  { id: 'boom', name: 'Boom', icon: '💥' },
  { id: 'click', name: 'Click', icon: '👆' },
  { id: 'swipe', name: 'Swipe', icon: '👋' },
  { id: 'notification', name: 'Notification', icon: '📱' },
  { id: 'laugh', name: 'Laugh', icon: '😂' },
  { id: 'applause', name: 'Applause', icon: '👏' },
  { id: 'record', name: 'Record Scratch', icon: '💿' },
  { id: 'typing', name: 'Typing', icon: '⌨️' },
  { id: 'camera', name: 'Camera', icon: '📸' },
];

export default function AudioPanel() {
  const { clips, selectedClipIds, updateClip } = useEditorStore();
  const [activeTab, setActiveTab] = useState<'music' | 'sfx' | 'voice'>('music');

  const selectedClip = selectedClipIds.length === 1 ? clips.get(selectedClipIds[0]) : null;

  return (
    <div className="flex flex-col h-full">
      {/* Tab switcher */}
      <div className="flex border-b border-white/[0.04] flex-shrink-0">
        {(['music', 'sfx', 'voice'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-[11px] font-semibold uppercase tracking-wider transition-colors relative ${
              activeTab === tab ? 'text-violet-400' : 'text-zinc-600 hover:text-zinc-400'
            }`}
          >
            {tab === 'music' ? 'Music' : tab === 'sfx' ? 'SFX' : 'Voice'}
            {activeTab === tab && (
              <motion.div
                layoutId="audio-tab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500"
              />
            )}
          </button>
        ))}
      </div>

      {/* Music Tab */}
      {activeTab === 'music' && (
        <>
          <PanelSection title="Music Library" defaultOpen={true}>
            <div className="space-y-1">
              {MUSIC_CATEGORIES.map((cat) => (
                <motion.button
                  key={cat.id}
                  whileHover={{ x: 2 }}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-zinc-800/50 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">{cat.name}</span>
                  </div>
                  <span className="text-[10px] text-zinc-600 group-hover:text-zinc-400">{cat.count}</span>
                </motion.button>
              ))}
            </div>
            <div className="mt-3 p-3 rounded-lg bg-violet-500/5 border border-violet-500/10 text-center">
              <p className="text-[11px] text-violet-300">🎵 Royalty-free music library</p>
              <p className="text-[10px] text-zinc-600 mt-0.5">Coming soon — Upload your own for now</p>
            </div>
          </PanelSection>
        </>
      )}

      {/* SFX Tab */}
      {activeTab === 'sfx' && (
        <PanelSection title="Sound Effects" defaultOpen={true}>
          <div className="grid grid-cols-3 gap-1">
            {SOUND_EFFECTS.map((sfx) => (
              <motion.button
                key={sfx.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-1 p-2.5 rounded-lg bg-zinc-900/30 hover:bg-zinc-800 transition-colors"
              >
                <span className="text-lg">{sfx.icon}</span>
                <span className="text-[9px] font-medium text-zinc-500">{sfx.name}</span>
              </motion.button>
            ))}
          </div>
          <div className="mt-3 p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/10 text-center">
            <p className="text-[10px] text-zinc-500">Free SFX pack coming soon</p>
          </div>
        </PanelSection>
      )}

      {/* Voice Tab */}
      {activeTab === 'voice' && (
        <PanelSection title="Voice Tools" defaultOpen={true}>
          <div className="space-y-2">
            <motion.button
              whileHover={{ scale: 1.01 }}
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">
                <MicIcon />
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-zinc-300">Record Voiceover</p>
                <p className="text-[10px] text-zinc-600">Record directly in browser</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.01 }}
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400">
                <WaveIcon />
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-zinc-300">AI Voice Cleanup</p>
                <p className="text-[10px] text-zinc-600">Remove noise & enhance</p>
              </div>
              <span className="px-1.5 py-0.5 text-[8px] font-bold uppercase bg-violet-500/10 text-violet-400 rounded border border-violet-500/20 ml-auto">AI</span>
            </motion.button>
          </div>
        </PanelSection>
      )}

      {/* Audio Controls (when audio/video clip selected) */}
      {selectedClip && (selectedClip.type === 'audio' || selectedClip.type === 'video') && (
        <PanelSection title="Clip Audio" defaultOpen={true}>
          <div className="space-y-2">
            <Slider
              label="Volume"
              value={selectedClip.volume}
              min={0}
              max={2}
              step={0.05}
              onChange={(v) => updateClip(selectedClip.id, { volume: v })}
              formatValue={(v) => `${Math.round(v * 100)}%`}
            />
            <Slider
              label="Speed"
              value={selectedClip.speed}
              min={0.25}
              max={4}
              step={0.25}
              onChange={(v) => updateClip(selectedClip.id, { speed: v })}
              formatValue={(v) => `${v}x`}
            />
          </div>
        </PanelSection>
      )}
    </div>
  );
}
