'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PanelSection, Slider, ColorPicker } from '../shared/UIComponents';
import { useEditorStore } from '../../stores/editorStore';

const CAPTION_STYLES = [
  { id: 'hormozi', name: 'Hormozi', preview: 'BOLD WHITE', font: 'Inter', weight: 900, color: '#FFF', stroke: '#000', strokeW: 4, bg: '' },
  { id: 'classic', name: 'Classic', preview: 'Clean Sub', font: 'Inter', weight: 600, color: '#FFF', stroke: '', strokeW: 0, bg: 'rgba(0,0,0,0.7)' },
  { id: 'neon', name: 'Neon', preview: 'Glow Text', font: 'Inter', weight: 800, color: '#00ff88', stroke: '', strokeW: 0, bg: '' },
  { id: 'meme', name: 'Meme', preview: 'IMPACT', font: 'Impact', weight: 400, color: '#FFF', stroke: '#000', strokeW: 3, bg: '' },
  { id: 'minimal', name: 'Minimal', preview: 'light text', font: 'Inter', weight: 300, color: '#ccc', stroke: '', strokeW: 0, bg: '' },
  { id: 'karaoke', name: 'Karaoke', preview: 'Word by word', font: 'Inter', weight: 700, color: '#FFD700', stroke: '#000', strokeW: 2, bg: '' },
];

export default function CaptionPanel() {
  const { clips, addClip, tracks } = useEditorStore();
  const [selectedStyle, setSelectedStyle] = useState('hormozi');
  const [captionText, setCaptionText] = useState('');
  const [fontSize, setFontSize] = useState(48);
  const [position, setPosition] = useState<'top' | 'center' | 'bottom'>('bottom');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateCaptions = async () => {
    setIsGenerating(true);
    // Simulate AI thinking
    await new Promise(r => setTimeout(r, 2000));
    
    const style = CAPTION_STYLES.find(s => s.id === selectedStyle) || CAPTION_STYLES[0];
    const textTrack = tracks.find(t => t.type === 'video') || tracks[0];
    
    if (textTrack) {
      // Add a few mock caption segments
      const mockCaptions = [
        { text: "Welcome to", start: 0, end: 1 },
        { text: "the future of", start: 1, end: 2 },
        { text: "content creation!", start: 2, end: 3 },
      ];

      mockCaptions.forEach(cap => {
        addClip({
          type: 'text',
          trackId: textTrack.id,
          startTime: cap.start,
          endTime: cap.end,
          trimStart: 0,
          name: 'AI Caption',
          text: {
            content: cap.text,
            fontSize: fontSize,
            fontFamily: style.font,
            fontWeight: Number(style.weight),
            fontStyle: 'normal',
            textDecoration: 'none',
            textAlign: 'center',
            color: style.color,
            strokeColor: style.stroke || '#000000',
            strokeWidth: style.strokeW,
            backgroundColor: style.bg || undefined,
            lineHeight: 1.2,
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
      });
    }

    setIsGenerating(false);
    alert('AI Captions generated successfully!');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Auto Caption */}
      <PanelSection title="Auto Captions" defaultOpen={true}>
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          disabled={isGenerating}
          onClick={handleGenerateCaptions}
          className={`w-full p-3 rounded-xl bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border border-violet-500/20 hover:border-violet-500/40 transition-all group ${isGenerating ? 'opacity-50 cursor-wait' : ''}`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-sm">
              {isGenerating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '💬'}
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-violet-300">{isGenerating ? 'Analyzing Audio...' : 'Generate Captions'}</p>
              <p className="text-[10px] text-zinc-500">{isGenerating ? 'AI is processing speech' : 'AI-powered speech-to-text'}</p>
            </div>
            <span className="ml-auto px-1.5 py-0.5 text-[8px] font-bold bg-violet-500/20 text-violet-400 rounded border border-violet-500/20">AI</span>
          </div>
        </motion.button>

        <div className="mt-2">
          <textarea
            value={captionText}
            onChange={(e) => setCaptionText(e.target.value)}
            placeholder="Or type captions manually..."
            className="w-full h-20 px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300 resize-none placeholder:text-zinc-700 focus:border-violet-500 focus:outline-none"
          />
        </div>
      </PanelSection>

      {/* Caption Styles */}
      <PanelSection title="Caption Style" defaultOpen={true}>
        <div className="grid grid-cols-2 gap-1.5">
          {CAPTION_STYLES.map((style) => (
            <motion.button
              key={style.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedStyle(style.id)}
              className={`p-2.5 rounded-lg text-center transition-all border ${
                selectedStyle === style.id
                  ? 'border-violet-500/50 bg-violet-500/10'
                  : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-600'
              }`}
            >
              <span
                className="text-sm block truncate"
                style={{
                  fontFamily: style.font,
                  fontWeight: style.weight,
                  color: style.color,
                  WebkitTextStroke: style.stroke ? `${style.strokeW * 0.2}px ${style.stroke}` : undefined,
                  textShadow: style.id === 'neon' ? `0 0 10px ${style.color}` : undefined,
                  backgroundColor: style.bg || undefined,
                  padding: style.bg ? '2px 6px' : undefined,
                  borderRadius: style.bg ? '4px' : undefined,
                }}
              >
                {style.preview}
              </span>
              <p className="text-[9px] text-zinc-600 mt-1">{style.name}</p>
            </motion.button>
          ))}
        </div>
      </PanelSection>

      {/* Settings */}
      <PanelSection title="Settings" defaultOpen={true}>
        <div className="space-y-3">
          <Slider label="Size" value={fontSize} min={16} max={120} step={2} onChange={setFontSize} formatValue={(v) => `${v}px`} />

          <div>
            <p className="text-[10px] text-zinc-500 mb-1.5">Position</p>
            <div className="flex gap-1">
              {(['top', 'center', 'bottom'] as const).map((pos) => (
                <button
                  key={pos}
                  onClick={() => setPosition(pos)}
                  className={`flex-1 py-1.5 text-[10px] font-medium rounded-lg capitalize transition-colors ${
                    position === pos
                      ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                      : 'bg-zinc-900 text-zinc-500 border border-zinc-800 hover:border-zinc-600'
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>
        </div>
      </PanelSection>

      {/* Emoji Options */}
      <PanelSection title="Auto Emojis" defaultOpen={false}>
        <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/30">
          <span className="text-[11px] text-zinc-400">Add emojis to captions</span>
          <button className="w-9 h-5 rounded-full bg-zinc-700 relative transition-colors">
            <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-zinc-400 transition-transform" />
          </button>
        </div>
        <p className="text-[10px] text-zinc-600 mt-1.5 px-1">AI detects context and adds relevant emojis automatically</p>
      </PanelSection>
    </div>
  );
}
