"use client";

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Hume Next.js ko bolna hai ki isse server par render mat karo (ssr: false)
const UniversalConverter = dynamic(
  () => import('@/components/ConverterComponent'),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-indigo-500" size={40} />
          <p className="font-bold tracking-widest uppercase text-xs">Initializing Engine...</p>
        </div>
      </div>
    )
  }
);

export default function Page() {
  return <UniversalConverter />;
}