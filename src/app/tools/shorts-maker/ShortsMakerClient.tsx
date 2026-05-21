// File: src/app/tools/shorts-maker/ShortsMakerClient.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Loader2, AlertCircle, Scissors, Zap, ArrowLeft, CheckCircle, Terminal, Gamepad2, Flame, Edit3, Download, Bomb, Rocket, History, SlidersHorizontal, Video } from 'lucide-react';
import Link from 'next/link';
import ToolInterfaceShell from '@/components/seo/ToolInterfaceShell';
import { useDevicePower } from '@/hooks/useDevicePower';
// 🔥 FIX: Naye Engine functions import kiye
import { initFFmpeg, loadVideoToMemory, cutClipFast, cleanupVideoFromMemory } from './engine/clipper';
// 🔥 FIX: History API connect ki
import { addHistory } from '@/lib/history';

type ProcessState = 'IDLE' | 'LOADING_ENGINE' | 'AI_ANALYZING' | 'CLIPPING' | 'DONE';
type TargetType = 'FLAME' | 'BOMB' | 'ROCKET';

interface ViralClip {
  id: string;
  startTime: number;
  duration: number;
  title: string;
  score: number;
  url?: string;
}

export default function ShortsMakerClient() {
  const device = useDevicePower();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<ProcessState>('IDLE');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [clipCount, setClipCount] = useState(5);
  
  const [logs, setLogs] = useState<string[]>(['[SYSTEM] Ready. Upload a video to extract viral hooks.']);
  const [progress, setProgress] = useState(0);
  const [currentAction, setCurrentAction] = useState('Standby');
  const [generatedClips, setGeneratedClips] = useState<ViralClip[]>([]);
  const [totalExpectedClips, setTotalExpectedClips] = useState(0);
  
  const [historyLocal, setHistoryLocal] = useState<ViralClip[]>([]);
  
  // Game States
  const [score, setScore] = useState(0);
  const [gameSpeed, setGameSpeed] = useState(1200);
  const [targetPos, setTargetPos] = useState({ top: '50%', left: '50%' });
  const [targetType, setTargetType] = useState<TargetType>('FLAME');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initFFmpeg().catch(console.error);
    const saved = localStorage.getItem('shorts_history_meta');
    if (saved) setHistoryLocal(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const handleFileProcess = (selected: File) => {
   if (selected.size > 500 * 1024 * 1024) {
      setErrorMsg('Bhai, max 500MB ki video allow hai browser memory limit ki wajah se.');
      return;
    }
    setFile(selected);
    setErrorMsg('');
    setStatus('IDLE');
    setScore(0);
    setGameSpeed(1200);
    setGeneratedClips([]);
    setLogs(['[SYSTEM] Video secured. Configure clip count and ignite the engine.']);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFileProcess(e.target.files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) handleFileProcess(e.dataTransfer.files[0]);
  };

  const moveTarget = () => {
    setTargetPos({ 
      top: `${Math.floor(Math.random() * 70) + 10}%`, 
      left: `${Math.floor(Math.random() * 80) + 10}%` 
    });
    const rand = Math.random();
    if (rand > 0.85) setTargetType('BOMB');
    else if (rand > 0.75) setTargetType('ROCKET');
    else setTargetType('FLAME');
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status !== 'IDLE' && status !== 'DONE') interval = setInterval(moveTarget, gameSpeed);
    return () => clearInterval(interval);
  }, [status, gameSpeed]);

  const handleHit = (type: TargetType) => {
    if (type === 'BOMB') setScore(s => Math.max(0, s - 20));
    else if (type === 'ROCKET') { setScore(s => s + 50); setGameSpeed(s => Math.max(500, s - 100)); }
    else { setScore(s => s + 10); setGameSpeed(s => Math.max(400, s - 40)); }
    moveTarget();
  };

  const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

 
 // ==========================================
  // 🚀 FAST AI PIPELINE (Modified for speed)
  // ==========================================
  const getViralSegmentsFromAI = async (masterFileName: string): Promise<ViralClip[]> => {
    return new Promise(async (resolve, reject) => {
      try {
        addLog('[FFMPEG] Extracting audio using Multithreading (Turbo Mode)...');
        setCurrentAction('Extracting Audio Track');
        
        const ff = await initFFmpeg();
        const audioName = `extracted_audio_${Date.now()}.m4a`;
        
        // 🔥 SPEED HACK: Use native AAC encoder, no threads flag to prevent WASM hangs
        await ff.exec([
          '-i', masterFileName, 
          '-vn', // Ignore video stream completely
          '-c:a', 'aac', // Native FFmpeg encoder (extremely fast)
          '-ar', '16000', 
          '-ac', '1', 
          '-b:a', '32k', 
          audioName
        ]);

       const audioFileData = await ff.readFile(audioName);
      const audioBlob = new Blob([audioFileData as any], { type: 'audio/mp4' });
        // Delete audio from memory to save RAM
        await ff.deleteFile(audioName);

        addLog(`[AI-BRAIN] Audio extracted perfectly! Sending to Neural Network...`);
        setCurrentAction(`AI Mapping ${clipCount} Viral Hooks`);

        const formData = new FormData();
        formData.append('audio', audioBlob, 'audio.m4a');
        formData.append('clipCount', clipCount.toString());

        // Groq API hit
        const response = await fetch('/api/analyze-video', { method: 'POST', body: formData });
        const data = await response.json();
        
        if (!response.ok || !data.success) throw new Error(data.error || 'AI analysis failed');

        addLog(`[AI-BRAIN] SUCCESS: Neural net identified ${data.clips.length} viral segments!`);
        resolve(data.clips);
      } catch (error: any) {
        reject(error);
      }
    });
  };


  // ==========================================
  // 🚀 THE MASTER PROCESSING ENGINE
  // ==========================================
  const startProcessing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setErrorMsg('');
    setStatus('LOADING_ENGINE');
    setProgress(5);
    setLogs(['[SYSTEM] Booting Advanced Video Engine...']);
    setCurrentAction('Waking up Engine');
    setGeneratedClips([]); 
    setTotalExpectedClips(0);

    const masterFileName = `master_video_${Date.now()}.mp4`;

    try {
      // 🔥 THE GOD-TIER MEMORY OPTIMIZATION (Load ONLY ONCE) 🔥
      addLog('[FFMPEG] Locking master video into virtual RAM (Doing this ONLY ONCE)...');
      setCurrentAction('Loading Video to Memory');
      await loadVideoToMemory(file, masterFileName); // Pehle hi load kar liya!

      setStatus('AI_ANALYZING');
      setProgress(15);
      
      // Pass the already loaded masterFileName to the AI function
      const segments = await getViralSegmentsFromAI(masterFileName);
      setTotalExpectedClips(segments.length);
      
      setStatus('CLIPPING');
      let finalClips: ViralClip[] = [];
      
      for (let i = 0; i < segments.length; i++) {
        const seg = segments[i];
        setCurrentAction(`Rendering Clip ${i + 1} of ${segments.length}`);
        addLog(`[FFMPEG] Flash-Cutting Clip ${i + 1}: ${seg.title}`);
        
        const outputUrl = await cutClipFast(
          masterFileName, 
          seg.startTime, 
          seg.duration, 
          i,
          (logMsg) => { if (logMsg.includes('fps=')) addLog(`> Clip ${i+1}: ${logMsg}`); }
        );

        const newClip = { ...seg, url: outputUrl };
        setGeneratedClips((prev) => [...prev, newClip]);
        finalClips.push(newClip);
        setProgress(15 + ((i + 1) / segments.length) * 80);
      }

      // 🔥 CLEANUP
      addLog('[SYSTEM] Purging virtual RAM to prevent memory leaks...');
      await cleanupVideoFromMemory(masterFileName);

      addLog('[SYSTEM] BATCH PROCESSING COMPLETE!');
      setCurrentAction('Finished');
      setProgress(100);
      setStatus('DONE');

      // Update History
      addHistory({
        toolName: 'AI Shorts Maker',
        toolSlug: 'shorts-maker',
        actionDesc: `Auto-extracted ${finalClips.length} viral clips from ${file.name}`
      });

      const updatedHistory = [...finalClips, ...historyLocal].slice(0, 20);
      setHistoryLocal(updatedHistory);
      localStorage.setItem('shorts_history_meta', JSON.stringify(updatedHistory));

    } catch (err: any) {
      console.error(err);
      addLog(`[CRITICAL ERROR] ${err.message}`);
      await cleanupVideoFromMemory(masterFileName); // Ensure cleanup on error
      setErrorMsg('Rendering failed. Try a smaller file or close other background tabs.');
      setStatus('IDLE');
    }
  };


// 🔥 FIX 1: Transfer Video File securely to New Tab using IndexedDB
  const handleEditInSeloice = async (clipUrl: string) => {
    try {
      addLog('[SYSTEM] Packaging video for Editor transfer...');
      
      // 1. Fetch the raw video data from the current tab's URL
      const res = await fetch(clipUrl);
      const blob = await res.blob();

      // 2. Open IndexedDB (Browser's heavy storage)
      const request = indexedDB.open('SeloiceTransferDB', 1);

      request.onupgradeneeded = (e: any) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('media')) {
          db.createObjectStore('media');
        }
      };

      request.onsuccess = (e: any) => {
        const db = e.target.result;
        const tx = db.transaction('media', 'readwrite');
        const store = tx.objectStore('media');
        
        // 3. Save the actual video file
        store.put(blob, 'pending_clip');

        tx.oncomplete = () => {
          // 4. Set a flag and open the new tab!
          localStorage.setItem('seloice_pending_edit', 'true');
          window.open('/tools/video-editor', '_blank');
        };
      };
    } catch (error) {
      console.error("Transfer failed:", error);
      setErrorMsg("Edit transfer failed. Try saving the file and uploading manually.");
    }
  };

  return (
    <ToolInterfaceShell className="w-full max-w-5xl">
      <div className="w-full min-h-[85vh] bg-[#030305] text-white font-sans flex flex-col relative pb-10 selection:bg-purple-500/30">
        
        {/* PREMIUM BACKGROUND GLOW */}
        <div className="fixed inset-0 z-0 flex justify-center pointer-events-none">
          <div className="absolute top-[-10%] w-[40rem] h-[40rem] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen opacity-60" />
        </div>

        <div className="relative z-10 mx-auto px-4 pt-10 md:pt-16 w-full max-w-5xl">
          <Link href="/tools" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-bold text-xs uppercase tracking-widest mb-10 bg-purple-500/10 hover:bg-purple-500/20 px-4 py-2 rounded-full border border-purple-500/20 transition-all w-fit">
            <ArrowLeft size={16} /> Back to Toolkit
          </Link>

          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 p-[2px] rounded-2xl mx-auto mb-6 shadow-[0_0_30px_rgba(168,85,247,0.3)] rotate-3">
              <div className="w-full h-full bg-[#0a0a0f] rounded-[14px] flex items-center justify-center">
                <Scissors size={28} className="text-white" />
              </div>
            </div>
            <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-4 uppercase drop-shadow-lg">
              AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">SHORTS MAKER</span>
            </h2>
            <p className="text-zinc-400 font-medium text-sm md:text-base max-w-xl mx-auto">Upload a long podcast or vlog. Our AI will find the most viral moments and clip them instantly using browser RAM.</p>
          </div>

          <div className={`bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative overflow-hidden max-w-4xl mx-auto mb-10 ${status === 'DONE' ? 'hidden' : 'block'}`}>
            <form onSubmit={startProcessing} className="space-y-6">
              
              {/* PREMIUM DRAG & DROP ZONE */}
              <div 
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => (status === 'IDLE' || status === 'DONE') && fileInputRef.current?.click()}
                className={`w-full border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center gap-4 transition-all relative overflow-hidden group
                  ${isDragging ? 'border-purple-500 bg-purple-500/10' : 'border-white/10 bg-black/40'}
                  ${(status === 'IDLE' || status === 'DONE') ? 'hover:border-purple-500/50 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity ${isDragging ? 'opacity-100' : ''}`} />
                
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform relative z-10 shadow-xl">
                  {file ? <Video size={32} className="text-purple-400" /> : <Upload size={32} className="text-purple-400" />}
                </div>
                <div className="text-center relative z-10">
                  <p className="font-black text-xl text-white">{file ? file.name : 'Drop your long video here'}</p>
                  <p className="text-sm text-zinc-500 mt-1 font-medium">{file ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : 'MP4, WebM (Max 500MB)'}</p>
                </div>
                <input type="file" accept="video/mp4,video/webm" className="hidden" ref={fileInputRef} onChange={handleFileChange} disabled={status !== 'IDLE' && status !== 'DONE'} />
              </div>

              {/* STYLISH RANGE SLIDER */}
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="flex items-center gap-2 text-sm font-bold text-purple-400 uppercase tracking-widest">
                    <SlidersHorizontal size={16} /> Extraction Target
                  </label>
                  <span className="text-2xl font-black text-white bg-white/5 px-4 py-1 rounded-lg border border-white/10">{clipCount} <span className="text-sm text-zinc-500 uppercase">Clips</span></span>
                </div>
                <input 
                  type="range" min="1" max="10" value={clipCount} 
                  onChange={(e) => setClipCount(parseInt(e.target.value))}
                  className="w-full accent-purple-500 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                  disabled={status !== 'IDLE' && status !== 'DONE'}
                />
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-3 uppercase font-bold tracking-widest">
                  <span>1 Clip</span>
                  <span>10 Clips</span>
                </div>
              </div>

              <AnimatePresence>
                {errorMsg && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3 text-sm font-bold mt-2">
                      <AlertCircle size={18} className="shrink-0" />
                      <p>{errorMsg}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {status === 'IDLE' || status === 'DONE' ? (
                <button type="submit" disabled={!file} className="w-full py-5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black uppercase tracking-widest text-sm shadow-[0_8px_0_0_#4c1d95] hover:shadow-[0_4px_0_0_#4c1d95] hover:translate-y-1 active:translate-y-2 active:shadow-none transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
                  <Zap size={20} className={file ? "animate-pulse" : ""} /> EXTRACT {clipCount} VIRAL HOOKS
                </button>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
                  {/* VIRAL RUSH GAME */}
                  <div className="bg-black/80 border border-purple-500/20 rounded-3xl p-5 flex flex-col h-[300px] relative overflow-hidden shadow-inner">
                    <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                      <div className="flex items-center gap-2 text-purple-400 font-bold text-sm uppercase tracking-widest">
                        <Gamepad2 size={18} /> Viral Rush
                      </div>
                      <div className="font-black text-white text-lg bg-white/5 px-3 py-1 rounded-lg">Score: <span className="text-green-400">{score}</span></div>
                    </div>
                    <div className="flex-1 relative bg-[#050505] rounded-2xl border border-white/5 overflow-hidden">
                      <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-zinc-800 font-bold text-xs text-center w-full select-none pointer-events-none uppercase tracking-widest">
                        Avoid 💣 | Hit 🚀
                      </p>
                      <motion.button 
                        type="button" animate={targetPos} onClick={(e) => { e.stopPropagation(); handleHit(targetType); }} 
                        className={`absolute p-4 rounded-full shadow-[0_0_20px_currentColor] transition-colors z-30
                          ${targetType === 'BOMB' ? 'bg-red-500/10 border border-red-500 text-red-500 hover:bg-red-500/30' : 
                            targetType === 'ROCKET' ? 'bg-blue-500/10 border border-blue-500 text-blue-500 hover:bg-blue-500/30' : 
                            'bg-orange-500/10 border border-orange-500 text-orange-500 hover:bg-orange-500/30'}`} 
                        style={{ transform: 'translate(-50%, -50%)' }}
                      >
                        {targetType === 'BOMB' && <Bomb size={28} />}
                        {targetType === 'ROCKET' && <Rocket size={28} />}
                        {targetType === 'FLAME' && <Flame size={28} />}
                      </motion.button>
                    </div>
                  </div>

                  {/* PRO TERMINAL */}
                  <div className="bg-[#050505] border border-zinc-800 rounded-3xl p-5 flex flex-col h-[300px] font-mono shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] relative">
                    <div className="flex items-center justify-between mb-3 border-b border-zinc-900 pb-3 shrink-0">
                      <div className="flex items-center gap-2 text-zinc-500 font-bold text-xs uppercase tracking-widest">
                        <Terminal size={14} /> Server Logs
                      </div>
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/50 animate-pulse" />
                      </div>
                    </div>
                    <div ref={terminalRef} className="flex-1 overflow-y-auto text-[10px] md:text-xs text-green-400/90 space-y-1.5 pr-2 scroll-smooth">
                      {logs.map((log, i) => (
                        <div key={i} className="break-all leading-relaxed font-mono">
                          <span className="text-zinc-600 mr-2">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
                          {log.includes('ERROR') ? <span className="text-red-400">{log}</span> : log}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-zinc-900 shrink-0">
                      <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-widest">
                        <span className="text-purple-400 animate-pulse">{currentAction}...</span>
                        <span className="text-white bg-white/10 px-2 py-0.5 rounded">{Math.min(Math.round(progress), 99)}%</span>
                      </div>
                      <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden shadow-inner">
                        <motion.div className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500 bg-[length:200%_auto] animate-gradient" animate={{ width: `${progress}%` }} transition={{ duration: 0.2 }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* REAL-TIME PROGRESSIVE GALLERY */}
          <AnimatePresence>
            {generatedClips.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mt-12">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 border-b border-white/10 pb-6 gap-4">
                  <div className="flex items-center gap-4">
                    {status === 'DONE' ? (
                      <div className="p-2 bg-green-500/20 rounded-xl border border-green-500/30">
                        <CheckCircle size={32} className="text-green-400" />
                      </div>
                    ) : (
                      <div className="p-2 bg-purple-500/20 rounded-xl border border-purple-500/30">
                        <Loader2 size={32} className="text-purple-400 animate-spin" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-2xl md:text-3xl font-black italic tracking-tighter uppercase text-white drop-shadow-md">
                        {status === 'DONE' ? 'Viral Batch Ready' : `Extracting (${generatedClips.length}/${totalExpectedClips})`}
                      </h3>
                      <p className="text-zinc-400 text-sm font-medium mt-1">Ready to be edited or posted directly.</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence>
                    {generatedClips.map((clip, idx) => (
                      <motion.div 
                        key={clip.id} 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                        animate={{ opacity: 1, scale: 1, y: 0 }} 
                        transition={{ delay: idx * 0.1 }}
                        className="bg-[#0a0a0f] border border-white/10 hover:border-purple-500/50 transition-all duration-300 rounded-[2rem] p-5 flex flex-col shadow-xl hover:shadow-[0_10px_40px_rgba(168,85,247,0.15)] group"
                      >
                        <div className="w-full aspect-[9/16] bg-black rounded-2xl overflow-hidden border border-white/5 mb-5 relative">
                          <video src={clip.url} controls className="w-full h-full object-cover" />
                          <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest border border-white/10 text-purple-400 shadow-lg">
                            {clip.duration}s
                          </div>
                          <div className="absolute top-3 left-3 bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-black border border-indigo-400 shadow-lg">
                            #{idx + 1}
                          </div>
                        </div>
                        
                        <div className="flex-1 mb-5">
                          <h4 className="font-bold text-white text-base mb-2 line-clamp-2 leading-snug group-hover:text-purple-300 transition-colors">{clip.title}</h4>
                          <div className="flex items-center gap-2">
                            <div className="bg-green-500/10 border border-green-500/20 px-2 py-1 rounded text-xs text-green-400 font-bold flex items-center gap-1.5">
                              <Flame size={12} /> Viral Score: {clip.score}/100
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-auto">
                          <button 
                            onClick={() => handleEditInSeloice(clip.url!)}
                            className="flex items-center justify-center gap-2 py-3 bg-zinc-800/80 hover:bg-purple-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all border border-white/5 hover:border-purple-500"
                          >
                            <Edit3 size={16} /> Edit
                          </button>
                          <a 
                            href={clip.url}
                            download={`Seloice_Viral_${idx + 1}_${clip.title}.mp4`}
                            className="flex items-center justify-center gap-2 py-3 bg-white text-black hover:bg-zinc-200 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg"
                          >
                            <Download size={16} /> Save
                          </a>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* LOCAL META HISTORY (Recent generations on this browser) */}
          {historyLocal.length > 0 && status === 'IDLE' && (
             <div className="mt-20 border-t border-white/10 pt-12">
               <div className="flex items-center gap-3 mb-6 text-zinc-400">
                 <History size={24} />
                 <h3 className="text-xl font-black italic uppercase tracking-widest">Recent Extractions</h3>
               </div>
               
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                 {historyLocal.map((clip, i) => (
                   <div key={i} className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex flex-col gap-3 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all">
                     <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug" title={clip.title}>{clip.title}</h4>
                     <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-auto">
                       <span className="text-purple-400">{clip.duration}s</span>
                       <span className="bg-white/5 px-2 py-0.5 rounded">{clip.score} Pts</span>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
          )}

        </div>
      </div>
    </ToolInterfaceShell>
  );
}