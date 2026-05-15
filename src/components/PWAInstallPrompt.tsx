"use client";

import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

export default function PWAInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
      // Check karo agar user ne pehle se mana toh nahi kiya is session me
      if (!sessionStorage.getItem('pwa_prompt_dismissed')) {
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    setInstallPrompt(null);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-4 right-4 md:left-auto md:right-8 md:w-96 z-[9999] animate-bounce-subtle">
      <div className="bg-emerald-600 border border-emerald-400/30 p-4 rounded-2xl shadow-[0_20px_50px_rgba(16,185,129,0.3)] flex items-center justify-between gap-4 backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl">
            <Download size={20} className="text-white" />
          </div>
          <div>
            <h4 className="text-white text-sm font-black uppercase tracking-tight">Install Seloice App</h4>
            <p className="text-emerald-100 text-[10px] font-medium">Faster access & offline tools</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handleInstall}
            className="bg-white text-emerald-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-50 transition-all active:scale-95"
          >
            Install
          </button>
          <button 
            onClick={() => {
                setIsVisible(false);
                sessionStorage.setItem('pwa_prompt_dismissed', 'true');
            }}
            className="text-emerald-200 hover:text-white p-1"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}