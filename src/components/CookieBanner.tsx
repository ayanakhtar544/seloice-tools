'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Check, X } from 'lucide-react';
import Link from 'next/link';
import {
  hasMadeChoice,
  acceptConsent,
  rejectConsent,
  acceptNonPersonalizedAds,
} from '@/lib/cookieConsent';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [strictRegion, setStrictRegion] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Fetch region strictly in background
    fetch('/api/consent/region')
      .then((r) => r.json())
      .then((d: { strict?: boolean }) => setStrictRegion(d.strict !== false))
      .catch(() => setStrictRegion(true));

    const checkConsent = () => {
      if (hasMadeChoice()) {
        setShowBanner(false);
      }
    };

    if (!hasMadeChoice()) {
      const timer = setTimeout(() => setShowBanner(true), 1200);
      
      // Listen for consent changes in other tabs or components
      window.addEventListener('storage', checkConsent);
      window.addEventListener('consent_updated', checkConsent);
      
      return () => {
        clearTimeout(timer);
        window.removeEventListener('storage', checkConsent);
        window.removeEventListener('consent_updated', checkConsent);
      };
    }
  }, []);

  const close = () => setShowBanner(false);

  // Prevent hydration mismatch
  if (!mounted) return null;

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          key="cookie-banner"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed left-0 right-0 z-[180] bg-[#111] md:left-auto md:right-6 md:max-w-md md:border border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] md:bottom-6 md:rounded-2xl md:shadow-2xl overflow-hidden rounded-t-3xl p-6 pb-8 md:p-5"
          style={{ bottom: 'var(--mobile-floating-offset)' }}
          role="dialog"
          aria-label="Cookie consent"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 shrink-0">
                <ShieldAlert size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Privacy & cookies</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  We use cookies for Google Analytics, Microsoft Clarity, and Google AdSense ads.
                  You can accept all, use limited non-personalized ads only, or decline optional
                  cookies.{' '}
                  <Link href="/privacy" className="text-indigo-400 hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  acceptConsent();
                  close();
                }}
                className="w-full py-2.5 rounded-xl border border-indigo-500 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <Check size={14} /> Accept all
              </button>
              {!strictRegion && (
                <button
                  type="button"
                  onClick={() => {
                    acceptNonPersonalizedAds();
                    close();
                  }}
                  className="w-full py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-200 text-xs font-bold transition-colors"
                >
                  Limited ads only (no personalization)
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  rejectConsent();
                  close();
                }}
                className="w-full py-2.5 rounded-xl border border-white/10 bg-transparent hover:bg-white/5 text-gray-400 text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <X size={14} /> Decline optional cookies
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
