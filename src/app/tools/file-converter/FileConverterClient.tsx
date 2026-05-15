"use client";

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const UniversalConverter = dynamic(
  () => import('@/components/ConverterComponent'),
  { 
    ssr: false, // 🔥 YE HAI REAL JADU (No Server Side Rendering)
    loading: () => (
      <div className="w-full  bg-[#050505] flex items-center justify-center text-white">
        <Loader2 className="animate-spin text-indigo-500" size={40} />
      </div>
    )
  }
);

export default function FileConverterClient() {
  return <UniversalConverter />;
}