// File: src/components/ShareOutput.tsx
"use client";

import React, { useState } from 'react';
import { Share2, MessageCircle, Copy, CheckCircle2, Download, Link2 } from 'lucide-react';

const TwitterIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);

interface ShareOutputProps {
  content: string; // The text content to share
  title?: string; // Optional title for the share
  url?: string; // The URL of the tool, defaults to window.location.href
  onDownload?: () => void; // Optional download handler if the output is a file/image
}

export default function ShareOutput({ content, title = "Check out this awesome result from Seloice!", url, onDownload }: ShareOutputProps) {
  const [copied, setCopied] = useState(false);

  const getUrl = () => {
    if (typeof window !== 'undefined') {
      return url || window.location.href;
    }
    return 'https://seloice.com';
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`${title}\n\n${content}\n\nGenerated via: ${getUrl()}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleTwitter = () => {
    const text = encodeURIComponent(`${title}\n\n${content.substring(0, 200)}...\n\n`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(getUrl())}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Seloice Tools',
          text: `${title}\n\n${content}`,
          url: getUrl(),
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-white/5">
      <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mr-2 flex items-center gap-1">
        <Share2 size={12} /> Share Result
      </span>

      <button onClick={handleCopy} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all group relative" title="Copy to Clipboard">
        {copied ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Copy size={16} className="group-hover:scale-110 transition-transform" />}
      </button>

      <button onClick={handleWhatsApp} className="p-2 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] transition-all group" title="Share to WhatsApp">
        <MessageCircle size={16} className="group-hover:scale-110 transition-transform" />
      </button>

      <button onClick={handleTwitter} className="p-2 rounded-xl bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] transition-all group" title="Share to X (Twitter)">
        <TwitterIcon size={16} className="group-hover:scale-110 transition-transform" />
      </button>

      {/* Conditionally show download if handler is provided */}
      {onDownload && (
        <button onClick={onDownload} className="p-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 transition-all group ml-auto flex items-center gap-2 text-xs font-bold uppercase tracking-widest" title="Download File">
          <Download size={14} className="group-hover:scale-110 transition-transform" /> 
          <span className="hidden sm:inline">Download</span>
        </button>
      )}

      {/* Mobile Native Share */}
      <button onClick={handleNativeShare} className="sm:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 transition-all group ml-auto">
        <Link2 size={16} />
      </button>
    </div>
  );
}
