// File: src/app/tools/video-compressor/page.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { Video, UploadCloud, Loader2, Download, ArrowLeft, FileVideo, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function VideoCompressor() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [stats, setStats] = useState({ original: 0, compressed: 0 });

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
        setProgress(Math.min(Math.round(progress * 100), 100));
      });

      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      
      setIsLoaded(true);
    } catch (error) {
      console.error("FFmpeg load error:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setOutputUrl(null);
      setProgress(0);
    }
  };

  const handleCompress = async () => {
    const ffmpeg = ffmpegRef.current;
    
    if (!file || !ffmpeg) {
      alert("Please wait for the tool to load completely or select a video.");
      return; 
    }

    setIsProcessing(true);
    setProgress(0);
    setOutputUrl(null);

    try {
      await ffmpeg.writeFile('input.mp4', await fetchFile(file));
      
      await ffmpeg.exec(['-i', 'input.mp4', '-vcodec', 'libx264', '-crf', '28', '-preset', 'ultrafast', 'output.mp4']);
      
      const data = await ffmpeg.readFile('output.mp4');
      
      // 🔥 FIX YAHAN HAI: .buffer hata diya gaya hai taaki TypeScript khush rahe
      const blob = new Blob([data as any], { type: 'video/mp4' });
      
      const url = URL.createObjectURL(blob);
      setOutputUrl(url);
      setStats({
        original: file.size,
        compressed: blob.size
      });
      
    } catch (error) {
      console.error("Error during compression:", error);
      alert("Something went wrong during compression. Please try a different video.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-orange-500/30 pb-20">
      <div className="fixed inset-0 z-0 pointer-events-none flex justify-center">
        <div className="absolute top-[-10%] w-[40rem] h-[40rem] bg-orange-600/10 rounded-full blur-[120px] opacity-40" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-8 md:pt-16">
        <Link href="/" className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-400 font-bold text-xs uppercase tracking-widest mb-10 transition-colors bg-orange-500/10 px-4 py-2 rounded-full border border-orange-500/20 w-fit">
          <ArrowLeft size={16} /> Back to Toolkit
        </Link>

        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-600 p-[2px] rounded-2xl mx-auto mb-6 shadow-xl shadow-orange-500/20 rotate-3">
            <div className="w-full h-full bg-[#111] rounded-[14px] flex items-center justify-center">
              <Video size={28} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-4">VIDEO <span className="text-orange-400">COMPRESSOR</span></h1>
          <p className="text-gray-400 font-medium max-w-lg mx-auto text-sm md:text-base">
            Shrink your video file size by up to 80% without losing visible quality. Processed 100% locally in your browser.
          </p>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-[2rem] p-6 md:p-10 shadow-2xl relative overflow-hidden">
          
          {!isLoaded && (
            <div className="absolute top-0 left-0 w-full h-1 bg-white/5 overflow-hidden">
              <motion.div animate={{ x: ["-100%", "100%"] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="w-1/2 h-full bg-orange-500" />
            </div>
          )}

          <div 
            onClick={() => isLoaded && !isProcessing && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center transition-all duration-300
              ${!isLoaded ? 'border-white/5 opacity-50 cursor-not-allowed' : 
                isProcessing ? 'border-orange-500/20 bg-orange-500/5 cursor-wait' : 
                'border-white/10 hover:border-orange-500/50 hover:bg-white/[0.02] cursor-pointer'}`}
          >
            <input type="file" accept="video/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} disabled={!isLoaded || isProcessing} />
            
            {isProcessing ? (
              <div className="flex flex-col items-center">
                <Loader2 size={48} className="text-orange-500 animate-spin mb-4" />
                <h3 className="text-xl font-black mb-2 italic">COMPRESSING VIDEO...</h3>
                <div className="w-48 h-2 bg-black rounded-full overflow-hidden mt-4 border border-white/10">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-gradient-to-r from-orange-500 to-red-500" />
                </div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-3">{progress}% COMPLETED</p>
              </div>
            ) : file ? (
              <div className="flex flex-col items-center">
                <FileVideo size={48} className="text-orange-400 mb-4" />
                <h3 className="text-xl font-bold mb-1 truncate max-w-xs">{file.name}</h3>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-6">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleCompress(); }}
                  className="px-8 py-4 rounded-xl bg-orange-600 text-white font-black uppercase tracking-widest text-sm shadow-[0_6px_0_0_#9a3412] active:translate-y-1 active:shadow-none transition-all hover:bg-orange-500"
                >
                  Compress Video
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <UploadCloud size={48} className="text-gray-600 mb-4" />
                <h3 className="text-xl font-black mb-2 italic text-gray-300">
                  {!isLoaded ? "LOADING ENGINE..." : "CLICK TO UPLOAD VIDEO"}
                </h3>
                <p className="text-sm text-gray-500 font-medium max-w-xs mx-auto">
                  {!isLoaded ? "Downloading WASM compression core." : "Supports MP4, MOV, WEBM and more."}
                </p>
              </div>
            )}
          </div>

          <AnimatePresence>
            {outputUrl && !isProcessing && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 bg-orange-500/10 border border-orange-500/20 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-400 shrink-0">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <h4 className="font-black italic text-lg text-orange-100">COMPRESSION DONE</h4>
                      <p className="text-xs text-orange-500/80 font-bold uppercase tracking-widest">Saved {(100 - (stats.compressed / stats.original) * 100).toFixed(0)}% space!</p>
                    </div>
                  </div>
                  <a href={outputUrl} download={`compressed_${file?.name || 'video.mp4'}`} className="w-full sm:w-auto px-6 py-3 rounded-xl bg-orange-500 text-black font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-orange-400 transition-colors">
                    <Download size={16} /> Download Video
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-orange-500/20 pt-6">
                  <div className="text-center">
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Original Size</p>
                    <p className="text-xl font-black text-gray-300">{(stats.original / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                  <div className="text-center border-l border-orange-500/20">
                    <p className="text-[10px] text-orange-500/80 font-black uppercase tracking-widest mb-1">New Size</p>
                    <p className="text-xl font-black text-orange-400">{(stats.compressed / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}