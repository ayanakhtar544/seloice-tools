'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useEditorStore } from '../../stores/editorStore';
import { PanelSection, Slider, ColorPicker } from '../shared/UIComponents';
import { TEXT_PRESETS, CANVAS_DIMENSIONS } from '../../types/editor';
import type { TextProperties, TimelineClip } from '../../types/editor';
import { generateId } from '../../utils/helpers';

const TypeIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 7 4 4 20 4 20 7" /><line x1="9" y1="20" x2="15" y2="20" /><line x1="12" y1="4" x2="12" y2="20" /></svg>;
const BoldIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" /><path d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" /></svg>;
const ItalicIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="4" x2="10" y2="4" /><line x1="14" y1="20" x2="5" y2="20" /><line x1="15" y1="4" x2="9" y2="20" /></svg>;
const AlignLeftIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="17" y1="10" x2="3" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="17" y1="18" x2="3" y2="18" /></svg>;
const AlignCenterIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="10" x2="6" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="18" y1="18" x2="6" y2="18" /></svg>;
const AlignRightIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="21" y1="10" x2="7" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="21" y1="18" x2="7" y2="18" /></svg>;

const FONTS = [
  'Inter', 'Impact', 'Arial', 'Georgia', 'Courier New',
  'Verdana', 'Times New Roman', 'Trebuchet MS', 'Comic Sans MS',
];

export default function TextPanel() {
  const {
    clips, selectedClipIds, tracks, project, currentTime,
    addTrack, addClip, updateClipText, updateClip,
  } = useEditorStore();

  const dimensions = CANVAS_DIMENSIONS[project.aspectRatio];
  const selectedClip = selectedClipIds.length === 1 ? clips.get(selectedClipIds[0]) : null;
  const isTextClip = selectedClip?.type === 'text';

  const addTextClip = (preset?: typeof TEXT_PRESETS[0]) => {
    let trackId = tracks.find((t) => t.type === 'text')?.id;
    if (!trackId) trackId = addTrack('text');

    const textProps: TextProperties = {
      content: preset ? preset.name : 'Your text here',
      fontFamily: preset?.style.fontFamily || 'Inter',
      fontSize: preset?.style.fontSize || 48,
      fontWeight: preset?.style.fontWeight || 700,
      fontStyle: 'normal',
      textDecoration: 'none',
      textAlign: (preset?.style.textAlign as TextProperties['textAlign']) || 'center',
      color: preset?.style.color || '#FFFFFF',
      backgroundColor: preset?.style.backgroundColor,
      strokeColor: preset?.style.strokeColor,
      strokeWidth: preset?.style.strokeWidth || 0,
      shadowColor: preset?.style.shadowColor as string | undefined,
      shadowBlur: preset?.style.shadowBlur || 0,
      shadowOffsetX: (preset?.style as any)?.shadowOffsetX || 0,
      shadowOffsetY: (preset?.style as any)?.shadowOffsetY || 0,
      lineHeight: preset?.style.lineHeight || 1.2,
      letterSpacing: preset?.style.letterSpacing || 0,
    };

    const newClip: Omit<TimelineClip, 'id'> = {
      trackId,
      type: 'text',
      name: preset ? preset.name : 'Text',
      startTime: currentTime,
      endTime: currentTime + 5,
      trimStart: 0,
      trimEnd: 0,
      speed: 1,
      volume: 0,
      opacity: 1,
      x: dimensions.width * 0.1,
      y: dimensions.height * 0.4,
      width: dimensions.width * 0.8,
      height: dimensions.height * 0.2,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      effects: [],
      text: textProps,
      locked: false,
      hidden: false,
    };

    addClip(newClip);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Text Presets */}
      <PanelSection title="Text Styles" defaultOpen={true}>
        <div className="space-y-1.5">
          {/* Add plain text */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => addTextClip()}
            className="w-full flex items-center gap-2.5 p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400 group-hover:bg-violet-500/20 transition-colors">
              <TypeIcon />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-zinc-300">Add Text</p>
              <p className="text-[10px] text-zinc-600">Plain text overlay</p>
            </div>
          </motion.button>

          {/* Presets */}
          <div className="grid grid-cols-1 gap-1">
            {TEXT_PRESETS.map((preset) => (
              <motion.button
                key={preset.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => addTextClip(preset)}
                className="w-full p-2.5 rounded-lg bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-600 transition-all text-left"
              >
                <span
                  className="text-sm truncate block"
                  style={{
                    fontFamily: preset.style.fontFamily,
                    fontWeight: preset.style.fontWeight,
                    color: preset.style.color,
                    textShadow: preset.style.shadowColor ? `0 0 ${preset.style.shadowBlur || 10}px ${preset.style.shadowColor}` : undefined,
                    WebkitTextStroke: preset.style.strokeColor ? `${(preset.style.strokeWidth || 1) * 0.3}px ${preset.style.strokeColor}` : undefined,
                    letterSpacing: `${preset.style.letterSpacing}px`,
                  }}
                >
                  {preset.name}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </PanelSection>

      {/* Text Editor (when text clip selected) */}
      {isTextClip && selectedClip?.text && (
        <>
          <PanelSection title="Edit Text" defaultOpen={true}>
            <textarea
              value={selectedClip.text.content}
              onChange={(e) => updateClipText(selectedClip.id, { content: e.target.value })}
              className="w-full h-20 px-3 py-2 text-sm bg-zinc-900 border border-zinc-700 rounded-lg text-white resize-none focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/30"
              placeholder="Type your text..."
            />
          </PanelSection>

          <PanelSection title="Font" defaultOpen={true}>
            <div className="space-y-2">
              <select
                value={selectedClip.text.fontFamily}
                onChange={(e) => updateClipText(selectedClip.id, { fontFamily: e.target.value })}
                className="w-full h-8 px-2 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-300 focus:border-violet-500 focus:outline-none"
              >
                {FONTS.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>

              <Slider
                label="Size"
                value={selectedClip.text.fontSize}
                min={12}
                max={200}
                step={1}
                onChange={(v) => updateClipText(selectedClip.id, { fontSize: v })}
                formatValue={(v) => `${v}px`}
              />

              <Slider
                label="Weight"
                value={selectedClip.text.fontWeight}
                min={100}
                max={900}
                step={100}
                onChange={(v) => updateClipText(selectedClip.id, { fontWeight: v })}
              />

              {/* Style buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => updateClipText(selectedClip.id, {
                    fontWeight: selectedClip.text!.fontWeight >= 700 ? 400 : 700,
                  })}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                    selectedClip.text.fontWeight >= 700 ? 'bg-violet-500/20 text-violet-400' : 'bg-zinc-800 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <BoldIcon />
                </button>
                <button
                  onClick={() => updateClipText(selectedClip.id, {
                    fontStyle: selectedClip.text!.fontStyle === 'italic' ? 'normal' : 'italic',
                  })}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                    selectedClip.text.fontStyle === 'italic' ? 'bg-violet-500/20 text-violet-400' : 'bg-zinc-800 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <ItalicIcon />
                </button>
                <div className="w-px h-5 bg-zinc-700 mx-1" />
                {(['left', 'center', 'right'] as const).map((align) => (
                  <button
                    key={align}
                    onClick={() => updateClipText(selectedClip.id, { textAlign: align })}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                      selectedClip.text!.textAlign === align ? 'bg-violet-500/20 text-violet-400' : 'bg-zinc-800 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {align === 'left' ? <AlignLeftIcon /> : align === 'center' ? <AlignCenterIcon /> : <AlignRightIcon />}
                  </button>
                ))}
              </div>

              <Slider label="Line H" value={selectedClip.text.lineHeight} min={0.5} max={3} step={0.1} onChange={(v) => updateClipText(selectedClip.id, { lineHeight: v })} />
              <Slider label="Spacing" value={selectedClip.text.letterSpacing} min={-5} max={20} step={0.5} onChange={(v) => updateClipText(selectedClip.id, { letterSpacing: v })} formatValue={(v) => `${v}px`} />
            </div>
          </PanelSection>

          <PanelSection title="Colors" defaultOpen={true}>
            <div className="space-y-3">
              <ColorPicker label="Text Color" value={selectedClip.text.color} onChange={(v) => updateClipText(selectedClip.id, { color: v })} />
              <ColorPicker label="Stroke" value={selectedClip.text.strokeColor || '#000000'} onChange={(v) => updateClipText(selectedClip.id, { strokeColor: v })} />
              <Slider label="Stroke W" value={selectedClip.text.strokeWidth || 0} min={0} max={20} step={0.5} onChange={(v) => updateClipText(selectedClip.id, { strokeWidth: v })} formatValue={(v) => `${v}px`} />
            </div>
          </PanelSection>

          <PanelSection title="Shadow" defaultOpen={false}>
            <div className="space-y-2">
              <ColorPicker label="Shadow Color" value={selectedClip.text.shadowColor || '#000000'} onChange={(v) => updateClipText(selectedClip.id, { shadowColor: v })} />
              <Slider label="Blur" value={selectedClip.text.shadowBlur || 0} min={0} max={50} step={1} onChange={(v) => updateClipText(selectedClip.id, { shadowBlur: v })} />
              <Slider label="X" value={selectedClip.text.shadowOffsetX || 0} min={-20} max={20} step={1} onChange={(v) => updateClipText(selectedClip.id, { shadowOffsetX: v })} />
              <Slider label="Y" value={selectedClip.text.shadowOffsetY || 0} min={-20} max={20} step={1} onChange={(v) => updateClipText(selectedClip.id, { shadowOffsetY: v })} />
            </div>
          </PanelSection>

          <PanelSection title="Position" defaultOpen={false}>
            <div className="space-y-2">
              <Slider label="Opacity" value={selectedClip.opacity} min={0} max={1} step={0.05} onChange={(v) => updateClip(selectedClip.id, { opacity: v })} formatValue={(v) => `${Math.round(v * 100)}%`} />
              <Slider label="Rotation" value={selectedClip.rotation} min={-180} max={180} step={1} onChange={(v) => updateClip(selectedClip.id, { rotation: v })} formatValue={(v) => `${v}°`} />
            </div>
          </PanelSection>
        </>
      )}
    </div>
  );
}
