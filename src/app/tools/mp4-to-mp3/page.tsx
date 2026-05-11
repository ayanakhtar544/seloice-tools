// File: src/app/tools/mp4-to-mp3/page.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Music, Video, UploadCloud, FileAudio, Loader2, Download, X, Settings2, CheckCircle2, PlayCircle } from 'lucide-react';
import Link from 'next/link';

// 🔥 FFmpeg imports
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export default function Mp4ToMp3() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedAudioUrl, setConvertedAudioUrl] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const ffmpegRef = useRef(new FFmpeg());

  useEffect(() => {
    const loadFFmpeg = async () => {
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
      const ffmpeg = ffmpegRef.current;
      
      ffmpeg.on('progress', ({ progress }) => {
        setProgress(Math.round(progress * 100));
      });

      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      setIsReady(true);
    };

    loadFFmpeg().catch(console.error);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(true);
  };
  
  const handleDragLeave = () => setIsDragging(false);
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.includes("video/")) {
      setFile(droppedFile); setConvertedAudioUrl(null);
    } else {
      alert("Bhai, sirf video file hi chalegi!");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile); setConvertedAudioUrl(null);
    }
  };

  const handleConvert = async () => {
    if (!file || !isReady) return;
    setIsConverting(true);
    setProgress(0);

    try {
      const ffmpeg = ffmpegRef.current;
      await ffmpeg.writeFile('input.mp4', await fetchFile(file));
      await ffmpeg.exec(['-i', 'input.mp4', '-q:a', '0', '-map', 'a', 'output.mp3']);
      
      const data = await ffmpeg.readFile('output.mp3');
      const blob = new Blob([(data as Uint8Array).buffer], { type: 'audio/mp3' });
      const url = URL.createObjectURL(blob);
      
      setConvertedAudioUrl(url);
    } catch (err) {
      console.error("Conversion me error:", err);
      alert("Kuch gadbad ho gayi convert karte time.");
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (!convertedAudioUrl || !file) return;
    const a = document.createElement('a');
    a.href = convertedAudioUrl;
    const originalName = file.name.split('.')[0];
    a.download = `${originalName}_audio.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const resetTool = () => {
    setFile(null);
    setConvertedAudioUrl(null);
    setProgress(0);
  };

  const formatSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-emerald-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-4xl mx-auto z-10 relative pt-4">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-400 mb-8 transition-colors">
          <ArrowLeft size={20} /> Back to Tools
        </Link>

        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-gradient-to-tr from-purple-600 to-emerald-500 rounded-3xl mb-4 shadow-[0_0_30px_rgba(147,51,234,0.3)]">
            <Music size={40} className="text-white" />
          </div>
          <h1 className="text-5xl font-black mb-2 tracking-tight">MP4 to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-emerald-400">MP3 Converter</span></h1>
          <p className="text-gray-400">Extract high-quality audio from any MP4 video instantly in your browser.</p>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-[2rem] p-6 md:p-10 shadow-2xl">
          
          <AnimatePresence mode="wait">
            {/* STAGE 1: Upload */}
            {!file && (
              <motion.div 
                key="upload"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className={`border-2 border-dashed rounded-[2rem] p-12 text-center transition-all ${isDragging ? 'border-purple-500 bg-purple-500/5' : 'border-white/10 bg-black/40 hover:border-white/30 hover:bg-black/60'}`}
                onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
              >
                <input type="file" accept="video/mp4,video/x-m4v,video/*" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  {isReady ? <UploadCloud size={40} className="text-gray-400" /> : <Loader2 size={40} className="text-purple-500 animate-spin" />}
                </div>
                <h3 className="text-2xl font-bold mb-2">
                  {isReady ? "Drag & Drop your video" : "Loading Converter Engine..."}
                </h3>
                <p className="text-gray-500 mb-6">
                  {isReady ? "Fast, secure, and works offline after loading." : "Please wait a few seconds..."}
                </p>
                <button 
                  disabled={!isReady}
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                >
                  Browse Files
                </button>
              </motion.div>
            )}

            {/* STAGE 2: Selected & Processing */}
            {file && !convertedAudioUrl && (
              <motion.div key="process" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="bg-black/50 border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-purple-500/20 p-3 rounded-xl text-purple-400"><Video size={24} /></div>
                    <div>
                      <p className="font-bold truncate max-w-[200px] md:max-w-[400px]">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatSize(file.size)}</p>
                    </div>
                  </div>
                  {!isConverting && (
                    <button onClick={resetTool} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"><X size={20}/></button>
                  )}
                </div>

                <div className="pt-4">
                  {isConverting ? (
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-purple-400 flex items-center gap-2"><Settings2 size={16} className="animate-spin" /> Extracting Audio...</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-emerald-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={handleConvert}
                      className="w-full bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 text-white py-4 rounded-2xl font-black text-xl transition-all shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2"
                    >
                      <FileAudio size={24} /> Convert to MP3
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* STAGE 3: Done & Preview */}
            {convertedAudioUrl && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                
                <h3 className="text-3xl font-black mb-2 flex items-center justify-center gap-3">
                  <CheckCircle2 size={30} className="text-emerald-500" /> Conversion Complete!
                </h3>
                <p className="text-gray-400 mb-6">Preview your audio below before downloading.</p>
                
                {/* 🔥 NAYA: Audio Player Box */}
                <div className="bg-black/60 border border-white/10 rounded-2xl p-5 mb-8 max-w-md mx-auto shadow-inner">
                  <div className="flex items-center gap-2 mb-3 justify-center text-sm font-bold text-emerald-400">
                    <PlayCircle size={18} /> Audio Preview
                  </div>
                  {/* HTML5 Native Audio Player */}
                  <audio 
                    controls 
                    src={convertedAudioUrl} 
                    className="w-full rounded-lg outline-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={handleDownload}
                    className="bg-white text-black px-10 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-xl shadow-white/10"
                  >
                    <Download size={20} /> Download MP3
                  </button>
                  <button 
                    onClick={resetTool}
                    className="bg-white/10 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all"
                  >
                    Convert Another
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