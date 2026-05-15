'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function GlobalAppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error('[app/error]', error);
    }
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
        <AlertTriangle size={24} className="text-red-400" aria-hidden />
      </div>
      <div>
        <h1 className="text-xl font-black text-white mb-2">Something went wrong</h1>
        <p className="text-sm text-gray-400 max-w-md">
          The page hit an unexpected error. You can try again or return home.
        </p>
      </div>
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black uppercase tracking-widest rounded-xl transition-colors"
        >
          <RefreshCw size={14} aria-hidden /> Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
