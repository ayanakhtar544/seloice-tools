'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, CheckCircle2, Sparkles, Share2, Unlock } from 'lucide-react';

interface ViralReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportWithWatermark: () => void;
}

export default function ViralReferralModal({ isOpen, onClose, onExportWithWatermark }: ViralReferralModalProps) {
  const [copied, setCopied] = useState(false);
  // Mock referral code for demonstration
  const referralLink = 'https://seloice.com/invite/creator-2026';

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 p-6"
          >
            <div className="relative overflow-hidden rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl">
              {/* Background Glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-fuchsia-500/20 blur-[50px] rounded-full pointer-events-none" />
              
              <button
                onClick={onClose}
                className="absolute right-4 top-4 z-10 rounded-full p-2 text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="p-8 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500/20 to-violet-500/20 border border-fuchsia-500/30 text-fuchsia-400">
                  <Unlock size={32} />
                </div>

                <h2 className="mb-2 text-2xl font-black text-white">Remove Watermark Free</h2>
                <p className="mb-8 text-sm text-zinc-400">
                  Invite 1 creator friend to try Seloice. Once they sign up, you both get 30 days of watermark-free 4K exports!
                </p>

                <div className="mb-8 relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 to-violet-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
                  <div className="relative flex items-center justify-between rounded-xl border border-white/10 bg-black/50 p-3 backdrop-blur-xl">
                    <span className="truncate text-sm font-medium text-zinc-300 select-all pl-2">
                      {referralLink}
                    </span>
                    <button
                      onClick={handleCopy}
                      className="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                    >
                      {copied ? <CheckCircle2 size={18} className="text-emerald-400" /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-500 hover:to-violet-500 py-4 font-bold text-white shadow-lg transition-all">
                    <Share2 size={18} /> Share via WhatsApp
                  </button>
                  <button 
                    onClick={onExportWithWatermark}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-transparent hover:bg-white/5 py-4 font-bold text-zinc-400 transition-all text-sm"
                  >
                    Export with Watermark for now
                  </button>
                </div>
              </div>
              
              <div className="bg-white/5 p-4 text-center border-t border-white/5">
                <p className="text-xs text-zinc-500 flex items-center justify-center gap-1">
                  <Sparkles size={12} className="text-fuchsia-400" /> 
                  14,024 creators unlocked this today
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
