// File: src/app/tools/video-editor/stores/editorStore.ts
import type { 
  AspectRatio, MediaAsset, TimelineClip, TimelineTrack, ProjectSettings, 
  ExportSettings, ExportJob, PanelTab, TrackType, ClipEffect, 
  TextProperties, HistoryEntry 
} from '../types/editor';
import { PLATFORM_PRESETS } from '../types/editor';
import { generateId } from '../utils/helpers';
import { create } from 'zustand';
import { subscribeWithSelector, persist } from 'zustand/middleware';

interface EditorState {
  project: ProjectSettings;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  isSeeking: boolean;
  playbackRate: number;
  volume: number;
  isMuted: boolean;
  mediaAssets: Map<string, MediaAsset>;
  importProgress: number;
  tracks: TimelineTrack[];
  clips: Map<string, TimelineClip>;
  selectedClipIds: string[];
  selectedTrackId: string | null;
  zoomLevel: number;
  scrollPosition: number;
  snapEnabled: boolean;
  magneticEnabled: boolean;
  activePanel: PanelTab;
  isPanelOpen: boolean;
  isTimelineExpanded: boolean;
  isMobileView: boolean;
  showSafeZone: boolean;
  previewScale: number;
  isExportModalOpen: boolean;
  isFullScreen: boolean;
  exportSettings: ExportSettings;
  exportQueue: ExportJob[];
  undoStack: any[];
  redoStack: any[];
  isLoading: boolean;
  isDirty: boolean;
  lastSavedAt: number | null;
  transitions: Map<string, { id: string; type: string; duration: number; afterClipId: string }>;
}

interface EditorActions {
  setProject: (updates: Partial<ProjectSettings>) => void;
  setAspectRatio: (ratio: AspectRatio) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setDuration: (d: number) => void;
  setPlaybackRate: (rate: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  addMediaAsset: (asset: MediaAsset) => void;
  removeMediaAsset: (id: string) => void;
  setImportProgress: (p: number) => void;
  addTrack: (type: TrackType, name?: string) => string;
  removeTrack: (id: string) => void;
  reorderTrack: (id: string, newOrder: number) => void;
  toggleTrackLock: (id: string) => void;
  toggleTrackMute: (id: string) => void;
  toggleTrackVisibility: (id: string) => void;
  addClip: (clip: Omit<TimelineClip, 'id'>) => string;
  updateClip: (id: string, updates: Partial<TimelineClip>) => void;
  removeClip: (id: string) => void;
  splitClip: (id: string, time: number) => void;
  duplicateClip: (id: string) => void;
  selectClip: (id: string, multi?: boolean) => void;
  deselectAll: () => void;
  moveClip: (id: string, startTime: number, trackId?: string) => void;
  trimClipStart: (id: string, newStart: number) => void;
  trimClipEnd: (id: string, newEnd: number) => void;
  addEffectToClip: (clipId: string, effect: ClipEffect) => void;
  removeEffectFromClip: (clipId: string, effectId: string) => void;
  updateClipText: (clipId: string, text: Partial<TextProperties>) => void;
  setActivePanel: (panel: PanelTab) => void;
  togglePanel: () => void;
  setMobileView: (v: boolean) => void;
  setZoomLevel: (z: number) => void;
  setScrollPosition: (p: number) => void;
  toggleSnapEnabled: () => void;
  toggleMagnetic: () => void;
  toggleSafeZone: () => void;
  setPreviewScale: (s: number) => void;
  setTimelineExpanded: (expanded: boolean) => void;
  toggleExportModal: () => void;
  toggleFullScreen: () => void;
  setExportSettings: (s: Partial<ExportSettings>) => void;
  applyPlatformPreset: (platform: string) => void;
  addExportJob: (job: ExportJob) => void;
  updateExportJob: (id: string, updates: Partial<ExportJob>) => void;
  removeExportJob: (id: string) => void;
  undo: () => void;
  redo: () => void;
  recalculateDuration: () => void;
  reset: () => void;
  repackTrack: (trackId: string) => void;
  addTransition: (afterClipId: string, type: string, duration: number) => void;
  removeTransition: (afterClipId: string) => void;
  restoreMediaAssets: () => Promise<void>;
}

const initialState: EditorState = {
  project: { id: generateId(), name: 'Untitled Project', aspectRatio: '9:16', resolution: '1080p', fps: 30, backgroundColor: '#000000', createdAt: Date.now(), updatedAt: Date.now() },
  currentTime: 0, duration: 0, isPlaying: false, isSeeking: false, playbackRate: 1, volume: 1, isMuted: false,
  mediaAssets: new Map(), importProgress: 0, tracks: [], clips: new Map(), selectedClipIds: [], selectedTrackId: null,
  zoomLevel: 1, scrollPosition: 0, snapEnabled: true, magneticEnabled: true, activePanel: 'media', isPanelOpen: true,
  isTimelineExpanded: true, isMobileView: false, isExportModalOpen: false, isFullScreen: false, showSafeZone: false, previewScale: 0.35,
  exportSettings: PLATFORM_PRESETS.instagram, exportQueue: [], undoStack: [], redoStack: [], isLoading: false, isDirty: false, lastSavedAt: null,
  transitions: new Map(),
};

// 🔥 HELPER FUNCTION FOR DEEP STATE SNAPSHOTTING (Senior Developer Architecture)
const createSnapshot = (s: EditorState) => {
  return {
    project: { ...s.project },
    tracks: JSON.parse(JSON.stringify(s.tracks)),
    clips: new Map(s.clips),
    transitions: new Map(s.transitions),
  };
};

export const useEditorStore = create<EditorState & EditorActions>()(
  persist(
    subscribeWithSelector((set, get) => ({
      ...initialState,
      
      restoreMediaAssets: async () => {
        const state = get();
        const updatedMediaAssets = new Map(state.mediaAssets);
        let elementsChanged = false;

        for (const [id, asset] of Array.from(updatedMediaAssets.entries())) {
          if (asset.url && (asset.url.startsWith('http://') || asset.url.startsWith('https://'))) {
            if (asset.blobUrl !== asset.url) {
              updatedMediaAssets.set(id, { ...asset, blobUrl: asset.url });
              elementsChanged = true;
            }
          } else {
            const { getAssetFromDB } = await import('../utils/indexedDB');
            const blob = await getAssetFromDB(id);
            if (blob) {
              const newBlobUrl = URL.createObjectURL(blob);
              updatedMediaAssets.set(id, { ...asset, blob, blobUrl: newBlobUrl });
              elementsChanged = true;
            }
          }
        }
        if (elementsChanged) set({ mediaAssets: updatedMediaAssets });
      },

      addTransition: (afterClipId, type, duration) => set((s) => {
        const snap = createSnapshot(s);
        const newTransitions = new Map(s.transitions);
        newTransitions.set(afterClipId, { id: generateId(), type, duration, afterClipId });
        return { transitions: newTransitions, undoStack: [...s.undoStack, snap], redoStack: [], isDirty: true };
      }),
      
      removeTransition: (afterClipId) => set((s) => {
        const snap = createSnapshot(s);
        const newTransitions = new Map(s.transitions);
        newTransitions.delete(afterClipId);
        return { transitions: newTransitions, undoStack: [...s.undoStack, snap], redoStack: [], isDirty: true };
      }),

      repackTrack: (trackId: string) => set((s) => {
        if (!s.magneticEnabled) return s;
        const track = s.tracks.find(t => t.id === trackId);
        if (!track || track.locked) return s;
        const trackClips = track.clips.map(cid => s.clips.get(cid)!).filter(Boolean);
        trackClips.sort((a, b) => a.startTime - b.startTime);
        const newClips = new Map(s.clips);
        let currentStart = 0;
        trackClips.forEach(clip => {
          const duration = clip.endTime - clip.startTime;
          newClips.set(clip.id, { ...clip, startTime: currentStart, endTime: currentStart + duration });
          currentStart += duration; 
        });
        return { clips: newClips, isDirty: true };
      }),

      setProject: (updates) => set((s) => ({ project: { ...s.project, ...updates, updatedAt: Date.now() }, isDirty: true })),
      setAspectRatio: (ratio) => set((s) => ({ project: { ...s.project, aspectRatio: ratio, updatedAt: Date.now() }, isDirty: true })),
      play: () => set({ isPlaying: true }),
      pause: () => set({ isPlaying: false }),
      togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
      seek: (time) => set({ currentTime: Math.max(0, time), isSeeking: false }),
      setDuration: (d) => set({ duration: d }),
      setPlaybackRate: (rate) => set({ playbackRate: rate }),
      setVolume: (vol) => set({ volume: Math.max(0, Math.min(1, vol)) }),
      toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
      stepForward: () => set((s) => ({ currentTime: Math.min(s.currentTime + 1 / s.project.fps, s.duration) })),
      stepBackward: () => set((s) => ({ currentTime: Math.max(s.currentTime - 1 / s.project.fps, 0) })),
      
      addMediaAsset: (asset) => {
        set((s) => { const m = new Map(s.mediaAssets); m.set(asset.id, asset); return { mediaAssets: m }; });
        if (asset.blob) {
          import('../utils/indexedDB').then(({ saveAssetToDB }) => { saveAssetToDB(asset.id, asset.blob!); });
        }
      },
      removeMediaAsset: (id) => set((s) => {
        const m = new Map(s.mediaAssets); m.delete(id);
        import('../utils/indexedDB').then(({ deleteAssetFromDB }) => { deleteAssetFromDB(id); });
        return { mediaAssets: m, isDirty: true };
      }),
      setImportProgress: (p) => set({ importProgress: p }),
      
      addTrack: (type, name) => {
        const id = generateId();
        set((s) => ({ tracks: [...s.tracks, { id, type, name: name || `${type} track`, order: s.tracks.length, locked: false, muted: false, visible: true, solo: false, height: type === 'audio' ? 48 : 64, clips: [] }], isDirty: true }));
        return id;
      },
      removeTrack: (id) => set((s) => {
        const snap = createSnapshot(s);
        const track = s.tracks.find((t) => t.id === id);
        if (!track) return s;
        const newClips = new Map(s.clips);
        track.clips.forEach((cid) => newClips.delete(cid));
        return { tracks: s.tracks.filter((t) => t.id !== id), clips: newClips, selectedClipIds: s.selectedClipIds.filter((cid) => !track.clips.includes(cid)), undoStack: [...s.undoStack, snap], redoStack: [], isDirty: true };
      }),
      reorderTrack: (id, newOrder) => set((s) => {
        const sorted = [...s.tracks].sort((a, b) => a.order - b.order);
        const idx = sorted.findIndex((t) => t.id === id);
        if (idx === -1) return s;
        const [item] = sorted.splice(idx, 1);
        sorted.splice(newOrder, 0, item);
        return { tracks: sorted.map((t, i) => ({ ...t, order: i })), isDirty: true };
      }),
      toggleTrackLock: (id) => set((s) => ({ tracks: s.tracks.map((t) => (t.id === id ? { ...t, locked: !t.locked } : t)) })),
      toggleTrackMute: (id) => set((s) => ({ tracks: s.tracks.map((t) => (t.id === id ? { ...t, muted: !t.muted } : t)) })),
      toggleTrackVisibility: (id) => set((s) => ({ tracks: s.tracks.map((t) => (t.id === id ? { ...t, visible: !t.visible } : t)) })),
      
      // 🔥 FIX 2: MULTI-LAYER OVERLAPPING ENGINE (FOR TEXT & AUDIO BOTH)
      addClip: (clipData) => {
        const snap = createSnapshot(get());
        const id = generateId();
        let finalTrackId = clipData.trackId;

        if (clipData.type === 'text' || clipData.type === 'audio') {
          const currentTracks = get().tracks;
          const currentClips = get().clips;
          const targetTrack = currentTracks.find(t => t.id === finalTrackId);

          if (targetTrack) {
            const hasOverlap = targetTrack.clips.some(cid => {
              const c = currentClips.get(cid);
              if (!c) return false;
              return (clipData.startTime >= c.startTime && clipData.startTime < c.endTime) ||
                     (clipData.endTime > c.startTime && clipData.endTime <= c.endTime);
            });

            if (hasOverlap) {
              const altTrack = currentTracks.find(t => t.type === clipData.type && !t.clips.some(cid => {
                const c = currentClips.get(cid);
                if (!c) return false;
                return (clipData.startTime >= c.startTime && clipData.startTime < c.endTime) ||
                       (clipData.endTime > c.startTime && clipData.endTime <= c.endTime);
              }));

              if (altTrack) {
                finalTrackId = altTrack.id;
              } else {
                finalTrackId = generateId();
                const count = currentTracks.filter(t => t.type === clipData.type).length;
                const newTrack = {
                  id: finalTrackId, type: clipData.type,
                  name: `${clipData.type === 'text' ? 'Text' : 'Audio'} Layer ${count + 1}`,
                  order: currentTracks.length, locked: false, muted: false, visible: true, solo: false,
                  height: clipData.type === 'audio' ? 48 : 64, clips: []
                };
                set((s) => ({ tracks: [...s.tracks, newTrack] }));
              }
            }
          }
        }

        const clip: TimelineClip = { ...clipData, id, trackId: finalTrackId } as TimelineClip;
        set((s) => {
          const newClips = new Map(s.clips);
          newClips.set(id, clip);
          return { 
            clips: newClips, 
            tracks: s.tracks.map((t) => t.id === clip.trackId ? { ...t, clips: [...t.clips, id] } : t), 
            undoStack: [...s.undoStack.slice(-49), snap],
            redoStack: [],
            isDirty: true 
          };
        });
        get().repackTrack(clip.trackId);
        get().recalculateDuration();
        return id;
      },
      
      updateClip: (id, updates) => {
        const snap = createSnapshot(get());
        set((s) => {
          const newClips = new Map(s.clips);
          const clip = newClips.get(id);
          if (!clip) return s;
          newClips.set(id, { ...clip, ...updates });
          return { clips: newClips, undoStack: [...s.undoStack.slice(-49), snap], redoStack: [], isDirty: true };
        });
        const clip = get().clips.get(id);
        if (clip) get().repackTrack(clip.trackId);
        get().recalculateDuration();
      },
      
      removeClip: (id) => {
        const snap = createSnapshot(get());
        let tid = '';
        set((s) => {
          const clip = s.clips.get(id);
          if (!clip) return s;
          tid = clip.trackId;
          const newClips = new Map(s.clips);
          newClips.delete(id);
          return { clips: newClips, tracks: s.tracks.map((t) => t.id === clip.trackId ? { ...t, clips: t.clips.filter((c) => c !== id) } : t), selectedClipIds: s.selectedClipIds.filter((c) => c !== id), undoStack: [...s.undoStack.slice(-49), snap], redoStack: [], isDirty: true };
        });
        get().repackTrack(tid);
        get().recalculateDuration();
      },
      
      splitClip: (id, time) => {
        const state = get(); const clip = state.clips.get(id);
        if (!clip || time <= clip.startTime || time >= clip.endTime) return;
        const relativeTime = time - clip.startTime;
        state.updateClip(id, { endTime: time });
        state.addClip({ ...clip, trackId: clip.trackId, startTime: time, endTime: clip.endTime, trimStart: clip.trimStart + relativeTime, name: `${clip.name} (split)` });
      },
      
      duplicateClip: (id) => {
        const clip = get().clips.get(id);
        if (!clip) return;
        get().addClip({ ...clip, startTime: clip.endTime, endTime: clip.endTime + (clip.endTime - clip.startTime), name: `${clip.name} (copy)` });
      },
      
      selectClip: (id, multi) => set((s) => ({ selectedClipIds: multi ? s.selectedClipIds.includes(id) ? s.selectedClipIds.filter((c) => c !== id) : [...s.selectedClipIds, id] : [id] })),
      deselectAll: () => set({ selectedClipIds: [] }),
      
      moveClip: (id, startTime, trackId) => {
        const snap = createSnapshot(get());
        set((s) => {
          const clip = s.clips.get(id);
          if (!clip) return s;
          const newClips = new Map(s.clips);
          newClips.set(id, { ...clip, startTime, endTime: startTime + (clip.endTime - clip.startTime), trackId: trackId || clip.trackId });
          let tracks = s.tracks;
          if (trackId && trackId !== clip.trackId) {
            tracks = tracks.map((t) => {
              if (t.id === clip.trackId) return { ...t, clips: t.clips.filter((c) => c !== id) };
              if (t.id === trackId) return { ...t, clips: [...t.clips, id] };
              return t;
            });
          }
          return { clips: newClips, tracks, undoStack: [...s.undoStack.slice(-49), snap], redoStack: [], isDirty: true };
        });
        const clip = get().clips.get(id);
        if (clip) {
            get().repackTrack(clip.trackId);
            if (trackId && trackId !== clip.trackId) get().repackTrack(trackId);
        }
        get().recalculateDuration();
      },
      
      trimClipStart: (id, newStart) => {
        const snap = createSnapshot(get());
        set((s) => {
          const clip = s.clips.get(id);
          if (!clip || newStart >= clip.endTime) return s;
          const newClips = new Map(s.clips);
          newClips.set(id, { ...clip, startTime: newStart, trimStart: clip.trimStart + (newStart - clip.startTime) });
          return { clips: newClips, undoStack: [...s.undoStack.slice(-49), snap], redoStack: [], isDirty: true };
        });
        const clip = get().clips.get(id);
        if (clip) get().repackTrack(clip.trackId);
      },
      
      trimClipEnd: (id, newEnd) => {
        const snap = createSnapshot(get());
        set((s) => {
          const clip = s.clips.get(id);
          if (!clip || newEnd <= clip.startTime) return s;
          const newClips = new Map(s.clips);
          newClips.set(id, { ...clip, endTime: newEnd });
          return { clips: newClips, undoStack: [...s.undoStack.slice(-49), snap], redoStack: [], isDirty: true };
        });
        const clip = get().clips.get(id);
        if (clip) get().repackTrack(clip.trackId);
      },
      
      addEffectToClip: (clipId, effect) => set((s) => { const snap = createSnapshot(s); const clip = s.clips.get(clipId); if (!clip) return s; const newClips = new Map(s.clips); newClips.set(clipId, { ...clip, effects: [...clip.effects, effect] }); return { clips: newClips, undoStack: [...s.undoStack, snap], redoStack: [], isDirty: true }; }),
      removeEffectFromClip: (clipId, effectId) => set((s) => { const snap = createSnapshot(s); const clip = s.clips.get(clipId); if (!clip) return s; const newClips = new Map(s.clips); newClips.set(clipId, { ...clip, effects: clip.effects.filter((e) => e.id !== effectId) }); return { clips: newClips, undoStack: [...s.undoStack, snap], redoStack: [], isDirty: true }; }),
      updateClipText: (clipId, text) => set((s) => { const clip = s.clips.get(clipId); if (!clip) return s; const newClips = new Map(s.clips); newClips.set(clipId, { ...clip, text: { ...clip.text!, ...text } }); return { clips: newClips, isDirty: true }; }),
      setActivePanel: (panel) => set({ activePanel: panel, isPanelOpen: true }),
      togglePanel: () => set((s) => ({ isPanelOpen: !s.isPanelOpen })),
      setMobileView: (v) => set({ isMobileView: v }),
      setZoomLevel: (z) => set({ zoomLevel: Math.max(0.1, Math.min(10, z)) }),
      setScrollPosition: (p) => set({ scrollPosition: p }),
      toggleSnapEnabled: () => set((s) => ({ snapEnabled: !s.snapEnabled })),
      toggleMagnetic: () => set((s) => ({ magneticEnabled: !s.magneticEnabled })),
      toggleSafeZone: () => set((s) => ({ showSafeZone: !s.showSafeZone })),
      toggleExportModal: () => set((s) => ({ isExportModalOpen: !s.isExportModalOpen })),
      toggleFullScreen: () => set((s) => ({ isFullScreen: !s.isFullScreen })),
      setPreviewScale: (s) => set({ previewScale: s }),
      setTimelineExpanded: (expanded) => set({ isTimelineExpanded: expanded }),
      setExportSettings: (s) => set((state) => ({ exportSettings: { ...state.exportSettings, ...s } })),
      applyPlatformPreset: (platform) => { const preset = PLATFORM_PRESETS[platform]; if (preset) set({ exportSettings: preset }); },
      addExportJob: (job) => set((s) => ({ exportQueue: [...s.exportQueue, job] })),
      updateExportJob: (id, updates) => set((s) => ({ exportQueue: s.exportQueue.map((j) => j.id === id ? { ...j, ...updates } : j) })),
      removeExportJob: (id) => set((s) => ({ exportQueue: s.exportQueue.filter((j) => j.id !== id) })),
      
      // 🔥 FIX 1: THE REAL HISTORICAL RESCUE (UNDO / REDO WORKS NOW)
      undo: () => set((s) => {
        if (s.undoStack.length === 0) return s;
        const previous = s.undoStack[s.undoStack.length - 1];
        const currentSnap = createSnapshot(s);
        return {
          project: previous.project,
          tracks: previous.tracks,
          clips: previous.clips,
          transitions: previous.transitions,
          undoStack: s.undoStack.slice(0, -1),
          redoStack: [...s.redoStack, currentSnap],
          isDirty: true
        };
      }),
      redo: () => set((s) => {
        if (s.redoStack.length === 0) return s;
        const nextState = s.redoStack[s.redoStack.length - 1];
        const currentSnap = createSnapshot(s);
        return {
          project: nextState.project,
          tracks: nextState.tracks,
          clips: nextState.clips,
          transitions: nextState.transitions,
          redoStack: s.redoStack.slice(0, -1),
          undoStack: [...s.undoStack, currentSnap],
          isDirty: true
        };
      }),
      
      recalculateDuration: () => set((s) => { let maxEnd = 0; s.clips.forEach((clip) => { if (clip.endTime > maxEnd) maxEnd = clip.endTime; }); return { duration: maxEnd || 0 }; }),
      reset: () => set({ ...initialState, project: { ...initialState.project, id: generateId(), createdAt: Date.now(), updatedAt: Date.now() } }),
    })),
    {
      name: 'seloice-editor-autosave',
      partialize: (state) => ({
        project: state.project,
        tracks: state.tracks,
        duration: state.duration,
        savedClips: Array.from(state.clips.entries()),
        savedTransitions: Array.from(state.transitions.entries()),
        savedMediaAssets: [...state.mediaAssets.entries()].map(([id, asset]) => {
          const { blob, blobUrl, ...rest } = asset;
          return [id, rest];
        }),
      }),
      merge: (persistedState: any, currentState: any) => {
        const mediaAssetsMap = new Map();
        if (persistedState?.savedMediaAssets) {
          persistedState.savedMediaAssets.forEach(([id, asset]: any) => {
            mediaAssetsMap.set(id, { ...asset, blobUrl: '' }); 
          });
        }
        return {
          ...currentState,
          ...persistedState,
          clips: persistedState?.savedClips ? new Map(persistedState.savedClips) : currentState.clips,
          transitions: persistedState?.savedTransitions ? new Map(persistedState.savedTransitions) : currentState.transitions,
          mediaAssets: mediaAssetsMap,
        };
      }
    }
  )
);