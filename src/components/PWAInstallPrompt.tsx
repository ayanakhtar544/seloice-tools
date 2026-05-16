"use client";

import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PWAInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Prevent SSR hydration mismatch by ensuring logic only runs on mount
    const checkAndSetPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
      if (!sessionStorage.getItem('pwa_prompt_dismissed')) {
        setIsVisible(true);
      }
    };

    // Check if the event fired before React hydrated
    const w = window as any;
    if (w.__deferredInstallPrompt) {
      checkAndSetPrompt(w.__deferredInstallPrompt);
      w.__deferredInstallPrompt = null;
    }

    const handleBeforeInstallPrompt = (e: any) => {
      checkAndSetPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    
    try {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsVisible(false);
      }
      // Cannot reuse the prompt after choice
      setInstallPrompt(null);
    } catch (err) {
      console.error("Install prompt failed:", err);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  // We ensure no hydration mismatch by keeping it hidden until useEffect
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="pwa-install-prompt"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed left-4 right-4 z-[170] md:left-auto md:right-8 md:bottom-6 md:w-96"
          style={{ bottom: 'calc(var(--mobile-floating-offset) + 5.5rem)' }}
        >
          <div className="bg-emerald-600 border border-emerald-400/30 p-4 rounded-2xl shadow-[0_20px_50px_rgba(16,185,129,0.3)] flex items-center justify-between gap-4 backdrop-blur-lg">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl shrink-0">
                <Download size={20} className="text-white" />
              </div>
              <div>
                <h4 className="text-white text-sm font-black uppercase tracking-tight">Install Seloice App</h4>
                <p className="text-emerald-100 text-[10px] font-medium">Faster access & offline tools</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={handleInstall}
                className="bg-white text-emerald-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-50 transition-all active:scale-95"
              >
                Install
              </button>
              <button 
                onClick={handleDismiss}
                className="text-emerald-200 hover:text-white p-1 transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
