// File: src/app/tools/video-editor/components/Panels/AudioPanel.tsx
'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { PanelSection, Slider } from '../shared/UIComponents';
import { useEditorStore } from '../../stores/editorStore';
import { Mic, Square, Volume2, Play, Plus, Upload } from 'lucide-react';
import { generateId } from '../../utils/helpers';

// 🔥 REAL Public URLs for testing so you can actually HEAR them!
const STOCK_MUSIC = [
  { name: 'Lo-Fi Chill Beats', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { name: 'Cinematic Epic', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { name: 'Upbeat Vlog Vibes', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { name: 'Phonk Drift', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
];

const STOCK_SFX = [
  { name: 'Whoosh', url: 'https://actions.google.com/sounds/v1/weapons/whoosh.ogg' },
  { name: 'Pop', url: 'https://actions.google.com/sounds/v1/water/pop.ogg' },
  { name: 'Mouse Click', url: 'https://actions.google.com/sounds/v1/tools/keyboard_click.ogg' },
  { name: 'Riser', url: 'https://actions.google.com/sounds/v1/science_fiction/alien_breath.ogg' },
];

export default function AudioPanel() {
  const { selectedClipIds, clips, updateClip, addTrack, tracks, addClip, addMediaAsset, currentTime } = useEditorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Voiceover States
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const selectedClipId = selectedClipIds[0];
  const selectedClip = selectedClipId ? clips.get(selectedClipId) : null;
  const isAudioOrVideo = selectedClip?.type === 'audio' || selectedClip?.type === 'video';

  const handleVolumeChange = (vol: number) => {
    if (selectedClipId) updateClip(selectedClipId, { volume: vol });
  };

  // 🚀 SMART OVERLAPPING AUDIO ENGINE
  const addAudioToTimeline = (blobUrl: string, name: string, mimeType: string = 'audio/mp3') => {
    const assetId = generateId();
    addMediaAsset({
      id: assetId, url: name, blobUrl, type: 'audio', name, duration: 15, size: 1024, mimeType,
      createdAt: 0
    });
    
    // 🔥 Find an audio track that doesn't overlap at the current time, OR create a new one!
    const audioTracks = tracks.filter(t => t.type === 'audio');
    let targetTrackId = null;

    for (const track of audioTracks) {
      // Check if this track already has a clip playing at 'currentTime'
      const hasOverlap = track.clips.some(cid => {
        const c = clips.get(cid);
        if (!c) return false;
        return currentTime >= c.startTime && currentTime < c.endTime;
      });

      if (!hasOverlap) {
        targetTrackId = track.id; // Found an empty track!
        break;
      }
    }

    // Agar saare audio tracks bhare hain, toh ek naya track bana do!
    if (!targetTrackId) {
      targetTrackId = addTrack('audio', `Audio ${audioTracks.length + 1}`);
    }
    
    addClip({
      type: 'audio', trackId: targetTrackId, mediaId: assetId, startTime: currentTime, endTime: currentTime + 15, // Default 15 sec
      trimStart: 0, trimEnd: 0, speed: 1, volume: 1, opacity: 1, name,
      x: 0, y: 0, width: 0, height: 0, rotation: 0, scaleX: 1, scaleY: 1, effects: [], locked: false, hidden: false
    });
  };

  // 🎙️ VOICEOVER LOGIC
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        audioChunksRef.current = [];
        const blobUrl = URL.createObjectURL(audioBlob);
        addAudioToTimeline(blobUrl, `Voiceover ${new Date().toLocaleTimeString()}`, 'audio/webm');
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (e) {
      alert('Microphone access denied! Please allow mic permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop()); // Turn off mic light
    }
    setIsRecording(false);
  };

  // 📁 LOCAL AUDIO IMPORT
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const blobUrl = URL.createObjectURL(file);
    addAudioToTimeline(blobUrl, file.name, file.type);
    e.target.value = ''; // Reset input
  };

  // 🎵 PLAY STOCK AUDIO PREVIEW
  const playPreview = (url: string) => {
    const audio = new Audio(url);
    audio.play();
    setTimeout(() => audio.pause(), 3000); // Play only 3 seconds as preview
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      
      {/* 🎚️ 1. SELECTED CLIP AUDIO SETTINGS */}
      {isAudioOrVideo ? (
        <PanelSection title="Clip Audio Settings" defaultOpen={true}>
          <div className="space-y-5">
            <Slider 
              label="Volume" 
              value={selectedClip.volume ?? 1} 
              min={0} max={2} step={0.1} 
              onChange={handleVolumeChange} 
              formatValue={v => `${Math.round(v * 100)}%`} 
            />
            <div className="flex gap-2">
               <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 p-2.5 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-colors">Fade In</button>
               <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 p-2.5 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-colors">Fade Out</button>
            </div>
          </div>
        </PanelSection>
      ) : (
        <div className="bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-2xl text-center">
          <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">Select a video or audio clip to adjust volume.</p>
        </div>
      )}

      {/* 📁 2. IMPORT AUDIO */}
      <PanelSection title="Import Local Audio" defaultOpen={true}>
        <input type="file" accept="audio/*" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 p-3 rounded-2xl transition-all group"
        >
          <Upload size={16} className="text-zinc-400 group-hover:text-white" />
          <span className="font-bold text-xs">Upload MP3 / WAV</span>
        </button>
      </PanelSection>

      {/* 🎙️ 3. VOICEOVER RECORDING */}
      <PanelSection title="Voiceover" defaultOpen={true}>
        <button 
          onClick={isRecording ? stopRecording : startRecording}
          className={`w-full flex items-center justify-center gap-3 p-4 rounded-2xl transition-all border ${
            isRecording 
              ? 'bg-rose-500/20 text-rose-400 border-rose-500/50 animate-pulse' 
              : 'bg-zinc-900/50 hover:bg-white/5 text-zinc-300 border-white/10'
          }`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform ${
            isRecording ? 'bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.6)]' : 'bg-rose-500/20 text-rose-500'
          }`}>
            {isRecording ? <Square size={16} fill="currentColor" /> : <Mic size={18} />}
          </div>
          <span className="font-black uppercase tracking-widest text-xs">
            {isRecording ? 'Stop Recording' : 'Start Voiceover'}
          </span>
        </button>
      </PanelSection>

      {/* 🎵 4. STOCK MUSIC */}
      <PanelSection title="Trending Music" defaultOpen={true}>
        <div className="space-y-2">
          {STOCK_MUSIC.map((song) => (
             <div key={song.name} className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-colors group">
                <div className="flex items-center gap-3">
                  <button onClick={() => playPreview(song.url)} className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center hover:bg-cyan-500 hover:text-white transition-colors">
                    <Play size={14} className="ml-0.5" />
                  </button>
                  <div>
                    <p className="text-[11px] font-bold text-white group-hover:text-cyan-400 transition-colors">{song.name}</p>
                    <p className="text-[8px] text-zinc-500 uppercase tracking-widest">Free to use</p>
                  </div>
                </div>
                <button onClick={() => addAudioToTimeline(song.url, song.name)} className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                  <Plus size={16} />
                </button>
             </div>
          ))}
        </div>
      </PanelSection>
      
      {/* 💥 5. SOUND EFFECTS */}
      <PanelSection title="Sound Effects" defaultOpen={true}>
        <div className="grid grid-cols-2 gap-2">
          {STOCK_SFX.map((sfx) => (
             <button key={sfx.name} onClick={() => addAudioToTimeline(sfx.url, sfx.name, 'audio/ogg')} className="p-3 bg-zinc-900/50 rounded-2xl border border-white/5 hover:border-cyan-500/30 hover:bg-cyan-500/10 transition-colors flex flex-col items-center gap-2 group">
                <Volume2 size={18} className="text-zinc-500 group-hover:text-cyan-400 transition-colors" />
                <span className="text-[10px] font-bold text-zinc-300">{sfx.name}</span>
             </button>
          ))}
        </div>
      </PanelSection>
    </div>
  );
}