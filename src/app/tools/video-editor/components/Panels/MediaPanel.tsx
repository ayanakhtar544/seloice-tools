'use client';

import React, { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditorStore } from '../../stores/editorStore';
import { PanelSection } from '../shared/UIComponents';
import {
  generateId, getMediaType, createBlobUrl, getVideoMetadata,
  getAudioDuration, generateVideoThumbnail, formatFileSize, formatDuration,
} from '../../utils/helpers';
import type { MediaAsset, TimelineClip } from '../../types/editor';
import { CANVAS_DIMENSIONS } from '../../types/editor';

const UploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const VideoIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>;
const ImageIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>;
const AudioIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>;
const TrashIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>;
const PlusIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
const TimelineIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"/><line x1="6" y1="6" x2="6" y2="18"/><line x1="14" y1="6" x2="14" y2="18"/></svg>;

export default function MediaPanel() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const mediaAssets = useEditorStore((s) => s.mediaAssets);
  const importProgress = useEditorStore((s) => s.importProgress);
  const project = useEditorStore((s) => s.project);
  const tracks = useEditorStore((s) => s.tracks);
  const addMediaAsset = useEditorStore((s) => s.addMediaAsset);
  const removeMediaAsset = useEditorStore((s) => s.removeMediaAsset);
  const setImportProgress = useEditorStore((s) => s.setImportProgress);
  const addTrack = useEditorStore((s) => s.addTrack);
  const addClip = useEditorStore((s) => s.addClip);

  const assets = Array.from(mediaAssets.values());
  const dimensions = CANVAS_DIMENSIONS[project.aspectRatio];

  // Process file — ONLY adds to media library, NOT to timeline
  const processFile = useCallback(async (file: File) => {
    const mediaType = getMediaType(file.type);
    const id = generateId();
    setIsProcessing(true);
    setImportProgress(10);

    try {
      const blobUrl = createBlobUrl(file);
      let duration = 0;
      let width = 0;
      let height = 0;
      let thumbnailUrl = '';

      if (mediaType === 'video') {
        setImportProgress(30);
        const meta = await getVideoMetadata(file);
        duration = meta.duration;
        width = meta.width;
        height = meta.height;
        setImportProgress(60);
        try {
          thumbnailUrl = await generateVideoThumbnail(file, 0.5);
        } catch { /* continue without thumbnail */ }
      } else if (mediaType === 'audio') {
        setImportProgress(40);
        duration = await getAudioDuration(file);
      } else if (mediaType === 'image') {
        setImportProgress(40);
        const img = new Image();
        await new Promise<void>((resolve, reject) => {
          img.onload = () => { width = img.width; height = img.height; resolve(); };
          img.onerror = () => reject(new Error('Failed to load image'));
          img.src = blobUrl;
        });
        thumbnailUrl = blobUrl;
      }

      setImportProgress(80);

      const asset: MediaAsset = {
        id, name: file.name, type: mediaType, mimeType: file.type,
        size: file.size, blob: file, blobUrl, thumbnailUrl,
        duration, width, height, createdAt: Date.now(),
      };

      addMediaAsset(asset);
      setImportProgress(100);
    } catch (err) {
      console.error('Failed to process file:', err);
    } finally {
      setIsProcessing(false);
      setTimeout(() => setImportProgress(0), 1000);
    }
  }, [addMediaAsset, setImportProgress]);

  // Add asset to timeline — called explicitly by user
  const addToTimeline = useCallback((asset: MediaAsset) => {
    const mediaType = asset.type;
    const trackType = mediaType === 'image' ? 'video' : mediaType;

    let trackId: string;
    const existingTrack = tracks.find((t) => t.type === trackType);
    if (existingTrack) {
      trackId = existingTrack.id;
    } else {
      trackId = addTrack(trackType);
    }

    // Calculate start time (append after last clip on track)
    const track = useEditorStore.getState().tracks.find((t) => t.id === trackId);
    let startTime = 0;
    if (track) {
      const trackClips = track.clips.map((cid) => useEditorStore.getState().clips.get(cid)).filter(Boolean);
      const maxEnd = trackClips.reduce((max, c) => Math.max(max, c!.endTime), 0);
      startTime = maxEnd;
    }

    const clipDuration = asset.duration || 5;

    const newClip: Omit<TimelineClip, 'id'> = {
      trackId,
      mediaId: asset.id,
      type: trackType,
      name: asset.name.replace(/\.[^.]+$/, ''),
      startTime,
      endTime: startTime + clipDuration,
      trimStart: 0,
      trimEnd: 0,
      speed: 1,
      volume: 1,
      opacity: 1,
      x: 0, y: 0,
      width: dimensions.width,
      height: dimensions.height,
      rotation: 0,
      scaleX: 1, scaleY: 1,
      effects: [],
      locked: false,
      hidden: false,
    };

    addClip(newClip);
  }, [tracks, addTrack, addClip, dimensions]);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    for (const file of fileArray) {
      await processFile(file);
    }
  }, [processFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
      e.target.value = '';
    }
  }, [handleFiles]);

  const typeIcon = (type: string) => {
    switch (type) {
      case 'video': return <VideoIcon />;
      case 'image': return <ImageIcon />;
      case 'audio': return <AudioIcon />;
      default: return <VideoIcon />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <PanelSection title="Import" defaultOpen={true}>
        {/* Drop zone */}
        <div
          className={`relative border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer ${
            isDragOver
              ? 'border-violet-500 bg-violet-500/10'
              : 'border-zinc-800 hover:border-zinc-600 bg-zinc-900/30'
          }`}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*,audio/*,image/*"
            multiple
            className="hidden"
            onChange={handleFileInput}
          />

          <div className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              isDragOver ? 'bg-violet-500/20 text-violet-400' : 'bg-zinc-800 text-zinc-500'
            }`}>
              <UploadIcon />
            </div>
            <div>
              <p className="text-xs font-medium text-zinc-300">Drop files here</p>
              <p className="text-[10px] text-zinc-600 mt-0.5">Video, images, or audio</p>
            </div>
          </div>

          <AnimatePresence>
            {importProgress > 0 && importProgress < 100 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800 rounded-b-xl overflow-hidden"
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${importProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {isProcessing && (
          <div className="flex items-center gap-2 mt-2 px-1">
            <div className="w-3 h-3 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-[10px] text-zinc-500">Processing media...</span>
          </div>
        )}
      </PanelSection>

      <PanelSection title={`Media Library (${assets.length})`} defaultOpen={true}>
        {assets.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-[11px] text-zinc-600">No media imported yet</p>
            <p className="text-[10px] text-zinc-700 mt-1">Files appear here after upload</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-1.5">
            {assets.map((asset) => (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group relative rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-colors"
              >
                {/* Thumbnail */}
                <div className="aspect-video bg-zinc-950 flex items-center justify-center">
                  {asset.thumbnailUrl ? (
                    <img src={asset.thumbnailUrl} alt={asset.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-zinc-700">{typeIcon(asset.type)}</div>
                  )}
                </div>

                {/* Info */}
                <div className="p-1.5">
                  <p className="text-[10px] font-medium text-zinc-400 truncate">{asset.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-[9px] text-zinc-600">{formatFileSize(asset.size)}</span>
                    {asset.duration && <span className="text-[9px] text-zinc-600">· {formatDuration(asset.duration)}</span>}
                    {asset.width && asset.height && (
                      <span className="text-[9px] text-zinc-600">· {asset.width}×{asset.height}</span>
                    )}
                  </div>

                  {/* Add to Timeline button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); addToTimeline(asset); }}
                    className="w-full mt-1.5 flex items-center justify-center gap-1 px-2 py-1 text-[10px] font-semibold text-violet-300 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 rounded-md transition-colors"
                  >
                    <TimelineIcon />
                    Add to Timeline
                  </button>
                </div>

                {/* Type badge */}
                <div className="absolute top-1 left-1 px-1 py-0.5 text-[8px] font-bold uppercase bg-black/60 backdrop-blur-sm rounded text-zinc-400">
                  {asset.type}
                </div>

                {/* Delete button */}
                <button
                  onClick={(e) => { e.stopPropagation(); removeMediaAsset(asset.id); }}
                  className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center rounded bg-red-500/0 hover:bg-red-500/80 text-transparent hover:text-white transition-all opacity-0 group-hover:opacity-100"
                >
                  <TrashIcon />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </PanelSection>

      <PanelSection title="Stock Media" defaultOpen={false}>
        <div className="text-center py-4">
          <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center mx-auto mb-2">
            <PlusIcon />
          </div>
          <p className="text-[11px] text-zinc-500">Free stock videos & music</p>
          <p className="text-[10px] text-zinc-700 mt-0.5">Coming soon</p>
        </div>
      </PanelSection>
    </div>
  );
}
