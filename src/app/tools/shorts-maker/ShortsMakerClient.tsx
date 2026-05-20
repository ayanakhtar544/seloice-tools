// File: src/app/tools/shorts-maker/ShortsMakerClient.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Loader2, AlertCircle, Scissors, Zap, ArrowLeft, CheckCircle, Terminal, Gamepad2, Flame, Edit3, Download, Bomb, Rocket, History, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import ToolInterfaceShell from '@/components/seo/ToolInterfaceShell';
import { useDevicePower } from '@/hooks/useDevicePower';
import { createShortClip, initFFmpeg } from './engine/clipper';

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
  const [status, setStatus] = useState<ProcessState>('IDLE');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Customization State
  const [clipCount, setClipCount] = useState(5);
  
  // Processing States
  const [logs, setLogs] = useState<string[]>(['System Ready. Waiting for video...']);
  const [progress, setProgress] = useState(0);
  const [currentAction, setCurrentAction] = useState('Standby');
  const [generatedClips, setGeneratedClips] = useState<ViralClip[]>([]);
  const [totalExpectedClips, setTotalExpectedClips] = useState(0);
  
  // History State
  const [history, setHistory] = useState<ViralClip[]>([]);
  
  // Game States
  const [score, setScore] = useState(0);
  const [gameSpeed, setGameSpeed] = useState(1200);
  const [targetPos, setTargetPos] = useState({ top: '50%', left: '50%' });
  const [targetType, setTargetType] = useState<TargetType>('FLAME');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Initialize
  useEffect(() => {
    initFFmpeg().catch(console.error);
    const saved = localStorage.getItem('shorts_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // Terminal Auto-scroll
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.size > 200 * 1024 * 1024) {
        setErrorMsg('Bhai, max 200MB ki video allow hai demo ke liye.');
        return;
      }
      setFile(selected);
      setErrorMsg('');
      setStatus('IDLE');
      setScore(0);
      setGameSpeed(1200);
      setGeneratedClips([]);
      setLogs(['[SYSTEM] New video loaded. Configure settings and click Generate.']);
    }
  };

  // Mini-Game Logic
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

  // AI & Processing Pipeline
  const getViralSegmentsFromAI = async (videoFile: File): Promise<ViralClip[]> => {
    return new Promise(async (resolve, reject) => {
      try {
        addLog('[FFMPEG] Extracting low-res audio to bypass Vercel limits...');
        setCurrentAction('Extracting Audio Track');
        
        const ff = await initFFmpeg();
        const inputName = 'full_video.mp4';
        const audioName = 'extracted_audio.mp3';
        
        const videoData = new Uint8Array(await videoFile.arrayBuffer());
        await ff.writeFile(inputName, videoData);

        await ff.exec(['-i', inputName, '-vn', '-ar', '16000', '-ac', '1', '-b:a', '32k', audioName]);

        const audioFileData = await ff.readFile(audioName);
        const audioUint8 = audioFileData as Uint8Array;
        const audioBlob = new Blob([audioUint8.slice().buffer as ArrayBuffer], { type: 'audio/mp3' });
        
        await ff.deleteFile(inputName);
        await ff.deleteFile(audioName);

        addLog(`[AI-BRAIN] Audio extracted! Uploading to Neural Network...`);
        setCurrentAction(`AI Extracting ${clipCount} Viral Moments`);

        const formData = new FormData();
        formData.append('audio', audioBlob, 'audio.mp3');
        formData.append('clipCount', clipCount.toString());

        const response = await fetch('/api/analyze-video', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.error || 'AI analysis failed');

        addLog(`[AI-BRAIN] SUCCESS: AI mapped ${data.clips.length} viral segments!`);
        resolve(data.clips);
      } catch (error: any) {
        addLog(`[AI ERROR] ${error.message}`);
        reject(error);
      }
    });
  };

  const startProcessing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setErrorMsg('');
    setStatus('LOADING_ENGINE');
    setProgress(5);
    setLogs(['[SYSTEM] Booting FFmpeg WebAssembly core...']);
    setCurrentAction('Waking up Engine');
    setGeneratedClips([]); 
    setTotalExpectedClips(0);

    try {
      const videoUrl = URL.createObjectURL(file);

      setStatus('AI_ANALYZING');
      setProgress(15);
      
      const segments = await getViralSegmentsFromAI(file);
      setTotalExpectedClips(segments.length);
      
      setStatus('CLIPPING');
      let finalClips: ViralClip[] = [];
      
      for (let i = 0; i < segments.length; i++) {
        const seg = segments[i];
        setCurrentAction(`Rendering Clip ${i + 1} of ${segments.length} (${seg.duration}s)`);
        addLog(`[FFMPEG] Slicing Clip ${i + 1}: ${seg.title}`);
        
        const outputUrl = await createShortClip(
          videoUrl, 
          seg.startTime, 
          seg.duration, 
          (logMsg) => { if (logMsg.includes('fps=')) addLog(`> Clip ${i+1}: ${logMsg}`); }
        );

        const newClip = { ...seg, url: outputUrl };
        setGeneratedClips((prev) => [...prev, newClip]);
        finalClips.push(newClip);
        setProgress(15 + ((i + 1) / segments.length) * 80);
      }

      addLog('[SYSTEM] All clips rendered successfully!');
      setCurrentAction('Finished');
      setProgress(100);
      setStatus('DONE');

      // Update History
      const updatedHistory = [...finalClips, ...history].slice(0, 20); // Keep max 20 in history
      setHistory(updatedHistory);
      localStorage.setItem('shorts_history', JSON.stringify(updatedHistory));

    } catch (err: any) {
      console.error(err);
      addLog('[CRITICAL ERROR] Execution halted.');
      setErrorMsg('Rendering fail ho gayi bhai. Terminal check kar.');
      setStatus('IDLE');
    }
  };

  const handleEditInSeloice = (clipUrl: string) => {
    localStorage.setItem('seloice_pending_edit', clipUrl);
    window.open('/tools/video-editor', '_blank');
  };

  return (
    <ToolInterfaceShell className="w-full max-w-5xl">
      <div className="w-full min-h-[85vh] bg-[#050505] text-white font-sans flex flex-col relative pb-10">
        <div className="fixed inset-0 z-0 flex justify-center pointer-events-none">
          <div className="absolute top-[-10%] w-[40rem] h-[40rem] bg-purple-600/10 rounded-full blur-[120px] opacity-40" />
        </div>

        <div className="relative z-10 mx-auto px-4 pt-10 md:pt-16 w-full max-w-5xl">
          <Link href="/tools" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-bold text-xs uppercase tracking-widest mb-10 bg-purple-500/10 px-4 py-2 rounded-full border border-purple-500/20 w-fit">
            <ArrowLeft size={16} /> Back to Toolkit
          </Link>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 p-[2px] rounded-2xl mx-auto mb-6 shadow-xl shadow-purple-500/20 rotate-3">
              <div className="w-full h-full bg-[#111] rounded-[14px] flex items-center justify-center">
                <Scissors size={28} className="text-white" />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-4 uppercase">
              AI <span className="text-purple-500">SHORTS MAKER</span>
            </h2>
            <p className="text-zinc-400 font-medium">Extract viral shorts dynamically with 100% Client-side rendering.</p>
          </div>

          <div className={`bg-[#111] border border-white/10 rounded-[2rem] p-6 md:p-10 shadow-2xl relative overflow-hidden max-w-4xl mx-auto mb-10 ${generatedClips.length > 0 ? 'hidden md:block' : 'block'}`}>
            <form onSubmit={startProcessing} className="space-y-6">
              
              <div 
                onClick={() => (status === 'IDLE' || status === 'DONE') && fileInputRef.current?.click()}
                className={`w-full border-2 border-dashed rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center gap-4 transition-all bg-black/40 
                  ${(status === 'IDLE' || status === 'DONE') ? 'border-white/10 hover:border-purple-500/50 cursor-pointer group' : 'border-white/5 opacity-50 cursor-not-allowed'}`}
              >
                <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload size={24} className="text-purple-400" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg">{file ? file.name : 'Upload Long Video (Podcast/Vlog)'}</p>
                  <p className="text-sm text-zinc-500 mt-1">MP4, WebM (Max 200MB)</p>
                </div>
                <input type="file" accept="video/mp4,video/webm" className="hidden" ref={fileInputRef} onChange={handleFileChange} disabled={status !== 'IDLE' && status !== 'DONE'} />
              </div>

              {/* Range Slider for Clip Count */}
              <div className="bg-black/50 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="flex items-center gap-2 text-sm font-bold text-purple-400 uppercase tracking-widest">
                    <SlidersHorizontal size={16} /> How many clips?
                  </label>
                  <span className="text-xl font-black text-white">{clipCount} Shorts</span>
                </div>
                <input 
                  type="range" 
                  min="1" max="10" 
                  value={clipCount} 
                  onChange={(e) => setClipCount(parseInt(e.target.value))}
                  className="w-full accent-purple-500 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                  disabled={status !== 'IDLE' && status !== 'DONE'}
                />
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-2 uppercase">
                  <span>1 Clip</span>
                  <span>10 Clips</span>
                </div>
              </div>

              <AnimatePresence>
                {errorMsg && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-start gap-3 text-sm font-medium mt-2">
                      <AlertCircle size={18} className="shrink-0 mt-0.5" />
                      <p>{errorMsg}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {status === 'IDLE' || status === 'DONE' ? (
                <button type="submit" disabled={!file} className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black uppercase tracking-widest text-sm shadow-[0_6px_0_0_#4c1d95] active:translate-y-1 active:shadow-none transition-all hover:brightness-110 flex items-center justify-center gap-2 disabled:opacity-50">
                  <Zap size={18} /> GENERATE {clipCount} VIRAL SHORTS
                </button>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {/* VIRAL RUSH GAME */}
                  <div className="bg-black/80 border border-purple-500/30 rounded-2xl p-4 flex flex-col h-[280px] relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                      <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                        <Gamepad2 size={16} /> VIRAL RUSH
                      </div>
                      <div className="font-black text-white text-lg">Score: <span className="text-green-400">{score}</span></div>
                    </div>
                    <div className="flex-1 relative bg-[#0a0a0a] rounded-xl border border-white/5 overflow-hidden">
                      <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-zinc-800 font-bold text-xs text-center w-full select-none pointer-events-none">
                        Avoid 💣 | Hit 🚀 for +50
                      </p>
                      <motion.button 
                        type="button" 
                        animate={targetPos} 
                        onClick={(e) => { e.stopPropagation(); handleHit(targetType); }} 
                        className={`absolute p-3 rounded-full shadow-[0_0_15px_currentColor] transition-colors z-30
                          ${targetType === 'BOMB' ? 'bg-red-500/20 border-red-500 text-red-500 hover:bg-red-500/40' : 
                            targetType === 'ROCKET' ? 'bg-blue-500/20 border-blue-500 text-blue-500 hover:bg-blue-500/40' : 
                            'bg-orange-500/20 border-orange-500 text-orange-500 hover:bg-orange-500/40'}`} 
                        style={{ transform: 'translate(-50%, -50%)', borderWidth: '1px' }}
                      >
                        {targetType === 'BOMB' && <Bomb size={24} />}
                        {targetType === 'ROCKET' && <Rocket size={24} />}
                        {targetType === 'FLAME' && <Flame size={24} />}
                      </motion.button>
                    </div>
                  </div>

                  {/* LIVE TERMINAL */}
                  <div className="bg-black/90 border border-zinc-800 rounded-2xl p-4 flex flex-col h-[280px] font-mono shadow-inner relative">
                    <div className="flex items-center justify-between mb-2 border-b border-zinc-900 pb-2 shrink-0">
                      <div className="flex items-center gap-2 text-zinc-400 font-bold text-xs uppercase tracking-widest">
                        <Terminal size={14} /> System Logs
                      </div>
                    </div>
                    <div ref={terminalRef} className="flex-1 overflow-y-auto text-[10px] md:text-xs text-green-400 space-y-1 pr-2 scroll-smooth">
                      {logs.map((log, i) => <div key={i} className="break-all opacity-80 leading-relaxed font-mono">{log}</div>)}
                    </div>
                    <div className="mt-4 pt-3 border-t border-zinc-800 shrink-0">
                      <div className="flex justify-between text-xs font-bold mb-2">
                        <span className="text-purple-400 animate-pulse">{currentAction}...</span>
                        <span className="text-white">{Math.min(Math.round(progress), 99)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500" animate={{ width: `${progress}%` }} transition={{ duration: 0.1 }} />
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
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 border-b border-white/10 pb-4 gap-4">
                  <div className="flex items-center gap-3">
                    {status === 'DONE' ? (
                      <CheckCircle size={28} className="text-green-400" />
                    ) : (
                      <Loader2 size={28} className="text-purple-400 animate-spin" />
                    )}
                    <h3 className="text-xl md:text-2xl font-black italic tracking-tight">
                      {status === 'DONE' 
                        ? 'YOUR VIRAL BATCH IS READY' 
                        : `GENERATING CLIPS (${generatedClips.length}/${totalExpectedClips})`}
                    </h3>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence>
                    {generatedClips.map((clip, idx) => (
                      <motion.div 
                        key={clip.id} 
                        initial={{ opacity: 0, scale: 0.9 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        className="bg-[#111] border border-white/10 hover:border-purple-500/50 transition-colors rounded-2xl p-4 flex flex-col shadow-xl"
                      >
                        <div className="w-full aspect-[9/16] bg-black rounded-xl overflow-hidden border border-white/5 mb-4 relative group">
                          <video src={clip.url} controls className="w-full h-full object-cover" />
                          <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-2 py-1 rounded text-xs font-bold border border-white/10 text-purple-400">
                            {clip.duration}s
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-white text-sm mb-1 truncate">{idx + 1}. {clip.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-4">
                            <span>Viral Score: <strong className="text-green-400">{clip.score}/100</strong></span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-auto">
                          <button 
                            onClick={() => handleEditInSeloice(clip.url!)}
                            className="flex items-center justify-center gap-1.5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-bold text-[10px] uppercase tracking-wider transition-colors shadow-inner"
                          >
                            <Edit3 size={14} /> Edit (New Tab)
                          </button>
                          <a 
                            href={clip.url}
                            download={`Viral_Short_${idx + 1}_${clip.title}.mp4`}
                            className="flex items-center justify-center gap-1.5 py-2.5 bg-white text-black hover:bg-zinc-200 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-colors shadow-lg"
                          >
                            <Download size={14} /> Save MP4
                          </a>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* HISTORY METADATA SECTION */}
          {history.length > 0 && status === 'IDLE' && (
             <div className="mt-16 border-t border-white/10 pt-10">
               <div className="flex items-center gap-2 mb-4 text-zinc-400">
                 <History size={20} />
                 <h3 className="text-lg font-bold uppercase tracking-widest">Recent Generations</h3>
               </div>
               <p className="text-[10px] text-zinc-500 mb-6 bg-zinc-900/50 p-3 rounded-lg border border-zinc-800 max-w-2xl">
                 Note: Actual video blobs are cleared by the browser on refresh to save memory. This history stores AI metadata (titles, timestamps). 
               </p>
               
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                 {history.map((clip, i) => (
                   <div key={i} className="bg-black/50 border border-white/5 p-4 rounded-xl flex flex-col gap-2 hover:border-purple-500/30 transition-colors">
                     <h4 className="text-xs font-bold text-white truncate" title={clip.title}>{clip.title}</h4>
                     <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                       <span className="text-purple-400">{clip.duration}s</span>
                       <span>Score: {clip.score}</span>
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