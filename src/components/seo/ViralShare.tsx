"use client";

import React, { useState, useEffect } from 'react';
import { Share2, Link as LinkIcon, Check } from 'lucide-react';

interface ViralShareProps {
  url: string;
  title: string;
  text?: string;
}

function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export default function ViralShare({ url, title, text }: ViralShareProps) {
  const [copied, setCopied] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Component browser par load ho chuka hai
    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      setCanShare(true); // Is device mein native share support hai
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if ((navigator as any).share) {
      try {
        await (navigator as any).share({
          title,
          text: text || title,
          url,
        });
      } catch (err) {
        console.error('Error sharing', err);
      }
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-black uppercase tracking-widest text-zinc-500">
        Share
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-emerald-500/10 hover:text-emerald-400 border border-white/5 hover:border-emerald-500/30 text-zinc-400 transition-all duration-300"
          aria-label="Copy link"
        >
          {copied ? <Check size={16} /> : <LinkIcon size={16} />}
        </button>

        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-xl bg-white/5 hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] border border-white/5 hover:border-[#1DA1F2]/30 text-zinc-400 transition-all duration-300"
          aria-label="Share on X"
        >
          <XIcon />
        </a>

        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-xl bg-white/5 hover:bg-[#4267B2]/10 hover:text-[#4267B2] border border-white/5 hover:border-[#4267B2]/30 text-zinc-400 transition-all duration-300"
          aria-label="Share on Facebook"
        >
          <FacebookIcon />
        </a>
{isMounted && canShare && (
        <button
          type="button"
          onClick={handleShare}
          className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 ..." // teri purani classes
          aria-label="Native share"
        >
          <Share2 size={16} />
        </button>
      )}
      </div>
    </div>
  );
}
