// File: src/app/tools/smart-captions/page.tsx
"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchFile } from '@ffmpeg/util';
import type { FFmpeg } from '@ffmpeg/ffmpeg';
import {
  loadFfmpegCore,
  logFfmpegLoadError,
  preloadFfmpegCore,
} from '@/lib/ffmpeg/load-core';
import { Type, UploadCloud, Loader2, Download, FileVideo, CheckCircle2, MessageSquareText, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const MAX_VIDEO_SIZE_BYTES = 300 * 1024 * 1024;

export default function Mp4ToTextClient() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('CLICK TO UPLOAD VIDEO');
  const [isProcessing, setIsProcessing] = useState(false);
  const [captions, setCaptions] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const ffmpegRef = useRef<FFmpeg | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const warm = () => preloadFfmpegCore();
    const browserWindow = window as Window & {
      requestIdleCallback?: (
        callback: IdleRequestCallback,
        options?: IdleRequestOptions
      ) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (browserWindow.requestIdleCallback) {
      const idleId = browserWindow.requestIdleCallback(() => warm(), {
        timeout: 1500,
      });
      return () => browserWindow.cancelIdleCallback?.(idleId);
    }

    const timeoutId = browserWindow.setTimeout(warm, 500);
    return () => browserWindow.clearTimeout(timeoutId);
  }, []);

  const ensureFfmpeg = async (): Promise<FFmpeg | null> => {
    if (ffmpegRef.current && isLoaded) return ffmpegRef.current;
    setStatusText('LOADING ENGINE...');
    try {
      const ffmpeg = await loadFfmpegCore();
      ffmpeg.on('progress', ({ progress: p }) => {
        setProgress(Math.min(Math.round(p * 100), 100));
      });
      ffmpegRef.current = ffmpeg;
      setIsLoaded(true);
      setStatusText('CLICK TO UPLOAD VIDEO');
      return ffmpeg;
    } catch (error) {
      logFfmpegLoadError('mp4-to-text', error);
      setStatusText('ERROR LOADING TOOL');
      return null;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const nextFile = e.target.files[0];
      if (!nextFile.type.startsWith('video/')) {
        setError('Please upload a valid video file.');
        return;
      }
      if (nextFile.size > MAX_VIDEO_SIZE_BYTES) {
        setError('Video is too large for fast mobile transcription. Keep it under 300 MB.');
        return;
      }

      setError(null);
      setFile(nextFile);
      setCaptions("");
      setProgress(0);
      void ensureFfmpeg();
    }
  };

  const handleGenerateCaptions = async () => {
    if (!file) return;
    setError(null);
    const ffmpeg = await ensureFfmpeg();
    if (!ffmpeg) {
      setError('Could not load the transcription engine. Please refresh and try again.');
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

      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 45_000);

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });
      window.clearTimeout(timeoutId);

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
      
    } catch (error: unknown) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error generating captions:', error);
      }
      const message = error instanceof Error ? error.message : 'Something went wrong';
      setError(message);
    } finally {
      try {
        await ffmpegRef.current?.deleteFile('input.mp4');
        await ffmpegRef.current?.deleteFile('audio.mp3');
      } catch {
        // Ignore cleanup failures.
      }
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
    URL.revokeObjectURL(element.href);
  };

  return (
    <div className="w-full  bg-[#050505] text-white font-sans selection:bg-indigo-500/30 pb-20">
      
      {/* Background Glow */}
      <div className="fixed inset-0 z-0 pointer-events-none flex justify-center">
        <div className="absolute top-[-10%] w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[120px] opacity-40" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-6 md:pt-16">
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
          <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-4">SMART <span className="text-indigo-400">CAPTIONS</span></h2>
          <p className="text-gray-400 font-medium max-w-lg mx-auto text-sm md:text-base">
            Auto-generate highly accurate subtitles for your videos using advanced AI. Lightning fast and completely free.
          </p>
        </div>

        {/* Main Tool Card */}
        <div className="bg-[#111] border border-white/10 rounded-[2rem] p-6 md:p-10 shadow-2xl relative overflow-hidden">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <p>{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Status Indicator */}
          {!isLoaded && (
            <div className="absolute top-0 left-0 w-full h-1 bg-white/5 overflow-hidden">
              <motion.div animate={{ x: ["-100%", "100%"] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="w-1/2 h-full bg-indigo-500" />
            </div>
          )}

          {/* Upload Area */}
          <div 
            onClick={() => !isProcessing && !captions && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center transition-all duration-300
              ${!isLoaded ? 'border-white/5 opacity-50 cursor-not-allowed' : 
                isProcessing ? 'border-indigo-500/20 bg-indigo-500/5 cursor-wait' : 
                captions ? 'border-white/5 hidden' : 'border-white/10 hover:border-indigo-500/50 hover:bg-white/[0.02] cursor-pointer'}`}
          >
              <input type="file" accept="video/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} disabled={isProcessing} />
            
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
                  {!isLoaded ? "Preparing the local video engine for a faster first run." : "AI automatically detects language and creates subtitles."}
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

</div>
    </div>
  );
}
