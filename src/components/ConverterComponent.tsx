"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, FileType, UploadCloud, Download, X, RefreshCcw, CheckCircle2, Settings2, Image as ImageIcon, Video, Music, PlayCircle } from 'lucide-react';
import Link from 'next/link';

// 🔥 FFmpeg imports
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export default function ConverterComponent() {
  const [file, setFile] = useState<File | null>(null);
  const [fileCategory, setFileCategory] = useState<'image' | 'video' | 'audio' | null>(null);
  const [targetFormat, setTargetFormat] = useState<string>('');
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [isFfmpegReady, setIsFfmpegReady] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const ffmpegRef = useRef(new FFmpeg());

  useEffect(() => {
    const loadFFmpeg = async () => {
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
      const ffmpeg = ffmpegRef.current;
      ffmpeg.on('progress', ({ progress }) => {
        setProgress(Math.min(Math.round(progress * 100), 100));
      });
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      setIsFfmpegReady(true);
    };
    loadFFmpeg().catch(console.error);
  }, []);

  const formats = {
    image: ['png', 'jpg', 'webp'],
    video: ['mp4', 'webm', 'gif'],
    audio: ['mp3', 'wav']
  };

  const processSelectedFile = (selectedFile: File) => {
    setFile(selectedFile);
    setConvertedUrl(null);
    setProgress(0);
    if (selectedFile.type.startsWith('image/')) { setFileCategory('image'); setTargetFormat('png'); }
    else if (selectedFile.type.startsWith('video/')) { setFileCategory('video'); setTargetFormat('mp4'); }
    else if (selectedFile.type.startsWith('audio/')) { setFileCategory('audio'); setTargetFormat('mp3'); }
  };

  const handleConvert = async () => {
    if (!file || !fileCategory || !targetFormat) return;
    setIsConverting(true);
    setProgress(0);

    try {
      if (fileCategory === 'image') {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width; canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          if (targetFormat === 'jpg' || targetFormat === 'jpeg') {
            ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) setConvertedUrl(URL.createObjectURL(blob));
            setIsConverting(false);
          }, `image/${targetFormat === 'jpg' ? 'jpeg' : targetFormat}`, 0.9);
        };
        img.src = url;
      } else {
        if (!isFfmpegReady) return;
        const ffmpeg = ffmpegRef.current;
        const inputName = `input.${file.name.split('.').pop()}`;
        const outputName = `output.${targetFormat}`;
        await ffmpeg.writeFile(inputName, await fetchFile(file));
        await ffmpeg.exec(['-i', inputName, outputName]);
        const data = await ffmpeg.readFile(outputName);
        const blob = new Blob([(data as Uint8Array).buffer], { type: targetFormat === 'mp3' ? 'audio/mp3' : `${fileCategory}/${targetFormat}` });
        setConvertedUrl(URL.createObjectURL(blob));
        setIsConverting(false);
      }
    } catch (err) { setIsConverting(false); alert("Error!"); }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 flex flex-col items-center relative selection:bg-indigo-500/30">
      <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="w-full max-w-4xl z-10 pt-4">
        <Link href="/" className="text-gray-500 hover:text-indigo-400 mb-8 inline-flex items-center gap-2 transition-colors">
          <ArrowLeft size={20} /> Back to Dashboard
        </Link>

        <div className="text-center mb-10">
          <h1 className="text-6xl font-black italic tracking-tighter uppercase">Universal <span className="text-indigo-500">Converter</span></h1>
          <p className="text-gray-400 mt-2 font-medium tracking-wide">Convert Image, Video, & Audio instantly in your browser.</p>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <AnimatePresence mode="wait">
            {!file ? (
              <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-2 border-dashed border-white/10 bg-black/20 rounded-3xl p-16 text-center cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group" onClick={() => fileInputRef.current?.click()}>
                <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => e.target.files?.[0] && processSelectedFile(e.target.files[0])} />
                <UploadCloud size={60} className="mx-auto mb-6 text-gray-600 group-hover:text-indigo-400 transition-colors" />
                <h3 className="text-2xl font-bold">Drop your file here</h3>
                <p className="text-gray-500 mt-2">MP4, WebM, WebP, JPG, PNG, MP3...</p>
              </motion.div>
            ) : (
              <motion.div key="process" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                {/* File Details */}
                <div className="flex items-center justify-between bg-white/5 border border-white/5 p-5 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="bg-indigo-500/20 p-3 rounded-xl text-indigo-400">{fileCategory === 'video' ? <Video/> : fileCategory === 'audio' ? <Music/> : <ImageIcon/>}</div>
                    <div>
                      <p className="font-bold truncate max-w-[200px] md:max-w-md">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button onClick={() => {setFile(null); setConvertedUrl(null);}} className="p-2 hover:bg-red-500/10 text-gray-500 hover:text-red-500 rounded-lg transition-all"><X/></button>
                </div>

                {!isConverting && !convertedUrl && (
                  <div className="bg-black/40 p-6 rounded-3xl border border-white/5">
                    <h4 className="font-bold mb-4 text-gray-400 flex items-center gap-2 uppercase tracking-widest text-xs"><Settings2 size={14}/> Target Format</h4>
                    <div className="flex flex-wrap gap-3">
                      {formats[fileCategory!].map(fmt => (
                        <button key={fmt} onClick={() => setTargetFormat(fmt)} className={`px-8 py-3 rounded-xl font-black uppercase tracking-tighter transition-all border-2 ${targetFormat === fmt ? 'bg-indigo-500 border-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'bg-white/5 border-transparent text-gray-500 hover:border-white/10'}`}>
                          {fmt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {isConverting ? (
                  <div className="space-y-4 py-4 text-center">
                    <p className="font-black text-indigo-400 animate-pulse uppercase">Processing {progress}%</p>
                    <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden">
                      <motion.div className="bg-indigo-500 h-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
                    </div>
                  </div>
                ) : convertedUrl ? (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-6 text-center">
                    <div className="p-1 bg-gradient-to-tr from-indigo-500 to-pink-500 rounded-3xl inline-block">
                        <div className="bg-[#111] rounded-[1.4rem] p-4">
                            {/* 🔥 PREVIEW LOGIC 🔥 */}
                            {fileCategory === 'image' && <img src={convertedUrl} className="max-h-64 rounded-xl shadow-2xl" alt="preview" />}
                            {fileCategory === 'video' && <video src={convertedUrl} controls className="max-h-64 rounded-xl shadow-2xl bg-black" />}
                            {fileCategory === 'audio' && <audio src={convertedUrl} controls className="w-64 md:w-80" />}
                        </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <button onClick={() => {
                            const a = document.createElement('a'); a.href = convertedUrl; a.download = `converted_${file?.name.split('.')[0]}.${targetFormat}`; a.click();
                        }} className="bg-white text-black px-12 py-4 rounded-2xl font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-2">
                            <Download size={20}/> Download {targetFormat.toUpperCase()}
                        </button>
                        <button onClick={() => {setFile(null); setConvertedUrl(null);}} className="bg-white/5 text-gray-400 px-12 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all">Convert Another</button>
                    </div>
                  </motion.div>
                ) : (
                  <button onClick={handleConvert} className="w-full bg-white text-black py-5 rounded-3xl font-black text-xl hover:bg-indigo-500 hover:text-white transition-all shadow-2xl active:scale-[0.98]">
                    START CONVERSION
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}