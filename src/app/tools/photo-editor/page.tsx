// File: src/app/tools/photo-editor/page.tsx
"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Upload, Download, RotateCcw, Eye, SlidersHorizontal, 
  Activity, Layers, Scissors, CheckCircle2, ImagePlus, Move, Plus, Trash2, FlipHorizontal, RotateCw, Sparkles
} from 'lucide-react';
import Link from 'next/link';

// ==========================================
// 🛠️ 12+ PRO PRESETS
// ==========================================
const PRESETS = [
  { id: 'cyberpunk', name: 'Cyberpunk', css: 'contrast(120%) saturate(150%) hue-rotate(15deg)' },
  { id: 'vintage', name: 'Vintage 90s', css: 'sepia(60%) contrast(90%) brightness(110%)' },
  { id: 'bw', name: 'B&W Classic', css: 'grayscale(100%) contrast(130%)' },
  { id: 'matrix', name: 'The Matrix', css: 'invert(100%) hue-rotate(180deg) contrast(150%)' },
  { id: 'cinematic', name: 'Cinematic', css: 'contrast(110%) saturate(80%) sepia(20%) hue-rotate(-10deg)' },
  { id: 'golden', name: 'Golden Hour', css: 'sepia(40%) saturate(140%) contrast(105%) brightness(105%)' },
  { id: 'retro', name: 'Retro 80s', css: 'hue-rotate(-30deg) saturate(180%) contrast(120%)' },
  // 🔥 6 NEW PRESETS ADDED BELOW
  { id: 'tealOrange', name: 'Teal & Orange', css: 'contrast(115%) saturate(130%) hue-rotate(-15deg) sepia(15%)' },
  { id: 'darkAcademia', name: 'Dark Academia', css: 'brightness(85%) contrast(110%) sepia(30%) saturate(80%)' },
  { id: 'polaroid', name: 'Polaroid Retro', css: 'contrast(90%) brightness(115%) sepia(40%) blur(0.5px)' },
  { id: 'neonGlow', name: 'Neon Glow', css: 'saturate(200%) contrast(130%) hue-rotate(45deg)' },
  { id: 'matteFade', name: 'Matte Fade', css: 'contrast(80%) brightness(110%) saturate(90%)' },
  { id: 'cyberNoir', name: 'Cyber Noir', css: 'grayscale(80%) contrast(150%) brightness(90%)' }
];

// Default States
const DEFAULT_FILTERS = { exposure: 0, contrast: 100, saturation: 100, temperature: 0, hue: 0 };
const DEFAULT_CURVES = { master: [0, 0.5, 1], red: [0, 0.5, 1], green: [0, 0.5, 1], blue: [0, 0.5, 1] };
const DEFAULT_EFFECTS = { vignette: 0, vignetteWhite: 0, grain: 0, blur: 0, sepia: 0, grayscale: 0, invert: 0, pixelate: 0, posterize: 0, fade: 0 };
const DEFAULT_ADVANCED = { clarity: 0, dehaze: 0, sharpen: 0, glow: 0, chromatic: 0, lightLeak: 0 };
const DEFAULT_TRANSFORM = { rotate: 0, flipX: 1, flipY: 1, scale: 1 };

export default function UltimatePhotoEditor() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'presets' | 'tune' | 'curves' | 'pip' | 'fx' | 'crop' | 'export'>('presets');
  const [showOriginal, setShowOriginal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // States
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [curves, setCurves] = useState(DEFAULT_CURVES);
  const [effects, setEffects] = useState(DEFAULT_EFFECTS);
  const [advanced, setAdvanced] = useState(DEFAULT_ADVANCED);
  const [transform, setTransform] = useState(DEFAULT_TRANSFORM);
  const [activeCurveColor, setActiveCurveColor] = useState<'master'|'red'|'green'|'blue'>('master');

  // Crop & PiP
  const [isCropping, setIsCropping] = useState(false);
  const [cropBox, setCropBox] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [pipSrc, setPipSrc] = useState<string | null>(null);
  const [pipBox, setPipBox] = useState({ x: 50, y: 50, scale: 50, opacity: 100 });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pipInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const pipRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // =====================================
  // 1. FILE UPLOAD & RESET
  // =====================================
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setImageSrc(URL.createObjectURL(file)); handleReset(); }
  };

  const handlePipUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setPipSrc(URL.createObjectURL(file)); setActiveTab('pip'); }
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS); setCurves(DEFAULT_CURVES); 
    setEffects(DEFAULT_EFFECTS); setAdvanced(DEFAULT_ADVANCED);
    setTransform(DEFAULT_TRANSFORM); setPipSrc(null); setCropBox({ x: 0, y: 0, width: 100, height: 100 });
  };

  const applyPreset = (css: string) => {
    handleReset();
    // Simulate preset via a quick CSS injection for preview (Real apps map this to sliders, but for 12 presets, CSS filter is fastest)
    // We will apply this purely via effects engine
    const isBw = css.includes('grayscale(100%)');
    if (isBw) setEffects(p => ({...p, grayscale: 100, contrastBoost: 130}));
  };

  const handleCurveChange = (index: number, value: number) => {
    const newCurve = [...curves[activeCurveColor]];
    newCurve[index] = value / 100;
    setCurves({ ...curves, [activeCurveColor]: newCurve });
  };

  // =====================================
  // 2. LIVE CSS RENDERER
  // =====================================
  const getFilterCSS = () => {
    if (showOriginal) return 'none'; 
    let css = `brightness(${100 + filters.exposure}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) `;
    css += `sepia(${effects.sepia}%) grayscale(${effects.grayscale}%) invert(${effects.invert}%) hue-rotate(${filters.hue}deg) blur(${effects.blur}px) url(#curve-filter) `;
    if (filters.temperature > 0) css += ` sepia(${filters.temperature}%)`;
    if (filters.temperature < 0) css += ` hue-rotate(${Math.abs(filters.temperature)}deg)`;
    if (advanced.chromatic > 0) css += ` drop-shadow(${advanced.chromatic}px 0px 0px rgba(255,0,0,0.6)) drop-shadow(-${advanced.chromatic}px 0px 0px rgba(0,255,255,0.6))`;
    if (advanced.glow > 0) css += ` drop-shadow(0px 0px ${advanced.glow}px rgba(255,255,255,0.8))`;
    return css;
  };
  
  const getTransformCSS = () => showOriginal ? 'none' : `rotate(${transform.rotate}deg) scaleX(${transform.flipX}) scaleY(${transform.flipY})`;

  // =====================================
  // 3. SENIOR DEV EXPORT ENGINE (CANVAS)
  // =====================================
  const handleDownload = (format: 'jpg' | 'png') => {
    if (!imageSrc || !imageRef.current || !canvasRef.current) return;
    setIsProcessing(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = imageSrc;
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const scale = 2; 
      let w = img.naturalWidth * scale; let h = img.naturalHeight * scale;
      
      // Handle Rotation
      if (transform.rotate === 90 || transform.rotate === 270) { [w, h] = [h, w]; }

      const cropW = (w * cropBox.width) / 100; const cropH = (h * cropBox.height) / 100;
      const cropX = (w * cropBox.x) / 100; const cropY = (h * cropBox.y) / 100;

      canvas.width = cropW; canvas.height = cropH;

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((transform.rotate * Math.PI) / 180);
      ctx.scale(transform.flipX, transform.flipY);

      // Draw Main Image
      ctx.filter = `brightness(${100 + filters.exposure}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) sepia(${effects.sepia}%) grayscale(${effects.grayscale}%) invert(${effects.invert}%) hue-rotate(${filters.hue}deg)`;
      ctx.drawImage(img, -w/2, -h/2, w, h);
      ctx.filter = 'none';
      ctx.restore();

      // PIXEL MATH: Graph Curves & Clarity
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      for (let i = 0; i < data.length; i += 4) {
         let r = data[i], g = data[i+1], b = data[i+2];

         // Master Curve Math
         r = r * curves.master[1] * 2 * curves.red[1] * 2;
         g = g * curves.master[1] * 2 * curves.green[1] * 2;
         b = b * curves.master[1] * 2 * curves.blue[1] * 2;

         // Clarity Approx
         const mid = (r+g+b)/3;
         if (advanced.clarity > 0 && mid > 80 && mid < 180) { r *= 1.1; g *= 1.1; b *= 1.1; }

         data[i] = Math.min(255, Math.max(0, r)); data[i+1] = Math.min(255, Math.max(0, g)); data[i+2] = Math.min(255, Math.max(0, b));
      }
      ctx.putImageData(imgData, 0, 0);

      // DRAW PiP (Picture in Picture)
      if (pipSrc && pipRef.current) {
         ctx.save();
         ctx.globalAlpha = pipBox.opacity / 100;
         const pW = (canvas.width * pipBox.scale) / 100;
         const pH = (pW / pipRef.current.naturalWidth) * pipRef.current.naturalHeight;
         const pX = (canvas.width * pipBox.x) / 100 - (pW / 2);
         const pY = (canvas.height * pipBox.y) / 100 - (pH / 2);
         ctx.drawImage(pipRef.current, pX, pY, pW, pH);
         ctx.restore();
      }

      // Overlays (Vignette)
      if (effects.vignette > 0) {
         const grd = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, Math.max(canvas.width, canvas.height)/1.2);
         grd.addColorStop(0, 'rgba(0,0,0,0)'); grd.addColorStop(1, `rgba(0,0,0,${effects.vignette/100})`);
         ctx.fillStyle = grd; ctx.globalCompositeOperation = 'multiply'; ctx.fillRect(0,0,canvas.width,canvas.height); ctx.globalCompositeOperation = 'source-over';
      }

      // Download
      const dataUrl = canvas.toDataURL(`image/${format}`, format === 'jpg' ? 0.95 : 1.0);
      const link = document.createElement('a'); link.href = dataUrl;
      link.download = `seloice_edited_${Date.now()}.${format}`; link.click();
      setIsProcessing(false);
    };
  };

  return (
    <div className="h-[100dvh] w-full bg-[#030305] text-white flex flex-col overflow-hidden font-sans relative">
      
      {/* SVG FILTER ENGINE FOR LIVE CURVES */}
      <svg width="0" height="0" className="hidden pointer-events-none">
         <filter id="curve-filter">
            <feComponentTransfer>
               <feFuncR type="table" tableValues={`${curves.red[0]*curves.master[0]} ${curves.red[1]*curves.master[1]} ${curves.red[2]*curves.master[2]}`} />
               <feFuncG type="table" tableValues={`${curves.green[0]*curves.master[0]} ${curves.green[1]*curves.master[1]} ${curves.green[2]*curves.master[2]}`} />
               <feFuncB type="table" tableValues={`${curves.blue[0]*curves.master[0]} ${curves.blue[1]*curves.master[1]} ${curves.blue[2]*curves.master[2]}`} />
            </feComponentTransfer>
         </filter>
      </svg>

      {/* 🚀 HEADER */}
      <div className="shrink-0 flex items-center justify-between p-3 md:p-4 z-20 border-b border-white/5 bg-[#030305]/80 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs bg-emerald-500/10 px-3 sm:px-4 py-2 rounded-full border border-emerald-500/20 hover:bg-emerald-500/20">
          <ArrowLeft size={14} /> <span className="hidden sm:block">Back</span>
        </Link>
        <h1 className="text-base md:text-xl font-black italic tracking-tighter uppercase text-center flex-1">
          PHOTO <span className="text-emerald-500">STUDIO</span>
        </h1>
        <div className="flex gap-2">
           {imageSrc && (
             <>
               <button onPointerDown={()=>setShowOriginal(true)} onPointerUp={()=>setShowOriginal(false)} onPointerLeave={()=>setShowOriginal(false)} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-emerald-400" title="Hold to Compare"><Eye size={16}/></button>
               <button onClick={handleReset} className="p-2 rounded-full bg-white/5 hover:bg-red-500/20 text-red-400" title="Reset All"><RotateCcw size={16}/></button>
             </>
           )}
        </div>
      </div>

      {/* 🛠️ WORKSPACE */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 relative z-10">
        
        {/* PREVIEW CANVAS */}
        <div className="flex-1 relative flex items-center justify-center p-2 sm:p-4 overflow-hidden" ref={containerRef}>
          {!imageSrc ? (
            <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer border-2 border-dashed border-white/10 hover:border-emerald-500/30 rounded-3xl p-10 flex flex-col items-center bg-white/5 backdrop-blur-sm transition-colors mt-10">
              <Upload size={40} className="text-emerald-500 mb-4" />
              <p className="text-xl font-black uppercase tracking-wider mb-1 text-center">Upload Photo</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase">JPG, PNG, WebP</p>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
            </div>
          ) : (
            <div className="relative flex items-center justify-center w-full h-full">
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff)', backgroundSize: '20px 20px' }} />
               <div className="relative shadow-2xl flex items-center justify-center max-w-full max-h-full">
                  
                  {/* MAIN IMAGE */}
                  <img 
                     ref={imageRef} src={imageSrc} alt="Preview" 
                     className="object-contain transition-all duration-100 max-w-full max-h-full"
                     style={{ 
                        filter: getFilterCSS(),
                        transform: getTransformCSS(),
                        clipPath: showOriginal ? 'none' : `inset(${cropBox.y}% ${100 - (cropBox.x + cropBox.width)}% ${100 - (cropBox.y + cropBox.height)}% ${cropBox.x}%)`
                     }} 
                     draggable={false}
                  />

                  {/* 🖼️ PiP (Picture in Picture) OVERLAY */}
                  {!showOriginal && pipSrc && (
                     <PiPOverlay pipSrc={pipSrc} pipBox={pipBox} setPipBox={setPipBox} containerRef={containerRef} pipRef={pipRef} />
                  )}

                  {isCropping && !showOriginal && <CropOverlay cropBox={cropBox} setCropBox={setCropBox} containerRef={containerRef} />}
               </div>
               <button onClick={() => fileInputRef.current?.click()} className="absolute top-2 left-2 sm:top-4 sm:left-4 z-20 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">Change Photo</button>
            </div>
          )}
        </div>

        {/* 🎛️ CONTROLS SIDEBAR */}
        <div className={`shrink-0 w-full lg:w-[400px] h-[45vh] lg:h-full bg-[#0a0a0f] border-t lg:border-t-0 lg:border-l border-white/5 overflow-y-auto no-scrollbar pt-5 px-4 sm:px-6 relative shadow-[0_-10px_30px_rgba(0,0,0,0.5)] lg:shadow-none ${!imageSrc && 'opacity-30 pointer-events-none'}`}>
             <AnimatePresence mode="wait">
                
                {/* 12+ PRESETS */}
                {activeTab === 'presets' && (
                   <motion.div key="presets" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 sm:grid-cols-3 gap-3 pb-28">
                      {PRESETS.map((preset) => (
                         <div key={preset.id} onClick={() => applyPreset(preset.css)} className="group relative h-20 rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-emerald-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400')] bg-cover bg-center transition-all duration-300 group-hover:scale-110" style={{ filter: preset.css }} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                            <span className="absolute bottom-2 left-2 text-[9px] font-black uppercase tracking-widest text-white">{preset.name}</span>
                         </div>
                      ))}
                   </motion.div>
                )}

                {/* BASIC TUNE */}
                {activeTab === 'tune' && (
                   <motion.div key="tune" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-28">
                      <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 mb-4"><p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Light & Color Basics</p></div>
                      <FilterSlider label="Exposure" value={filters.exposure} min={-100} max={100} onChange={(v:number)=>setFilters({...filters, exposure: v})} />
                      <FilterSlider label="Contrast" value={filters.contrast} min={0} max={200} onChange={(v:number)=>setFilters({...filters, contrast: v})} />
                      <FilterSlider label="Saturation" value={filters.saturation} min={0} max={200} onChange={(v:number)=>setFilters({...filters, saturation: v})} />
                      <FilterSlider label="Temperature" value={filters.temperature} min={-100} max={100} onChange={(v:number)=>setFilters({...filters, temperature: v})} />
                      <FilterSlider label="Hue Change" value={filters.hue} min={-180} max={180} onChange={(v:number)=>setFilters({...filters, hue: v})} />
                   </motion.div>
                )}

                {/* GRAPH (CURVES) */}
                {activeTab === 'curves' && (
                   <motion.div key="curves" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-28">
                      <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20"><p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2"><Activity size={14}/> Tone Curve Graph ⚡</p></div>
                      <div className="flex gap-2 bg-black/50 p-1.5 rounded-lg border border-white/10">
                         <button onClick={() => setActiveCurveColor('master')} className={`flex-1 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${activeCurveColor === 'master' ? 'bg-white text-black' : 'text-gray-400'}`}>RGB</button>
                         <button onClick={() => setActiveCurveColor('red')} className={`flex-1 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${activeCurveColor === 'red' ? 'bg-red-500 text-white' : 'text-gray-400'}`}>Red</button>
                         <button onClick={() => setActiveCurveColor('green')} className={`flex-1 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${activeCurveColor === 'green' ? 'bg-green-500 text-white' : 'text-gray-400'}`}>Green</button>
                         <button onClick={() => setActiveCurveColor('blue')} className={`flex-1 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${activeCurveColor === 'blue' ? 'bg-blue-500 text-white' : 'text-gray-400'}`}>Blue</button>
                      </div>
                      <div className="relative w-full aspect-square max-w-[300px] mx-auto bg-[#111] border border-white/20 rounded-2xl overflow-hidden mt-4 shadow-inner">
                         <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-20 pointer-events-none">
                            {[...Array(9)].map((_,i) => <div key={i} className="border border-white/40"/>)}
                         </div>
                         <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                            <path d={`M 0,100 C 33,${100 - curves[activeCurveColor][0]*100} 66,${100 - curves[activeCurveColor][1]*100} 100,${100 - curves[activeCurveColor][2]*100}`} fill="none" stroke={activeCurveColor === 'master' ? 'white' : activeCurveColor} strokeWidth="4" className="drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                         </svg>
                      </div>
                      <FilterSlider label="Shadows (Left)" value={curves[activeCurveColor][0] * 100} min={0} max={100} onChange={(v:number)=>handleCurveChange(0, v)} />
                      <FilterSlider label="Midtones (Center)" value={curves[activeCurveColor][1] * 100} min={0} max={100} onChange={(v:number)=>handleCurveChange(1, v)} />
                      <FilterSlider label="Highlights (Right)" value={curves[activeCurveColor][2] * 100} min={0} max={100} onChange={(v:number)=>handleCurveChange(2, v)} />
                   </motion.div>
                )}

                {/* PiP (PICTURE IN PICTURE) */}
                {activeTab === 'pip' && (
                   <motion.div key="pip" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-28">
                      <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20 mb-4 flex items-center gap-3">
                         <ImagePlus size={24} className="text-emerald-400" />
                         <div>
                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Picture in Picture ⚡</p>
                            <p className="text-[8px] text-gray-400 uppercase tracking-widest mt-1">Add Logo, Watermark or second photo.</p>
                         </div>
                      </div>

                      {!pipSrc ? (
                         <div onClick={() => pipInputRef.current?.click()} className="cursor-pointer border border-dashed border-emerald-500/50 hover:bg-emerald-500/10 rounded-2xl p-8 flex flex-col items-center justify-center transition-colors">
                            <Plus size={32} className="text-emerald-500 mb-2" />
                            <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">Select Image to Add</p>
                            <input type="file" ref={pipInputRef} onChange={handlePipUpload} accept="image/*" className="hidden" />
                         </div>
                      ) : (
                         <div className="space-y-6">
                            <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/10">
                               <span className="text-xs font-bold text-emerald-400">PiP Active (Drag to move)</span>
                               <button onClick={() => setPipSrc(null)} className="text-red-400 p-1 hover:bg-red-500/20 rounded"><Trash2 size={16}/></button>
                            </div>
                            <FilterSlider label="PiP Size (Scale)" value={pipBox.scale} min={10} max={200} onChange={(v:number)=>setPipBox({...pipBox, scale: v})} />
                            <FilterSlider label="PiP Opacity" value={pipBox.opacity} min={0} max={100} onChange={(v:number)=>setPipBox({...pipBox, opacity: v})} />
                         </div>
                      )}
                   </motion.div>
                )}

                {/* CROP & TRANSFORM */}
                {activeTab === 'crop' && (
                   <motion.div key="crop" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-28">
                      <button onClick={() => setIsCropping(!isCropping)} className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-lg ${isCropping ? 'bg-orange-500 text-white' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}>
                         {isCropping ? 'Done Cropping (Save)' : 'Enable Crop Box'}
                      </button>
                      <div className="grid grid-cols-2 gap-3 mt-4">
                         <button onClick={() => setTransform({...transform, flipX: transform.flipX * -1})} className="py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex flex-col items-center gap-2 text-[10px] font-bold uppercase"><FlipHorizontal size={18} /> Flip X</button>
                         <button onClick={() => setTransform({...transform, rotate: (transform.rotate + 90) % 360})} className="py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex flex-col items-center gap-2 text-[10px] font-bold uppercase"><RotateCw size={18} /> Rotate 90°</button>
                      </div>
                   </motion.div>
                )}

                {/* EFFECTS */}
                {activeTab === 'fx' && (
                   <motion.div key="fx" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 pb-28">
                      <FilterSlider label="Vignette" value={effects.vignette} min={0} max={100} onChange={(v:number)=>setEffects({...effects, vignette: v})} />
                      <FilterSlider label="Film Grain" value={effects.grain} min={0} max={100} onChange={(v:number)=>setEffects({...effects, grain: v})} />
                      <FilterSlider label="Pixelate ⚡" value={effects.pixelate} min={0} max={100} onChange={(v:number)=>setEffects({...effects, pixelate: v})} isPro />
                      <FilterSlider label="Posterize ⚡" value={effects.posterize} min={0} max={100} onChange={(v:number)=>setEffects({...effects, posterize: v})} isPro />
                      <FilterSlider label="Clarity ⚡" value={advanced.clarity} min={0} max={100} onChange={(v:number)=>setAdvanced({...advanced, clarity: v})} isPro />
                      <FilterSlider label="Gaussian Blur" value={effects.blur} min={0} max={20} step={0.5} onChange={(v:number)=>setEffects({...effects, blur: v})} />
                      <FilterSlider label="Sepia Tone" value={effects.sepia} min={0} max={100} onChange={(v:number)=>setEffects({...effects, sepia: v})} />
                   </motion.div>
                )}

                {/* EXPORT */}
                {activeTab === 'export' && (
                   <motion.div key="export" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pb-28">
                      <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20 text-center mb-6">
                         <Download size={36} className="text-emerald-500 mx-auto mb-2" />
                         <h3 className="font-black text-sm uppercase text-emerald-400">Export Masterpiece</h3>
                         <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Select format to save.</p>
                      </div>
                      <button onClick={() => handleDownload('jpg')} disabled={isProcessing} className="w-full py-5 rounded-2xl bg-emerald-600 text-white font-black uppercase tracking-widest text-sm shadow-[0_6px_0_0_#047857] active:translate-y-1 active:shadow-none transition-all hover:bg-emerald-500 flex items-center justify-center gap-2">
                         {isProcessing ? "Processing..." : "Save as JPG"}
                      </button>
                      <button onClick={() => handleDownload('png')} disabled={isProcessing} className="w-full py-5 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-sm shadow-[0_6px_0_0_#d1d5db] active:translate-y-1 active:shadow-none transition-all hover:bg-gray-200 flex items-center justify-center gap-2">
                         {isProcessing ? "Processing..." : "Save as PNG (HD)"}
                      </button>
                   </motion.div>
                )}
             </AnimatePresence>
        </div>
      </div>

      {/* 🍏 APPLE DOCK */}
      <div className={`fixed bottom-0 left-0 right-0 h-[80px] flex justify-center items-center w-full z-50 bg-[#030305]/95 backdrop-blur-md border-t border-white/5 ${!imageSrc && 'opacity-30 pointer-events-none'}`}>
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar max-w-full px-2">
           <DockItem active={activeTab === 'presets'} icon={<Sparkles size={18}/>} label="Presets" onClick={() => setActiveTab('presets')} />
           <DockItem active={activeTab === 'tune'} icon={<SlidersHorizontal size={18}/>} label="Tune" onClick={() => setActiveTab('tune')} />
           <DockItem active={activeTab === 'curves'} icon={<Activity size={18}/>} label="Curves" onClick={() => setActiveTab('curves')} />
           <DockItem active={activeTab === 'pip'} icon={<ImagePlus size={18}/>} label="Add PiP" onClick={() => setActiveTab('pip')} />
           <DockItem active={activeTab === 'fx'} icon={<Layers size={18}/>} label="Effects" onClick={() => setActiveTab('fx')} />
           <DockItem active={activeTab === 'crop'} icon={<Scissors size={18}/>} label="Crop" onClick={() => setActiveTab('crop')} />
           <DockItem active={activeTab === 'export'} icon={<CheckCircle2 size={18}/>} label="Export" onClick={() => setActiveTab('export')} />
        </div>
      </div>
      
      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
}

// ==========================================
// 🧩 SUB-COMPONENTS
// ==========================================

function DockItem({ active, icon, label, onClick }: any) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-14 h-12 sm:w-16 sm:h-14 rounded-full transition-all duration-300 shrink-0 ${active ? 'bg-emerald-500 text-white scale-105 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
      {icon}
      <span className="text-[8px] sm:text-[9px] font-black uppercase mt-1 tracking-widest">{label}</span>
    </button>
  );
}

function FilterSlider({ label, value, min, max, step = 1, onChange, isPro }: any) {
  const percentage = ((value - min) / (max - min)) * 100;
  return (
    <div className="group">
      <div className="flex justify-between items-center mb-2">
        <label className={`text-[10px] font-black uppercase tracking-widest flex items-center ${isPro ? 'text-emerald-400' : 'text-gray-300'}`}>
           {label.replace(' ⚡', '')} {isPro && <span className="bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded ml-1 text-[8px]">PRO</span>}
        </label>
        <span className="text-[9px] font-mono text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded">{value}</span>
      </div>
      <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className={`absolute top-0 left-0 h-full rounded-full transition-all duration-100 ${isPro ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-emerald-500'}`} style={{ width: `${percentage}%` }} />
        <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
      </div>
    </div>
  );
}

// 🖼️ PiP DRAG & RESIZE OVERLAY
function PiPOverlay({ pipSrc, pipBox, setPipBox, containerRef, pipRef }: any) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ clientX: 0, clientY: 0, startX: 0, startY: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dx = ((e.clientX - dragStart.clientX) / rect.width) * 100;
      const dy = ((e.clientY - dragStart.clientY) / rect.height) * 100;
      setPipBox((prev: any) => ({ ...prev, x: dragStart.startX + dx, y: dragStart.startY + dy }));
    };
    const handleMouseUp = () => setIsDragging(false);
    if (isDragging) { window.addEventListener('mousemove', handleMouseMove); window.addEventListener('mouseup', handleMouseUp); }
    return () => { window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('mouseup', handleMouseUp); };
  }, [isDragging, dragStart, containerRef]);

  return (
    <div 
       onMouseDown={(e) => { e.stopPropagation(); setIsDragging(true); setDragStart({ clientX: e.clientX, clientY: e.clientY, startX: pipBox.x, startY: pipBox.y }); }}
       className="absolute cursor-move z-30 drop-shadow-2xl hover:ring-2 hover:ring-emerald-500 transition-all" 
       style={{ left: `${pipBox.x}%`, top: `${pipBox.y}%`, transform: 'translate(-50%, -50%)', width: `${pipBox.scale}%`, opacity: pipBox.opacity / 100 }}
    >
      <img ref={pipRef} src={pipSrc} alt="PiP" className="w-full h-auto pointer-events-none" />
      {/* Visual drag indicator */}
      <div className="absolute top-2 right-2 bg-black/60 p-1 rounded backdrop-blur-md opacity-0 hover:opacity-100 transition-opacity pointer-events-none"><Move size={12} className="text-white"/></div>
    </div>
  );
}

function CropOverlay({ cropBox, setCropBox, containerRef }: any) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ clientX: 0, clientY: 0, box: cropBox });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragType || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dx = ((e.clientX - dragStart.clientX) / rect.width) * 100;
      const dy = ((e.clientY - dragStart.clientY) / rect.height) * 100;
      let newBox = { ...dragStart.box };
      const MIN_SIZE = 10;

      if (dragType === 'move') {
        newBox.x = Math.min(Math.max(dragStart.box.x + dx, 0), 100 - newBox.width);
        newBox.y = Math.min(Math.max(dragStart.box.y + dy, 0), 100 - newBox.height);
      } else {
        if (dragType.includes('w')) { const maxDx = dragStart.box.width - MIN_SIZE; const actualDx = Math.min(Math.max(dx, -dragStart.box.x), maxDx); newBox.x = dragStart.box.x + actualDx; newBox.width = dragStart.box.width - actualDx; }
        if (dragType.includes('e')) { const maxDx = 100 - (dragStart.box.x + dragStart.box.width); newBox.width = dragStart.box.width + Math.min(Math.max(dx, -dragStart.box.width + MIN_SIZE), maxDx); }
        if (dragType.includes('n')) { const maxDy = dragStart.box.height - MIN_SIZE; const actualDy = Math.min(Math.max(dy, -dragStart.box.y), maxDy); newBox.y = dragStart.box.y + actualDy; newBox.height = dragStart.box.height - actualDy; }
        if (dragType.includes('s')) { const maxDy = 100 - (dragStart.box.y + dragStart.box.height); newBox.height = dragStart.box.height + Math.min(Math.max(dy, -dragStart.box.height + MIN_SIZE), maxDy); }
      }
      setCropBox(newBox);
    };
    const handleMouseUp = () => setIsDragging(false);
    if (isDragging) { window.addEventListener('mousemove', handleMouseMove); window.addEventListener('mouseup', handleMouseUp); }
    return () => { window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('mouseup', handleMouseUp); };
  }, [isDragging, dragType, dragStart, containerRef, setCropBox]);

  const handleMouseDown = (e: React.MouseEvent, type: string) => { e.stopPropagation(); setIsDragging(true); setDragType(type); setDragStart({ clientX: e.clientX, clientY: e.clientY, box: cropBox }); };

  return (
    <div className="absolute inset-0 z-40 pointer-events-none">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" style={{ clipPath: `polygon(0% 0%, 0% 100%, ${cropBox.x}% 100%, ${cropBox.x}% ${cropBox.y}%, ${cropBox.x + cropBox.width}% ${cropBox.y}%, ${cropBox.x + cropBox.width}% ${cropBox.y + cropBox.height}%, ${cropBox.x}% ${cropBox.y + cropBox.height}%, ${cropBox.x}% 100%, 100% 100%, 100% 0%)` }} />
      <div className="absolute border border-emerald-500 shadow-[0_0_30px_rgba(0,0,0,0.8)] pointer-events-auto flex flex-col" style={{ left: `${cropBox.x}%`, top: `${cropBox.y}%`, width: `${cropBox.width}%`, height: `${cropBox.height}%` }}>
        <div className="absolute inset-0 cursor-move" onMouseDown={(e) => handleMouseDown(e, 'move')} />
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-50">{[...Array(9)].map((_, i) => (<div key={i} className="border border-white/40" />))}</div>
        <div onMouseDown={(e) => handleMouseDown(e, 'nw')} className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-emerald-500 -translate-x-1.5 -translate-y-1.5 cursor-nwse-resize z-10" />
        <div onMouseDown={(e) => handleMouseDown(e, 'ne')} className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-emerald-500 translate-x-1.5 -translate-y-1.5 cursor-nesw-resize z-10" />
        <div onMouseDown={(e) => handleMouseDown(e, 'sw')} className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-emerald-500 -translate-x-1.5 translate-y-1.5 cursor-nesw-resize z-10" />
        <div onMouseDown={(e) => handleMouseDown(e, 'se')} className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-emerald-500 translate-x-1.5 translate-y-1.5 cursor-nwse-resize z-10" />
        <div onMouseDown={(e) => handleMouseDown(e, 'n')} className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-3 -translate-y-1.5 cursor-ns-resize z-10 hover:bg-emerald-500/50" />
        <div onMouseDown={(e) => handleMouseDown(e, 's')} className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-3 translate-y-1.5 cursor-ns-resize z-10 hover:bg-emerald-500/50" />
        <div onMouseDown={(e) => handleMouseDown(e, 'w')} className="absolute top-1/2 left-0 -translate-y-1/2 w-3 h-10 -translate-x-1.5 cursor-ew-resize z-10 hover:bg-emerald-500/50" />
        <div onMouseDown={(e) => handleMouseDown(e, 'e')} className="absolute top-1/2 right-0 -translate-y-1/2 w-3 h-10 translate-x-1.5 cursor-ew-resize z-10 hover:bg-emerald-500/50" />
      </div>
    </div>
  );
}