'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useEditorStore } from '../../stores/editorStore';
import { PanelSection, Slider } from '../shared/UIComponents';
import { EFFECT_PRESETS } from '../../types/editor';
import type { ClipEffect, EffectType } from '../../types/editor';
import { generateId } from '../../utils/helpers';

const EFFECT_CATEGORIES: { name: string; effects: { type: EffectType; label: string; icon: string }[] }[] = [
  {
    name: 'Adjust',
    effects: [
      { type: 'brightness', label: 'Brightness', icon: '☀️' },
      { type: 'contrast', label: 'Contrast', icon: '◐' },
      { type: 'saturation', label: 'Saturation', icon: '🎨' },
      { type: 'hue-rotate', label: 'Hue Shift', icon: '🌈' },
      { type: 'blur', label: 'Blur', icon: '💫' },
    ],
  },
  {
    name: 'Stylize',
    effects: [
      { type: 'sepia', label: 'Sepia', icon: '📜' },
      { type: 'grayscale', label: 'Grayscale', icon: '⬛' },
      { type: 'invert', label: 'Invert', icon: '🔄' },
      { type: 'vignette', label: 'Vignette', icon: '🔲' },
      { type: 'film-grain', label: 'Film Grain', icon: '🎬' },
    ],
  },
  {
    name: 'Viral',
    effects: [
      { type: 'vhs', label: 'VHS', icon: '📼' },
      { type: 'glitch', label: 'Glitch', icon: '⚡' },
      { type: 'rgb-split', label: 'RGB Split', icon: '🔴' },
      { type: 'noise', label: 'Noise', icon: '📡' },
      { type: 'chromatic-aberration', label: 'Chromatic', icon: '🌀' },
    ],
  },
  {
    name: 'Motion',
    effects: [
      { type: 'shake', label: 'Shake', icon: '📳' },
      { type: 'zoom-pulse', label: 'Zoom Pulse', icon: '🔍' },
      { type: 'motion-blur', label: 'Motion Blur', icon: '💨' },
      { type: 'glow', label: 'Glow', icon: '✨' },
    ],
  },
  {
    name: 'Color Grade',
    effects: [
      { type: 'cinematic', label: 'Cinematic', icon: '🎥' },
      { type: 'vintage', label: 'Vintage', icon: '📷' },
      { type: 'cool', label: 'Cool Tone', icon: '🧊' },
      { type: 'warm', label: 'Warm Tone', icon: '🔥' },
      { type: 'color-overlay', label: 'Color Overlay', icon: '🎭' },
    ],
  },
];

export default function EffectsPanel() {
  const { clips, selectedClipIds, addEffectToClip, removeEffectFromClip, updateClip } = useEditorStore();

  const selectedClip = selectedClipIds.length === 1 ? clips.get(selectedClipIds[0]) : null;
  const clipEffects = selectedClip?.effects || [];

  const addEffect = (type: EffectType) => {
    if (!selectedClip) return;
    const effect: ClipEffect = {
      id: generateId(),
      type,
      enabled: true,
      intensity: 0.5,
      params: {},
    };
    addEffectToClip(selectedClip.id, effect);
  };

  const updateEffectIntensity = (effectId: string, intensity: number) => {
    if (!selectedClip) return;
    const updated = selectedClip.effects.map((e) =>
      e.id === effectId ? { ...e, intensity } : e
    );
    updateClip(selectedClip.id, { effects: updated });
  };

  const toggleEffect = (effectId: string) => {
    if (!selectedClip) return;
    const updated = selectedClip.effects.map((e) =>
      e.id === effectId ? { ...e, enabled: !e.enabled } : e
    );
    updateClip(selectedClip.id, { effects: updated });
  };

  const applyPreset = (presetKey: string) => {
    if (!selectedClip) return;
    const preset = EFFECT_PRESETS[presetKey];
    if (!preset) return;
    const effects: ClipEffect[] = preset.effects.map((e) => ({
      id: generateId(),
      type: e.type!,
      enabled: true,
      intensity: e.intensity || 0.5,
      params: {},
    }));
    updateClip(selectedClip.id, { effects });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Quick Presets */}
      <PanelSection title="Quick Presets" defaultOpen={true}>
        <div className="grid grid-cols-2 gap-1.5">
          {Object.entries(EFFECT_PRESETS).map(([key, preset]) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => applyPreset(key)}
              disabled={!selectedClip}
              className={`p-2.5 rounded-lg text-left transition-all border ${
                selectedClip
                  ? 'bg-zinc-900/50 border-zinc-800 hover:border-violet-500/30 hover:bg-violet-500/5 cursor-pointer'
                  : 'bg-zinc-900/20 border-zinc-800/30 opacity-40 cursor-not-allowed'
              }`}
            >
              <p className="text-xs font-semibold text-zinc-300">{preset.name}</p>
              <p className="text-[9px] text-zinc-600 mt-0.5">
                {preset.effects.length} effect{preset.effects.length > 1 ? 's' : ''}
              </p>
            </motion.button>
          ))}
        </div>
      </PanelSection>

      {/* Active Effects on Selected Clip */}
      {selectedClip && clipEffects.length > 0 && (
        <PanelSection title={`Active (${clipEffects.length})`} defaultOpen={true}>
          <div className="space-y-1.5">
            {clipEffects.map((effect) => (
              <div key={effect.id} className="rounded-lg bg-zinc-900/50 border border-zinc-800 p-2">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleEffect(effect.id)}
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        effect.enabled
                          ? 'bg-violet-500 border-violet-400'
                          : 'bg-zinc-800 border-zinc-600'
                      }`}
                    >
                      {effect.enabled && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                    <span className="text-[11px] font-medium text-zinc-300 capitalize">
                      {effect.type.replace(/-/g, ' ')}
                    </span>
                  </div>
                  <button
                    onClick={() => removeEffectFromClip(selectedClip.id, effect.id)}
                    className="text-zinc-600 hover:text-red-400 transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
                <Slider
                  value={effect.intensity}
                  min={0}
                  max={1}
                  step={0.01}
                  onChange={(v) => updateEffectIntensity(effect.id, v)}
                  formatValue={(v) => `${Math.round(v * 100)}%`}
                />
              </div>
            ))}
          </div>
        </PanelSection>
      )}

      {/* All Effects */}
      {EFFECT_CATEGORIES.map((category) => (
        <PanelSection key={category.name} title={category.name} defaultOpen={category.name === 'Adjust'}>
          <div className="grid grid-cols-3 gap-1">
            {category.effects.map((effect) => (
              <motion.button
                key={effect.type}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => addEffect(effect.type)}
                disabled={!selectedClip}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                  selectedClip
                    ? 'bg-zinc-900/30 hover:bg-zinc-800 cursor-pointer'
                    : 'opacity-30 cursor-not-allowed'
                }`}
              >
                <span className="text-lg">{effect.icon}</span>
                <span className="text-[9px] font-medium text-zinc-500">{effect.label}</span>
              </motion.button>
            ))}
          </div>
        </PanelSection>
      ))}

      {/* No clip selected hint */}
      {!selectedClip && (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-xs text-zinc-500">Select a clip to apply effects</p>
            <p className="text-[10px] text-zinc-700 mt-1">Click on a clip in the timeline</p>
          </div>
        </div>
      )}
    </div>
  );
}
