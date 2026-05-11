// File: src/app/privacy/page.tsx
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Seloice Tools',
  description: 'Learn how Seloice Tools protects your privacy and data.',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 font-sans selection:bg-indigo-500/30">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-indigo-500 hover:text-indigo-400 font-bold text-sm uppercase tracking-widest mb-12 transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
            <ShieldCheck size={24} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tight text-white">Privacy Policy</h1>
        </div>
        
        <p className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-12 border-b border-white/10 pb-6">Last Updated: May 2026</p>

        <div className="space-y-8 text-sm md:text-base leading-relaxed">
          <section>
            <h2 className="text-2xl font-black text-white mb-4">1. Local Processing (WASM)</h2>
            <p>At Seloice Tools, we prioritize your privacy. The majority of our tools, including Video Compressor, Image Converter, and MP4 to MP3, run <strong>locally in your browser</strong> using WebAssembly (WASM). This means your files are NEVER uploaded to our servers. Processing happens entirely on your device.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">2. YouTube & Instagram Downloader Tools</h2>
            <p>For tools requiring external APIs (like YouTube or Reel Downloaders), we only process the public URL you provide. We do not store, host, or keep logs of the videos you download. The download link is fetched directly from the respective platforms to your browser.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">3. Data Collection</h2>
            <p>We do not require you to create an account, log in, or provide personal information to use Seloice Tools. We use basic, anonymized analytics (like Google Analytics) to monitor website traffic and improve tool performance. This data does not identify you personally.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">4. Cookies</h2>
            <p>We may use cookies to store your preferences (such as dark mode or tool settings) locally on your browser. We do not use tracking cookies for advertising purposes.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">5. Third-Party Links</h2>
            <p>Our website may contain links to third-party sites. If you click on a third-party link, you will be directed to that site. We strongly advise you to review the Privacy Policy of every site you visit.</p>
          </section>
        </div>
      </div>
    </div>
  );
}