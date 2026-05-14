"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Check, X } from 'lucide-react';
import { hasMadeChoice, acceptConsent, rejectConsent } from '@/lib/cookieConsent';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Only show if the user hasn't made a choice yet
    // Delayed slightly to not interrupt immediate page load experience
    if (!hasMadeChoice()) {
      const timer = setTimeout(() => setShowBanner(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    acceptConsent();
    setShowBanner(false);
  };

  const handleReject = () => {
    rejectConsent();
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 md:bottom-6 md:left-auto md:right-6 md:max-w-sm z-[999] bg-[#111] border border-white/10 shadow-2xl rounded-2xl p-5 overflow-hidden"
        >
          {/* Subtle gradient background effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 shrink-0">
                <ShieldAlert size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Your Privacy</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  We use cookies to analyze traffic and improve your experience. 
                  We don't use annoying ads. You can opt-out of non-essential tracking.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-1">
              <button 
                onClick={handleReject}
                className="flex-1 py-2.5 rounded-xl border border-white/10 bg-transparent hover:bg-white/5 text-gray-300 text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <X size={14} /> Decline
              </button>
              <button 
                onClick={handleAccept}
                className="flex-1 py-2.5 rounded-xl border border-indigo-500 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(79,70,229,0.3)]"
              >
                <Check size={14} /> Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
