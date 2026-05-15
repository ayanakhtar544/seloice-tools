'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ToolsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error('[tools/error]', error);
    }
  }, [error]);

  return (
    <div className="w-full max-w-4xl mx-auto min-h-[280px] flex flex-col items-center justify-center gap-6 rounded-[2rem] border border-red-500/20 bg-[#111] p-10 text-center mb-8">
      <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
        <AlertTriangle size={24} className="text-red-400" aria-hidden />
      </div>
      <div>
        <h2 className="text-lg font-black text-white mb-2">This tool failed to load</h2>
        <p className="text-sm text-gray-400 max-w-sm">
          Something went wrong while loading the tool. Try again or pick another tool.
        </p>
      </div>
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black uppercase tracking-widest rounded-xl transition-colors"
        >
          <RefreshCw size={14} aria-hidden /> Retry tool
        </button>
        <Link
          href="/tools"
          className="inline-flex items-center px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-colors"
        >
          All tools
        </Link>
      </div>
    </div>
  );
}
