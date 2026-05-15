// File: src/app/tools/auto-captions/page.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { Subtitles, UploadCloud, Loader2, Download, ArrowLeft, FileVideo, CheckCircle2, Globe, Palette, Edit3, Settings, PlayCircle, AlignVerticalSpaceAround } from 'lucide-react';
import Link from 'next/link';

const LANGUAGES = [
  { code: 'auto', name: 'Auto Detect (AI Magic)' },
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi (हिंदी)' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
];

const TEXT_COLORS = ['white', 'yellow', 'cyan', 'green', 'red', 'black'];
const BG_COLORS = ['black', 'white', 'blue', 'red', 'green', 'transparent'];

interface CaptionBlock {
  id: number;
  time: string;
  text: string;
  startSec: number;
  endSec: number;
}

export default function AutoCaptions() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("LOADING ENGINE...");
  
  const [appState, setAppState] = useState<'upload' | 'processing' | 'edit' | 'burning' | 'done'>('upload');
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('auto');
  
  const [captions, setCaptions] = useState<CaptionBlock[]>([]);
  // 🔥 Position Feature Added Here
  const [capStyle, setCapStyle] = useState({ size: 36, color: 'yellow', bg: 'black', bgOpacity: '0.6', position: 'bottom' });

  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
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
      setStatusText("CLICK TO UPLOAD VIDEO");
    } catch (error) {
      console.error("FFmpeg error:", error);
      setStatusText("ERROR LOADING TOOL");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setOutputUrl(null);
      setProgress(0);
      setAppState('upload');
    }
  };

  const timeToSeconds = (timeStr: string) => {
    if (!timeStr) return 0;
    const [hours, minutes, secMs] = timeStr.split(':');
    const [sec, ms] = secMs.split(',');
    return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(sec) + parseInt(ms) / 1000;
  };

  const handleExtractText = async () => {
    const ffmpeg = ffmpegRef.current;
    if (!file || !ffmpeg) return;

    setAppState('processing');
    setProgress(0);
    setStatusText("EXTRACTING AUDIO...");

    try {
      await ffmpeg.writeFile('input.mp4', await fetchFile(file));
      await ffmpeg.exec(['-i', 'input.mp4', '-vn', '-acodec', 'libmp3lame', '-ac', '1', '-ar', '16000', '-q:a', '5', 'audio.mp3']);
      const audioData = await ffmpeg.readFile('audio.mp3');
      const audioBlob = new Blob([audioData as any], { type: 'audio/mp3' });
      const audioFile = new File([audioBlob], "audio.mp3", { type: 'audio/mp3' });

      setStatusText("AI IS WRITING CAPTIONS...");
      const formData = new FormData();
      formData.append('file', audioFile);
      formData.append('language', selectedLanguage);

      const response = await fetch('/api/generate-srt', { method: 'POST', body: formData });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || "API Error");
      }

      const srtText = await response.text();
      if (!srtText || srtText.trim() === "") throw new Error("No speech detected.");

      const blocks = srtText.trim().split(/\n\s*\n/).map((block, idx) => {
        const lines = block.split('\n');
        const timeLine = lines[1];
        const [startStr, endStr] = timeLine.split(' --> ');
        return {
          id: idx,
          time: timeLine,
          startSec: timeToSeconds(startStr),
          endSec: timeToSeconds(endStr),
          text: lines.slice(2).join('\n')
        };
      }).filter(b => b.text.trim() !== "");

      setCaptions(blocks);
      setAppState('edit');

    } catch (error: any) {
      console.error("Error:", error);
      alert(`Error: ${error.message}`);
      setAppState('upload');
    }
  };

  const handleBurnVideo = async () => {
    const ffmpeg = ffmpegRef.current;
    if (!file || !ffmpeg) return;

    setAppState('burning');
    setProgress(0);

    try {
      // 🔥 DYNAMIC FONT LOADER FOR HINDI/OTHER LANGUAGES
      setStatusText("LOADING FONTS...");
      let fontUrl = 'https://raw.githubusercontent.com/google/fonts/main/ofl/roboto/Roboto-Bold.ttf'; // Default English
      if (selectedLanguage === 'hi') {
        // Special font for Hindi Devanagari support
        fontUrl = 'https://raw.githubusercontent.com/google/fonts/main/ofl/hind/Hind-Bold.ttf';
      }
      const fontData = await fetchFile(fontUrl);
      await ffmpeg.writeFile('custom_font.ttf', fontData);

      setStatusText("BURNING CUSTOM CAPTIONS...");

      const drawtextFilters = captions.map(cap => {
        let safeText = cap.text.replace(/\n/g, ' ').replace(/'/g, "\u2019").replace(/:/g, "\\:").replace(/,/g, "\\,");
        if (!safeText.trim()) return null;

        const boxFilter = capStyle.bg === 'transparent' ? 'box=0' : `box=1:boxcolor=${capStyle.bg}@${capStyle.bgOpacity}:boxborderw=10`;
        
        // 🔥 CALCULATE POSITION FOR FFMPEG
        let yPos = "h*0.85-text_h"; // default bottom
        if (capStyle.position === 'top') yPos = "h*0.15";
        else if (capStyle.position === 'middle') yPos = "(h-text_h)/2";
          
        return `drawtext=fontfile=custom_font.ttf:text='${safeText}':fontcolor=${capStyle.color}:fontsize=${capStyle.size}:${boxFilter}:x=(w-text_w)/2:y=${yPos}:enable='between(t,${cap.startSec},${cap.endSec})'`;
      }).filter(Boolean);
      
      const vfString = drawtextFilters.join(',');

      await ffmpeg.exec(['-i', 'input.mp4', '-vf', vfString, '-c:v', 'libx264', '-preset', 'ultrafast', '-c:a', 'copy', 'output.mp4']);
      
      const outputData = await ffmpeg.readFile('output.mp4');
      if (outputData.length === 0) throw new Error("Rendering failed. Text format might be complex.");

      const outputBlob = new Blob([outputData as any], { type: 'video/mp4' });
      setOutputUrl(URL.createObjectURL(outputBlob));
      setAppState('done');

    } catch (error: any) {
      alert(`Error: ${error.message}`);
      setAppState('edit');
    }
  };

  const updateCaptionText = (id: number, newText: string) => {
    setCaptions(caps => caps.map(c => c.id === id ? { ...c, text: newText } : c));
  };

  const getRGBA = (color: string, opacity: string) => {
    const map: Record<string, string> = { 'black': `rgba(0,0,0,${opacity})`, 'white': `rgba(255,255,255,${opacity})`, 'blue': `rgba(0,0,255,${opacity})`, 'red': `rgba(255,0,0,${opacity})`, 'green': `rgba(0,128,0,${opacity})`, 'transparent': 'transparent' };
    return map[color] || color;
  };

  // 🔥 Determine flex position for Live Preview Overlay
  const getPreviewAlign = () => {
    if (capStyle.position === 'top') return 'justify-start pt-[15%]';
    if (capStyle.position === 'middle') return 'justify-center';
    return 'justify-end pb-[15%]'; // bottom
  };

  const activeCaption = captions.find(c => currentTime >= c.startSec && currentTime <= c.endSec);

  return (
    <div className="w-full  bg-[#050505] text-white font-sans selection:bg-cyan-500/30 pb-20">
      <div className="fixed inset-0 z-0 pointer-events-none flex justify-center">
        <div className="absolute top-[-10%] w-[40rem] h-[40rem] bg-cyan-600/10 rounded-full blur-[120px] opacity-40" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-8 md:pt-16">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 mb-8 md:mb-12">
          <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">Home</Link>
          <span className="opacity-50">/</span>
          <Link href="/#tools" className="hover:text-white transition-colors">Tools</Link>
          <span className="opacity-50">/</span>
          <span className="text-white">AUTO CAPTIONS PRO</span>
        </nav>
    

        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-4">AUTO <span className="text-cyan-400">CAPTIONS PRO</span></h2>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-[2rem] p-6 md:p-10 shadow-2xl relative overflow-hidden">
          
          {(appState === 'upload' || appState === 'processing') && (
            <div className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center transition-all duration-300
              ${!isLoaded ? 'border-white/5 opacity-50 cursor-not-allowed' : 
                appState === 'processing' ? 'border-cyan-500/20 bg-cyan-500/5 cursor-wait' : 'border-white/10 hover:border-cyan-500/50 hover:bg-white/[0.02]'}`}
            >
              <input type="file" accept="video/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} disabled={!isLoaded || appState === 'processing'} />
              
              {appState === 'processing' ? (
                <div className="flex flex-col items-center">
                  <Loader2 size={48} className="text-cyan-500 animate-spin mb-4" />
                  <h3 className="text-xl font-black mb-2 italic uppercase">{statusText}</h3>
                  <div className="w-48 h-2 bg-black rounded-full overflow-hidden mt-4 border border-white/10">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                  </div>
                </div>
              ) : file ? (
                <div className="flex flex-col items-center w-full max-w-sm mx-auto">
                  <FileVideo size={48} className="text-cyan-400 mb-4" />
                  <h3 className="text-xl font-bold mb-4 truncate w-full text-center">{file.name}</h3>
                  
                  <div className="w-full bg-black/40 border border-white/10 rounded-xl p-4 mb-6">
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                      <Globe size={14} /> Video Spoken Language
                    </label>
                    <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} className="w-full bg-black border border-white/10 text-white text-sm rounded-lg p-3 outline-none">
                      {LANGUAGES.map((lang) => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
                    </select>
                  </div>

                  <div className="flex gap-4 w-full">
                    <button onClick={() => setFile(null)} className="flex-1 py-4 rounded-xl bg-white/5 text-gray-300 font-black uppercase tracking-widest text-xs hover:bg-white/10">Cancel</button>
                    <button onClick={handleExtractText} className="flex-1 py-4 rounded-xl bg-cyan-600 text-white font-black uppercase tracking-widest text-xs shadow-[0_4px_0_0_#0891b2] hover:bg-cyan-500 flex items-center justify-center gap-2"><Settings size={16} /> Process</button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <UploadCloud size={48} className="text-gray-600 mb-4" />
                  <h3 className="text-xl font-black mb-2 italic text-gray-300">{statusText}</h3>
                  <p className="text-sm text-gray-500 font-medium max-w-xs mx-auto">Click to upload your video</p>
                </div>
              )}
            </div>
          )}

          {appState === 'edit' && file && (
            <AnimatePresence>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* LEFT SIDE: PREVIEW & CONTROLS */}
                <div className="space-y-6">
                  
                  {/* VIDEO PREVIEW */}
                  <div className="relative w-full aspect-[9/16] md:aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl max-h-[50vh] flex justify-center">
                    <video 
                      ref={videoRef}
                      src={URL.createObjectURL(file)} 
                      className="h-full object-contain"
                      controls
                      onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                    />
                    
                    {/* DYNAMIC LIVE OVERLAY WITH POSITION */}
                    <div className={`absolute inset-0 pointer-events-none flex flex-col items-center px-4 ${getPreviewAlign()}`}>
                      {activeCaption && (
                        <div 
                          className="text-center font-black leading-tight transition-all duration-100 ease-linear"
                          style={{
                            fontSize: `${Math.max(16, capStyle.size * 0.6)}px`,
                            color: capStyle.color,
                            backgroundColor: getRGBA(capStyle.bg, capStyle.bgOpacity),
                            padding: capStyle.bg !== 'transparent' ? '4px 12px' : '0px',
                            borderRadius: '4px',
                            fontFamily: selectedLanguage === 'hi' ? 'sans-serif' : 'Arial, sans-serif'
                          }}
                        >
                          {activeCaption.text}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SETTINGS PANEL */}
                  <div className="bg-black/40 p-5 rounded-2xl border border-white/5 space-y-5">
                    
                    {/* Position Control */}
                    <div>
                      <label className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase mb-2">
                        <AlignVerticalSpaceAround size={14}/> Caption Position
                      </label>
                      <div className="flex gap-2 bg-[#111] p-1 rounded-lg border border-white/5">
                        {['top', 'middle', 'bottom'].map(pos => (
                          <button 
                            key={pos} 
                            onClick={() => setCapStyle({...capStyle, position: pos})}
                            className={`flex-1 py-2 text-xs font-bold uppercase rounded-md transition-colors ${capStyle.position === pos ? 'bg-cyan-600 text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                          >
                            {pos}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Font Size */}
                      <div>
                        <label className="text-[10px] text-gray-400 font-bold uppercase mb-2 block">Size: {capStyle.size}px</label>
                        <input type="range" min="16" max="72" value={capStyle.size} onChange={(e) => setCapStyle({...capStyle, size: parseInt(e.target.value)})} className="w-full accent-cyan-500" />
                      </div>
                      {/* Background Opacity */}
                      <div>
                        <label className="text-[10px] text-gray-400 font-bold uppercase mb-2 block">BG Opacity</label>
                        <input type="range" min="0.1" max="1.0" step="0.1" value={parseFloat(capStyle.bgOpacity)} disabled={capStyle.bg === 'transparent'} onChange={(e) => setCapStyle({...capStyle, bgOpacity: e.target.value})} className="w-full accent-cyan-500 disabled:opacity-30" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Text Color */}
                      <div>
                        <label className="text-[10px] text-gray-400 font-bold uppercase mb-2 block">Text Color</label>
                        <div className="flex gap-2 flex-wrap">
                          {TEXT_COLORS.map(c => <button key={c} onClick={() => setCapStyle({...capStyle, color: c})} className={`w-6 h-6 rounded-full border ${capStyle.color === c ? 'border-cyan-500 scale-125' : 'border-white/20'}`} style={{ backgroundColor: c }} />)}
                        </div>
                      </div>
                      {/* BG Color */}
                      <div>
                        <label className="text-[10px] text-gray-400 font-bold uppercase mb-2 block">Bg Color</label>
                        <div className="flex gap-2 flex-wrap">
                          {BG_COLORS.map(c => <button key={c} onClick={() => setCapStyle({...capStyle, bg: c})} className={`w-6 h-6 rounded-full border ${capStyle.bg === c ? 'border-cyan-500 scale-125' : 'border-white/20'} ${c === 'transparent' ? 'bg-gradient-to-br from-gray-700 to-gray-900' : ''}`} style={{ backgroundColor: c !== 'transparent' ? c : undefined }} />)}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* RIGHT SIDE: TEXT EDITOR & EXPORT */}
                <div className="flex flex-col h-full">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-cyan-400 uppercase tracking-widest mb-4">
                    <Edit3 size={16} /> Edit Text
                  </h3>
                  
                  <div className="flex-1 bg-black/40 border border-white/5 rounded-2xl p-2 overflow-y-auto max-h-[55vh] space-y-2 custom-scrollbar mb-6">
                    {captions.map(cap => {
                      const isActive = currentTime >= cap.startSec && currentTime <= cap.endSec;
                      return (
                        <div key={cap.id} className={`p-3 rounded-xl border transition-all ${isActive ? 'bg-cyan-500/10 border-cyan-500' : 'bg-[#111] border-white/5 hover:border-white/10'}`}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] text-cyan-500 font-mono font-bold">{cap.time}</span>
                            <button onClick={() => { if(videoRef.current) videoRef.current.currentTime = cap.startSec; }} className="text-gray-500 hover:text-cyan-400"><PlayCircle size={14}/></button>
                          </div>
                          <textarea 
                            value={cap.text}
                            onChange={(e) => updateCaptionText(cap.id, e.target.value)}
                            className="w-full bg-transparent text-white font-medium focus:outline-none resize-none overflow-hidden"
                            rows={cap.text.split('\n').length || 1}
                            style={{ fontFamily: selectedLanguage === 'hi' ? 'sans-serif' : 'inherit' }}
                          />
                        </div>
                      );
                    })}
                  </div>

                  <button onClick={handleBurnVideo} className="w-full py-5 rounded-xl bg-cyan-600 text-white font-black uppercase tracking-widest text-sm shadow-[0_6px_0_0_#0891b2] active:translate-y-1 active:shadow-none transition-all hover:bg-cyan-500 flex items-center justify-center gap-2 mt-auto">
                    <Subtitles size={20} /> Burn Final Video
                  </button>
                </div>

              </motion.div>
            </AnimatePresence>
          )}

          {appState === 'burning' && (
            <div className="flex flex-col items-center py-10">
              <Loader2 size={48} className="text-cyan-500 animate-spin mb-4" />
              <h3 className="text-xl font-black mb-2 italic uppercase">{statusText}</h3>
              <div className="w-48 h-2 bg-black rounded-full overflow-hidden mt-4 border border-white/10">
                <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-gradient-to-r from-cyan-500 to-blue-500" />
              </div>
            </div>
          )}

          {appState === 'done' && outputUrl && (
            <AnimatePresence>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 shrink-0">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <h4 className="font-black italic text-lg text-cyan-100 uppercase">Pro Captions Added!</h4>
                      <p className="text-xs text-cyan-500/80 font-bold uppercase tracking-widest">Your video is ready</p>
                    </div>
                  </div>
                  <div className="flex gap-4 w-full sm:w-auto">
                     <button onClick={() => { setAppState('upload'); setFile(null); setOutputUrl(null); }} className="px-4 py-3 text-xs font-bold text-gray-500 hover:text-white uppercase tracking-widest transition-colors">
                      Start Over
                    </button>
                    <a href={outputUrl} download={`captions_pro_${file?.name || 'video.mp4'}`} className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-500 text-black font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-cyan-400 transition-colors">
                      <Download size={16} /> Download Video
                    </a>
                  </div>
                </div>
                
                <div className="mt-6 rounded-xl overflow-hidden border border-white/10 bg-black aspect-video max-h-96 w-full flex justify-center">
                  <video src={outputUrl} controls className="h-full object-contain" />
                </div>
              </motion.div>
            </AnimatePresence>
          )}

        </div>

</div>
    </div>
  );
}