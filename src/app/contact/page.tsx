// File: src/app/contact/page.tsx
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, MapPin } from 'lucide-react';

import type { Metadata } from 'next';
import { buildStaticMetadata, STATIC_PAGES } from '@/lib/seo/pages-registry';

const contactMeta = STATIC_PAGES.find((p) => p.path === '/contact')!;
export const metadata: Metadata = buildStaticMetadata(contactMeta);

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 font-sans selection:bg-indigo-500/30">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-indigo-500 hover:text-indigo-400 font-bold text-sm uppercase tracking-widest mb-12 transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white mb-6">Get in Touch.</h1>
        <p className="text-lg text-gray-400 max-w-xl mb-16">Have a question, found a bug, or want to suggest a new tool? We'd love to hear from you.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Details */}
          <div className="space-y-6">
            <div className="bg-[#111] border border-white/10 p-8 rounded-3xl flex items-start gap-4">
              <Mail className="text-indigo-500 mt-1" />
              <div>
                <h3 className="text-white font-black uppercase tracking-widest text-sm mb-1">Email Us</h3>
                <p className="text-gray-400">hello@seloice.com</p>
                <p className="text-xs text-gray-500 mt-2">We usually reply within 24 hours.</p>
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 p-8 rounded-3xl flex items-start gap-4">
              <div>
                <h3 className="text-white font-black uppercase tracking-widest text-sm mb-1">Twitter / X</h3>
                <p className="text-gray-400">@seloice</p>
                <p className="text-xs text-gray-500 mt-2">DMs are open for feature requests.</p>
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 p-8 rounded-3xl flex items-start gap-4">
              <MapPin className="text-pink-500 mt-1" />
              <div>
                <h3 className="text-white font-black uppercase tracking-widest text-sm mb-1">Location</h3>
                <p className="text-gray-400">Bihar, India</p>
                <p className="text-xs text-gray-500 mt-2">Building for the global creator economy.</p>
              </div>
            </div>
          </div>

          {/* Direct Contact */}
          <div className="bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 p-8 rounded-3xl flex flex-col justify-center text-center">
            <h3 className="text-3xl font-black text-white mb-4 italic">Ready to reach out?</h3>
            <p className="text-gray-400 mb-8 max-w-sm mx-auto">
              Skip the forms. We prefer direct communication. Click below to open your email client and send us a message directly.
            </p>
            
            <a 
              href="mailto:hello@seloice.com" 
              className="w-full bg-indigo-600 text-white font-black text-sm uppercase tracking-widest py-5 rounded-xl hover:bg-indigo-700 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] flex items-center justify-center gap-3"
            >
              <Mail size={18} /> Send an Email
            </a>
            
            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Or connect with us on</p>
              <a 
                href="https://twitter.com/seloice" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white hover:bg-white/5 px-6 py-3 rounded-xl transition-colors border border-transparent hover:border-white/10"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.95H5.078z"></path>
                </svg>
                Twitter / X
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}