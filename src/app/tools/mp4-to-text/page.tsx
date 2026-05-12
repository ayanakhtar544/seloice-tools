// File: src/app/tools/smart-captions/page.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { Type, UploadCloud, Loader2, Download, ArrowLeft, FileVideo, CheckCircle2, MessageSquareText } from 'lucide-react';
import Link from 'next/link';

export default function SmartCaptions() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("LOADING ENGINE...");
  const [isProcessing, setIsProcessing] = useState(false);
  const [captions, setCaptions] = useState<string>("");

  const ffmpegRef = useRef<FFmpeg | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadFFmpeg();
  }, []);

  const loadFFmpeg = async () => {
    try {
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
      const ffmpeg = new FFmpeg();
      ffmpegRef.current = ffmpeg;

      ffmpeg.on('progress', ({ progress }) => {
        // Only show progress for audio extraction phase
        setProgress(Math.min(Math.round(progress * 100), 100));
      });

      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      
      setIsLoaded(true);
      setStatusText("CLICK TO UPLOAD VIDEO");
    } catch (error) {
      console.error("FFmpeg load error:", error);
      setStatusText("ERROR LOADING TOOL");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setCaptions("");
      setProgress(0);
    }
  };

  const handleGenerateCaptions = async () => {
    const ffmpeg = ffmpegRef.current;
    
    if (!file || !ffmpeg) {
      alert("Please wait for the tool to load completely or select a video.");
      return; 
    }

    setIsProcessing(true);
    setProgress(0);
    setCaptions("");
    setStatusText("EXTRACTING AUDIO (LOCALLY)...");

    try {
      // 1. Extract Audio from Video locally
      await ffmpeg.writeFile('input.mp4', await fetchFile(file));
      
      // Fast audio extraction: mp3, 1 channel, low bitrate for speech recognition
      await ffmpeg.exec(['-i', 'input.mp4', '-vn', '-acodec', 'libmp3lame', '-ac', '1', '-ar', '16000', '-q:a', '5', 'audio.mp3']);
      
      const audioData = await ffmpeg.readFile('audio.mp3');
      
      // 🔥 TypeScript strict mode bypass fix
      const audioBlob = new Blob([audioData as any], { type: 'audio/mp3' });
      const audioFile = new File([audioBlob], "audio.mp3", { type: 'audio/mp3' });

      setStatusText("ANALYZING SPEECH WITH AI...");
      setProgress(100); // Extraction done, now waiting for API

      // 2. Send audio to Groq API route
      const formData = new FormData();
      formData.append('file', audioFile);

      // Sending to your local Next.js API route
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

     if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || "Failed to connect to Groq API");
      }

      const data = await response.json();
      
      // Assuming your API returns { text: "transcribed text..." }
      if (data.text) {
        setCaptions(data.text);
      } else {
        setCaptions("Transcription completed, but no text was returned.");
      }
      
    } catch (error: any) {
      console.error("Error generating captions:", error);
      alert(`Error: ${error.message}`); // 🔥 Ab humein exactly pata chalega kya phata hai
    } finally {
      setIsProcessing(false);
      setStatusText("CLICK TO UPLOAD VIDEO");
    }
  };

  const downloadSRT = () => {
    if (!captions) return;
    
    // Simple logic to create a basic text file (You can enhance this to actual SRT format later)
    const element = document.createElement("a");
    const fileBlob = new Blob([captions], {type: 'text/plain'});
    element.href = URL.createObjectURL(fileBlob);
    element.download = `captions_${file?.name.split('.')[0] || 'video'}.txt`;
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="w-full  bg-[#050505] text-white font-sans selection:bg-indigo-500/30 pb-20">
      
      {/* Background Glow */}
      <div className="fixed inset-0 z-0 pointer-events-none flex justify-center">
        <div className="absolute top-[-10%] w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[120px] opacity-40" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-8 md:pt-16">
        {/* Top Navigation */}
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 mb-8 md:mb-12">
          <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">Home</Link>
          <span className="opacity-50">/</span>
          <Link href="/#tools" className="hover:text-white transition-colors">Tools</Link>
          <span className="opacity-50">/</span>
          <span className="text-white">SMART CAPTIONS</span>
        </nav>
    

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-600 p-[2px] rounded-2xl mx-auto mb-6 shadow-xl shadow-indigo-500/20 rotate-3">
            <div className="w-full h-full bg-[#111] rounded-[14px] flex items-center justify-center">
              <Type size={28} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-4">SMART <span className="text-indigo-400">CAPTIONS</span></h1>
          <p className="text-gray-400 font-medium max-w-lg mx-auto text-sm md:text-base">
            Auto-generate highly accurate subtitles for your videos using advanced AI. Lightning fast and completely free.
          </p>
        </div>

        {/* Main Tool Card */}
        <div className="bg-[#111] border border-white/10 rounded-[2rem] p-6 md:p-10 shadow-2xl relative overflow-hidden">
          
          {/* Status Indicator */}
          {!isLoaded && (
            <div className="absolute top-0 left-0 w-full h-1 bg-white/5 overflow-hidden">
              <motion.div animate={{ x: ["-100%", "100%"] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="w-1/2 h-full bg-indigo-500" />
            </div>
          )}

          {/* Upload Area */}
          <div 
            onClick={() => isLoaded && !isProcessing && !captions && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center transition-all duration-300
              ${!isLoaded ? 'border-white/5 opacity-50 cursor-not-allowed' : 
                isProcessing ? 'border-indigo-500/20 bg-indigo-500/5 cursor-wait' : 
                captions ? 'border-white/5 hidden' : 'border-white/10 hover:border-indigo-500/50 hover:bg-white/[0.02] cursor-pointer'}`}
          >
            <input type="file" accept="video/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} disabled={!isLoaded || isProcessing} />
            
            {isProcessing ? (
              <div className="flex flex-col items-center">
                <Loader2 size={48} className="text-indigo-500 animate-spin mb-4" />
                <h3 className="text-xl font-black mb-2 italic uppercase">{statusText}</h3>
                {progress < 100 && (
                  <>
                    <div className="w-48 h-2 bg-black rounded-full overflow-hidden mt-4 border border-white/10">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" />
                    </div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-3">{progress}% COMPLETED</p>
                  </>
                )}
                {progress === 100 && (
                  <p className="text-xs text-gray-400 mt-3 animate-pulse">Communicating with AI models...</p>
                )}
              </div>
            ) : file && !captions ? (
              <div className="flex flex-col items-center">
                <FileVideo size={48} className="text-indigo-400 mb-4" />
                <h3 className="text-xl font-bold mb-1 truncate max-w-xs">{file.name}</h3>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-6">Ready to extract speech</p>
                <div className="flex gap-4">
                  <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="px-6 py-4 rounded-xl bg-white/5 text-gray-300 font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-colors">
                    Change Video
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleGenerateCaptions(); }} className="px-8 py-4 rounded-xl bg-indigo-600 text-white font-black uppercase tracking-widest text-sm shadow-[0_6px_0_0_#3730a3] active:translate-y-1 active:shadow-none transition-all hover:bg-indigo-500 flex items-center gap-2">
                    <Type size={18} /> Generate Captions
                  </button>
                </div>
              </div>
            ) : !captions && (
              <div className="flex flex-col items-center">
                <UploadCloud size={48} className="text-gray-600 mb-4" />
                <h3 className="text-xl font-black mb-2 italic text-gray-300">{statusText}</h3>
                <p className="text-sm text-gray-500 font-medium max-w-xs mx-auto">
                  {!isLoaded ? "Downloading WASM core engine." : "AI automatically detects language and creates subtitles."}
                </p>
              </div>
            )}
          </div>

          {/* AI Result Area */}
          <AnimatePresence>
            {captions && !isProcessing && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 shrink-0">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <h4 className="font-black italic text-lg text-indigo-100 uppercase">AI Transcript Ready</h4>
                      <p className="text-xs text-indigo-500/80 font-bold uppercase tracking-widest">Edit & Download</p>
                    </div>
                  </div>
                  <button onClick={() => { setCaptions(""); setFile(null); }} className="text-xs font-bold text-gray-500 hover:text-white uppercase tracking-widest transition-colors">
                    Start Over
                  </button>
                </div>

                <div className="relative group mb-6">
                  <MessageSquareText className="absolute top-4 left-4 text-gray-600" size={20} />
                  <textarea 
                    value={captions}
                    onChange={(e) => setCaptions(e.target.value)}
                    className="w-full h-64 bg-black/50 border border-white/10 rounded-2xl p-4 pl-12 text-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium leading-relaxed resize-none"
                    placeholder="Transcription will appear here..."
                  />
                  <div className="absolute bottom-4 right-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                    {captions.split(' ').length} Words
                  </div>
                </div>

                <div className="flex justify-end">
                  <button onClick={downloadSRT} className="px-8 py-4 rounded-xl bg-indigo-600 text-white font-black uppercase tracking-widest text-sm shadow-[0_6px_0_0_#3730a3] active:translate-y-1 active:shadow-none transition-all hover:bg-indigo-500 flex items-center gap-2">
                    <Download size={18} /> Download Text File
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      
        {/* Try Other Tools Section */}
        <div className="border-t border-white/10 pt-12 pb-8 mt-16 w-full">
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-xl md:text-2xl font-black italic uppercase flex items-center gap-2">Try Other Tools</h3>
             <a href="/#tools" className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors">View All</a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="/tools/video-compressor">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-4 group">
                <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-200 group-hover:text-white transition-colors">Video Compressor</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Free Tool</p>
                </div>
              </div>
            </a>
            <a href="/tools/auto-captions">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-4 group">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 13h4"/><path d="M15 13h2"/><path d="M7 9h2"/><path d="M13 9h4"/><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-200 group-hover:text-white transition-colors">Auto Captions</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Free Tool</p>
                </div>
              </div>
            </a>
            <a href="/tools/bg-remover">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-4 group">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-200 group-hover:text-white transition-colors">BG Remover</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Free Tool</p>
                </div>
              </div>
            </a>
          </div>
        </div>
</div>
    </div>
  );
}