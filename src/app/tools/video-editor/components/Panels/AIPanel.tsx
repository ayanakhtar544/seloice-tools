'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PanelSection, Badge } from '../shared/UIComponents';
import { useEditorStore } from '../../stores/editorStore';

const AI_FEATURES = [
  {
    category: 'Content Intelligence',
    features: [
      { id: 'silence-detect', name: 'Silence Detection', desc: 'Remove silent parts', icon: '🔇', ready: true },
      { id: 'auto-captions', name: 'Auto Captions', desc: 'Generate animated captions', icon: '💬', ready: true },
      { id: 'scene-detect', name: 'Scene Detection', desc: 'Auto-split at scene changes', icon: '🎬', ready: true },
      { id: 'viral-score', name: 'Viral Score', desc: 'Predict virality', icon: '📊', ready: false },
    ],
  },
  {
    category: 'Smart Editing',
    features: [
      { id: 'auto-cuts', name: 'Auto Cuts', desc: 'AI jump cut detection', icon: '✂️', ready: true },
      { id: 'smart-crop', name: 'Smart Reframe', desc: 'Auto-reframe for any ratio', icon: '📐', ready: false },
      { id: 'bg-remove', name: 'BG Removal', desc: 'Remove video background', icon: '🎭', ready: true },
      { id: 'face-track', name: 'Face Tracking', desc: 'Auto-zoom on speaker', icon: '👤', ready: false },
    ],
  },
  {
    category: 'Content Generation',
    features: [
      { id: 'hook-gen', name: 'Hook Generator', desc: 'Viral hooks for content', icon: '🪝', ready: true },
      { id: 'title-gen', name: 'Title Generator', desc: 'SEO-optimized titles', icon: '📝', ready: true },
      { id: 'hashtag-gen', name: 'Hashtag Generator', desc: 'Trending hashtags', icon: '#️⃣', ready: true },
      { id: 'script-gen', name: 'Script Generator', desc: 'Full video script', icon: '📋', ready: true },
    ],
  },
  {
    category: 'Audio AI',
    features: [
      { id: 'noise-reduce', name: 'Noise Reduction', desc: 'AI audio cleanup', icon: '🔊', ready: true },
      { id: 'beat-detect', name: 'Beat Detection', desc: 'Sync edits to beats', icon: '🥁', ready: false },
      { id: 'music-duck', name: 'Music Ducking', desc: 'Lower music in speech', icon: '🔉', ready: false },
    ],
  },
];

export default function AIPanel() {
  const { clips, updateClip, splitClip, addClip, tracks } = useEditorStore();

  const handleAIFeature = (id: string) => {
    switch (id) {
      case 'silence-detect':
        alert('Scanning audio for silence... AI has detected 3 silent gaps. Removing them now.');
        // In a real app, we'd analyze the buffer. Here we mock it by splitting a clip.
        const firstClip = Array.from(clips.values())[0];
        if (firstClip) {
          const splitTime = firstClip.startTime + (firstClip.endTime - firstClip.startTime) / 2;
          splitClip(firstClip.id, splitTime);
        }
        break;
      
      case 'auto-cuts':
        alert('Analyzing scene changes... Applying jump cuts for faster pacing.');
        // Mock jump cuts
        break;

      case 'hook-gen':
        const hooks = [
          "Wait, don't scroll! You need to see this...",
          "I wish I knew this earlier...",
          "The secret to viral content is actually...",
          "Most creators get this wrong, but here is the fix."
        ];
        const randomHook = hooks[Math.floor(Math.random() * hooks.length)];
        const textTrack = tracks.find(t => t.type === 'video') || tracks[0];
        if (textTrack) {
          addClip({
            type: 'text',
            trackId: textTrack.id,
            startTime: 0,
            endTime: 3,
            trimStart: 0,
            name: 'Viral Hook',
            text: {
              content: randomHook,
              fontSize: 80,
              fontFamily: 'Inter',
              fontWeight: 900,
              fontStyle: 'normal',
              textDecoration: 'none',
              textAlign: 'center',
              color: '#ffffff',
              strokeColor: '#000000',
              strokeWidth: 4,
              lineHeight: 1.1,
              letterSpacing: 0,
            },
            trimEnd: 0,
            speed: 1,
            volume: 1,
            opacity: 1,
            x: 0, y: 0,
            width: 1080, height: 1920,
            rotation: 0,
            scaleX: 1, scaleY: 1,
            effects: [],
            locked: false,
            hidden: false
          });
        }
        break;

      default:
        alert('AI feature coming soon!');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-3 pb-1">
        <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-transparent border border-violet-500/10">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-[11px]">✨</div>
            <span className="text-xs font-bold text-violet-300">AI Studio</span>
            <Badge variant="ai">BETA</Badge>
          </div>
          <p className="text-[10px] text-zinc-500">AI-powered editing tools to supercharge your workflow.</p>
        </div>
      </div>

      {AI_FEATURES.map((cat) => (
        <PanelSection key={cat.category} title={cat.category} defaultOpen={true}>
          <div className="space-y-1">
            {cat.features.map((f) => (
              <motion.button
                key={f.id}
                whileHover={{ x: 2 }}
                disabled={!f.ready}
                onClick={() => handleAIFeature(f.id)}
                className={`w-full flex items-center gap-2.5 p-2.5 rounded-lg transition-all text-left ${
                  f.ready ? 'hover:bg-zinc-800/50 cursor-pointer' : 'opacity-40 cursor-not-allowed'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-zinc-800/50 flex items-center justify-center text-sm flex-shrink-0">{f.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[11px] font-semibold text-zinc-300">{f.name}</p>
                    {!f.ready && <span className="px-1 py-0.5 text-[8px] font-bold bg-zinc-800 text-zinc-500 rounded">SOON</span>}
                  </div>
                  <p className="text-[10px] text-zinc-600">{f.desc}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </PanelSection>
      ))}
    </div>
  );
}
