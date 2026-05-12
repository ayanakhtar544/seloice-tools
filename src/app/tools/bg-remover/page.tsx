// File: src/app/tools/bg-remover/page.tsx
"use client";

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Eraser, Upload, Download, Sparkles, Image as ImageIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';


export default function BackgroundRemover() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressText, setProgressText] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setOriginalFile(file);
    setOriginalUrl(URL.createObjectURL(file));
    setProcessedUrl(null); // Nayi file aate hi purana result hata do
  };

  const handleRemoveBackground = async () => {
    if (!originalFile) return;
    
    setIsProcessing(true);
    setProgressText('Loading AI Model... (First time takes 5-10 seconds)');
    
    try {
      // PRO FIX: Dynamic Import (Ye error ko jad se khatam kar dega)
      const imglyModule = await import('@imgly/background-removal');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const removeBg = (imglyModule as any).default ?? (imglyModule as any).removeBackground;

      // Magic happens here!
      const imageBlob = await removeBg(originalFile, {
        progress: (key: string, current: number, total: number) => {
          if (key.includes('fetch')) {
             setProgressText(`Downloading AI Magic... ${Math.round((current / total) * 100)}%`);
          } else {
             setProgressText('Erasing Background... Almost there! 🚀');
          }
        }
      });
      
      const url = URL.createObjectURL(imageBlob);
      setProcessedUrl(url);
      
    } catch (error) {
      console.error("AI Error:", error);
      alert("Bhai, kuch gadbad ho gayi AI model load hone mein.");
    } finally {
      setIsProcessing(false);
      setProgressText('');
    }
  };
  const handleDownload = () => {
    if (!processedUrl) return;
    const link = document.createElement('a');
    link.href = processedUrl;
    link.download = `no_bg_${Date.now()}.png`; // Hamesha PNG format mein download hoga taaki transparency rahe
    link.click();
  };

  return (
    <div className="w-full  bg-[#050505] text-white selection:bg-emerald-500/30 p-6 flex flex-col items-center relative overflow-hidden">
      
      {/* Background Glowing Orbs */}
      <div className="absolute top-[-5%] left-[-5%] w-[40rem] h-[40rem] bg-emerald-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[40rem] h-[40rem] bg-teal-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-6xl pt-4 z-10">
        
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition-colors mb-8 group w-fit">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Tools</span>
        </Link>

        {/* Hero Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl mb-6 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <Eraser size={36} className="text-emerald-400" />
          </div>
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
            Magic <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">BG Remover</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Remove backgrounds from any image instantly in your browser. 100% Free, Private, and Powered by AI.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Panel (Left) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 bg-[#111]/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl flex flex-col gap-6"
          >
            {/* Upload Box */}
            <div 
              onClick={() => !isProcessing && fileInputRef.current?.click()}
              className={`border-2 border-dashed ${isProcessing ? 'border-white/5 opacity-50 cursor-not-allowed' : 'border-white/20 hover:border-emerald-500/50 cursor-pointer'} bg-black/50 p-8 rounded-2xl flex flex-col items-center justify-center transition-all group`}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" disabled={isProcessing} />
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                <Upload size={28} />
              </div>
              <span className="font-bold text-lg text-gray-200 mb-1">{originalUrl ? 'Change Image' : 'Upload Image'}</span>
              <span className="text-sm text-gray-500">Supports JPG, PNG, WEBP</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleRemoveBackground}
                disabled={!originalUrl || isProcessing || !!processedUrl}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white disabled:opacity-50 disabled:cursor-not-allowed w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                {isProcessing ? (
                  <><Loader2 className="animate-spin" size={20} /> Processing AI...</>
                ) : (
                  <><Sparkles size={20} /> Remove Background</>
                )}
              </button>
              
              {isProcessing && (
                <div className="text-center text-emerald-400 text-sm font-medium animate-pulse">
                  {progressText}
                </div>
              )}

              {processedUrl && (
                <button 
                  onClick={handleDownload}
                  className="bg-white hover:bg-gray-200 text-black w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Download size={20} /> Download Transparent PNG
                </button>
              )}
            </div>
          </motion.div>

          {/* Preview Panel (Right) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 bg-[#111]/50 backdrop-blur-md border border-white/5 p-6 rounded-3xl shadow-2xl flex flex-col items-center justify-center min-h-[500px] relative"
          >
            {!originalUrl ? (
              <div className="text-gray-600 flex flex-col items-center text-center">
                <ImageIcon size={64} className="mb-4 opacity-50" />
                <p className="text-lg font-medium text-gray-400">Live Preview</p>
                <p className="text-sm">Upload an image to see the magic</p>
              </div>
            ) : (
              <div className="w-full flex flex-col md:flex-row gap-4 items-center justify-center">
                
                {/* Original Image */}
                <div className="flex-1 w-full flex flex-col items-center">
                  <span className="text-sm text-gray-500 mb-2 font-bold uppercase tracking-wider">Original</span>
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black w-full aspect-square flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={originalUrl} alt="Original" className="w-full h-full object-contain opacity-80" />
                  </div>
                </div>

                {/* Arrow Divider */}
                <div className="hidden md:flex text-gray-600">
                  <ArrowLeft size={32} className="rotate-180" />
                </div>

                {/* Processed Image */}
                <div className="flex-1 w-full flex flex-col items-center">
                  <span className="text-sm text-emerald-400 mb-2 font-bold uppercase tracking-wider">Background Removed</span>
                  <div 
                    className="relative rounded-2xl overflow-hidden border border-emerald-500/30 w-full aspect-square flex items-center justify-center"
                    // Checkerboard background taaki transparency saaf dikhe
                    style={{
                      backgroundImage: 'repeating-linear-gradient(45deg, #1a1a1a 25%, transparent 25%, transparent 75%, #1a1a1a 75%, #1a1a1a), repeating-linear-gradient(45deg, #1a1a1a 25%, #111 25%, #111 75%, #1a1a1a 75%, #1a1a1a)',
                      backgroundPosition: '0 0, 10px 10px',
                      backgroundSize: '20px 20px'
                    }}
                  >
                    {isProcessing ? (
                      <div className="flex flex-col items-center text-emerald-500 animate-pulse">
                        <Sparkles size={40} className="mb-2" />
                        <span className="text-sm font-bold">Applying Magic...</span>
                      </div>
                    ) : processedUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={processedUrl} alt="Processed" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-sm text-gray-600">Waiting for processing...</span>
                    )}
                  </div>
                </div>

              </div>
            )}
          </motion.div>

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