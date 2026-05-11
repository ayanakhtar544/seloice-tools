// File: src/app/contact/page.tsx
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Contact Us | Seloice Tools',
  description: 'Get in touch with the Seloice Tools team for support, bugs, or business inquiries.',
};

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
                <p className="text-gray-400">hello@seloicetools.com</p>
                <p className="text-xs text-gray-500 mt-2">We usually reply within 24 hours.</p>
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 p-8 rounded-3xl flex items-start gap-4">
              <div>
                <h3 className="text-white font-black uppercase tracking-widest text-sm mb-1">Twitter / X</h3>
                <p className="text-gray-400">@SeloiceTools</p>
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

          {/* Contact Form Mockup */}
          <div className="bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 p-8 rounded-3xl">
            <h3 className="text-2xl font-black text-white mb-6 italic">Send a Message</h3>
            
            {/* 🔥 FIX: Removed onSubmit and changed button type to "button" */}
            <form className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Name</label>
                <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" placeholder="Ansari Bhaiya" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email</label>
                <input type="email" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Message</label>
                <textarea rows={4} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" placeholder="How can we help you?"></textarea>
              </div>
              
              {/* 🔥 FIX: Changed to type="button" */}
              <button type="button" className="w-full bg-indigo-600 text-white font-black text-sm uppercase tracking-widest py-4 rounded-xl hover:bg-indigo-700 transition-colors">
                Send Message
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}