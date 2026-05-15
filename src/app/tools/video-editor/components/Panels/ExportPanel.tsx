'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useEditorStore } from '../../stores/editorStore';
import { PanelSection, SegmentedControl, Slider } from '../shared/UIComponents';
import type { ExportFormat, ExportQuality } from '../../types/editor';

const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: '📸', ratio: '9:16', maxDur: '90s' },
  { id: 'youtube', name: 'YouTube Shorts', icon: '▶️', ratio: '9:16', maxDur: '60s' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵', ratio: '9:16', maxDur: '10min' },
  { id: 'twitter', name: 'Twitter/X', icon: '🐦', ratio: '16:9', maxDur: '2:20' },
  { id: 'custom', name: 'Custom', icon: '⚙️', ratio: 'Any', maxDur: 'Any' },
];

export default function ExportPanel() {
  const {
    exportSettings, duration, clips,
    setExportSettings, applyPlatformPreset,
  } = useEditorStore();

  const hasContent = clips.size > 0;

  const handleExport = () => {
    if (!hasContent) return;
    useEditorStore.getState().toggleExportModal();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Platform Selection */}
      <PanelSection title="Platform" defaultOpen={true}>
        <div className="space-y-1">
          {PLATFORMS.map((p) => (
            <motion.button
              key={p.id}
              whileHover={{ x: 2 }}
              onClick={() => applyPlatformPreset(p.id)}
              className={`w-full flex items-center gap-2.5 p-2.5 rounded-lg transition-all text-left ${
                exportSettings.platform === p.id
                  ? 'bg-violet-500/10 border border-violet-500/30'
                  : 'hover:bg-zinc-800/50 border border-transparent'
              }`}
            >
              <span className="text-lg">{p.icon}</span>
              <div className="flex-1">
                <p className="text-[11px] font-semibold text-zinc-300">{p.name}</p>
                <p className="text-[9px] text-zinc-600">{p.ratio} · Max {p.maxDur}</p>
              </div>
              {exportSettings.platform === p.id && (
                <div className="w-4 h-4 rounded-full bg-violet-500 flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </PanelSection>

      {/* Quality */}
      <PanelSection title="Quality" defaultOpen={true}>
        <div className="space-y-3">
          <SegmentedControl<ExportQuality>
            options={[
              { value: '720p', label: '720p' },
              { value: '1080p', label: '1080p' },
              { value: '4K', label: '4K' },
            ]}
            value={exportSettings.quality}
            onChange={(v) => setExportSettings({ quality: v })}
          />

          <SegmentedControl<ExportFormat>
            options={[
              { value: 'mp4', label: 'MP4' },
              { value: 'webm', label: 'WebM' },
              { value: 'gif', label: 'GIF' },
            ]}
            value={exportSettings.format}
            onChange={(v) => setExportSettings({ format: v })}
          />

          <Slider
            label="FPS"
            value={exportSettings.fps}
            min={15} max={60} step={5}
            onChange={(v) => setExportSettings({ fps: v })}
          />

          <Slider
            label="Bitrate"
            value={exportSettings.videoBitrate}
            min={1000} max={20000} step={500}
            onChange={(v) => setExportSettings({ videoBitrate: v })}
            formatValue={(v) => `${(v / 1000).toFixed(1)}M`}
          />
        </div>
      </PanelSection>

      {/* Watermark */}
      <PanelSection title="Watermark" defaultOpen={false}>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/30">
            <span className="text-[11px] text-zinc-400">Add watermark</span>
            <button className="w-9 h-5 rounded-full bg-zinc-700 relative">
              <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-zinc-400" />
            </button>
          </div>
          <input
            type="text"
            placeholder="@yourusername"
            className="w-full h-8 px-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300 placeholder:text-zinc-700 focus:border-violet-500 focus:outline-none"
          />
        </div>
      </PanelSection>

      {/* Export Button */}
      <div className="mt-auto px-4 pb-4">
        <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 mb-3">
          <div className="flex items-center justify-between text-[10px] text-zinc-500">
            <span>Duration</span>
            <span className="text-zinc-300 font-mono">{Math.round(duration)}s</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-1">
            <span>Format</span>
            <span className="text-zinc-300 uppercase">{exportSettings.format} · {exportSettings.quality}</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-1">
            <span>Est. size</span>
            <span className="text-zinc-300">~{Math.round(duration * exportSettings.videoBitrate / 8000)} MB</span>
          </div>
        </div>

        <motion.button
          whileHover={hasContent ? { scale: 1.02 } : {}}
          whileTap={hasContent ? { scale: 0.98 } : {}}
          onClick={handleExport}
          disabled={!hasContent}
          className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${
            hasContent
              ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40'
              : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
          }`}
        >
          {hasContent ? '🚀 Export Video' : 'Add content to export'}
        </motion.button>

        <p className="text-[9px] text-zinc-700 text-center mt-2">
          Processed entirely in your browser • No upload needed
        </p>
      </div>
    </div>
  );
}
