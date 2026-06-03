import React from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import type { Metadata } from 'next';
import { buildStaticMetadata, STATIC_PAGES } from '@/lib/seo/pages-registry';

const disclaimerMeta = STATIC_PAGES.find((p) => p.path === '/disclaimer')!;
export const metadata: Metadata = buildStaticMetadata(disclaimerMeta);

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 font-sans selection:bg-indigo-500/30">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-indigo-500 hover:text-indigo-400 font-bold text-sm uppercase tracking-widest mb-12 transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
            <AlertTriangle size={24} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tight text-white">Disclaimer</h1>
        </div>
        
        <p className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-12 border-b border-white/10 pb-6">Last Updated: May 2026</p>

        <div className="space-y-8 text-sm md:text-base leading-relaxed">
          <section>
            <h2 className="text-2xl font-black text-white mb-4">1. General Information</h2>
            <p className="text-gray-400">The information provided by Seloice Tools on this website is for general informational purposes only. All information on the site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information or tool on the site.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">2. AI-Generated Content Disclaimer</h2>
            <p className="text-gray-400">Our text, image, and content generation tools utilize advanced artificial intelligence models. Due to the nature of machine learning:</p>
            <ul className="list-disc list-inside text-gray-400 mt-2 space-y-2 ml-4">
              <li>The output generated may occasionally be inaccurate, nonsensical, or out of context.</li>
              <li>Seloice Tools does not endorse or guarantee the factuality or appropriateness of AI-generated content.</li>
              <li>You are strictly responsible for reviewing, fact-checking, and editing any AI-generated content before publishing it on your own platforms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">3. Download Tools and Fair Use</h2>
            <p className="text-gray-400">Seloice Tools provides utilities that may allow users to download public media (such as YouTube videos, Instagram Reels, etc.). It is strictly designed for personal, non-commercial use, educational purposes, and "fair use" as defined by copyright law. By using these tools, you agree that:</p>
            <ul className="list-disc list-inside text-gray-400 mt-2 space-y-2 ml-4">
              <li>You have the legal right or explicit permission from the creator/copyright holder to download the content.</li>
              <li>You will not use our tools to distribute copyrighted material, commit piracy, or infringe upon intellectual property rights.</li>
              <li>Seloice Tools assumes no responsibility or liability for any copyright violations committed by our users.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-black text-white mb-4">4. "As-Is" Service and Liability</h2>
            <p className="text-gray-400">All tools are provided on an "as-is" and "as-available" basis. We cannot guarantee that the tools will work for every file type, on every device, or at all times. Seloice Tools, its developers, and affiliates shall not be held liable for any direct, indirect, consequential, or incidental damages (including data loss or business interruption) arising from your use of our tools.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">5. External Links Disclaimer</h2>
            <p className="text-gray-400">The site may contain (or you may be sent through the site) links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us. We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites linked through the site.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
