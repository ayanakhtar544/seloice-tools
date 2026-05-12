// File: src/app/tools/qr-generator/page.tsx
"use client";

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, QrCode, Download, Link as LinkIcon, Palette, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { QRCodeCanvas } from 'qrcode.react';

export default function QRGenerator() {
  const [url, setUrl] = useState('https://ansaribhaiya.com');
  const [fgColor, setFgColor] = useState('#ffffff');
  const [bgColor, setBgColor] = useState('#000000');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isDownloaded, setIsDownloaded] = useState(false);
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoUrl(URL.createObjectURL(file));
  };

  const handleDownload = () => {
    if (!qrRef.current) return;
    const canvas = qrRef.current.querySelector('canvas');
    if (!canvas) return;

    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `branded_qr_${Date.now()}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    setIsDownloaded(true);
    setTimeout(() => setIsDownloaded(false), 2000);
  };

  return (
    <div className="w-full  bg-[#050505] text-white selection:bg-yellow-500/30 p-6 flex flex-col items-center relative overflow-hidden">
      
      {/* Background Glowing Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-yellow-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-amber-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-6xl pt-4 z-10">
        
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors mb-8 group w-fit">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Tools</span>
        </Link>

        {/* Hero Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-2xl mb-6 shadow-[0_0_30px_rgba(234,179,8,0.15)]">
            <QrCode size={36} className="text-yellow-400" />
          </div>
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
            Branded <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">QR Creator</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Generate custom, high-resolution QR codes for your links. Add your own brand colors and center logo instantly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 bg-[#111]/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl flex flex-col gap-6"
          >
            {/* Link Input */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                <LinkIcon size={16} /> Destination URL
              </label>
              <input 
                type="text" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-black/50 border border-white/10 focus:border-yellow-500/50 rounded-xl px-4 py-3 text-white outline-none transition-colors"
                placeholder="https://your-link.com"
              />
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                  <Palette size={16} /> QR Color
                </label>
                <div className="flex items-center gap-3 bg-black/50 border border-white/10 rounded-xl p-2">
                  <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent" />
                  <span className="text-sm font-mono uppercase">{fgColor}</span>
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                  <Palette size={16} /> Background
                </label>
                <div className="flex items-center gap-3 bg-black/50 border border-white/10 rounded-xl p-2">
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent" />
                  <span className="text-sm font-mono uppercase">{bgColor}</span>
                </div>
              </div>
            </div>

            {/* Logo Upload */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                <ImageIcon size={16} /> Center Logo (Optional)
              </label>
              <div 
                onClick={() => logoInputRef.current?.click()}
                className="border-2 border-dashed border-white/20 hover:border-yellow-500/50 bg-black/50 p-4 rounded-xl flex items-center justify-center cursor-pointer transition-all group"
              >
                <input type="file" ref={logoInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
                {logoUrl ? (
                  <span className="font-bold text-yellow-400">Logo Selected (Click to change)</span>
                ) : (
                  <span className="text-gray-400 group-hover:text-white transition-colors">Click to upload brand logo</span>
                )}
              </div>
              {logoUrl && (
                <button onClick={() => setLogoUrl(null)} className="text-xs text-red-400 mt-2 hover:underline">Remove Logo</button>
              )}
            </div>

          </motion.div>

          {/* Preview Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 bg-[#111]/50 backdrop-blur-md border border-white/5 p-6 rounded-3xl shadow-2xl flex flex-col items-center justify-center min-h-[400px]"
          >
            <div 
              className="p-4 rounded-2xl shadow-[0_0_50px_rgba(234,179,8,0.1)] transition-all duration-300 mb-8"
              style={{ backgroundColor: bgColor }}
            >
              <div ref={qrRef} className="bg-white p-2 rounded-xl flex items-center justify-center">
                <QRCodeCanvas 
                  value={url || 'https://ansaribhaiya.com'} 
                  size={250} 
                  fgColor={fgColor}
                  bgColor={bgColor}
                  level="H" // High error correction level for logo rendering
                  imageSettings={logoUrl ? {
                    src: logoUrl,
                    x: undefined,
                    y: undefined,
                    height: 50,
                    width: 50,
                    excavate: true, // Digs a hole in the QR for the logo
                  } : undefined}
                />
              </div>
            </div>

            <button 
              onClick={handleDownload}
              className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black w-full max-w-[300px] py-4 rounded-xl font-extrabold transition-all flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20"
            >
              {isDownloaded ? <><CheckCircle2 size={20} /> Downloaded!</> : <><Download size={20} /> Download HD QR Code</>}
            </button>

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