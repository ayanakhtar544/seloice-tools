// File: src/app/terms/page.tsx
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | Seloice Tools',
  description: 'Terms and conditions for using Seloice Tools.',
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 font-sans selection:bg-indigo-500/30">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-indigo-500 hover:text-indigo-400 font-bold text-sm uppercase tracking-widest mb-12 transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
            <FileText size={24} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tight text-white">Terms of Service</h1>
        </div>
        
        <p className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-12 border-b border-white/10 pb-6">Last Updated: May 2026</p>

        <div className="space-y-8 text-sm md:text-base leading-relaxed">
          <section>
            <h2 className="text-2xl font-black text-white mb-4">1. Acceptance of Terms</h2>
            <p>By accessing and using Seloice Tools, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">2. Use of Downloader Tools</h2>
            <p>Our video downloading tools are meant for downloading your own content, content in the public domain, or content for which you have explicit permission from the creator. You agree NOT to use our tools to download copyrighted material for commercial distribution.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">3. Disclaimer of Warranties</h2>
            <p>Seloice Tools is provided "as is" without any representations or warranties, express or implied. We do not warrant that the website will be constantly available, or that the tools will perfectly process every single file type without errors.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">4. Limitations of Liability</h2>
            <p>Seloice Tools will not be liable to you (whether under the law of contact, the law of torts or otherwise) in relation to the contents of, or use of, or otherwise in connection with, this website for any direct, indirect, special or consequential loss.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">5. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. We do so by posting and drawing attention to the updated terms on the Site. Your decision to continue to visit and make use of the Site after such changes have been made constitutes your formal acceptance of the new Terms of Service.</p>
          </section>
        </div>
      </div>
    </div>
  );
}