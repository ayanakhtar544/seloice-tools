import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Cookie } from 'lucide-react';
import type { Metadata } from 'next';
import { buildStaticMetadata, STATIC_PAGES } from '@/lib/seo/pages-registry';

const cookieMeta = STATIC_PAGES.find((p) => p.path === '/cookie-policy')!;
export const metadata: Metadata = buildStaticMetadata(cookieMeta);

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 font-sans selection:bg-indigo-500/30">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-indigo-500 hover:text-indigo-400 font-bold text-sm uppercase tracking-widest mb-12 transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
            <Cookie size={24} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tight text-white">Cookie Policy</h1>
        </div>
        
        <p className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-12 border-b border-white/10 pb-6">Last Updated: May 2026</p>

        <div className="space-y-8 text-sm md:text-base leading-relaxed">
          <section>
            <h2 className="text-2xl font-black text-white mb-4">1. What Are Cookies?</h2>
            <p className="text-gray-400">Cookies are small text files that are placed on your computer or mobile device when you browse websites. They are widely used to make websites work more efficiently, provide a better user experience, and supply analytical information to the site owners.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">2. How We Use Cookies</h2>
            <p className="text-gray-400 mb-2">Seloice Tools uses cookies and similar tracking technologies for several purposes:</p>
            <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
              <li><strong>Essential Cookies:</strong> Required for the basic functioning of our website, such as managing your session and saving your tool preferences locally.</li>
              <li><strong>Analytics Cookies:</strong> To understand how visitors interact with our website, helping us improve the user experience. We use tools like Google Analytics.</li>
              <li><strong>Advertising Cookies:</strong> Used to deliver personalized advertisements that are relevant to you and your interests.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">3. Google AdSense & Third-Party Vendors</h2>
            <p className="text-gray-400 mb-2">We use Google AdSense to display ads on some of our pages. Google, as a third-party vendor, uses cookies to serve ads based on your prior visits to our website or other websites.</p>
            <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
              <li>Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to Seloice Tools and/or other sites on the Internet.</li>
              <li>You may opt out of personalized advertising by visiting <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Google's Ads Settings</a>.</li>
              <li>Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">www.aboutads.info</a>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">4. Managing Your Cookie Preferences</h2>
            <p className="text-gray-400">Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience, since it will no longer be personalized to you. It may also stop you from saving customized settings like your preferred tool configurations.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-black text-white mb-4">5. Local Storage</h2>
            <p className="text-gray-400">In addition to traditional cookies, Seloice Tools heavily relies on HTML5 Local Storage. Since we process files directly in your browser without uploading them to our servers, we use Local Storage to save your progress, tool history, and preferences strictly on your device.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-black text-white mb-4">6. Contact Us</h2>
            <p className="text-gray-400">If you have any questions about our Cookie Policy, please contact us at <a href="mailto:hello@seloice.com" className="text-indigo-400 hover:underline">hello@seloice.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
