'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { canvasRecorder } from '../engine/CanvasRecorder';
import { useEditorStore } from '../stores/editorStore';

export default function ExportModal({ 
  isOpen, 
  onClose
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !isExporting && !downloadUrl) {
      startExport();
    }
  }, [isOpen]);

  const startExport = async () => {
    const canvas = document.getElementById('preview-canvas') as HTMLCanvasElement;
    if (!canvas) {
      setStatus('Preview canvas not found');
      return;
    }
    
    setIsExporting(true);
    setDownloadUrl(null);
    setProgress(0);
    
    try {
      const url = await canvasRecorder.startExport(
        canvas,
        (p, s) => {
          setProgress(p);
          setStatus(s);
        }
      );
      setDownloadUrl(url);
    } catch (err) {
      console.error(err);
      setStatus('Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    const { exportSettings } = useEditorStore.getState();
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `seloice-video.${exportSettings.format}`;
    a.click();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md bg-[#0a0a0f] border border-white/10 rounded-2xl shadow-2xl p-6"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/30">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">
                {downloadUrl ? 'Export Complete!' : 'Exporting Video...'}
              </h2>
              <p className="text-sm text-zinc-400 mt-1">
                {downloadUrl ? 'Your video is ready to download.' : status}
              </p>
            </div>

            {!downloadUrl ? (
              <div className="space-y-2">
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "linear", duration: 0.2 }}
                  />
                </div>
                <div className="flex justify-between text-xs text-zinc-500 font-mono">
                  <span>{Math.round(progress)}%</span>
                  <span>Please don't close this tab</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleDownload}
                  className="w-full py-3 rounded-xl font-bold bg-white text-black hover:bg-zinc-200 transition-colors"
                >
                  Download Video
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-xl font-bold text-zinc-400 hover:text-white transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
