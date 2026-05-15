import React from 'react';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdUnit from '@/components/AdUnit';
import { canShowAdsOnTool } from '@/lib/adsense/tool-ads';
import ToolPageContent from '@/components/seo/ToolPageContent';
import ToolPageHeader from '@/components/seo/ToolPageHeader';
import ToolLazyGate from '@/components/seo/ToolLazyGate';
import ToolDisclaimer from '@/components/seo/ToolDisclaimer';
import { toolsHubMetadata } from './page-metadata';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  if (pathname === '/tools' || pathname === '/tools/') {
    return toolsHubMetadata;
  }
  return {};
}

function extractToolSlug(pathname: string): string | null {
  const match = pathname.match(/^\/tools\/([^/]+)\/?$/);
  if (!match || match[1] === 'page') return null;
  return match[1];
}

export default async function ToolsLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  const toolSlug = extractToolSlug(pathname);
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30 overflow-x-hidden flex flex-col">
      {/* FLOATING BACKGROUND EFFECTS (consistent with main page) */}
      <div className="fixed inset-0 z-0 pointer-events-none flex justify-center">
        <div className="absolute top-[-20%] left-[-10%] w-[60rem] h-[60rem] bg-indigo-600/10 rounded-full blur-[150px] opacity-70 mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50rem] h-[50rem] bg-pink-600/10 rounded-full blur-[150px] opacity-70 mix-blend-screen" />
        <div
          className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      <Navbar />

      <main id="tools-main" className="flex-grow pt-24 md:pt-32 pb-20 relative z-10 px-4 md:px-6 w-full max-w-[1440px] mx-auto">
        {toolSlug && <ToolPageHeader slug={toolSlug} />}
        {toolSlug && <ToolDisclaimer slug={toolSlug} />}
        {toolSlug ? <ToolLazyGate slug={toolSlug}>{children}</ToolLazyGate> : children}
        {toolSlug && <ToolPageContent slug={toolSlug} />}

        {(!toolSlug || canShowAdsOnTool(toolSlug)) && (
          <div className="mt-20 max-w-4xl mx-auto w-full">
            <AdUnit slot="banner" variant="leaderboard" />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
