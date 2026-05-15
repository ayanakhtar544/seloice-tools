'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PanelSection } from '../shared/UIComponents';

const TEMPLATE_CATEGORIES = [
  {
    name: '🔥 Viral Reels',
    templates: [
      { id: 't1', name: 'Hook → Value → CTA', desc: '3-part reel structure', duration: '30s', color: '#f43f5e' },
      { id: 't2', name: 'Before & After', desc: 'Transformation reveal', duration: '15s', color: '#8b5cf6' },
      { id: 't3', name: 'Top 5 Listicle', desc: 'Countdown with captions', duration: '45s', color: '#06b6d4' },
      { id: 't4', name: 'POV Story', desc: 'First-person narrative', duration: '30s', color: '#f59e0b' },
    ],
  },
  {
    name: '😂 Meme Edits',
    templates: [
      { id: 'm1', name: 'Classic Meme', desc: 'Top/bottom Impact text', duration: '10s', color: '#22c55e' },
      { id: 'm2', name: 'Expectation vs Reality', desc: 'Split screen compare', duration: '15s', color: '#ef4444' },
      { id: 'm3', name: '"Wait for it"', desc: 'Build-up & punchline', duration: '20s', color: '#a855f7' },
    ],
  },
  {
    name: '🎬 YouTube Shorts',
    templates: [
      { id: 'y1', name: 'Tutorial Quick', desc: 'Step-by-step short', duration: '60s', color: '#ef4444' },
      { id: 'y2', name: 'Fact Bomb', desc: 'Rapid-fire facts', duration: '30s', color: '#3b82f6' },
      { id: 'y3', name: 'Storytime', desc: 'Narrative with captions', duration: '45s', color: '#f97316' },
    ],
  },
  {
    name: '🤖 Faceless Content',
    templates: [
      { id: 'f1', name: 'AI Voiceover + Stock', desc: 'Narrated with b-roll', duration: '60s', color: '#6366f1' },
      { id: 'f2', name: 'Reddit Story', desc: 'Scrolling text with TTS', duration: '45s', color: '#f97316' },
      { id: 'f3', name: 'Quote Cards', desc: 'Animated motivational', duration: '15s', color: '#14b8a6' },
    ],
  },
];

export default function TemplatePanel() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-3 pb-1">
        <div className="relative">
          <input
            type="text"
            placeholder="Search templates..."
            className="w-full h-8 pl-8 pr-3 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300 placeholder:text-zinc-600 focus:border-violet-500 focus:outline-none"
          />
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-600">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>

      {TEMPLATE_CATEGORIES.map((cat) => (
        <PanelSection key={cat.name} title={cat.name} defaultOpen={true}>
          <div className="space-y-1.5">
            {cat.templates.map((tmpl) => (
              <motion.button
                key={tmpl.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full flex items-center gap-2.5 p-2.5 rounded-lg bg-zinc-900/40 border border-zinc-800/50 hover:border-zinc-600 transition-all text-left group"
              >
                <div
                  className="w-10 h-14 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: `${tmpl.color}15`, border: `1px solid ${tmpl.color}30` }}
                >
                  <div className="w-5 h-7 rounded-sm border border-dashed opacity-40" style={{ borderColor: tmpl.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-zinc-300">{tmpl.name}</p>
                  <p className="text-[10px] text-zinc-600">{tmpl.desc}</p>
                  <p className="text-[9px] text-zinc-700 mt-0.5">⏱ {tmpl.duration}</p>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-700 group-hover:text-zinc-400 transition-colors flex-shrink-0">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </motion.button>
            ))}
          </div>
        </PanelSection>
      ))}

      <div className="px-4 py-3">
        <div className="p-3 rounded-lg bg-gradient-to-br from-fuchsia-500/5 to-violet-500/5 border border-violet-500/10 text-center">
          <p className="text-[11px] text-violet-300 font-medium">📦 Template Marketplace</p>
          <p className="text-[10px] text-zinc-600 mt-0.5">Community templates coming soon</p>
        </div>
      </div>
    </div>
  );
}
