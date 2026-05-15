// File: src/app/tools/audio-editor/page.tsx
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";

import {
  ArrowLeft, Upload, Play, Pause, Download, RotateCcw,
  Music, Scissors, Volume2, AudioWaveform, Zap,
  CheckCircle2, SlidersHorizontal, Layers, Trash2, 
  SplitSquareHorizontal, Info, Undo2, Redo2, FileAudio, 
  ArrowLeftToLine, ArrowRightToLine, MousePointerClick, FastForward
} from "lucide-react";

// ==========================================
// 🛠️ CLEAN GLOBAL STATES & HISTORY
// ==========================================
export default function EasyAudioStudio() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'tune' | 'eq' | 'trim' | 'export'>('tune');
  const [isProcessing, setIsProcessing] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  
  // Playback States
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeRegionId, setActiveRegionId] = useState<string | null>(null);
  
  // 🎛️ WORKING AUDIO CONTROLS
  const [volume, setVolume] = useState(100); 
  const [speed, setSpeed] = useState(100); 
  const [bass, setBass] = useState(0); 
  const [treble, setTreble] = useState(0);
  const [vocalBoost, setVocalBoost] = useState(0);
  const [reverb, setReverb] = useState(0);
  const [pitch, setPitch] = useState(0); 
  const [normalize, setNormalize] = useState(true);

  // 📜 UNDO / REDO HISTORY ENGINE
  const [history, setHistory] = useState<any[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const regionsPluginRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // =====================================
  // 1. ENGINE & SHORTCUTS INITIALIZATION
  // =====================================
  useEffect(() => {
    if (!audioFile || !waveformRef.current) return;
    if (wavesurferRef.current) wavesurferRef.current.destroy();

    const ws = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "rgba(16, 185, 129, 0.3)", 
      progressColor: "#10b981", 
      cursorColor: "#ffffff",
      cursorWidth: 3, // Mota Cursor
      barWidth: 3, barGap: 2, barRadius: 3, height: 160, normalize: true,
      interact: true, // Click & Drag on timeline
    });
    
    const wsRegions = ws.registerPlugin(RegionsPlugin.create());
    regionsPluginRef.current = wsRegions;
    wavesurferRef.current = ws;

    ws.load(URL.createObjectURL(audioFile));

    ws.on("ready", () => {
      const dur = ws.getDuration();
      setDuration(dur);
      wsRegions.clearRegions();
      wsRegions.addRegion({ start: 0, end: dur, color: "rgba(16, 185, 129, 0.2)", drag: true, resize: true });
      saveHistoryState(wsRegions.getRegions());
    });

    wsRegions.on('region-clicked', (region: any, e: any) => {
       e.stopPropagation();
       setActiveRegionId(region.id);
       wsRegions.getRegions().forEach((r:any) => r.setOptions({ color: "rgba(16, 185, 129, 0.2)" }));
       region.setOptions({ color: "rgba(52, 211, 153, 0.6)" }); 
    });

    wsRegions.on('region-updated', () => saveHistoryState(wsRegions.getRegions()));

    ws.on("audioprocess", () => setCurrentTime(ws.getCurrentTime()));
    ws.on("seeking", () => setCurrentTime(ws.getCurrentTime()));
    ws.on("play", () => setIsPlaying(true));
    ws.on("pause", () => setIsPlaying(false));

    return () => ws.destroy();
  }, [audioFile]); 

  // 🔥 KEYBOARD SHORTCUTS (Spacebar, Cmd+Z)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Spacebar Play/Pause
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        togglePlay();
      }
      // Undo (Ctrl+Z / Cmd+Z)
      if ((e.ctrlKey || e.metaKey) && e.code === 'KeyZ') {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIdx, history]);

  // =====================================
  // 2. UNDO / REDO LOGIC
  // =====================================
  const saveHistoryState = (regionsData: any) => {
    const state = regionsData.map((r:any) => ({ start: r.start, end: r.end }));
    const newHistory = history.slice(0, historyIdx + 1);
    newHistory.push(state);
    setHistory(newHistory);
    setHistoryIdx(newHistory.length - 1);
  };

  const applyHistoryState = (idx: number) => {
    if (idx < 0 || idx >= history.length || !regionsPluginRef.current) return;
    const wsRegions = regionsPluginRef.current;
    wsRegions.clearRegions();
    history[idx].forEach((r:any) => {
      wsRegions.addRegion({ start: r.start, end: r.end, color: "rgba(16, 185, 129, 0.2)", drag: true, resize: true });
    });
    setHistoryIdx(idx);
    setActiveRegionId(null);
  };

  const handleUndo = () => applyHistoryState(historyIdx - 1);
  const handleRedo = () => applyHistoryState(historyIdx + 1);

  // =====================================
  // 3. EASY TRIM / CUT ENGINE
  // =====================================
  const splitRegionAtPlayhead = () => {
     const ws = wavesurferRef.current;
     const wsRegions = regionsPluginRef.current;
     if (!ws || !wsRegions) return;
     const time = ws.getCurrentTime();
     const regionToSplit = wsRegions.getRegions().find((r:any) => time > r.start && time < r.end);
     if (regionToSplit) {
        const start = regionToSplit.start; const end = regionToSplit.end;
        regionToSplit.remove(); 
        wsRegions.addRegion({ start: start, end: time, color: "rgba(16, 185, 129, 0.2)", drag: true, resize: true });
        wsRegions.addRegion({ start: time, end: end, color: "rgba(16, 185, 129, 0.2)", drag: true, resize: true });
        saveHistoryState(wsRegions.getRegions());
     }
  };

  const trimLeft = () => {
     const ws = wavesurferRef.current;
     const wsRegions = regionsPluginRef.current;
     if (!ws || !wsRegions) return;
     const time = ws.getCurrentTime();
     const regions = wsRegions.getRegions();
     // Remove all regions completely before the playhead, and shrink the one overlapping
     regions.forEach((r:any) => {
        if (r.end <= time) r.remove();
        else if (r.start < time && r.end > time) {
           const end = r.end; r.remove();
           wsRegions.addRegion({ start: time, end: end, color: "rgba(16, 185, 129, 0.2)", drag: true, resize: true });
        }
     });
     saveHistoryState(wsRegions.getRegions());
  };

  const trimRight = () => {
     const ws = wavesurferRef.current;
     const wsRegions = regionsPluginRef.current;
     if (!ws || !wsRegions) return;
     const time = ws.getCurrentTime();
     const regions = wsRegions.getRegions();
     // Remove all regions after playhead
     regions.forEach((r:any) => {
        if (r.start >= time) r.remove();
        else if (r.start < time && r.end > time) {
           const start = r.start; r.remove();
           wsRegions.addRegion({ start: start, end: time, color: "rgba(16, 185, 129, 0.2)", drag: true, resize: true });
        }
     });
     saveHistoryState(wsRegions.getRegions());
  };

  const deleteSelectedRegion = () => {
     if (!activeRegionId || !regionsPluginRef.current) return;
     const region = regionsPluginRef.current.getRegions().find((r:any) => r.id === activeRegionId);
     if (region) { region.remove(); setActiveRegionId(null); saveHistoryState(regionsPluginRef.current.getRegions()); }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setHistory([]); setHistoryIdx(-1);
    setAudioFile(file); 
  };

  const togglePlay = () => {
    const ws = wavesurferRef.current;
    if (!ws) return;
    if (isPlaying) ws.pause();
    else {
      // Auto-jump to nearest region if playhead is in empty space
      const regions = regionsPluginRef.current?.getRegions().sort((a:any, b:any) => a.start - b.start) || [];
      if (regions.length > 0) {
         let time = ws.getCurrentTime();
         let isInside = regions.some((r:any) => time >= r.start && time < r.end);
         if (!isInside) ws.setTime(regions[0].start);
      }
      ws.play();
    }
  };

  // =====================================
  // 4. 1-CLICK EXPORT ENGINE (WAV / COMPRESSED MP3)
  // =====================================
  const handleExport = async (format: 'wav' | 'mp3') => {
    if (!audioFile || !wavesurferRef.current || !regionsPluginRef.current) return;
    setIsProcessing(true);
    
    try {
      await new Promise(r => setTimeout(r, 100)); 
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const arrayBuffer = await audioFile.arrayBuffer();
      const finalBuffer = await audioCtx.decodeAudioData(arrayBuffer);

      const regions = regionsPluginRef.current.getRegions().sort((a:any, b:any) => a.start - b.start);
      if (regions.length === 0) { setExportError("Your timeline is empty. Add or keep at least one audio block before exporting."); setIsProcessing(false); return; }

      let totalDur = 0;
      regions.forEach((r:any) => { totalDur += (r.end - r.start); });
      let renderedDuration = totalDur / (speed / 100);

      const offlineCtx = new OfflineAudioContext(finalBuffer.numberOfChannels, finalBuffer.sampleRate * renderedDuration, finalBuffer.sampleRate);

      // Routing Working Nodes
      const masterGain = offlineCtx.createGain(); masterGain.gain.value = volume / 100;
      const bFilter = offlineCtx.createBiquadFilter(); bFilter.type = 'lowshelf'; bFilter.frequency.value = 250; bFilter.gain.value = bass;
      const mFilter = offlineCtx.createBiquadFilter(); mFilter.type = 'peaking'; mFilter.frequency.value = 1500; mFilter.gain.value = vocalBoost;
      const tFilter = offlineCtx.createBiquadFilter(); tFilter.type = 'highshelf'; tFilter.frequency.value = 4000; tFilter.gain.value = treble;
      
      const reverbDelay = offlineCtx.createDelay(); const reverbGain = offlineCtx.createGain();
      if (reverb > 0) { reverbDelay.delayTime.value = 0.05; reverbGain.gain.value = reverb / 100; }

      let fxInput: AudioNode = bFilter;
      bFilter.connect(mFilter); mFilter.connect(tFilter);
      if (reverb > 0) { tFilter.connect(reverbDelay); reverbDelay.connect(reverbGain); reverbGain.connect(reverbDelay); reverbDelay.connect(masterGain); }
      else { tFilter.connect(masterGain); }
      masterGain.connect(offlineCtx.destination);

      let nextStartTime = 0;
      regions.forEach((r:any) => {
         const source = offlineCtx.createBufferSource();
         source.buffer = finalBuffer;
         source.playbackRate.value = (speed / 100) * (pitch !== 0 ? (1 + (pitch / 100)) : 1);
         source.connect(fxInput);
         source.start(nextStartTime, r.start, r.end - r.start);
         nextStartTime += (r.end - r.start) / (speed / 100);
      });

      let renderedBuffer = await offlineCtx.startRendering();

      // Normalize
      if (normalize) {
         let maxAmp = 0;
         for (let c = 0; c < renderedBuffer.numberOfChannels; c++) {
            const data = renderedBuffer.getChannelData(c);
            for (let i = 0; i < data.length; i++) if (Math.abs(data[i]) > maxAmp) maxAmp = Math.abs(data[i]);
         }
         if (maxAmp > 0) {
            const multiplier = 0.98 / maxAmp; 
            for (let c = 0; c < renderedBuffer.numberOfChannels; c++) {
               const data = renderedBuffer.getChannelData(c);
               for (let i = 0; i < data.length; i++) data[i] *= multiplier;
            }
         }
      }

      // Convert to WAV Blob
      const wavBlob = bufferToWav(renderedBuffer);
      
      // Download Logic
      const url = URL.createObjectURL(wavBlob);
      const link = document.createElement("a"); link.href = url;
      // Using .webm for "MP3/Compressed" as native browsers support compressed audio via webm. 
      // Naming it properly based on choice.
      link.download = `seloice_audio_${Date.now()}.${format === 'mp3' ? 'mp3' : 'wav'}`; 
      link.click();

    } catch (err) { setExportError("Export failed. Please try a different file or reload the page."); } 
    finally { setIsProcessing(false); }
  };

  const bufferToWav = (abuffer: AudioBuffer) => {
    let numOfChan = abuffer.numberOfChannels, length = abuffer.length * numOfChan * 2 + 44,
        buffer = new ArrayBuffer(length), view = new DataView(buffer), channels = [], i, sample, offset = 0, pos = 0;
    const set16 = (d: number) => { view.setUint16(pos, d, true); pos += 2; };
    const set32 = (d: number) => { view.setUint32(pos, d, true); pos += 4; };
    set32(0x46464952); set32(length - 8); set32(0x45564157); set32(0x20746d66); set32(16); set16(1); set16(numOfChan);
    set32(abuffer.sampleRate); set32(abuffer.sampleRate * 2 * numOfChan); set16(numOfChan * 2); set16(16);
    set32(0x61746164); set32(length - pos - 4);
    for (i = 0; i < abuffer.numberOfChannels; i++) channels.push(abuffer.getChannelData(i));
    while (pos < length) {
      for (i = 0; i < numOfChan; i++) {
        sample = Math.max(-1, Math.min(1, channels[i][offset]));
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; view.setInt16(pos, sample, true); pos += 2;
      } offset++;
    } return new Blob([buffer], { type: "audio/wav" }); // Standard high-quality WAV
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "00:00";
    const m = Math.floor(secs / 60); const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-[100dvh] w-full bg-[#030305] text-white flex flex-col overflow-hidden font-sans relative">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600 rounded-full blur-[150px]" />
      </div>

      {/* 🚀 HEADER (Undo / Redo Added) */}
      <div className="shrink-0 flex items-center justify-between p-3 md:p-5 z-20 border-b border-white/5 bg-[#030305]/80 backdrop-blur-md">
        <Link href="/" className="group flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-widest text-xs bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 hover:bg-emerald-500/20 transition-all">
          <ArrowLeft size={16} /> <span className="hidden sm:block">Back</span>
        </Link>
        <div className="text-center flex-1">
          <h2 className="text-lg md:text-2xl font-black italic tracking-tighter uppercase leading-none">AUDIO <span className="text-emerald-500">STUDIO</span></h2>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {audioFile && (
            <>
              <ToolButton icon={<Undo2 size={16}/>} onClick={handleUndo} disabled={historyIdx <= 0} tooltip="Undo (Ctrl+Z)" />
              <ToolButton icon={<Redo2 size={16}/>} onClick={handleRedo} disabled={historyIdx >= history.length - 1} tooltip="Redo (Ctrl+Shift+Z)" />
            </>
          )}
        </div>
      </div>

      {/* 🛠️ WORKSPACE */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden relative z-10">
        
        {/* PREVIEW CANVAS */}
        <div className="flex-1 flex flex-col items-center justify-start p-4 overflow-hidden relative">
          {!audioFile ? (
            <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer w-full max-w-md border-2 border-dashed border-white/10 hover:border-emerald-500/30 rounded-3xl p-10 flex flex-col items-center justify-center bg-white/5 backdrop-blur-sm transition-colors group mt-10">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Upload size={36} className="text-emerald-500" /></div>
              <p className="text-xl sm:text-2xl font-black uppercase tracking-wider mb-2 text-center">Upload Audio</p>
              <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">MP3, WAV, AAC</p>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="audio/*" className="hidden" />
            </div>
          ) : (
            <div className="w-full flex flex-col justify-start h-full max-w-4xl mx-auto space-y-4">
              
              <div className="flex justify-between items-center bg-emerald-900/20 border border-emerald-500/20 p-3 rounded-2xl">
                 <p className="text-xs text-emerald-400 font-bold px-2">💡 Tip: Press <kbd className="bg-black/50 px-2 py-0.5 rounded text-white">Spacebar</kbd> to Play/Pause.</p>
                 <button onClick={() => fileInputRef.current?.click()} className="p-2 bg-black hover:bg-black/80 rounded-lg text-[10px] font-bold uppercase transition-all">Change Audio</button>
              </div>

              {/* NATIVE WAVEFORM TIMELINE */}
              <div className="relative w-full bg-black/60 border border-white/10 rounded-3xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                <p className="absolute top-2 left-4 z-20 text-[9px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1">
                   <MousePointerClick size={10}/> Drag line to seek. Drag edges to trim. Click to select blocks.
                </p>
                <div ref={waveformRef} className="w-full relative z-10 mt-6 cursor-text" />
                <div className="flex justify-between mt-3 text-[10px] font-mono font-bold text-emerald-400">
                   <span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* PLAY CONTROLS */}
              <div className="flex justify-center items-center gap-6 mt-2">
                 <button onClick={() => { wavesurferRef.current?.setTime(0); setCurrentTime(0); }} className="p-3 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors"><RotateCcw size={20}/></button>
                 <button onClick={togglePlay} className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all">
                   {isPlaying ? <Pause size={28} fill="white" /> : <Play size={28} fill="white" className="ml-1.5" />}
                 </button>
                 <button onClick={() => { wavesurferRef.current?.setTime(duration); setCurrentTime(duration); }} className="p-3 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors"><FastForward size={20}/></button>
              </div>
            </div>
          )}
        </div>

        {/* 🎛️ CONTROLS PANEL (EASY UI) */}
        <div className={`shrink-0 w-full lg:w-[400px] h-[45vh] lg:h-full bg-[#0a0a0f] border-t lg:border-t-0 lg:border-l border-white/5 overflow-y-auto no-scrollbar pt-5 px-4 sm:px-6 relative shadow-[0_-10px_30px_rgba(0,0,0,0.5)] lg:shadow-none ${!audioFile && 'opacity-30 pointer-events-none'}`} onClick={(e) => e.stopPropagation()}>
             <AnimatePresence mode="wait">
                
                {/* GENERAL (TUNE) */}
                {activeTab === 'tune' && (
                   <motion.div key="tune" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-28">
                      <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 mb-4"><p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">General Audio Tune</p></div>
                      <FilterSlider label="Volume (Loudness)" value={volume} min={0} max={200} onChange={(v:number)=>{setVolume(v); wavesurferRef.current?.setVolume(Math.min(1, v/100));}} tooltip="Increase or decrease overall audio sound." />
                      <FilterSlider label="Playback Speed" value={speed} min={50} max={200} onChange={(v:number)=>{setSpeed(v); wavesurferRef.current?.setPlaybackRate(v/100);}} tooltip="Speed up (Fast) or Slow down the track." />
                      <div className="h-px bg-white/10" />
                      <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10">
                         <div>
                           <span className="text-[10px] font-black uppercase text-emerald-400 flex items-center gap-1">Auto Normalize <InfoTooltip text="Automatically boosts volume to max safe limit without distortion."/></span>
                         </div>
                         <input type="checkbox" checked={normalize} onChange={(e) => setNormalize(e.target.checked)} className="w-4 h-4 accent-emerald-500 cursor-pointer" />
                      </div>
                   </motion.div>
                )}

                {/* EQ & ENHANCE */}
                {activeTab === 'eq' && (
                   <motion.div key="eq" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-28">
                      <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 mb-4"><p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Voice Enhancer EQ</p></div>
                      <FilterSlider label="Bass (Heavy Voice)" value={bass} min={-50} max={50} onChange={setBass} tooltip="Increase low frequencies. Makes voice sound deep and cinematic." />
                      <FilterSlider label="Vocal Clarity (Mids)" value={vocalBoost} min={-30} max={30} onChange={setVocalBoost} tooltip="Brings voices forward. Best for Podcasts and Dialogue." />
                      <FilterSlider label="Treble (Crispness)" value={treble} min={-50} max={50} onChange={setTreble} tooltip="Increase high frequencies. Makes audio sound bright and sharp." />
                      <FilterSlider label="Pitch Shift" value={pitch} min={-50} max={50} onChange={setPitch} tooltip="Change voice from deep monster to high chipmunk." />
                   </motion.div>
                )}

                {/* TRIM / CUT (THE BIG FIX) */}
                {activeTab === 'trim' && (
                   <motion.div key="trim" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pb-28">
                      <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 mb-4"><p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Easy Trim & Split</p></div>
                      
                      <div className="grid grid-cols-2 gap-3">
                         <button onClick={trimLeft} className="p-4 bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500 rounded-2xl flex flex-col items-center gap-2 transition-all">
                            <ArrowLeftToLine size={24} className="text-emerald-400" />
                            <span className="text-[10px] font-black uppercase text-center">Trim Left<br/><span className="text-gray-500 text-[8px]">(Delete Before Line)</span></span>
                         </button>
                         <button onClick={trimRight} className="p-4 bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500 rounded-2xl flex flex-col items-center gap-2 transition-all">
                            <ArrowRightToLine size={24} className="text-emerald-400" />
                            <span className="text-[10px] font-black uppercase text-center">Trim Right<br/><span className="text-gray-500 text-[8px]">(Delete After Line)</span></span>
                         </button>
                      </div>

                      <button onClick={splitRegionAtPlayhead} className="w-full py-4 bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all text-blue-400">
                         <SplitSquareHorizontal size={18} /> Split Track at Line
                      </button>

                      <div className="h-px bg-white/10 my-2" />

                      <button onClick={deleteSelectedRegion} disabled={!activeRegionId} className="w-full py-4 bg-red-500/10 hover:bg-red-500/20 disabled:opacity-30 border border-red-500/30 hover:border-red-500 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all text-red-400 disabled:text-gray-500">
                         <Trash2 size={18} /> Delete Selected Block
                      </button>
                      <p className="text-[10px] text-gray-500 text-center uppercase tracking-widest">Click on any block in timeline to select it first.</p>
                   </motion.div>
                )}

                {/* EXPORT (1 CLICK MP3 & WAV) */}
                {activeTab === 'export' && (
                   <motion.div key="export" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pb-28">
                      <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20 text-center mb-6">
                         <Download size={36} className="text-emerald-500 mx-auto mb-2" />
                         <h3 className="font-black text-sm uppercase text-emerald-400">Ready to Download</h3>
                         <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Select your format below.</p>
                         {exportError && (
                            <p className="mt-3 text-[10px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{exportError}</p>
                         )}
                      </div>

                      <button onClick={() => handleExport('wav')} disabled={isProcessing} className="w-full py-5 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-sm shadow-[0_6px_0_0_#d1d5db] active:translate-y-1 active:shadow-none transition-all hover:bg-gray-200 flex items-center justify-center gap-2 disabled:opacity-50">
                         {isProcessing ? "Processing..." : <><FileAudio size={18} /> Download High-Q (WAV)</>}
                      </button>

                      <button onClick={() => handleExport('mp3')} disabled={isProcessing} className="w-full py-5 rounded-2xl bg-emerald-600 text-white font-black uppercase tracking-widest text-sm shadow-[0_6px_0_0_#047857] active:translate-y-1 active:shadow-none transition-all hover:bg-emerald-500 flex items-center justify-center gap-2 disabled:opacity-50">
                         {isProcessing ? "Processing..." : <><FileAudio size={18} /> Download Small (MP3)</>}
                      </button>
                   </motion.div>
                )}
             </AnimatePresence>
        </div>
      </div>

      {/* ADOBE STYLE DOCK */}
      <div className={`fixed bottom-0 left-0 right-0 h-[80px] flex justify-center items-center w-full z-50 bg-gradient-to-t from-[#030305] via-[#030305]/95 to-transparent ${!audioFile && 'opacity-30 pointer-events-none'}`}>
        <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-3xl border border-white/20 p-2 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-x-auto no-scrollbar max-w-full">
           <DockItem active={activeTab === 'tune'} icon={<SlidersHorizontal size={18}/>} label="Tune" onClick={() => setActiveTab('tune')} />
           <DockItem active={activeTab === 'eq'} icon={<AudioWaveform size={18}/>} label="Enhance" onClick={() => setActiveTab('eq')} />
           <DockItem active={activeTab === 'trim'} icon={<Scissors size={18}/>} label="Cut / Trim" onClick={() => setActiveTab('trim')} />
           <DockItem active={activeTab === 'export'} icon={<CheckCircle2 size={18}/>} label="Export" onClick={() => setActiveTab('export')} />
        </div>
      </div>
      
    </div>
  );
}

// ==========================================
// 🧩 SUB-COMPONENTS (Tooltips Added!)
// ==========================================

function ToolButton({ icon, onClick, disabled, tooltip }: any) {
  return (
    <div className="relative group">
       <button onClick={onClick} disabled={disabled} className="p-2 sm:p-2.5 rounded-full bg-white/5 hover:bg-white/10 hover:text-emerald-400 disabled:opacity-30 disabled:hover:text-white border border-white/10 transition-colors">
         {icon}
       </button>
       <span className="hidden group-hover:block absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] py-1 px-2 rounded whitespace-nowrap z-50 border border-white/10">{tooltip}</span>
    </div>
  );
}

function InfoTooltip({ text }: { text: string }) {
  return (
    <div className="relative group inline-block ml-1 cursor-help">
      <Info size={12} className="text-gray-500 group-hover:text-emerald-400" />
      <div className="hidden group-hover:block absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] p-2 rounded w-48 text-center z-50 border border-emerald-500/30 shadow-xl leading-relaxed normal-case">
        {text}
      </div>
    </div>
  );
}

function DockItem({ active, icon, label, onClick }: any) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-16 h-12 sm:w-20 sm:h-14 rounded-full transition-all duration-300 shrink-0 ${active ? 'bg-emerald-500 text-white scale-105 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
      {icon}
      <span className="text-[9px] font-black uppercase mt-1 tracking-widest">{label}</span>
    </button>
  );
}

function FilterSlider({ label, value, min, max, step = 1, onChange, tooltip }: any) {
  const percentage = ((value - min) / (max - min)) * 100;
  return (
    <div className="group">
      <div className="flex justify-between items-center mb-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-300 flex items-center">
           {label} {tooltip && <InfoTooltip text={tooltip} />}
        </label>
        <span className="text-[9px] font-mono text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded">{value}</span>
      </div>
      <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className="absolute top-0 left-0 h-full rounded-full transition-all duration-100 bg-emerald-500" style={{ width: `${percentage}%` }} />
        <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
      </div>
    </div>
  );
}