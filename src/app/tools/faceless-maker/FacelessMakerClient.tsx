// File: src/app/tools/faceless-maker/FacelessMakerClient.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Loader2, Wand2, ArrowLeft, Terminal, Gamepad2, Mic, FileText, CheckCircle, Download, Sparkles, Video, Languages, Type, Scissors, Edit3 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ToolInterfaceShell from '@/components/seo/ToolInterfaceShell';
import { initFFmpeg } from '../shorts-maker/engine/clipper';

type ProcessState = 'IDLE' | 'GENERATING_STORY' | 'REVIEW_SCRIPT' | 'GENERATING_VOICE' | 'MERGING_VIDEO' | 'DONE';

export default function FacelessMakerClient() {
  const router = useRouter();

  // Settings State
  const [topic, setTopic] = useState('');
  const [voiceType, setVoiceType] = useState('sigma_male');
  const [language, setLanguage] = useState('English');
  const [frameRatio, setFrameRatio] = useState('9:16');
  const [bgFile, setBgFile] = useState<File | null>(null);
  
  // Workflow State
  const [status, setStatus] = useState<ProcessState>('IDLE');
  const [generatedScript, setGeneratedScript] = useState('');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>(['[SYSTEM] Faceless Pro Engine Ready. Waiting for inputs...']);
  
  // Final Outputs
  const [finalVideoUrl, setFinalVideoUrl] = useState<string | null>(null);
  const [finalBlob, setFinalBlob] = useState<Blob | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [logs]);

  const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

  // 🔥 STEP 1: Generate AI Script (And Pause for Review)
  const generateScript = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !bgFile) return;

    try {
      setStatus('GENERATING_STORY');
      setLogs(['[SYSTEM] Initializing Algo-Hacked AI Engine...']);
      
      const storyRes = await fetch('/api/faceless-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, language })
      });
      
      const storyData = await storyRes.json();
      if (!storyData.success) throw new Error(storyData.error);
      
      setGeneratedScript(storyData.script);
      setStatus('REVIEW_SCRIPT');
      addLog(`[AI-BRAIN] Script generated! Waiting for your final edits...`);

    } catch (err: any) {
      addLog(`[CRITICAL ERROR] ${err.message}`);
      setStatus('IDLE');
    }
  };

  
     // 🔥 STEP 2: Proceed with Edited Script to TTS & FFmpeg
  const renderVideo = async () => {
    if (!generatedScript || !bgFile) return;

    try {
      setStatus('GENERATING_VOICE');
      addLog(`[TTS-ENGINE] Converting approved script to ${voiceType} voice...`);
      setProgress(20);
      
      const ttsRes = await fetch('/api/faceless-tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script: generatedScript, voiceType })
      });

      if (!ttsRes.ok) {
        const errorData = await ttsRes.json();
        throw new Error(`AI Voice Error: ${errorData.error || 'API Failed'}`);
      }

      const audioBlob = await ttsRes.blob();
      addLog('[TTS-ENGINE] Voice locked! Booting FFmpeg...');
      setProgress(40);
      
      setStatus('MERGING_VIDEO');
      const ff = await initFFmpeg();
      
      ff.on('log', ({ message }: { message: string }) => {
        if (message.includes('time=')) addLog(`> Rendering: ${message}`);
      });

      const bgName = `bg_${Date.now()}.mp4`;
      const ttsName = `tts_${Date.now()}.mp3`;
      const outputName = `final_${Date.now()}.mp4`;

      await ff.writeFile(bgName, new Uint8Array(await bgFile.arrayBuffer()));
      await ff.writeFile(ttsName, new Uint8Array(await audioBlob.arrayBuffer()));

      setProgress(60);
      addLog(`[FFMPEG] Fusing Video & Audio in ${frameRatio} ratio...`);

      let cropFilter = 'crop=ih*(9/16):ih,scale=720:-2'; 
      if (frameRatio === '16:9') cropFilter = 'scale=1280:-2'; 
      if (frameRatio === '1:1') cropFilter = 'crop=ih:ih,scale=1080:1080'; 

      await ff.exec([
        '-ss', '15', 
        '-i', bgName,
        '-i', ttsName,
        '-map', '0:v:0',
        '-map', '1:a:0',
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-vf', cropFilter,
        '-shortest',
        outputName
      ]);

      const finalData = await ff.readFile(outputName);
      const outputBlob = new Blob([finalData as any], { type: 'video/mp4' });
      
      setFinalBlob(outputBlob);
      setFinalVideoUrl(URL.createObjectURL(outputBlob));

      await ff.deleteFile(bgName);
      await ff.deleteFile(ttsName);
      await ff.deleteFile(outputName);

      setProgress(100);
      setStatus('DONE');
      addLog('[SYSTEM] Viral Faceless Video Ready! 🚀');

    } catch (err: any) {
      console.error(err);
      addLog(`[CRITICAL ERROR] ${err.message}`);
      
      // 🔥 THE FIX: Ab ye wapas Step 1 pe nahi phekega, balki screen par pop-up dega!
      alert(`Bhai Rendering me Error aaya: ${err.message}`);
      setStatus('REVIEW_SCRIPT'); 
    }
  };
  
  // 🔥 SEND TO EDITOR BRIDGE
  const sendToEditor = () => {
    if (!finalBlob) return;
    
    // Using your exact IndexedDB logic from PendingEditListener
    const request = indexedDB.open('SeloiceTransferDB', 1);
    request.onupgradeneeded = (e: any) => {
      e.target.result.createObjectStore('media');
    };
    request.onsuccess = (e: any) => {
      const db = e.target.result;
      const tx = db.transaction('media', 'readwrite');
      const store = tx.objectStore('media');
      store.put(finalBlob, 'pending_clip');
      
      localStorage.setItem('seloice_pending_edit', 'true');
      router.push('/tools/video-editor'); // Send user to editor for captions
    };
  };

  return (
    <ToolInterfaceShell className="w-full max-w-5xl">
      <div className="w-full min-h-[85vh] bg-[#030305] text-white font-sans flex flex-col relative pb-10">
        
        <div className="fixed inset-0 z-0 flex justify-center pointer-events-none">
          <div className="absolute top-[-10%] w-[40rem] h-[40rem] bg-rose-600/10 rounded-full blur-[120px] mix-blend-screen opacity-60" />
        </div>

        <div className="relative z-10 mx-auto px-4 pt-10 md:pt-16 w-full max-w-5xl">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-4 uppercase drop-shadow-lg">
              FACELESS <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">PRO MAKER</span>
            </h2>
            <p className="text-zinc-400 font-medium text-sm md:text-base max-w-2xl mx-auto">
              Insta-Algo Optimized Scripts. You control the language, framing, and final cuts.
            </p>
          </div>

          <div className={`bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative overflow-hidden max-w-4xl mx-auto mb-10 ${status === 'DONE' ? 'hidden' : 'block'}`}>
            
            {status === 'IDLE' || status === 'GENERATING_STORY' ? (
              <form onSubmit={generateScript} className="space-y-6">
                {/* SETTINGS ROW */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase"><Languages size={16}/> Language</label>
                    <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500/50">
                      <option value="English">English</option>
                      <option value="Hindi">Hindi (Pure)</option>
                      <option value="Hinglish">Hinglish (WhatsApp Style)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase"><Scissors size={16}/> Frame Ratio</label>
                    <select value={frameRatio} onChange={(e) => setFrameRatio(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500/50">
                      <option value="9:16">9:16 (Reels/Shorts)</option>
                      <option value="1:1">1:1 (Insta Square)</option>
                      <option value="16:9">16:9 (YouTube Landscape)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase"><FileText size={16} /> Story Topic</label>
                  <textarea value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="A Reddit story about..." className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 text-white h-24" required />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase"><Gamepad2 size={16} /> Background Gameplay</label>
                  <input type="file" accept="video/mp4" onChange={(e) => setBgFile(e.target.files?.[0] || null)} className="w-full file:bg-rose-500/10 file:text-rose-400 file:border-0 file:mr-4 file:px-4 file:py-2 file:rounded-xl bg-black/50 border border-white/10 p-2 rounded-xl text-sm" required />
                </div>

                <button type="submit" disabled={status !== 'IDLE'} className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-600 to-orange-600 text-white font-black uppercase text-sm shadow-[0_4px_0_0_#9f1239] hover:translate-y-1 active:translate-y-2 active:shadow-none transition-all flex items-center justify-center gap-2">
                  {status === 'GENERATING_STORY' ? <Loader2 className="animate-spin" /> : <Wand2 />} 1. Generate AI Script
                </button>
              </form>
            ) : status === 'REVIEW_SCRIPT' ? (
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-rose-500/30 pb-3">
                  <Edit3 className="text-rose-400" />
                  <h3 className="text-xl font-black uppercase text-white">Review & Edit Script</h3>
                </div>
                <p className="text-xs text-zinc-400">Tweak the hook or fix any words before we generate the voice.</p>
                <textarea value={generatedScript} onChange={(e) => setGeneratedScript(e.target.value)} className="w-full bg-black/80 border border-rose-500/50 rounded-2xl p-5 text-white h-48 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono text-sm" />
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase"><Mic size={16} /> Voice</label>
                  <select value={voiceType} onChange={(e) => setVoiceType(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white">
                    <option value="sigma_male">Sigma Male</option>
                    <option value="reddit_guy">Reddit Guy</option>
                    <option value="creepy_girl">Creepy Girl</option>
                    <option value="storyteller">Storyteller</option>
                  </select>
                </div>

                <button onClick={renderVideo} className="w-full py-4 rounded-xl bg-white text-black font-black uppercase text-sm shadow-[0_4px_0_0_#a1a1aa] hover:translate-y-1 active:translate-y-2 active:shadow-none transition-all flex items-center justify-center gap-2">
                  <Video size={18} /> 2. Looks Good, Render Video!
                </button>
              </div>
            ) : (
              // TERMINAL UI
              <div className="bg-[#050505] border border-zinc-800 rounded-2xl p-4 font-mono h-[250px] flex flex-col">
                <div ref={terminalRef} className="flex-1 overflow-y-auto text-xs text-green-400 space-y-1">
                  {logs.map((log, i) => (<div key={i}>{log}</div>))}
                </div>
                <div className="mt-3 pt-3 border-t border-zinc-900">
                  <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-rose-500" animate={{ width: `${progress}%` }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* FINAL RESULT UI */}
          <AnimatePresence>
            {status === 'DONE' && finalVideoUrl && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mt-12 max-w-lg mx-auto">
                <div className="bg-[#0a0a0f] border border-rose-500/30 rounded-3xl p-6 shadow-2xl">
                  <h3 className="text-xl font-black italic uppercase text-center mb-4">Video Ready</h3>
                  <video src={finalVideoUrl} controls className={`w-full bg-black rounded-xl mb-4 ${frameRatio === '9:16' ? 'aspect-[9/16]' : frameRatio === '1:1' ? 'aspect-square' : 'aspect-video'}`} />
                  
                  <div className="flex flex-col gap-3">
                    <button onClick={sendToEditor} className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold uppercase text-sm flex items-center justify-center gap-2 transition-all">
                      <Type size={18} /> Send to Editor (Add Captions)
                    </button>
                    <a href={finalVideoUrl} download={`Faceless_${Date.now()}.mp4`} className="w-full py-3 border border-white/20 hover:bg-white/10 text-white rounded-xl font-bold uppercase text-sm flex items-center justify-center gap-2 transition-all">
                      <Download size={18} /> Download Raw Video
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </ToolInterfaceShell>
  );
}