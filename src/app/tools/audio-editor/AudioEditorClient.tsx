// File: src/app/tools/audio-editor/AudioEditorClient.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";

import {
  ArrowLeft, Upload, Play, Pause, Download, RotateCcw,
  Music, Scissors, Volume2, AudioWaveform, Zap,
  CheckCircle2, SlidersHorizontal, Trash2, 
  SplitSquareHorizontal, Info, Undo2, Redo2, FileAudio, 
  ArrowLeftToLine, ArrowRightToLine, MousePointerClick, FastForward,
  Sparkles, Activity, FileText, Check, AlertTriangle, ShieldAlert,
  Flame, Radio, Heart, HelpCircle
} from "lucide-react";

// ============================================================================
// 🎭 TYPES & CONSTANTS
// ============================================================================
interface DiagnosticReport {
  clippingCount: number;
  silentDuration: number;
  silentBlocks: number;
  noiseFloorDb: number;
  speechClarityScore: number;
  pacingScore: number;
  detectedEmotion: 'Suspenseful' | 'Motivational' | 'Sad/Atmospheric' | 'High Energy' | 'Neutral';
  advice: string[];
}

export default function EliteAudioStudio() {
  // Dual-File State
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [musicFile, setMusicFile] = useState<File | null>(null);
  const [musicName, setMusicName] = useState<string>("");
  const [activeTab, setActiveTab] = useState<'diagnostics' | 'mastering' | 'tune' | 'eq' | 'trim' | 'export'>('diagnostics');
  const [isProcessing, setIsProcessing] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  
  // Playback States
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeRegionId, setActiveRegionId] = useState<string | null>(null);

  // 🎛️ STUDIO AUDIO CONTROLS & DSP PARAMETERS
  const [volume, setVolume] = useState(100); 
  const [speed, setSpeed] = useState(100); 
  const [bass, setBass] = useState(0); 
  const [vocalClarity, setVocalClarity] = useState(0); // Peaking mids
  const [treble, setTreble] = useState(0); // Crispness highs
  const [pitch, setPitch] = useState(0); 
  
  // Advanced Pro-Studio Controls
  const [noiseGate, setNoiseGate] = useState(true);
  const [humKiller, setHumKiller] = useState(true);
  const [warmth, setWarmth] = useState(25); // Sigmoid harmonic saturation
  const [stereoWidth, setStereoWidth] = useState(20); // Phase widener
  const [reverb, setReverb] = useState(10); // Room reflection wet level
  const [delayTime, setDelayTime] = useState(25); // Slapback reflection spacing
  const [duckingDepth, setDuckingDepth] = useState(70); // % volume duck under vocal
  const [compressorThreshold, setCompressorThreshold] = useState(-20); // dB

  // Preset States
  const [masteringPreset, setMasteringPreset] = useState<'none' | 'tiktok' | 'youtube' | 'podcast' | 'spotify'>('none');
  const [emotionPreset, setEmotionPreset] = useState<'none' | 'suspense' | 'motivation' | 'horror' | 'sadness' | 'excitement'>('none');

  // Diagnostics & AI Scanner Report
  const [diagnostics, setDiagnostics] = useState<DiagnosticReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Undo / Redo History Engine
  const [history, setHistory] = useState<any[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  // Web Audio Refs for Live Syncing Playback
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const regionsPluginRef = useRef<any>(null);
  
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const musicInputRef = useRef<HTMLInputElement>(null);
  
  // Background Music Playback Node Ref
  const musicAudioRef = useRef<HTMLAudioElement | null>(null);
  const playheadIntervalRef = useRef<number | null>(null);

  // Visualizer Canvas Refs
  const visualizerCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const leftMeterRef = useRef<HTMLDivElement | null>(null);
  const rightMeterRef = useRef<HTMLDivElement | null>(null);

  // Decoded Primary Audio Buffer for sample-level checks
  const decodedBufferRef = useRef<AudioBuffer | null>(null);

  // ============================================================================
  // 🎙️ PRESETS DEFINITIONS
  // ============================================================================
  const applyMasteringPreset = (preset: 'none' | 'tiktok' | 'youtube' | 'podcast' | 'spotify') => {
    setMasteringPreset(preset);
    if (preset === 'none') {
      setVolume(100);
      setBass(0);
      setVocalClarity(0);
      setTreble(0);
      setWarmth(0);
      setCompressorThreshold(-15);
      return;
    }

    switch (preset) {
      case 'tiktok':
        setVolume(125);
        setBass(25);
        setVocalClarity(15);
        setTreble(18);
        setWarmth(45);
        setCompressorThreshold(-28);
        setNoiseGate(true);
        break;
      case 'youtube':
        setVolume(105);
        setBass(8);
        setVocalClarity(12);
        setTreble(14);
        setWarmth(20);
        setCompressorThreshold(-18);
        setNoiseGate(true);
        break;
      case 'podcast':
        setVolume(110);
        setBass(12);
        setVocalClarity(22);
        setTreble(8);
        setWarmth(35);
        setCompressorThreshold(-24);
        setNoiseGate(true);
        setHumKiller(true);
        break;
      case 'spotify':
        setVolume(100);
        setBass(15);
        setVocalClarity(5);
        setTreble(15);
        setWarmth(15);
        setCompressorThreshold(-16);
        setStereoWidth(40);
        break;
    }
  };

  const applyEmotionPreset = (emotion: 'none' | 'suspense' | 'motivation' | 'horror' | 'sadness' | 'excitement') => {
    setEmotionPreset(emotion);
    if (emotion === 'none') {
      setReverb(10);
      setDelayTime(20);
      setStereoWidth(20);
      return;
    }

    switch (emotion) {
      case 'suspense':
        setReverb(45);
        setDelayTime(45);
        setStereoWidth(35);
        setBass(20);
        setTreble(-15);
        break;
      case 'motivation':
        setReverb(18);
        setDelayTime(15);
        setStereoWidth(25);
        setVocalClarity(20);
        setTreble(12);
        break;
      case 'horror':
        setReverb(65);
        setDelayTime(60);
        setStereoWidth(60);
        setBass(-10);
        setTreble(20);
        break;
      case 'sadness':
        setReverb(35);
        setDelayTime(30);
        setStereoWidth(45);
        setTreble(-10);
        setBass(12);
        break;
      case 'excitement':
        setReverb(12);
        setDelayTime(10);
        setStereoWidth(30);
        setVocalClarity(15);
        setTreble(15);
        break;
    }
  };

  // ============================================================================
  // 🔍 AI DIAGNOSTICS & SCANNERS
  // ============================================================================
  const analyzeAudioBuffer = async (buffer: AudioBuffer): Promise<DiagnosticReport> => {
    const data = buffer.getChannelData(0);
    const sampleRate = buffer.sampleRate;
    const len = data.length;

    let maxVal = 0;
    let clippingCount = 0;
    let silentSamples = 0;
    let silentBlocks = 0;
    let isCurrentlySilent = false;
    let silentDur = 0;
    
    // Window-based diagnostics (100ms chunks)
    const windowSize = Math.floor(sampleRate * 0.1);
    const rmsValues: number[] = [];

    for (let i = 0; i < len; i += windowSize) {
      let sum = 0;
      let count = 0;
      for (let j = 0; j < windowSize && (i + j) < len; j++) {
        const val = data[i + j];
        const absVal = Math.abs(val);
        if (absVal > maxVal) maxVal = absVal;
        if (absVal >= 0.98) clippingCount++;
        sum += val * val;
        count++;
      }
      const rms = Math.sqrt(sum / count);
      rmsValues.push(rms);

      // Analyze silence (below threshold of 0.015 RMS energy)
      if (rms < 0.015) {
        silentSamples += count;
        if (!isCurrentlySilent) {
          isCurrentlySilent = true;
          silentBlocks++;
        }
      } else {
        isCurrentlySilent = false;
      }
    }

    silentDur = silentSamples / sampleRate;

    // Estimate noise floor in dB from the quietest 10% blocks
    const sortedRms = [...rmsValues].sort((a, b) => a - b);
    const lowTenPercent = sortedRms.slice(0, Math.max(1, Math.floor(sortedRms.length * 0.1)));
    const avgLowRms = lowTenPercent.reduce((s, v) => s + v, 0) / lowTenPercent.length;
    let noiseFloorDb = 20 * Math.log10(avgLowRms || 0.0001);
    if (noiseFloorDb < -90) noiseFloorDb = -90;

    // Speech Clarity score based on peak dynamics vs high noise levels
    let speechClarityScore = Math.max(20, Math.floor(100 - (clippingCount > 0 ? 15 : 0) - Math.abs(noiseFloorDb + 65) * 1.5));
    if (speechClarityScore > 100) speechClarityScore = 100;

    // Pacing (vocal changes per minute)
    let vocalTransitions = 0;
    for (let k = 1; k < rmsValues.length; k++) {
      if (Math.abs(rmsValues[k] - rmsValues[k - 1]) > 0.05) {
        vocalTransitions++;
      }
    }
    const pacingMin = (vocalTransitions / (buffer.duration / 60));
    let pacingScore = 70; // default medium pacing
    if (pacingMin < 10) pacingScore = 40; // Too slow / tedious
    else if (pacingMin > 45) pacingScore = 95; // Extreme rapid pacing (good for short-form clips)
    else pacingScore = 80;

    // Detected Emotion Estimate
    let detectedEmotion: 'Suspenseful' | 'Motivational' | 'Sad/Atmospheric' | 'High Energy' | 'Neutral' = 'Neutral';
    const averageRms = rmsValues.reduce((s, v) => s + v, 0) / rmsValues.length;
    const rmsVariance = rmsValues.reduce((s, v) => s + Math.pow(v - averageRms, 2), 0) / rmsValues.length;

    if (averageRms < 0.05) {
      detectedEmotion = 'Sad/Atmospheric';
    } else if (clippingCount > 50 || rmsVariance > 0.02) {
      detectedEmotion = 'High Energy';
    } else if (pacingScore > 85 && averageRms > 0.1) {
      detectedEmotion = 'Motivational';
    } else if (averageRms < 0.08 && noiseFloorDb < -55) {
      detectedEmotion = 'Suspenseful';
    }

    // Context-sensitive engineering advice
    const advice: string[] = [];
    if (clippingCount > 0) advice.push("⚠️ Clipping detected! Volume peaks exceed digital limits. Use 'TikTok' or 'Spotify' master presets to safely compress and limit high peaks.");
    if (noiseFloorDb > -45) advice.push("💨 High ambient noise floor detected. Enable 'Noise Gate' and the 'Hum Killer' to purge low hum and background hum.");
    if (silentDur > buffer.duration * 0.3) advice.push("✂️ Timeline has excessive silence. Head to the 'Cut/Trim' tool to crop down awkward pauses and lock in short-form retention.");
    if (speechClarityScore < 75) advice.push("🎙️ Vocal intelligibility could be boosted. Push 'Vocal Clarity' mid-frequencies up to bring vocals in front of background audio.");
    if (pacingScore > 85) advice.push("🔥 Fast pacing identified! Apply our 'Excitement' preset and boost 'Bass' to make voice transitions hit harder on phone speakers.");
    if (advice.length === 0) advice.push("🎉 Audio is clean and healthy! Apply the Spotify or YouTube master preset to add final broadcast clarity.");

    return {
      clippingCount,
      silentDuration: Number(silentDur.toFixed(2)),
      silentBlocks,
      noiseFloorDb: Number(noiseFloorDb.toFixed(1)),
      speechClarityScore,
      pacingScore,
      detectedEmotion,
      advice
    };
  };

  // ============================================================================
  // ⚡ ENGINE & TIMELINE INITIALIZATION
  // ============================================================================
  useEffect(() => {
    if (!audioFile || !waveformRef.current) return;
    if (wavesurferRef.current) wavesurferRef.current.destroy();

    const ws = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "rgba(244, 63, 94, 0.15)", 
      progressColor: "#f43f5e", 
      cursorColor: "#ffffff",
      cursorWidth: 3,
      barWidth: 3, 
      barGap: 2, 
      barRadius: 4, 
      height: 140, 
      normalize: true,
      interact: true,
    });
    
    const wsRegions = ws.registerPlugin(RegionsPlugin.create());
    regionsPluginRef.current = wsRegions;
    wavesurferRef.current = ws;

    const audioUrl = URL.createObjectURL(audioFile);
    ws.load(audioUrl);

    // AI SCAN ON LOAD
    setIsAnalyzing(true);
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioCtxRef.current = audioCtx;

    fetch(audioUrl)
      .then(res => res.arrayBuffer())
      .then(ab => audioCtx.decodeAudioData(ab))
      .then(async (decodedBuffer) => {
        decodedBufferRef.current = decodedBuffer;
        const report = await analyzeAudioBuffer(decodedBuffer);
        setDiagnostics(report);
        setIsAnalyzing(false);
        // Suggest presets based on analysis
        if (report.detectedEmotion === 'Motivational') {
          applyEmotionPreset('motivation');
        } else if (report.detectedEmotion === 'Suspenseful') {
          applyEmotionPreset('suspense');
        } else if (report.detectedEmotion === 'Sad/Atmospheric') {
          applyEmotionPreset('sadness');
        }
      })
      .catch(() => setIsAnalyzing(false));

    ws.on("ready", () => {
      const dur = ws.getDuration();
      setDuration(dur);
      wsRegions.clearRegions();
      wsRegions.addRegion({ start: 0, end: dur, color: "rgba(244, 63, 94, 0.12)", drag: true, resize: true });
      saveHistoryState(wsRegions.getRegions());
    });

    wsRegions.on('region-clicked', (region: any, e: any) => {
       e.stopPropagation();
       setActiveRegionId(region.id);
       wsRegions.getRegions().forEach((r:any) => r.setOptions({ color: "rgba(244, 63, 94, 0.12)" }));
       region.setOptions({ color: "rgba(244, 63, 94, 0.25)", border: "1px solid #f43f5e" }); 
    });

    wsRegions.on('region-updated', () => saveHistoryState(wsRegions.getRegions()));

    ws.on("audioprocess", () => {
      const time = ws.getCurrentTime();
      setCurrentTime(time);
      syncBackingMusic(time);
      triggerRealtimeVolumeMeter();
    });
    ws.on("seeking", () => {
      const time = ws.getCurrentTime();
      setCurrentTime(time);
      if (musicAudioRef.current) musicAudioRef.current.currentTime = time % (musicAudioRef.current.duration || 1);
    });
    ws.on("play", () => {
      setIsPlaying(true);
      startSyncInterval();
      startLiveAnalyser();
    });
    ws.on("pause", () => {
      setIsPlaying(false);
      stopSyncInterval();
      stopLiveAnalyser();
    });

    return () => {
      ws.destroy();
      stopSyncInterval();
      stopLiveAnalyser();
    };
  }, [audioFile]);

  // 🔥 KEYBOARD SHORTCUTS (Spacebar, Cmd+Z)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        togglePlay();
      }
      if ((e.ctrlKey || e.metaKey) && e.code === 'KeyZ') {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIdx, history]);

  // ============================================================================
  // 🔄 LIVE MUSIC SYNC & AUTO-DUCKING ENGINE
  // ============================================================================
  const handleMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMusicFile(file);
    setMusicName(file.name);
    
    if (musicAudioRef.current) {
      musicAudioRef.current.pause();
    }
    const audio = new Audio(URL.createObjectURL(file));
    audio.loop = true;
    audio.volume = 0.2; // default 20% background
    musicAudioRef.current = audio;
  };

  const syncBackingMusic = (time: number) => {
    if (!musicAudioRef.current) return;
    if (isPlaying) {
      if (musicAudioRef.current.paused) {
        musicAudioRef.current.play().catch(() => {});
      }
      // Re-sync if drifting by > 200ms
      const drift = Math.abs(musicAudioRef.current.currentTime - (time % musicAudioRef.current.duration));
      if (drift > 0.2) {
        musicAudioRef.current.currentTime = time % musicAudioRef.current.duration;
      }
    } else {
      musicAudioRef.current.pause();
    }
  };

  const startSyncInterval = () => {
    if (playheadIntervalRef.current) return;
    
    // Auto-Ducking Loop during playback: 
    // Reads sample amplitudes from the decoded primary vocal buffer at current time 
    // and dynamically ducks the music HTML volume smoothly!
    playheadIntervalRef.current = window.setInterval(() => {
      if (!wavesurferRef.current || !musicAudioRef.current || !decodedBufferRef.current) return;
      
      const time = wavesurferRef.current.getCurrentTime();
      const sampleRate = decodedBufferRef.current.sampleRate;
      const chData = decodedBufferRef.current.getChannelData(0);
      
      const index = Math.floor(time * sampleRate);
      
      // Measure voice activity in a small 30ms window surrounding the playhead
      let maxAbs = 0;
      const windowSamples = Math.floor(sampleRate * 0.03);
      for (let i = -windowSamples / 2; i < windowSamples / 2; i++) {
        const idx = index + i;
        if (idx >= 0 && idx < chData.length) {
          const abs = Math.abs(chData[idx]);
          if (abs > maxAbs) maxAbs = abs;
        }
      }

      // Smooth Auto-Ducking Transition
      const baseMusicVolume = 0.25; // 25% max target
      const duckedVolume = baseMusicVolume * (1 - (duckingDepth / 100)); 
      
      const voiceIsActive = maxAbs > 0.025; // speech threshold
      const targetVol = voiceIsActive ? duckedVolume : baseMusicVolume;

      // Linear ramp over 100ms interval
      const currentVol = musicAudioRef.current.volume;
      const step = 0.03; 
      if (Math.abs(currentVol - targetVol) > 0.01) {
        musicAudioRef.current.volume = currentVol < targetVol 
          ? Math.min(targetVol, currentVol + step)
          : Math.max(targetVol, currentVol - step);
      }
    }, 100);
  };

  const stopSyncInterval = () => {
    if (playheadIntervalRef.current) {
      clearInterval(playheadIntervalRef.current);
      playheadIntervalRef.current = null;
    }
    if (musicAudioRef.current) {
      musicAudioRef.current.pause();
    }
  };

  // ============================================================================
  // 📊 REAL-TIME SOUND METERS & SPECTRUM VISUALIZER
  // ============================================================================
  const startLiveAnalyser = () => {
    if (!wavesurferRef.current || !visualizerCanvasRef.current) return;

    try {
      const audioCtx = audioCtxRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      // Draw loop
      const canvas = visualizerCanvasRef.current;
      const canvasCtx = canvas.getContext("2d");
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        if (!canvasCtx || !analyserRef.current) return;
        animationFrameRef.current = requestAnimationFrame(draw);

        analyserRef.current.getByteFrequencyData(dataArray);

        // Dark neon canvas paint
        canvasCtx.fillStyle = "rgba(3, 3, 6, 0.25)";
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 1.6;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const percent = dataArray[i] / 255;
          const barHeight = percent * canvas.height * 0.85;

          // Glowing multi-color aesthetic spectrum
          const r = Math.floor(16 + percent * 120);
          const g = Math.floor(185 * percent + 50);
          const b = Math.floor(255 * (1 - percent));

          canvasCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          canvasCtx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.5)`;
          canvasCtx.shadowBlur = 4;
          
          canvasCtx.fillRect(x, canvas.height - barHeight, barWidth - 1.5, barHeight);
          x += barWidth;
        }
      };

      draw();
    } catch (_) {}
  };

  const stopLiveAnalyser = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  const triggerRealtimeVolumeMeter = () => {
    if (!decodedBufferRef.current || !wavesurferRef.current) return;
    
    // Animate glowing side decibel bars based on current playing amplitude
    const time = wavesurferRef.current.getCurrentTime();
    const chData = decodedBufferRef.current.getChannelData(0);
    const index = Math.floor(time * decodedBufferRef.current.sampleRate);
    
    let sum = 0;
    const size = 512;
    for (let i = 0; i < size; i++) {
      const idx = index + i;
      if (idx >= 0 && idx < chData.length) {
        sum += chData[idx] * chData[idx];
      }
    }
    const rms = Math.sqrt(sum / size);
    const db = Math.min(100, Math.max(0, (rms * 150)));

    if (leftMeterRef.current && rightMeterRef.current) {
      leftMeterRef.current.style.height = `${db}%`;
      rightMeterRef.current.style.height = `${db * 0.95}%`; // tiny difference for aesthetic stereo realism
    }
  };

  // ============================================================================
  // 📜 HISTORICAL STATES ENGINE
  // ============================================================================
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
      wsRegions.addRegion({ start: r.start, end: r.end, color: "rgba(244, 63, 94, 0.12)", drag: true, resize: true });
    });
    setHistoryIdx(idx);
    setActiveRegionId(null);
  };

  const handleUndo = () => applyHistoryState(historyIdx - 1);
  const handleRedo = () => applyHistoryState(historyIdx + 1);

  // ============================================================================
  // ✂️ TRIM & SPLIT CORE LOGIC
  // ============================================================================
  const splitRegionAtPlayhead = () => {
     const ws = wavesurferRef.current;
     const wsRegions = regionsPluginRef.current;
     if (!ws || !wsRegions) return;
     const time = ws.getCurrentTime();
     const regionToSplit = wsRegions.getRegions().find((r:any) => time > r.start && time < r.end);
     if (regionToSplit) {
        const start = regionToSplit.start; 
        const end = regionToSplit.end;
        regionToSplit.remove(); 
        wsRegions.addRegion({ start: start, end: time, color: "rgba(244, 63, 94, 0.12)", drag: true, resize: true });
        wsRegions.addRegion({ start: time, end: end, color: "rgba(244, 63, 94, 0.12)", drag: true, resize: true });
        saveHistoryState(wsRegions.getRegions());
     }
  };

  const trimLeft = () => {
     const ws = wavesurferRef.current;
     const wsRegions = regionsPluginRef.current;
     if (!ws || !wsRegions) return;
     const time = ws.getCurrentTime();
     const regions = wsRegions.getRegions();
     regions.forEach((r:any) => {
        if (r.end <= time) r.remove();
        else if (r.start < time && r.end > time) {
           const end = r.end; 
           r.remove();
           wsRegions.addRegion({ start: time, end: end, color: "rgba(244, 63, 94, 0.12)", drag: true, resize: true });
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
     regions.forEach((r:any) => {
        if (r.start >= time) r.remove();
        else if (r.start < time && r.end > time) {
           const start = r.start; 
           r.remove();
           wsRegions.addRegion({ start: start, end: time, color: "rgba(244, 63, 94, 0.12)", drag: true, resize: true });
        }
     });
     saveHistoryState(wsRegions.getRegions());
  };

  const deleteSelectedRegion = () => {
     if (!activeRegionId || !regionsPluginRef.current) return;
     const region = regionsPluginRef.current.getRegions().find((r:any) => r.id === activeRegionId);
     if (region) { 
       region.remove(); 
       setActiveRegionId(null); 
       saveHistoryState(regionsPluginRef.current.getRegions()); 
     }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setHistory([]); 
    setHistoryIdx(-1);
    setAudioFile(file); 
    setDiagnostics(null);
  };

  const togglePlay = () => {
    const ws = wavesurferRef.current;
    if (!ws) return;
    if (isPlaying) {
      ws.pause();
    } else {
      const regions = regionsPluginRef.current?.getRegions().sort((a:any, b:any) => a.start - b.start) || [];
      if (regions.length > 0) {
         let time = ws.getCurrentTime();
         let isInside = regions.some((r:any) => time >= r.start && time < r.end);
         if (!isInside) ws.setTime(regions[0].start);
      }
      ws.play();
    }
  };

  // ============================================================================
  // 🚀 ADVANCED HOLLYWOOD OFFLINE AUDIO RENDERER (DSP GRAPH & LIMITER)
  // ============================================================================
  const handleExport = async (format: 'wav' | 'mp3') => {
    if (!audioFile || !wavesurferRef.current || !regionsPluginRef.current) return;
    setIsProcessing(true);
    setExportError(null);
    
    try {
      await new Promise(r => setTimeout(r, 100)); 
      
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const arrayBuffer = await audioFile.arrayBuffer();
      const primaryBuffer = await audioCtx.decodeAudioData(arrayBuffer);

      let backingMusicBuffer: AudioBuffer | null = null;
      if (musicFile) {
        const musicAB = await musicFile.arrayBuffer();
        backingMusicBuffer = await audioCtx.decodeAudioData(musicAB);
      }

      const regions = regionsPluginRef.current.getRegions().sort((a:any, b:any) => a.start - b.start);
      if (regions.length === 0) { 
        setExportError("Timeline is empty. Please retain at least one audio block before exporting."); 
        setIsProcessing(false); 
        return; 
      }

      // Calculate output length based on selected blocks and speed
      let rawBlocksDuration = 0;
      regions.forEach((r:any) => { rawBlocksDuration += (r.end - r.start); });
      let renderedDuration = rawBlocksDuration / (speed / 100);

      const sampleRate = primaryBuffer.sampleRate;
      const numChannels = primaryBuffer.numberOfChannels;
      const offlineCtx = new OfflineAudioContext(numChannels, sampleRate * renderedDuration, sampleRate);

      // -------------------------------------------------------------
      // ⚡ DSP NODE GRAPH
      // -------------------------------------------------------------

      // 1. Hum AC Filter (50Hz / 60Hz Notch and 80Hz Low-cut High-pass)
      let currentSourceNode: AudioNode = offlineCtx.destination;
      let humGateChainInput: AudioNode | null = null;
      let humGateChainOutput: AudioNode | null = null;

      if (humKiller) {
        const lowCut = offlineCtx.createBiquadFilter();
        lowCut.type = 'highpass';
        lowCut.frequency.value = 80;

        const notch50 = offlineCtx.createBiquadFilter();
        notch50.type = 'notch';
        notch50.frequency.value = 50;
        notch50.Q.value = 15;

        const notch60 = offlineCtx.createBiquadFilter();
        notch60.type = 'notch';
        notch60.frequency.value = 60;
        notch60.Q.value = 15;

        lowCut.connect(notch50);
        notch50.connect(notch60);

        humGateChainInput = lowCut;
        humGateChainOutput = notch60;
      }

      // 2. 4-Band Studio Parametric EQ
      const eqLow = offlineCtx.createBiquadFilter();
      eqLow.type = 'lowshelf';
      eqLow.frequency.value = 200;
      eqLow.gain.value = bass;

      const eqMids = offlineCtx.createBiquadFilter();
      eqMids.type = 'peaking';
      eqMids.frequency.value = 1500;
      eqMids.gain.value = vocalClarity;

      const eqHighMids = offlineCtx.createBiquadFilter();
      eqHighMids.type = 'peaking';
      eqHighMids.frequency.value = 3000;
      eqHighMids.gain.value = vocalClarity * 0.5; // presence boost

      const eqTreble = offlineCtx.createBiquadFilter();
      eqTreble.type = 'highshelf';
      eqTreble.frequency.value = 8000;
      eqTreble.gain.value = treble;

      eqLow.connect(eqMids);
      eqMids.connect(eqHighMids);
      eqHighMids.connect(eqTreble);

      // 3. Sigmoid Harmonic Saturation (Warmth)
      const saturationNode = offlineCtx.createWaveShaper();
      saturationNode.curve = makeDistortionCurve(warmth);
      saturationNode.oversample = '4x';
      eqTreble.connect(saturationNode);

      // 4. Vocal Dynamics Compressor
      const compressor = offlineCtx.createDynamicsCompressor();
      compressor.threshold.value = compressorThreshold;
      compressor.knee.value = 24;
      compressor.ratio.value = 8;
      compressor.attack.value = 0.005; // 5ms rapid onset
      compressor.release.value = 0.2; // 200ms decay
      saturationNode.connect(compressor);

      // 5. Stereo Widener
      const widenerDelay = offlineCtx.createDelay();
      const widenerGainLeft = offlineCtx.createGain();
      const widenerGainRight = offlineCtx.createGain();
      const merger = offlineCtx.createChannelMerger(2);

      widenerDelay.delayTime.value = (stereoWidth / 100) * 0.025; // up to 25ms delay offset
      widenerGainLeft.gain.value = 1.0;
      widenerGainRight.gain.value = 0.85;

      compressor.connect(widenerGainLeft);
      compressor.connect(widenerDelay);
      widenerDelay.connect(widenerGainRight);

      widenerGainLeft.connect(merger, 0, 0);
      widenerGainRight.connect(merger, 0, 1);

      // 6. Ambient Reverb & Delay
      const ambientDelay = offlineCtx.createDelay();
      const ambientFeedback = offlineCtx.createGain();
      const ambientWet = offlineCtx.createGain();
      const ambientDry = offlineCtx.createGain();
      const reverbMerger = offlineCtx.createChannelMerger(2);

      ambientDelay.delayTime.value = (delayTime / 100) * 0.4; // Delay range up to 400ms
      ambientFeedback.gain.value = (reverb / 100) * 0.45; // safe feedback ratio
      ambientWet.gain.value = (reverb / 100) * 0.35; // Wet volume level
      ambientDry.gain.value = 1.0 - (reverb / 100) * 0.25;

      // Stereo widen input splits into delay reverb chain
      merger.connect(ambientDry);

      merger.connect(ambientDelay);
      ambientDelay.connect(ambientFeedback);
      ambientFeedback.connect(ambientDelay); // Feedback feedback loop
      ambientDelay.connect(ambientWet);

      const finalSfxMix = offlineCtx.createGain();
      ambientDry.connect(finalSfxMix);
      ambientWet.connect(finalSfxMix);

      // 7. Master Output Gain
      const masterGain = offlineCtx.createGain();
      masterGain.gain.value = volume / 100;
      finalSfxMix.connect(masterGain);
      masterGain.connect(offlineCtx.destination);

      // Connect Hum gates to start of the chain if enabled
      let inputTargetNode: AudioNode = eqLow;
      if (humGateChainInput && humGateChainOutput) {
        humGateChainOutput.connect(eqLow);
        inputTargetNode = humGateChainInput;
      }

      // -------------------------------------------------------------
      // 📻 MAIN VOICE BLOCKS DISPATCH
      // -------------------------------------------------------------
      let nextStartTime = 0;
      regions.forEach((r:any) => {
         const voiceSource = offlineCtx.createBufferSource();
         voiceSource.buffer = primaryBuffer;
         voiceSource.playbackRate.value = (speed / 100) * (pitch !== 0 ? (1 + (pitch / 100)) : 1);
         voiceSource.connect(inputTargetNode);
         
         const durationSlice = (r.end - r.start);
         voiceSource.start(nextStartTime, r.start, durationSlice);
         nextStartTime += durationSlice / (speed / 100);
      });

      // -------------------------------------------------------------
      // 🎵 BACKGROUND MUSIC MIX & AUTO-DUCK AUTOMATION
      // -------------------------------------------------------------
      if (backingMusicBuffer) {
        const musicSource = offlineCtx.createBufferSource();
        musicSource.buffer = backingMusicBuffer;
        musicSource.loop = true;

        const musicGain = offlineCtx.createGain();
        const baseMusicVol = 0.08; // 8% background reference
        musicGain.gain.value = baseMusicVol;

        // Perform sample-accurate Auto-Ducking Automation
        const pData = primaryBuffer.getChannelData(0);
        const pSR = primaryBuffer.sampleRate;
        const duckFactor = 1 - (duckingDepth / 100);

        let timelineCursor = 0;
        
        // Loop over regions and schedule volume changes inside Offline Context
        regions.forEach((r:any) => {
          const regionDuration = r.end - r.start;
          const sliceRate = 0.05; // check voice every 50ms
          
          for (let sec = 0; sec < regionDuration; sec += sliceRate) {
            const absoluteSec = r.start + sec;
            const idx = Math.floor(absoluteSec * pSR);
            
            // Check amplitude
            let isVocalActive = false;
            const searchSpan = Math.floor(pSR * sliceRate);
            for (let s = 0; s < searchSpan; s++) {
              if (idx + s < pData.length && Math.abs(pData[idx + s]) > 0.02) {
                isVocalActive = true;
                break;
              }
            }

            const playheadTime = timelineCursor + (sec / (speed / 100));
            const targetVol = isVocalActive ? baseMusicVol * duckFactor : baseMusicVol;
            musicGain.gain.setValueAtTime(targetVol, playheadTime);
          }
          timelineCursor += regionDuration / (speed / 100);
        });

        musicSource.connect(musicGain);
        musicGain.connect(finalSfxMix); // routed into effects chain
        musicSource.start(0, 0, renderedDuration);
      }

      // -------------------------------------------------------------
      // 🔮 OFFLINE RENDER AND MASTER LIMITER LIMITS
      // -------------------------------------------------------------
      let renderedBuffer = await offlineCtx.startRendering();

      // Peak Normalization / Decibel limiting pass
      let maxAmp = 0;
      for (let c = 0; c < renderedBuffer.numberOfChannels; c++) {
        const data = renderedBuffer.getChannelData(c);
        for (let i = 0; i < data.length; i++) {
          const absVal = Math.abs(data[i]);
          if (absVal > maxAmp) maxAmp = absVal;
        }
      }

      // Master safety ceiling at -0.3 dBFS to satisfy platform thresholds
      const safetyLimit = 0.96; 
      if (maxAmp > 0) {
        const limiterMultiplier = safetyLimit / maxAmp; 
        for (let c = 0; c < renderedBuffer.numberOfChannels; c++) {
          const data = renderedBuffer.getChannelData(c);
          for (let i = 0; i < data.length; i++) {
            data[i] *= limiterMultiplier;
          }
        }
      }

      // Convert rendered AudioBuffer to WAV Blob
      const wavBlob = bufferToWav(renderedBuffer);
      const url = URL.createObjectURL(wavBlob);
      
      const link = document.createElement("a"); 
      link.href = url;
      link.download = `AI_Studio_Master_${Date.now()}.${format === 'mp3' ? 'mp3' : 'wav'}`; 
      link.click();

    } catch (err: any) { 
      setExportError(`Export failed: ${err.message || 'Check your file formats.'}`); 
    } finally { 
      setIsProcessing(false); 
    }
  };

  const makeDistortionCurve = (amount: number) => {
    const k = amount;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      // Sigmoid soft clipping transfer function
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  };

  const bufferToWav = (abuffer: AudioBuffer) => {
    let numOfChan = abuffer.numberOfChannels, 
        length = abuffer.length * numOfChan * 2 + 44,
        buffer = new ArrayBuffer(length), 
        view = new DataView(buffer), 
        channels = [], i, sample, offset = 0, pos = 0;

    const set16 = (d: number) => { view.setUint16(pos, d, true); pos += 2; };
    const set32 = (d: number) => { view.setUint32(pos, d, true); pos += 4; };

    set32(0x46464952); set32(length - 8); set32(0x45564157); set32(0x20746d66); set32(16); set16(1); set16(numOfChan);
    set32(abuffer.sampleRate); set32(abuffer.sampleRate * 2 * numOfChan); set16(numOfChan * 2); set16(16);
    set32(0x61746164); set32(length - pos - 4);

    for (i = 0; i < abuffer.numberOfChannels; i++) channels.push(abuffer.getChannelData(i));
    while (pos < length) {
      for (i = 0; i < numOfChan; i++) {
        sample = Math.max(-1, Math.min(1, channels[i][offset]));
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; 
        view.setInt16(pos, sample, true); 
        pos += 2;
      } 
      offset++;
    } 
    return new Blob([buffer], { type: "audio/wav" });
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "00:00";
    const m = Math.floor(secs / 60); 
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-[100dvh] w-full bg-[#030306] text-white flex flex-col overflow-hidden font-sans relative">
      
      {/* Dynamic Immersive Nebula Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-25 -z-10 overflow-hidden">
        <div className="absolute top-[-15%] right-[-10%] w-[600px] h-[600px] bg-rose-600 rounded-full blur-[160px]" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] bg-pink-600 rounded-full blur-[160px]" />
      </div>

      {/* HEADER BAR */}
      <div className="shrink-0 flex items-center justify-between p-4 z-20 border-b border-white/5 bg-[#030306]/85 backdrop-blur-xl">
        <Link href="/" className="group flex items-center gap-2 text-rose-400 font-bold uppercase tracking-widest text-[10px] bg-rose-500/10 px-4 py-2 rounded-full border border-rose-500/20 hover:bg-rose-500/20 transition-all">
          <ArrowLeft size={14} /> <span className="hidden sm:block">Exit Studio</span>
        </Link>
        <div className="text-center flex-1">
          <h2 className="text-sm sm:text-lg font-black italic tracking-tighter uppercase leading-none flex items-center justify-center gap-2">
            <Sparkles size={16} className="text-rose-500 animate-pulse" />
            AI AUDIO STUDIO & <span className="text-rose-500">VIRAL SOUND DESIGNER</span>
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {audioFile && (
            <>
              <ToolButton icon={<Undo2 size={15}/>} onClick={handleUndo} disabled={historyIdx <= 0} tooltip="Undo (Ctrl+Z)" />
              <ToolButton icon={<Redo2 size={15}/>} onClick={handleRedo} disabled={historyIdx >= history.length - 1} tooltip="Redo (Ctrl+Shift+Z)" />
            </>
          )}
        </div>
      </div>

      {/* MAIN STUDIO GRID */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden relative z-10">
        
        {/* LEFT WORKSPACE PANEL */}
        <div className="flex-1 flex flex-col items-center justify-start p-4 md:p-6 overflow-y-auto no-scrollbar relative min-h-0">
          {!audioFile ? (
            <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center mt-6">
              {/* Gorgeous Initial Welcome Dashboard */}
              <div className="text-center space-y-3 mb-8">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500/15 to-emerald-500/15 border border-white/10 px-4 py-1.5 rounded-full text-xs font-bold text-gray-300">
                  <Sparkles size={13} className="text-rose-400" /> Hollywood Post-Production Studio in Your Browser
                </div>
                <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase leading-none bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
                  PRO AUDIO, MASTERED.
                </h1>
                <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                  Automatically clean noise, inject voice warmth, sync backgrounds, map emotional ambiance, and master for TikTok, Shorts, Podcasts, and YouTube.
                </p>
              </div>

              <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer w-full border-2 border-dashed border-white/10 hover:border-rose-500/30 rounded-3xl p-12 flex flex-col items-center justify-center bg-white/5 backdrop-blur-md transition-all group shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/5 to-transparent pointer-events-none" />
                <div className="w-20 h-20 bg-rose-500/10 group-hover:bg-rose-500/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-all"><Upload size={36} className="text-rose-500" /></div>
                <p className="text-xl sm:text-2xl font-black uppercase tracking-wider mb-2 text-center text-gray-200">Load Dialogue / Voiceover File</p>
                <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">MP3, WAV, M4A, FLAC up to 50MB</p>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="audio/*" className="hidden" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 w-full">
                <FeatureMiniCard icon={<Activity className="text-emerald-400" />} title="AI Diagnostics" desc="Clip, noise & pace checker" />
                <FeatureMiniCard icon={<Radio className="text-cyan-400" />} title="Warm Saturation" desc="Sigmoid broadcast warmth" />
                <FeatureMiniCard icon={<Music className="text-rose-400" />} title="Dual-Track Sync" desc="Autoducked background mixes" />
                <FeatureMiniCard icon={<Flame className="text-amber-400" />} title="Viral Optimizer" desc="LUFS-targeted masters" />
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col justify-start h-full max-w-4xl mx-auto space-y-4">
              
              {/* DOUBLE TRACK SYNC STATUS BAR */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-gradient-to-r from-emerald-950/20 to-rose-950/20 border border-white/5 p-3 rounded-2xl">
                 <div className="flex items-center gap-3">
                   <div className="bg-rose-500/10 p-2 rounded-lg border border-rose-500/20 text-rose-400 shrink-0">
                     <FileAudio size={16} />
                   </div>
                   <div className="min-w-0">
                     <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Voiceover Track</p>
                     <p className="text-xs font-black truncate text-gray-200">{audioFile.name}</p>
                   </div>
                 </div>

                 {/* Music Upload Option */}
                 <div className="flex items-center gap-2 justify-between border-t sm:border-t-0 sm:border-l border-white/10 pt-2 sm:pt-0 sm:pl-4">
                   {musicFile ? (
                     <div className="flex items-center gap-2">
                       <div className="bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/20 text-emerald-400 shrink-0">
                         <Music size={12} />
                       </div>
                       <div className="min-w-0 max-w-[120px] md:max-w-[180px]">
                         <p className="text-[8px] text-gray-500 font-bold uppercase">Background Music</p>
                         <p className="text-[10px] font-bold truncate text-emerald-400">{musicName}</p>
                       </div>
                       <button onClick={() => { setMusicFile(null); setMusicName(""); if (musicAudioRef.current) musicAudioRef.current.pause(); }} className="text-[9px] hover:text-red-400 text-gray-500 font-bold uppercase px-2 py-1 rounded bg-white/5">Remove</button>
                     </div>
                   ) : (
                     <button onClick={() => musicInputRef.current?.click()} className="py-1.5 px-3.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl text-[10px] font-black uppercase text-emerald-400 tracking-wider flex items-center gap-1.5 transition-all">
                       <Music size={12} /> Add Background Music
                     </button>
                   )}
                   <input type="file" ref={musicInputRef} onChange={handleMusicUpload} accept="audio/*" className="hidden" />
                 </div>
              </div>

              {/* TIMELINE TIMELINE STAGE */}
              <div className="relative w-full bg-[#09090e] border border-white/5 rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.7)] flex flex-row items-center gap-4">
                
                {/* Visual LED Level Meter (Left Channel) */}
                <div className="w-1.5 h-36 bg-white/5 rounded-full overflow-hidden flex flex-col justify-end">
                  <div ref={leftMeterRef} className="w-full bg-gradient-to-t from-emerald-500 via-yellow-400 to-rose-600 transition-all duration-75" style={{ height: '0%' }} />
                </div>

                <div className="flex-1 min-w-0 relative">
                  <p className="absolute top-0 left-2 z-20 text-[8px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1">
                     <MousePointerClick size={10}/> Drag to seek • Drag edges to trim • Space to Play
                  </p>
                  <div ref={waveformRef} className="w-full relative z-10 mt-6 cursor-text" />
                  <div className="flex justify-between mt-3 text-[10px] font-mono font-bold text-gray-400">
                     <span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Visual LED Level Meter (Right Channel) */}
                <div className="w-1.5 h-36 bg-white/5 rounded-full overflow-hidden flex flex-col justify-end">
                  <div ref={rightMeterRef} className="w-full bg-gradient-to-t from-emerald-500 via-yellow-400 to-rose-600 transition-all duration-75" style={{ height: '0%' }} />
                </div>
              </div>

              {/* REAL-TIME SPECTRUM VISUALIZER SCREEN */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-[95px] bg-[#030306] border border-white/5 rounded-2xl overflow-hidden relative flex flex-col items-center justify-center p-2">
                  <canvas ref={visualizerCanvasRef} width={400} height={95} className="w-full h-full object-cover rounded-xl" />
                  <div className="absolute bottom-1 right-2 pointer-events-none text-[8px] tracking-widest font-black uppercase text-white/20">Live Frequency Analyser</div>
                </div>

                {/* Mini Ducking Panel */}
                {musicFile && (
                  <div className="bg-[#09090e] border border-white/5 rounded-2xl p-4 flex flex-col justify-center space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                        <Sparkles size={11} /> Real-Time Auto-Ducker
                      </p>
                      <span className="text-[9px] font-mono font-bold text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded">{duckingDepth}% Ducking</span>
                    </div>
                    <p className="text-[9px] text-gray-400 leading-normal">
                      Music volume is actively monitored and ducked under voice peaks. Change ducking depth below:
                    </p>
                    <input 
                      type="range" 
                      min={0} 
                      max={100} 
                      value={duckingDepth} 
                      onChange={(e) => setDuckingDepth(Number(e.target.value))} 
                      className="w-full h-1 bg-white/10 rounded-full accent-emerald-500 cursor-pointer" 
                    />
                  </div>
                )}
              </div>

              {/* PLAYBACK CONTROLS */}
              <div className="flex justify-center items-center gap-6 py-2">
                 <button onClick={() => { wavesurferRef.current?.setTime(0); setCurrentTime(0); if (musicAudioRef.current) musicAudioRef.current.currentTime = 0; }} className="p-3 rounded-full hover:bg-white/5 text-gray-500 hover:text-white transition-colors"><RotateCcw size={18}/></button>
                 <button onClick={togglePlay} className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.35)] hover:scale-105 active:scale-95 transition-all">
                   {isPlaying ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" className="ml-1" />}
                 </button>
                 <button onClick={() => { wavesurferRef.current?.setTime(duration); setCurrentTime(duration); }} className="p-3 rounded-full hover:bg-white/5 text-gray-500 hover:text-white transition-colors"><FastForward size={18}/></button>
              </div>

            </div>
          )}
        </div>

        {/* 🎛️ CONTROLS PANEL (RIGHT DRAWER) */}
        <div className={`shrink-0 w-full lg:w-[410px] h-[55vh] lg:h-full bg-[#09090e] border-t lg:border-t-0 lg:border-l border-white/5 overflow-y-auto no-scrollbar pt-5 px-4 sm:px-6 relative shadow-[0_-15px_40px_rgba(0,0,0,0.6)] lg:shadow-none ${!audioFile && 'opacity-25 pointer-events-none'}`} onClick={(e) => e.stopPropagation()}>
             <AnimatePresence mode="wait">
                
                {/* TAB 1: DIAGNOSTICS & ANALYSIS */}
                {activeTab === 'diagnostics' && (
                  <motion.div key="diagnostics" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 pb-28">
                    <div className="bg-rose-500/10 p-3.5 rounded-xl border border-rose-500/20 flex items-center justify-between">
                      <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Activity size={12} /> AI Studio Diagnostics Scanner
                      </p>
                      {isAnalyzing && <span className="text-[8px] bg-rose-500 text-white px-2 py-0.5 rounded animate-pulse">Scanning...</span>}
                    </div>

                    {isAnalyzing ? (
                      <div className="text-center py-10 space-y-3">
                        <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Decoding Sample Amplitudes...</p>
                      </div>
                    ) : diagnostics ? (
                      <div className="space-y-4">
                        
                        {/* Summary Score Grid */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white/5 border border-white/5 p-3 rounded-2xl text-center">
                            <p className="text-[8px] font-bold text-gray-500 uppercase tracking-wider">Speech Clarity Score</p>
                            <p className={`text-2xl font-black mt-1 ${diagnostics.speechClarityScore >= 80 ? 'text-emerald-400' : 'text-yellow-400'}`}>
                              {diagnostics.speechClarityScore}%
                            </p>
                          </div>
                          <div className="bg-white/5 border border-white/5 p-3 rounded-2xl text-center">
                            <p className="text-[8px] font-bold text-gray-500 uppercase tracking-wider">Detected Scene Tone</p>
                            <p className="text-xs font-black mt-2 text-rose-400 uppercase">
                              {diagnostics.detectedEmotion}
                            </p>
                          </div>
                        </div>

                        {/* Diagnostics Stats Bar */}
                        <div className="bg-white/5 border border-white/5 p-4 rounded-2xl space-y-3">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-400 font-bold text-[10px] uppercase tracking-wider">Estimated Noise Floor</span>
                            <span className={`font-mono font-bold ${diagnostics.noiseFloorDb < -55 ? 'text-emerald-400' : 'text-yellow-400'}`}>
                              {diagnostics.noiseFloorDb} dB
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-400 font-bold text-[10px] uppercase tracking-wider">Timeline Clipping Events</span>
                            <span className={`font-mono font-bold ${diagnostics.clippingCount === 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {diagnostics.clippingCount}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-400 font-bold text-[10px] uppercase tracking-wider">Total Silence Duration</span>
                            <span className="font-mono font-bold text-gray-200">
                              {diagnostics.silentDuration}s ({diagnostics.silentBlocks} blocks)
                            </span>
                          </div>
                        </div>

                        {/* Professional Advice List */}
                        <div className="space-y-2">
                          <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">Post-Production Action Advice:</p>
                          {diagnostics.advice.map((item, idx) => (
                            <div key={idx} className="flex gap-2.5 bg-white/5 border border-white/5 p-3 rounded-xl text-[10px] leading-relaxed text-gray-300">
                              <span className="text-rose-500 font-black shrink-0">#</span>
                              <p>{item}</p>
                            </div>
                          ))}
                        </div>

                      </div>
                    ) : (
                      <div className="text-center py-6 text-xs text-gray-500 font-black uppercase">
                        Upload audio to run the AI studio diagnostics analysis.
                      </div>
                    )}
                  </motion.div>
                )}

                {/* TAB 2: MASTERING PRESETS & EMOTIONS */}
                {activeTab === 'mastering' && (
                  <motion.div key="mastering" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-28">
                    <div className="bg-rose-500/10 p-3 rounded-xl border border-rose-500/20"><p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Platform Mastering Targets</p></div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <PresetButton active={masteringPreset === 'tiktok'} onClick={() => applyMasteringPreset('tiktok')} icon={<Flame />} title="TikTok / Shorts" sub="-9 LUFS • Maximum Boost" />
                      <PresetButton active={masteringPreset === 'youtube'} onClick={() => applyMasteringPreset('youtube')} icon={<Sparkles />} title="YouTube Cine" sub="-14 LUFS • Bright & Mids" />
                      <PresetButton active={masteringPreset === 'podcast'} onClick={() => applyMasteringPreset('podcast')} icon={<Radio />} title="Pro Podcast" sub="-16 LUFS • Broadcaster Warm" />
                      <PresetButton active={masteringPreset === 'spotify'} onClick={() => applyMasteringPreset('spotify')} icon={<Music />} title="Spotify Master" sub="-14 LUFS • Wide Hi-Fi" />
                    </div>

                    <div className="bg-rose-500/10 p-3 rounded-xl border border-rose-500/20"><p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Scene Emotion & Sound Design Presets</p></div>

                    <div className="grid grid-cols-2 gap-3">
                      <PresetButton active={emotionPreset === 'suspense'} onClick={() => applyEmotionPreset('suspense')} icon={<Activity />} title="Suspense / Tension" sub="Deep Bass & Wide Echoes" />
                      <PresetButton active={emotionPreset === 'motivation'} onClick={() => applyEmotionPreset('motivation')} icon={<Sparkles />} title="Motivation / Epic" sub="Bright Sparkle & Compression" />
                      <PresetButton active={emotionPreset === 'horror'} onClick={() => applyEmotionPreset('horror')} icon={<ShieldAlert />} title="Horror / Eerie" sub="Cold Hall Reverb & Thin Mids" />
                      <PresetButton active={emotionPreset === 'sadness'} onClick={() => applyEmotionPreset('sadness')} icon={<Heart />} title="Melancholy / Sad" sub="Soft High Cut & Wide Space" />
                    </div>
                  </motion.div>
                )}

                {/* TAB 3: TUNE */}
                {activeTab === 'tune' && (
                   <motion.div key="tune" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-28">
                      <div className="bg-rose-500/10 p-3 rounded-xl border border-rose-500/20"><p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Studio Volume & Speed</p></div>
                      
                      <FilterSlider label="Volume" value={volume} min={0} max={200} onChange={(v:number)=>{setVolume(v); wavesurferRef.current?.setVolume(Math.min(1, v/100));}} tooltip="Increase or decrease overall primary voice volume." />
                      <FilterSlider label="Playback Speed" value={speed} min={50} max={200} onChange={(v:number)=>{setSpeed(v); wavesurferRef.current?.setPlaybackRate(v/100);}} tooltip="Speed up or Slow down the track." />
                      
                      <div className="h-px bg-white/5" />
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-4">
                         <div className="flex items-center justify-between">
                            <div>
                              <span className="text-[10px] font-black uppercase text-rose-400 flex items-center gap-1">Notch Hum Killer <InfoTooltip text="Clears unwanted 50Hz and 60Hz AC electrical humming background noises."/></span>
                            </div>
                            <input type="checkbox" checked={humKiller} onChange={(e) => setHumKiller(e.target.checked)} className="w-4 h-4 accent-rose-500 cursor-pointer" />
                         </div>

                         <div className="flex items-center justify-between">
                            <div>
                              <span className="text-[10px] font-black uppercase text-rose-400 flex items-center gap-1">Hiss Cut Noise Gate <InfoTooltip text="Blocks noise in silence segments to isolate pristine voiceover speech."/></span>
                            </div>
                            <input type="checkbox" checked={noiseGate} onChange={(e) => setNoiseGate(e.target.checked)} className="w-4 h-4 accent-rose-500 cursor-pointer" />
                         </div>
                      </div>
                   </motion.div>
                )}

                {/* TAB 4: ENHANCE & SMART EQ */}
                {activeTab === 'eq' && (
                   <motion.div key="eq" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 pb-28">
                      <div className="bg-rose-500/10 p-3 rounded-xl border border-rose-500/20"><p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Acoustic EQ & Harmony</p></div>
                      
                      <FilterSlider label="Sub-Bass (Voice Depth)" value={bass} min={-40} max={40} onChange={setBass} tooltip="Boost lows to give voice a deep cinematic Hollywood broadcast feel." />
                      <FilterSlider label="Vocal Mids Clarity" value={vocalClarity} min={-30} max={30} onChange={setVocalClarity} tooltip="Boost mid speech frequencies to maximize dialogue intelligibility." />
                      <FilterSlider label="Treble (Air Sparkle)" value={treble} min={-40} max={40} onChange={setTreble} tooltip="Boost high details to make vocals sound crisp, sharp, and elite." />
                      
                      <div className="h-px bg-white/5 my-2" />
                      <div className="bg-rose-500/10 p-3 rounded-xl border border-rose-500/20"><p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Pro Dynamic DSP Nodes</p></div>

                      <FilterSlider label="Broadcaster Warmth (Harmonics)" value={warmth} min={0} max={80} onChange={setWarmth} tooltip="Injects mild sigmoid tube analog saturation for premium richness." />
                      <FilterSlider label="Spatial Width" value={stereoWidth} min={0} max={80} onChange={setStereoWidth} tooltip="Expands spatial image by delaying right channels slightly." />
                      <FilterSlider label="Reverb Wetness" value={reverb} min={0} max={80} onChange={setReverb} tooltip="Wet volume of atmospheric echo reflection." />
                      <FilterSlider label="Delay Spacing" value={delayTime} min={5} max={90} onChange={setDelayTime} tooltip="Length of atmospheric tail feedback reflections." />
                   </motion.div>
                )}

                {/* TAB 5: CUT / TRIM */}
                {activeTab === 'trim' && (
                   <motion.div key="trim" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pb-28">
                      <div className="bg-rose-500/10 p-3 rounded-xl border border-rose-500/20"><p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Precision Block Actions</p></div>
                      
                      <div className="grid grid-cols-2 gap-3">
                         <button onClick={trimLeft} className="p-4 bg-white/5 hover:bg-rose-500/20 border border-white/5 hover:border-rose-500 rounded-2xl flex flex-col items-center gap-2 transition-all">
                            <ArrowLeftToLine size={22} className="text-rose-400" />
                            <span className="text-[9px] font-black uppercase text-center text-gray-300">Trim Left<br/><span className="text-gray-500 text-[8px]">(Crop Before Playhead)</span></span>
                         </button>
                         <button onClick={trimRight} className="p-4 bg-white/5 hover:bg-rose-500/20 border border-white/5 hover:border-rose-500 rounded-2xl flex flex-col items-center gap-2 transition-all">
                            <ArrowRightToLine size={22} className="text-rose-400" />
                            <span className="text-[9px] font-black uppercase text-center text-gray-300">Trim Right<br/><span className="text-gray-500 text-[8px]">(Crop After Playhead)</span></span>
                         </button>
                      </div>

                      <button onClick={splitRegionAtPlayhead} className="w-full py-4 bg-white/5 hover:bg-cyan-500/20 border border-white/5 hover:border-cyan-500 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all text-cyan-400">
                         <SplitSquareHorizontal size={16} /> Split Block at Playhead
                      </button>

                      <div className="h-px bg-white/5 my-2" />

                      <button onClick={deleteSelectedRegion} disabled={!activeRegionId} className="w-full py-4 bg-red-500/10 hover:bg-red-500/20 disabled:opacity-30 border border-red-500/30 hover:border-red-500 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all text-red-400 disabled:text-gray-500">
                         <Trash2 size={16} /> Delete Selected Block
                      </button>
                      <p className="text-[9px] text-gray-500 text-center uppercase tracking-widest">Click on any block in the timeline visualizer to select it first.</p>
                   </motion.div>
                )}

                {/* TAB 6: EXPORT */}
                {activeTab === 'export' && (
                   <motion.div key="export" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pb-28">
                      <div className="bg-rose-500/10 p-5 rounded-2xl border border-rose-500/20 text-center">
                         <Download size={36} className="text-rose-500 mx-auto mb-2" />
                         <h3 className="font-black text-sm uppercase text-rose-400">Master final mix</h3>
                         <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-1">Select final production output format.</p>
                         {exportError && (
                            <p className="mt-3 text-[10px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2 leading-relaxed">{exportError}</p>
                         )}
                      </div>

                      <button onClick={() => handleExport('wav')} disabled={isProcessing} className="w-full py-4.5 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-xs shadow-[0_4px_0_0_#d1d5db] active:translate-y-1 active:shadow-none transition-all hover:bg-gray-150 flex items-center justify-center gap-2 disabled:opacity-50">
                         {isProcessing ? "Rendering Master..." : <><FileAudio size={16} /> Download High-Fi Studio Master (WAV)</>}
                      </button>

                      <button onClick={() => handleExport('mp3')} disabled={isProcessing} className="w-full py-4.5 rounded-2xl bg-rose-600 text-white font-black uppercase tracking-widest text-xs shadow-[0_4px_0_0_#be123c] active:translate-y-1 active:shadow-none transition-all hover:bg-rose-500 flex items-center justify-center gap-2 disabled:opacity-50">
                         {isProcessing ? "Rendering Master..." : <><FileAudio size={16} /> Download Platform Compressed (MP3)</>}
                      </button>
                      
                      <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-[9px] text-gray-400 leading-normal">
                        💡 Our master exporter automatically incorporates a Brickwall Peak Limiter set to **-0.3 dBFS** to ensure your viral audio stays fully compliant with commercial guidelines.
                      </div>
                   </motion.div>
                )}
             </AnimatePresence>
        </div>
      </div>

      {/* FLOATING STUDIO FOOTER DOCK */}
      <div className={`fixed bottom-0 left-0 right-0 h-[80px] flex justify-center items-center w-full z-40 bg-gradient-to-t from-[#030306] via-[#030306]/95 to-transparent ${!audioFile && 'opacity-35 pointer-events-none'}`}>
        <div className="flex items-center gap-1 sm:gap-2 bg-[#09090e]/90 backdrop-blur-3xl border border-white/10 p-1.5 rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.85)] overflow-x-auto no-scrollbar max-w-full">
           <DockItem active={activeTab === 'diagnostics'} icon={<Activity size={16}/>} label="Scanner" onClick={() => setActiveTab('diagnostics')} />
           <DockItem active={activeTab === 'mastering'} icon={<Sparkles size={16}/>} label="Platform" onClick={() => setActiveTab('mastering')} />
           <DockItem active={activeTab === 'tune'} icon={<SlidersHorizontal size={16}/>} label="Cleanse" onClick={() => setActiveTab('tune')} />
           <DockItem active={activeTab === 'eq'} icon={<AudioWaveform size={16}/>} label="Enhance" onClick={() => setActiveTab('eq')} />
           <DockItem active={activeTab === 'trim'} icon={<Scissors size={16}/>} label="Timeline" onClick={() => setActiveTab('trim')} />
           <DockItem active={activeTab === 'export'} icon={<CheckCircle2 size={16}/>} label="Master" onClick={() => setActiveTab('export')} />
        </div>
      </div>
      
    </div>
  );
}

// ============================================================================
// 🧩 MINI INTERACTIVE COMPONENTS
// ============================================================================

function ToolButton({ icon, onClick, disabled, tooltip }: any) {
  return (
    <div className="relative group">
       <button onClick={onClick} disabled={disabled} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 hover:text-rose-400 disabled:opacity-30 disabled:hover:text-white border border-white/10 transition-colors">
         {icon}
       </button>
       <span className="hidden group-hover:block absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-gray-950 text-white text-[9px] py-1 px-2.5 rounded whitespace-nowrap z-50 border border-white/10">{tooltip}</span>
    </div>
  );
}

function InfoTooltip({ text }: { text: string }) {
  return (
    <div className="relative group inline-block ml-1 cursor-help shrink-0">
      <Info size={11} className="text-gray-500 group-hover:text-rose-400" />
      <div className="hidden group-hover:block absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-950 text-white text-[9px] p-2.5 rounded-lg w-52 text-center z-50 border border-rose-500/20 shadow-2xl leading-relaxed normal-case">
        {text}
      </div>
    </div>
  );
}

function DockItem({ active, icon, label, onClick }: any) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-15 h-11 sm:w-18 sm:h-13 rounded-full transition-all duration-300 shrink-0 ${active ? 'bg-gradient-to-tr from-rose-600 to-rose-500 text-white scale-105 shadow-[0_0_15px_rgba(244,63,94,0.4)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
      {icon}
      <span className="text-[8px] font-black uppercase mt-0.5 tracking-wider">{label}</span>
    </button>
  );
}

function FilterSlider({ label, value, min, max, step = 1, onChange, tooltip }: any) {
  const percentage = ((value - min) / (max - min)) * 100;
  return (
    <div className="group">
      <div className="flex justify-between items-center mb-1.5">
        <label className="text-[9px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1 select-none">
           {label} {tooltip && <InfoTooltip text={tooltip} />}
        </label>
        <span className="text-[9px] font-mono text-rose-300 bg-rose-500/10 px-1.5 py-0.5 rounded font-bold">{value}</span>
      </div>
      <div className="relative h-1 bg-white/10 rounded-full overflow-hidden">
        <div className="absolute top-0 left-0 h-full rounded-full transition-all duration-100 bg-rose-500" style={{ width: `${percentage}%` }} />
        <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
      </div>
    </div>
  );
}

function PresetButton({ active, onClick, icon, title, sub }: any) {
  return (
    <button 
      onClick={onClick} 
      className={`p-3 border rounded-2xl flex flex-col items-start gap-1 text-left transition-all relative overflow-hidden ${
        active 
          ? 'bg-gradient-to-tr from-rose-950/20 to-rose-900/15 border-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.15)] scale-[1.02]' 
          : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 text-gray-400'
      }`}
    >
      <div className={`p-1.5 rounded-lg border text-sm ${active ? 'border-rose-500/30 text-rose-400 bg-rose-500/10' : 'border-white/10 text-gray-400 bg-white/5'}`}>
        {icon}
      </div>
      <p className="text-[10px] font-black uppercase tracking-wider mt-1 text-gray-200">{title}</p>
      <p className="text-[8px] font-bold text-gray-500 uppercase leading-none">{sub}</p>
    </button>
  );
}

function FeatureMiniCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-white/5 border border-white/5 p-4 rounded-2xl text-center space-y-1">
      <div className="text-xl inline-block mb-1">{icon}</div>
      <p className="text-[10px] font-black uppercase tracking-wider text-gray-200 leading-none">{title}</p>
      <p className="text-[8px] font-bold text-gray-500 uppercase leading-tight">{desc}</p>
    </div>
  );
}