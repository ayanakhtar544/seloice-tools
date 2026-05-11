// File: src/app/tools/video-compressor/page.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Video, UploadCloud, Loader2, Download, X, Settings2, CheckCircle2, Minimize, HardDrive } from 'lucide-react';
import Link from 'next/link';

// 🔥 FFmpeg imports
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export default function VideoCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  
  // Compression Settings
  const [quality, setQuality] = useState<'high' | 'medium' | 'low'>('medium');
  
  // Results
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const ffmpegRef = useRef(new FFmpeg());

  // 🔥 Page load hote hi FFmpeg engine background me ready karna
  useEffect(() => {
    const loadFFmpeg = async () => {
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
      const ffmpeg = ffmpegRef.current;
      
      // Real-time compression progress
      ffmpeg.on('progress', ({ progress }) => {
        // progress kabhi-kabhi 1 se zyada chala jata hai bugs ki wajah se, isliye Min/Max set kiya hai
        const percentage = Math.min(Math.round(progress * 100), 100);
        setProgress(percentage);
      });

      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      setIsReady(true);
    };

    loadFFmpeg().catch(console.error);
  }, []);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.includes("video/mp4")) {
      setFile(droppedFile); setCompressedUrl(null);
    } else {
      alert("Bhai, filhal sirf MP4 video allow hai taaki browser crash na ho!");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile); setCompressedUrl(null);
    }
  };

  // 🔥 ASLI COMPRESSION LOGIC (Client-Side)

  const handleCompress = async () => {
    if (!file || !isReady) return;
    setIsCompressing(true);
    setProgress(0);

    try {
      const ffmpeg = ffmpegRef.current;
      await ffmpeg.writeFile('input.mp4', await fetchFile(file));
      
      // 🔥 SENIOR DEV SWEET SPOT (Speed + Compression)
      // CRF jitna bada hoga, file utni choti hogi. 
      // Ultrafast speed ke sath hum CRF aggressively set kar rahe hain.
      let crfValue = '32'; // Medium Quality (Choti file, theek-thaak quality)
      if (quality === 'high') crfValue = '26'; // Badi file, Achhi quality
      if (quality === 'low') crfValue = '38';  // Bohot choti file, Low quality

      // Wapas 'ultrafast' laga diya taaki user ko wait na karna pade, bina scaling ke!
      await ffmpeg.exec([
        '-i', 'input.mp4', 
        '-vcodec', 'libx264', 
        '-crf', crfValue, 
        '-preset', 'ultrafast', 
        '-c:a', 'copy', // Audio ko process hone se bacha rahe hain (Speed badhayega)
        'output.mp4'
      ]);
      
      const data = await ffmpeg.readFile('output.mp4');
      const blob = new Blob([(data as Uint8Array).buffer], { type: 'video/mp4' });
      
      // Agar video already itni compressed thi ki uska size badh gaya, toh error de denge
      if (blob.size >= file.size) {
        alert("Bhai, ye video already highly compressed hai! Isko aur chota karenge toh quality puri kharab ho jayegi.");
        resetTool();
        return;
      }

      const url = URL.createObjectURL(blob);
      setCompressedSize(blob.size);
      setCompressedUrl(url);
    } catch (err) {
      console.error("Compression me error:", err);
      alert("Kuch gadbad ho gayi!");
    } finally {
      setIsCompressing(false);
    }
  };
  const handleDownload = () => {
    if (!compressedUrl || !file) return;
    const a = document.createElement('a');
    a.href = compressedUrl;
    const originalName = file.name.split('.')[0];
    a.download = `${originalName}_compressed.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const resetTool = () => {
    setFile(null);
    setCompressedUrl(null);
    setCompressedSize(null);
    setProgress(0);
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return "0 MB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  // Kitna percent data bacha liya (Compression Ratio)
  const getSavedPercentage = () => {
    if (!file || !compressedSize) return 0;
    const saved = ((file.size - compressedSize) / file.size) * 100;
    return saved > 0 ? saved.toFixed(1) : 0;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-orange-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-yellow-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-4xl mx-auto z-10 relative pt-4">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-400 mb-8 transition-colors">
          <ArrowLeft size={20} /> Back to Tools
        </Link>

        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-gradient-to-tr from-orange-600 to-yellow-500 rounded-3xl mb-4 shadow-[0_0_30px_rgba(234,88,12,0.3)]">
            <Minimize size={40} className="text-white" />
          </div>
          <h1 className="text-5xl font-black mb-2 tracking-tight">Video <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">Compressor</span></h1>
          <p className="text-gray-400">Shrink your MP4 videos up to 80% without losing visible quality.</p>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-[2rem] p-6 md:p-10 shadow-2xl">
          
          <AnimatePresence mode="wait">
            {/* STAGE 1: Upload */}
            {!file && (
              <motion.div 
                key="upload"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className={`border-2 border-dashed rounded-[2rem] p-12 text-center transition-all ${isDragging ? 'border-orange-500 bg-orange-500/5' : 'border-white/10 bg-black/40 hover:border-white/30 hover:bg-black/60'}`}
                onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
              >
                <input type="file" accept="video/mp4" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  {isReady ? <UploadCloud size={40} className="text-gray-400" /> : <Loader2 size={40} className="text-orange-500 animate-spin" />}
                </div>
                <h3 className="text-2xl font-bold mb-2">
                  {isReady ? "Drag & Drop MP4 Video" : "Loading Compressor..."}
                </h3>
                <p className="text-gray-500 mb-6">
                  {isReady ? "Files are compressed entirely on your device for 100% privacy." : "Initializing WASM Engine..."}
                </p>
                <button 
                  disabled={!isReady}
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                >
                  Browse Video File
                </button>
              </motion.div>
            )}

            {/* STAGE 2: Selected & Settings */}
            {file && !compressedUrl && (
              <motion.div key="process" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                
                <div className="bg-black/50 border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-orange-500/20 p-3 rounded-xl text-orange-400"><Video size={24} /></div>
                    <div>
                      <p className="font-bold truncate max-w-[200px] md:max-w-[400px]">{file.name}</p>
                      <p className="text-xs text-gray-500">Original Size: {formatSize(file.size)}</p>
                    </div>
                  </div>
                  {!isCompressing && (
                    <button onClick={resetTool} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"><X size={20}/></button>
                  )}
                </div>

                {!isCompressing && (
                  <div>
                    <h4 className="font-bold flex items-center gap-2 mb-4"><Settings2 size={18} className="text-orange-500" /> Compression Quality</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {['high', 'medium', 'low'].map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => setQuality(lvl as any)}
                          className={`p-4 rounded-xl border transition-all text-center ${quality === lvl ? 'bg-orange-500/10 border-orange-500 text-orange-400' : 'bg-black/50 border-white/10 text-gray-400 hover:border-white/30'}`}
                        >
                          <p className="font-bold capitalize">{lvl}</p>
                          <p className="text-[10px] uppercase mt-1">
                            {lvl === 'high' ? 'Large File' : lvl === 'medium' ? 'Balanced' : 'Small File'}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  {isCompressing ? (
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-orange-400 flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> Compressing Video... (Browser tab open rakhna)</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={handleCompress}
                      className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-500 hover:to-yellow-500 text-white py-4 rounded-2xl font-black text-xl transition-all shadow-lg shadow-orange-600/20 flex items-center justify-center gap-2"
                    >
                      <Minimize size={24} /> Compress Video Now
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* STAGE 3: Done & Comparison */}
            {compressedUrl && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                
                <h3 className="text-3xl font-black mb-2 flex items-center justify-center gap-3">
                  <CheckCircle2 size={30} className="text-green-500" /> Done! You Saved {getSavedPercentage()}% Space
                </h3>
                <p className="text-gray-400 mb-8">Video compressed successfully. Compare sizes below.</p>
                
                {/* ⚖️ NAYA: Before vs After Size Comparison */}
                <div className="flex items-center justify-center gap-4 mb-10 max-w-lg mx-auto">
                   <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                      <p className="text-xs text-gray-500 font-bold tracking-widest mb-1">ORIGINAL</p>
                      <p className="text-2xl font-black text-white">{formatSize(file?.size || 0)}</p>
                   </div>
                   <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center border border-white/10 shrink-0">
                      <ArrowLeft size={20} className="text-gray-500 rotate-180" />
                   </div>
                   <div className="flex-1 bg-orange-500/10 border border-orange-500/30 rounded-2xl p-5 text-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-orange-500 text-black text-[9px] font-black px-2 py-1 rounded-bl-lg">- {getSavedPercentage()}%</div>
                      <p className="text-xs text-orange-400 font-bold tracking-widest mb-1">COMPRESSED</p>
                      <p className="text-2xl font-black text-white">{formatSize(compressedSize || 0)}</p>
                   </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={handleDownload}
                    className="bg-white text-black px-10 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-xl shadow-white/10"
                  >
                    <Download size={20} /> Download Compressed MP4
                  </button>
                  <button 
                    onClick={resetTool}
                    className="bg-white/10 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all"
                  >
                    Compress Another
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