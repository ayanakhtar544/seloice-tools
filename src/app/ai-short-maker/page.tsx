import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import JsonLd from '@/components/seo/JsonLd';

const AIShortMakerClient = dynamic(() => import('@/components/seo/AIShortMakerClient'), {
  loading: () => (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center" aria-busy="true" aria-label="Loading">
      <p className="text-gray-500 text-sm font-medium">Loading Seloice AI Short Maker…</p>
    </div>
  ),
});

export const metadata: Metadata = {
  title: "Best AI Short Maker: Turn Long Videos Into Viral Clips | Seloice",
  description: "Stop editing for hours. Seloice is the ultimate AI short maker that instantly analyzes long videos to find viral moments, adds dynamic captions, and generates perfect clips for YouTube Shorts, TikTok, and Reels in 1-click. Try it free!",
  keywords: ["AI Short Maker", "AI shorts generator", "Video to shorts AI", "AI clip generator"],
  alternates: {
    canonical: "https://seloice.com/ai-short-maker",
  },
  openGraph: {
    title: "Best AI Short Maker: Turn Long Videos Into Viral Clips | Seloice",
    description: "Seloice analyzes long videos, finds viral moments, and generates multi-platform short clips with dynamic captions in seconds.",
    url: "https://seloice.com/ai-short-maker",
    images: [{ url: "/api/og?title=AI%20Short%20Maker", width: 1200, height: 630 }],
  }
};

export default function AIShortMakerPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Seloice",
          "operatingSystem": "Web browser, Cloud-based",
          "applicationCategory": "MultimediaApplication",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "description": "Seloice is an advanced AI short maker that automatically repurposes long videos into viral YouTube Shorts, TikToks, and Reels with dynamic captions and auto-framing.",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "1250"
          },
          "featureList": [
            "AI Viral Clip Finder",
            "Automatic Dynamic Captions",
            "Auto-Framing and Speaker Tracking",
            "1-Click Export to Social Media"
          ]
        }}
      />
      <AIShortMakerClient />
    </>
  );
}
