// File: src/app/tools/pdf-grid-maker/PdfGridClient.tsx
'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PDFDocument } from 'pdf-lib';
import ToolInterfaceShell from '@/components/seo/ToolInterfaceShell';

export default function PdfGridClient() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<'IDLE' | 'PROCESSING' | 'DONE' | 'ERROR'>('IDLE');
  const [errorMsg, setErrorMsg] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  
  // 🔥 New Settings State
  const [gridType, setGridType] = useState<2 | 4>(4); 
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
      setStatus('IDLE');
      setDownloadUrl(null);
    }
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newFiles = [...files];
    [newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]];
    setFiles(newFiles);
  };

  const moveDown = (index: number) => {
    if (index === files.length - 1) return;
    const newFiles = [...files];
    [newFiles[index + 1], newFiles[index]] = [newFiles[index], newFiles[index + 1]];
    setFiles(newFiles);
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (newFiles.length === 0) setDownloadUrl(null);
  };

  // 🔥 THE NEW TIGHT-MATH ENGINE 🔥
  const processPdf = async () => {
    if (files.length === 0) return;
    setStatus('PROCESSING');
    setErrorMsg('');

    try {
      const newPdf = await PDFDocument.create();
      
      // A4 Standard Dimensions
      const isPortrait = orientation === 'portrait';
      const PAGE_WIDTH = isPortrait ? 595.28 : 841.89;
      const PAGE_HEIGHT = isPortrait ? 841.89 : 595.28;
      
      let allEmbeddedPages: any[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const arrayBuffer = await file.arrayBuffer();
        const tempPdf = await PDFDocument.load(arrayBuffer);
        const indices = tempPdf.getPageIndices();
        const embeddedPages = await newPdf.embedPdf(arrayBuffer, indices);
        allEmbeddedPages.push(...embeddedPages);
      }

      // Dynamic Grid Calculation
      let cols = 2;
      let rows = 2;

      if (gridType === 2) {
        if (isPortrait) {
          cols = 1; rows = 2; // Stacked vertically
        } else {
          cols = 2; rows = 1; // Side by side (Best for 2-Up notes)
        }
      }

      // 🔥 EXTREME TIGHT MARGINS (Gap kam karne ka jadoo)
      const margin = 8; // Border se kitna door
      const spacing = 8; // Panno ke beech ka gap

      const cellWidth = (PAGE_WIDTH - (margin * 2) - (spacing * (cols - 1))) / cols;
      const cellHeight = (PAGE_HEIGHT - (margin * 2) - (spacing * (rows - 1))) / rows;

      let currentPage = newPdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      let pagesAddedToCurrent = 0;

      for (let i = 0; i < allEmbeddedPages.length; i++) {
        const sourcePage = allEmbeddedPages[i];
        
        if (pagesAddedToCurrent === gridType) {
          currentPage = newPdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
          pagesAddedToCurrent = 0;
        }

        // Calculate current cell position
        const colIndex = pagesAddedToCurrent % cols;
        const rowIndex = Math.floor(pagesAddedToCurrent / cols);

        const cellX = margin + colIndex * (cellWidth + spacing);
        // PDF-lib y-axis starts from bottom, so subtract from top
        const cellY = PAGE_HEIGHT - margin - cellHeight - rowIndex * (cellHeight + spacing);

        // Scale page to perfectly fit inside the calculated cell tight-box
        const scale = Math.min(
          cellWidth / sourcePage.width,
          cellHeight / sourcePage.height
        );

        const scaledWidth = sourcePage.width * scale;
        const scaledHeight = sourcePage.height * scale;

        // Center perfectly within the tight cell
        const xOffset = cellX + (cellWidth - scaledWidth) / 2;
        const yOffset = cellY + (cellHeight - scaledHeight) / 2;

        currentPage.drawPage(sourcePage, {
          x: xOffset, 
          y: yOffset, 
          width: scaledWidth, 
          height: scaledHeight,
        });
        
        pagesAddedToCurrent++;
      }

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      setDownloadUrl(url);
      setStatus('DONE');

    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || 'Error processing PDFs');
      setStatus('ERROR');
    }
  };

  return (
    <ToolInterfaceShell className="w-full max-w-5xl">
      <div className="w-full min-h-[85vh] bg-[#030305] text-white font-sans flex flex-col relative pb-10">
        
        <div className="fixed inset-0 z-0 flex justify-center pointer-events-none">
          <div className="absolute top-[-10%] w-[40rem] h-[40rem] bg-rose-600/10 rounded-full blur-[120px] mix-blend-screen opacity-60" />
        </div>

        <div className="relative z-10 mx-auto px-4 pt-10 md:pt-16 w-full max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-4 uppercase drop-shadow-lg">
              PDF <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">GRID MAKER</span>
            </h2>
            <p className="text-zinc-400 font-medium text-sm md:text-base max-w-2xl mx-auto">
              Merge multiple PDFs and combine their pages. Tight gaps, landscape options, and 100% local processing.
            </p>
          </div>

          <div className="bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative max-w-2xl mx-auto">
            
            {/* FILE UPLOAD ZONE */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-zinc-700 hover:border-rose-500/50 bg-black/50 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors group mb-6"
            >
              <div className="w-16 h-16 bg-white/5 group-hover:bg-rose-500/10 rounded-2xl flex items-center justify-center mb-4 transition-colors">
                <IconFileUp className="text-zinc-400 group-hover:text-rose-400 w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Upload PDF Files</h3>
              <p className="text-sm text-zinc-500">Click to browse (Multiple files allowed)</p>
              <input 
                type="file" 
                accept=".pdf" 
                multiple
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
              />
            </div>

            {/* QUEUE & REORDER UI */}
            {files.length > 0 && (
              <div className="mb-6 space-y-3">
                <div className="flex justify-between items-end">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Files Order ({files.length})</label>
                  <button onClick={() => setFiles([])} className="text-[10px] text-red-400 hover:text-red-300 uppercase font-bold tracking-wider">Clear All</button>
                </div>
                <div className="space-y-2 max-h-[250px] overflow-y-auto custom-scrollbar pr-2">
                  <AnimatePresence>
                    {files.map((file, index) => (
                      <motion.div 
                        key={`${file.name}-${index}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 rounded-xl hover:bg-white/10 transition-colors"
                      >
                        <div className="flex flex-col gap-1">
                          <button onClick={() => moveUp(index)} disabled={index === 0} className="text-zinc-500 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-500 transition-colors">
                            <IconArrowUp className="w-4 h-4" />
                          </button>
                          <button onClick={() => moveDown(index)} disabled={index === files.length - 1} className="text-zinc-500 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-500 transition-colors">
                            <IconArrowDown className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-white truncate">{file.name}</h4>
                          <p className="text-xs text-zinc-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <button onClick={() => removeFile(index)} className="p-2 text-zinc-500 hover:text-red-400 bg-black/30 rounded-lg hover:bg-red-500/10 transition-colors">
                          <IconTrash className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* SETTINGS UI */}
            {files.length > 0 && status !== 'DONE' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                
                {/* Orientation Selector */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Page Orientation</label>
                  <div className="flex gap-4">
                    <div 
                      onClick={() => setOrientation('portrait')}
                      className={`flex-1 p-3 rounded-xl border cursor-pointer flex items-center justify-center gap-2 transition-all ${orientation === 'portrait' ? 'bg-rose-500/10 border-rose-500 text-rose-400' : 'bg-black/50 border-white/10 text-zinc-400 hover:bg-white/5'}`}
                    >
                      <IconPortrait className="w-5 h-5" />
                      <span className="text-sm font-bold">Portrait</span>
                    </div>
                    <div 
                      onClick={() => setOrientation('landscape')}
                      className={`flex-1 p-3 rounded-xl border cursor-pointer flex items-center justify-center gap-2 transition-all ${orientation === 'landscape' ? 'bg-rose-500/10 border-rose-500 text-rose-400' : 'bg-black/50 border-white/10 text-zinc-400 hover:bg-white/5'}`}
                    >
                      <IconLandscape className="w-5 h-5" />
                      <span className="text-sm font-bold">Landscape</span>
                    </div>
                  </div>
                </div>

                {/* Grid Type Selector */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Grid Layout</label>
                  <div className="flex gap-4">
                    <div 
                      onClick={() => setGridType(2)}
                      className={`flex-1 p-4 rounded-2xl border cursor-pointer flex flex-col items-center gap-2 transition-all ${gridType === 2 ? 'bg-rose-500/10 border-rose-500 text-rose-400' : 'bg-black/50 border-white/10 text-zinc-400 hover:bg-white/5'}`}
                    >
                      <IconColumns className="w-6 h-6" />
                      <span className="text-sm font-bold">2 Pages / Sheet</span>
                    </div>
                    <div 
                      onClick={() => setGridType(4)}
                      className={`flex-1 p-4 rounded-2xl border cursor-pointer flex flex-col items-center gap-2 transition-all ${gridType === 4 ? 'bg-rose-500/10 border-rose-500 text-rose-400' : 'bg-black/50 border-white/10 text-zinc-400 hover:bg-white/5'}`}
                    >
                      <IconGrid className="w-6 h-6" />
                      <span className="text-sm font-bold">4 Pages / Sheet</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={processPdf}
                  disabled={status === 'PROCESSING'}
                  className="w-full mt-2 py-5 rounded-2xl bg-gradient-to-r from-rose-600 to-orange-600 text-white font-black uppercase tracking-widest text-sm shadow-[0_8px_0_0_#9f1239] hover:translate-y-1 active:translate-y-2 active:shadow-none transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {status === 'PROCESSING' ? <><IconLoader className="animate-spin w-5 h-5" /> MERGING & PACKING PDFs...</> : <><IconFileText className="w-5 h-5" /> GENERATE MERGED GRID</>}
                </button>
              </motion.div>
            )}

            {/* ERROR UI */}
            {status === 'ERROR' && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-mono text-center">
                {errorMsg}
              </div>
            )}

            {/* DOWNLOAD UI */}
            {status === 'DONE' && downloadUrl && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-6">
                <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-3xl text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconCheck className="text-green-500 w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Success!</h3>
                  <p className="text-sm text-zinc-400 mb-6">Your combined PDF is ready to download.</p>
                  
                  <div className="flex gap-4">
                    <button 
                      onClick={() => { setFiles([]); setStatus('IDLE'); }}
                      className="flex-1 py-4 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition-colors"
                    >
                      Process New
                    </button>
                    <a 
                      href={downloadUrl}
                      download={`Grid_${orientation}_${gridType}x.pdf`}
                      className="flex-1 py-4 rounded-xl bg-green-500 text-black font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-green-400 transition-colors"
                    >
                      <IconDownload className="w-5 h-5" /> Download
                    </a>
                  </div>
                </div>
              </motion.div>
            )}

          </div>
        </div>
      </div>
    </ToolInterfaceShell>
  );
}

// SAFE INLINE SVGs
const IconFileUp = (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M12 12v6"/><path d="m9 15 3-3 3 3"/></svg>;
const IconArrowUp = (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m18 15-6-6-6 6"/></svg>;
const IconArrowDown = (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m6 9 6 6 6-6"/></svg>;
const IconTrash = (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>;
const IconColumns = (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="12" y1="3" x2="12" y2="21"/></svg>;
const IconGrid = (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="12" y1="3" x2="12" y2="21"/></svg>;
const IconPortrait = (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/></svg>;
const IconLandscape = (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="5" width="20" height="14" rx="2" ry="2"/></svg>;
const IconFileText = (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
const IconLoader = (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>;
const IconCheck = (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="20 6 9 17 4 12"/></svg>;
const IconDownload = (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;