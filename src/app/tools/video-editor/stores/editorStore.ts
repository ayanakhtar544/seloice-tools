// ============================================================
// Seloice AI Video Editor — Main Zustand Store
// ============================================================
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type {
  AspectRatio,
  MediaAsset,
  TimelineClip,
  TimelineTrack,
  ProjectSettings,
  ExportSettings,
  ExportJob,
  PanelTab,
  TrackType,
  ClipEffect,
  TextProperties,
  HistoryEntry,
} from '../types/editor';
import { PLATFORM_PRESETS } from '../types/editor';
import { generateId } from '../utils/helpers';

// ─── Editor State ────────────────────────────────────────────
interface EditorState {
  // Project
  project: ProjectSettings;
  
  // Playback
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  isSeeking: boolean;
  playbackRate: number;
  volume: number;
  isMuted: boolean;
  
  // Media
  mediaAssets: Map<string, MediaAsset>;
  importProgress: number;
  
  // Timeline
  tracks: TimelineTrack[];
  clips: Map<string, TimelineClip>;
  selectedClipIds: string[];
  selectedTrackId: string | null;
  zoomLevel: number;
  scrollPosition: number;
  snapEnabled: boolean;
  magneticEnabled: boolean;
  
  // UI
  activePanel: PanelTab;
  isPanelOpen: boolean;
  isTimelineExpanded: boolean;
  isMobileView: boolean;
  showSafeZone: boolean;
  previewScale: number;
  isExportModalOpen: boolean;
  isFullScreen: boolean;
  
  // Export
  exportSettings: ExportSettings;
  exportQueue: ExportJob[];
  
  // History
  undoStack: HistoryEntry[];
  redoStack: HistoryEntry[];
  
  // Flags
  isLoading: boolean;
  isDirty: boolean;
  lastSavedAt: number | null;
}

// ─── Editor Actions ──────────────────────────────────────────
interface EditorActions {
  // Project
  setProject: (updates: Partial<ProjectSettings>) => void;
  setAspectRatio: (ratio: AspectRatio) => void;
  
  // Playback
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
  
  // Media
  addMediaAsset: (asset: MediaAsset) => void;
  removeMediaAsset: (id: string) => void;
  setImportProgress: (p: number) => void;
  
  // Timeline
  addTrack: (type: TrackType, name?: string) => string;
  removeTrack: (id: string) => void;
  reorderTrack: (id: string, newOrder: number) => void;
  toggleTrackLock: (id: string) => void;
  toggleTrackMute: (id: string) => void;
  toggleTrackVisibility: (id: string) => void;
  
  // Clips
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
  
  // UI
  setActivePanel: (panel: PanelTab) => void;
  togglePanel: () => void;
  setMobileView: (v: boolean) => void;
  setZoomLevel: (z: number) => void;
  setScrollPosition: (p: number) => void;
  toggleSnapEnabled: () => void;
  toggleSafeZone: () => void;
  setPreviewScale: (s: number) => void;
  setTimelineExpanded: (expanded: boolean) => void;
  toggleExportModal: () => void;
  toggleFullScreen: () => void;
  
  // Export
  setExportSettings: (s: Partial<ExportSettings>) => void;
  applyPlatformPreset: (platform: string) => void;
  addExportJob: (job: ExportJob) => void;
  updateExportJob: (id: string, updates: Partial<ExportJob>) => void;
  removeExportJob: (id: string) => void;
  
  // History
  undo: () => void;
  redo: () => void;
  pushHistory: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
  
  // Utility
  recalculateDuration: () => void;
  reset: () => void;
}

// ─── Initial State ───────────────────────────────────────────
const initialState: EditorState = {
  project: {
    id: generateId(),
    name: 'Untitled Project',
    aspectRatio: '9:16',
    resolution: '1080p',
    fps: 30,
    backgroundColor: '#000000',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  currentTime: 0,
  duration: 0,
  isPlaying: false,
  isSeeking: false,
  playbackRate: 1,
  volume: 1,
  isMuted: false,
  mediaAssets: new Map(),
  importProgress: 0,
  tracks: [],
  clips: new Map(),
  selectedClipIds: [],
  selectedTrackId: null,
  zoomLevel: 1,
  scrollPosition: 0,
  snapEnabled: true,
  magneticEnabled: true,
  activePanel: 'media',
  isPanelOpen: true,
  isTimelineExpanded: true,
  isMobileView: false,
  isExportModalOpen: false,
  isFullScreen: false,
  showSafeZone: false,
  previewScale: 0.35,
  exportSettings: PLATFORM_PRESETS.instagram,
  exportQueue: [],
  undoStack: [],
  redoStack: [],
  isLoading: false,
  isDirty: false,
  lastSavedAt: null,
};

// ─── Store ───────────────────────────────────────────────────
export const useEditorStore = create<EditorState & EditorActions>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    // ── Project ──────────────────────────────────
    setProject: (updates) =>
      set((s) => ({
        project: { ...s.project, ...updates, updatedAt: Date.now() },
        isDirty: true,
      })),

    setAspectRatio: (ratio) =>
      set((s) => ({
        project: { ...s.project, aspectRatio: ratio, updatedAt: Date.now() },
        isDirty: true,
      })),

    // ── Playback ─────────────────────────────────
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

    // ── Media ────────────────────────────────────
    addMediaAsset: (asset) =>
      set((s) => {
        const newMap = new Map(s.mediaAssets);
        newMap.set(asset.id, asset);
        return { mediaAssets: newMap };
      }),

    removeMediaAsset: (id) =>
      set((s) => {
        const newMap = new Map(s.mediaAssets);
        newMap.delete(id);
        return { mediaAssets: newMap };
      }),

    setImportProgress: (p) => set({ importProgress: p }),

    // ── Timeline Tracks ──────────────────────────
    addTrack: (type, name) => {
      const id = generateId();
      set((s) => ({
        tracks: [
          ...s.tracks,
          {
            id,
            type,
            name: name || `${type.charAt(0).toUpperCase() + type.slice(1)} ${s.tracks.filter((t) => t.type === type).length + 1}`,
            order: s.tracks.length,
            locked: false,
            muted: false,
            visible: true,
            solo: false,
            height: type === 'audio' ? 48 : 64,
            clips: [],
          },
        ],
        isDirty: true,
      }));
      return id;
    },

    removeTrack: (id) =>
      set((s) => {
        const track = s.tracks.find((t) => t.id === id);
        if (!track) return s;
        const newClips = new Map(s.clips);
        track.clips.forEach((cid) => newClips.delete(cid));
        return {
          tracks: s.tracks.filter((t) => t.id !== id),
          clips: newClips,
          selectedClipIds: s.selectedClipIds.filter((cid) => !track.clips.includes(cid)),
          isDirty: true,
        };
      }),

    reorderTrack: (id, newOrder) =>
      set((s) => {
        const sorted = [...s.tracks].sort((a, b) => a.order - b.order);
        const idx = sorted.findIndex((t) => t.id === id);
        if (idx === -1) return s;
        const [item] = sorted.splice(idx, 1);
        sorted.splice(newOrder, 0, item);
        return {
          tracks: sorted.map((t, i) => ({ ...t, order: i })),
          isDirty: true,
        };
      }),

    toggleTrackLock: (id) =>
      set((s) => ({
        tracks: s.tracks.map((t) => (t.id === id ? { ...t, locked: !t.locked } : t)),
      })),

    toggleTrackMute: (id) =>
      set((s) => ({
        tracks: s.tracks.map((t) => (t.id === id ? { ...t, muted: !t.muted } : t)),
      })),

    toggleTrackVisibility: (id) =>
      set((s) => ({
        tracks: s.tracks.map((t) => (t.id === id ? { ...t, visible: !t.visible } : t)),
      })),

    // ── Clips ────────────────────────────────────
    addClip: (clipData) => {
      const id = generateId();
      const clip: TimelineClip = { ...clipData, id } as TimelineClip;
      set((s) => {
        const newClips = new Map(s.clips);
        newClips.set(id, clip);
        return {
          clips: newClips,
          tracks: s.tracks.map((t) =>
            t.id === clip.trackId ? { ...t, clips: [...t.clips, id] } : t
          ),
          isDirty: true,
        };
      });
      get().recalculateDuration();
      return id;
    },

    updateClip: (id, updates) =>
      set((s) => {
        const newClips = new Map(s.clips);
        const clip = newClips.get(id);
        if (!clip) return s;
        newClips.set(id, { ...clip, ...updates });
        return { clips: newClips, isDirty: true };
      }),

    removeClip: (id) =>
      set((s) => {
        const clip = s.clips.get(id);
        if (!clip) return s;
        const newClips = new Map(s.clips);
        newClips.delete(id);
        return {
          clips: newClips,
          tracks: s.tracks.map((t) =>
            t.id === clip.trackId ? { ...t, clips: t.clips.filter((c) => c !== id) } : t
          ),
          selectedClipIds: s.selectedClipIds.filter((c) => c !== id),
          isDirty: true,
        };
      }),

    splitClip: (id, time) => {
      const state = get();
      const clip = state.clips.get(id);
      if (!clip) return;
      if (time <= clip.startTime || time >= clip.endTime) return;

      const relativeTime = time - clip.startTime;

      // Update original clip to end at split point
      state.updateClip(id, { endTime: time });

      // Create new clip from split point
      state.addClip({
        ...clip,
        trackId: clip.trackId,
        startTime: time,
        endTime: clip.endTime,
        trimStart: clip.trimStart + relativeTime,
        name: `${clip.name} (split)`,
        locked: false,
        hidden: false,
      });
    },

    duplicateClip: (id) => {
      const clip = get().clips.get(id);
      if (!clip) return;
      get().addClip({
        ...clip,
        startTime: clip.endTime,
        endTime: clip.endTime + (clip.endTime - clip.startTime),
        name: `${clip.name} (copy)`,
      });
    },

    selectClip: (id, multi) =>
      set((s) => ({
        selectedClipIds: multi
          ? s.selectedClipIds.includes(id)
            ? s.selectedClipIds.filter((c) => c !== id)
            : [...s.selectedClipIds, id]
          : [id],
      })),

    deselectAll: () => set({ selectedClipIds: [] }),

    moveClip: (id, startTime, trackId) =>
      set((s) => {
        const clip = s.clips.get(id);
        if (!clip) return s;
        const duration = clip.endTime - clip.startTime;
        const newClips = new Map(s.clips);
        newClips.set(id, {
          ...clip,
          startTime,
          endTime: startTime + duration,
          trackId: trackId || clip.trackId,
        });

        let tracks = s.tracks;
        if (trackId && trackId !== clip.trackId) {
          tracks = tracks.map((t) => {
            if (t.id === clip.trackId) return { ...t, clips: t.clips.filter((c) => c !== id) };
            if (t.id === trackId) return { ...t, clips: [...t.clips, id] };
            return t;
          });
        }

        return { clips: newClips, tracks, isDirty: true };
      }),

    trimClipStart: (id, newStart) =>
      set((s) => {
        const clip = s.clips.get(id);
        if (!clip || newStart >= clip.endTime) return s;
        const delta = newStart - clip.startTime;
        const newClips = new Map(s.clips);
        newClips.set(id, {
          ...clip,
          startTime: newStart,
          trimStart: clip.trimStart + delta,
        });
        return { clips: newClips, isDirty: true };
      }),

    trimClipEnd: (id, newEnd) =>
      set((s) => {
        const clip = s.clips.get(id);
        if (!clip || newEnd <= clip.startTime) return s;
        const newClips = new Map(s.clips);
        newClips.set(id, { ...clip, endTime: newEnd });
        return { clips: newClips, isDirty: true };
      }),

    addEffectToClip: (clipId, effect) =>
      set((s) => {
        const clip = s.clips.get(clipId);
        if (!clip) return s;
        const newClips = new Map(s.clips);
        newClips.set(clipId, {
          ...clip,
          effects: [...clip.effects, effect],
        });
        return { clips: newClips, isDirty: true };
      }),

    removeEffectFromClip: (clipId, effectId) =>
      set((s) => {
        const clip = s.clips.get(clipId);
        if (!clip) return s;
        const newClips = new Map(s.clips);
        newClips.set(clipId, {
          ...clip,
          effects: clip.effects.filter((e) => e.id !== effectId),
        });
        return { clips: newClips, isDirty: true };
      }),

    updateClipText: (clipId, text) =>
      set((s) => {
        const clip = s.clips.get(clipId);
        if (!clip) return s;
        const newClips = new Map(s.clips);
        newClips.set(clipId, {
          ...clip,
          text: { ...clip.text!, ...text },
        });
        return { clips: newClips, isDirty: true };
      }),

    // ── UI ───────────────────────────────────────
    setActivePanel: (panel) => set({ activePanel: panel, isPanelOpen: true }),
    togglePanel: () => set((s) => ({ isPanelOpen: !s.isPanelOpen })),
    setMobileView: (v) => set({ isMobileView: v }),
    setZoomLevel: (z) => set({ zoomLevel: Math.max(0.1, Math.min(10, z)) }),
    setScrollPosition: (p) => set({ scrollPosition: p }),
    toggleSnapEnabled: () => set((s) => ({ snapEnabled: !s.snapEnabled })),
    toggleSafeZone: () => set((s) => ({ showSafeZone: !s.showSafeZone })),
    toggleExportModal: () => set((s) => ({ isExportModalOpen: !s.isExportModalOpen })),
    toggleFullScreen: () => set((s) => ({ isFullScreen: !s.isFullScreen })),
    setPreviewScale: (s) => set({ previewScale: s }),
    setTimelineExpanded: (expanded) => set({ isTimelineExpanded: expanded }),

    // ── Export ────────────────────────────────────
    setExportSettings: (s) =>
      set((state) => ({
        exportSettings: { ...state.exportSettings, ...s },
      })),

    applyPlatformPreset: (platform) => {
      const preset = PLATFORM_PRESETS[platform];
      if (preset) set({ exportSettings: preset });
    },

    addExportJob: (job) =>
      set((s) => ({ exportQueue: [...s.exportQueue, job] })),

    updateExportJob: (id, updates) =>
      set((s) => ({
        exportQueue: s.exportQueue.map((j) =>
          j.id === id ? { ...j, ...updates } : j
        ),
      })),

    removeExportJob: (id) =>
      set((s) => ({
        exportQueue: s.exportQueue.filter((j) => j.id !== id),
      })),

    // ── History ──────────────────────────────────
    undo: () =>
      set((s) => {
        if (s.undoStack.length === 0) return s;
        const entry = s.undoStack[s.undoStack.length - 1];
        return {
          undoStack: s.undoStack.slice(0, -1),
          redoStack: [...s.redoStack, entry],
        };
      }),

    redo: () =>
      set((s) => {
        if (s.redoStack.length === 0) return s;
        const entry = s.redoStack[s.redoStack.length - 1];
        return {
          redoStack: s.redoStack.slice(0, -1),
          undoStack: [...s.undoStack, entry],
        };
      }),

    pushHistory: (entry) =>
      set((s) => ({
        undoStack: [...s.undoStack.slice(-49), { ...entry, id: generateId(), timestamp: Date.now() }],
        redoStack: [],
      })),

    // ── Utility ──────────────────────────────────
    recalculateDuration: () =>
      set((s) => {
        let maxEnd = 0;
        s.clips.forEach((clip) => {
          if (clip.endTime > maxEnd) maxEnd = clip.endTime;
        });
        return { duration: maxEnd || 0 };
      }),

    reset: () => set({ ...initialState, project: { ...initialState.project, id: generateId(), createdAt: Date.now(), updatedAt: Date.now() } }),
  }))
);
