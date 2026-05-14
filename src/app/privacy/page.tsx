// File: src/app/privacy/page.tsx
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Seloice Tools',
  description: 'Learn how Seloice Tools protects your privacy, handles cookies, and uses third-party services including Google AdSense and Analytics.',
  alternates: {
    canonical: 'https://seloice.com/privacy',
  },
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 font-sans selection:bg-indigo-500/30">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-bold text-sm uppercase tracking-widest mb-12 transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <ShieldCheck size={24} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tight text-white">Privacy Policy</h1>
        </div>
        
        <p className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-12 border-b border-white/10 pb-6">
          Last Updated: May 2026
        </p>

        <div className="space-y-10 text-sm md:text-base leading-relaxed">

          <section>
            <h2 className="text-2xl font-black text-white mb-4">1. Introduction</h2>
            <p>Welcome to Seloice Tools (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and share information when you use our website at <strong className="text-white">seloice.com</strong>.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">2. Local Processing (WASM)</h2>
            <p>At Seloice Tools, we prioritize your privacy. The majority of our tools — including Video Compressor, Image Converter, Photo Editor, and MP4 to MP3 — run <strong className="text-white">locally in your browser</strong> using WebAssembly (WASM). Your files are <strong className="text-white">NEVER uploaded to our servers</strong>. Processing happens entirely on your device.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">3. YouTube & Instagram Downloader Tools</h2>
            <p>For tools requiring external APIs (like YouTube or Reel Downloaders), we only process the public URL you provide. We do not store, host, or keep logs of any videos you download. The download link is fetched directly from the respective platforms to your browser.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">4. Analytics & Tracking</h2>
            <p>We use anonymized analytics to understand how visitors use our tools and to improve our service. These services are only activated <strong className="text-white">after you explicitly accept cookies</strong> via our consent banner:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-400">
              <li><strong className="text-gray-200">Google Analytics 4 (GA4)</strong> — Tracks anonymized page views, session duration, and feature usage. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Google Privacy Policy</a>.</li>
              <li><strong className="text-gray-200">Microsoft Clarity</strong> — Session recording and heatmaps to understand user experience. <a href="https://privacy.microsoft.com/privacystatement" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Microsoft Privacy Policy</a>.</li>
              <li><strong className="text-gray-200">Vercel Analytics</strong> — Privacy-friendly, edge-based traffic analytics.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">5. Advertising (Google AdSense)</h2>
            <p>Seloice Tools uses <strong className="text-white">Google AdSense</strong> to display advertisements. AdSense may use cookies and similar tracking technologies to serve personalized ads based on your browsing history and interests.</p>
            <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-400">
              <li>AdSense ads are only loaded <strong className="text-gray-200">after you accept cookies</strong> via our consent banner.</li>
              <li>Google may use the DoubleClick cookie to serve ads based on your visit to our site and other sites on the internet.</li>
              <li>You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Google Ads Settings</a>.</li>
              <li>You can opt out of third-party vendor cookies at <a href="https://www.networkadvertising.org/choices/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">NAI Opt-Out</a>.</li>
            </ul>
            <p className="mt-3">For more information on how Google uses data, please visit: <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">How Google uses data when you use our partners&apos; sites or apps</a>.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">6. Cookies</h2>
            <p>We use the following types of cookies:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-400">
              <li><strong className="text-gray-200">Essential Cookies</strong> — Required for the website to function correctly. Cannot be disabled.</li>
              <li><strong className="text-gray-200">Analytics Cookies</strong> — Help us understand how visitors use our site (Google Analytics, Clarity). Only set after consent.</li>
              <li><strong className="text-gray-200">Advertising Cookies</strong> — Used by Google AdSense to serve relevant ads. Only set after consent.</li>
              <li><strong className="text-gray-200">Preference Cookies</strong> — Store your consent choice in <code className="text-indigo-300 bg-indigo-500/10 px-1 rounded">localStorage</code> so we don&apos;t ask repeatedly.</li>
            </ul>
            <p className="mt-3">You can withdraw your consent at any time by clearing your browser&apos;s local storage or by contacting us.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">7. Data We Do NOT Collect</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-400">
              <li>We do not require account creation or login to use any tool.</li>
              <li>We do not sell your personal data to any third party.</li>
              <li>We do not store files you process through our WASM-based tools.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">8. Third-Party Links</h2>
            <p>Our website may contain links to third-party sites. We are not responsible for the privacy practices of those sites and encourage you to review their respective privacy policies.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">9. Children&apos;s Privacy</h2>
            <p>Seloice Tools is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, please contact us immediately.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">10. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page with an updated date.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">11. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
            <ul className="list-disc pl-6 mt-3 space-y-1 text-gray-400">
              <li>Email: <a href="mailto:hello@seloice.com" className="text-indigo-400 hover:underline">hello@seloice.com</a></li>
              <li>Website: <Link href="/contact" className="text-indigo-400 hover:underline">seloice.com/contact</Link></li>
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
}