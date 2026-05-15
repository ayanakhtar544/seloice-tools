'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import Link from 'next/link';
import ErrorBoundary from '@/components/ErrorBoundary';
import { getToolBySlug } from '@/lib/seo/tools-registry';
import ToolLoadingSkeleton from '@/components/seo/ToolLoadingSkeleton';

function createToolComponent(
  slug: string,
  importFn: () => Promise<{ default: ComponentType }>
) {
  const tool = getToolBySlug(slug);
  const label = tool ? `Loading ${tool.shortTitle}…` : 'Loading tool…';
  return dynamic(importFn, {
    ssr: false,
    loading: () => <ToolLoadingSkeleton label={label} />,
  });
}

const TOOL_COMPONENTS: Record<string, ComponentType> = {
  'audio-editor': createToolComponent('audio-editor', () => import('@/app/tools/audio-editor/AudioEditorClient')),
  'auto-captions': createToolComponent('auto-captions', () => import('@/app/tools/auto-captions/AutoCaptionsClient')),
  'bg-remover': createToolComponent('bg-remover', () => import('@/app/tools/bg-remover/BgRemoverClient')),
  'color-extractor': createToolComponent('color-extractor', () => import('@/app/tools/color-extractor/ColorExtractorClient')),
  'file-converter': createToolComponent('file-converter', () => import('@/app/tools/file-converter/FileConverterClient')),
  'grid-maker': createToolComponent('grid-maker', () => import('@/app/tools/grid-maker/GridMakerClient')),
  'hashtag-extractor': createToolComponent('hashtag-extractor', () => import('@/app/tools/hashtag-extractor/HashtagExtractorClient')),
  'hashtag-generator': createToolComponent('hashtag-generator', () => import('@/app/tools/hashtag-generator/HashtagGeneratorClient')),
  'image-converter': createToolComponent('image-converter', () => import('@/app/tools/image-converter/ImageConverterClient')),
  'mp4-to-mp3': createToolComponent('mp4-to-mp3', () => import('@/app/tools/mp4-to-mp3/Mp4ToMp3Client')),
  'mp4-to-text': createToolComponent('mp4-to-text', () => import('@/app/tools/mp4-to-text/Mp4ToTextClient')),
  'photo-editor': createToolComponent('photo-editor', () => import('@/app/tools/photo-editor/PhotoEditorClient')),
  'qr-generator': createToolComponent('qr-generator', () => import('@/app/tools/qr-generator/QrGeneratorClient')),
  'reel-downloader': createToolComponent('reel-downloader', () => import('@/app/tools/reel-downloader/ReelDownloaderClient')),
  'reel-fitter': createToolComponent('reel-fitter', () => import('@/app/tools/reel-fitter/ReelFitterClient')),
  'safe-zone': createToolComponent('safe-zone', () => import('@/app/tools/safe-zone/SafeZoneClient')),
  'smart-captions': createToolComponent('smart-captions', () => import('@/app/tools/smart-captions/SmartCaptionsClient')),
  'speech-to-text': createToolComponent('speech-to-text', () => import('@/app/tools/speech-to-text/SpeechToTextClient')),
  'thumbnail-extractor': createToolComponent('thumbnail-extractor', () => import('@/app/tools/thumbnail-extractor/ThumbnailExtractorClient')),
  'tweet-generator': createToolComponent('tweet-generator', () => import('@/app/tools/tweet-generator/TweetGeneratorClient')),
  'video-compressor': createToolComponent('video-compressor', () => import('@/app/tools/video-compressor/VideoCompressorClient')),
  'video-editor': createToolComponent('video-editor', () => import('@/app/tools/video-editor/VideoEditorClient')),
  'viral-hooks': createToolComponent('viral-hooks', () => import('@/app/tools/viral-hooks/ViralHooksClient')),
  'watermark-adder': createToolComponent('watermark-adder', () => import('@/app/tools/watermark-adder/WatermarkAdderClient')),
  'whatsapp-mockup': createToolComponent('whatsapp-mockup', () => import('@/app/tools/whatsapp-mockup/WhatsappMockupClient')),
  'yt-downloader': createToolComponent('yt-downloader', () => import('@/app/tools/yt-downloader/YtDownloaderClient')),
  'yt-tag-extractor': createToolComponent('yt-tag-extractor', () => import('@/app/tools/yt-tag-extractor/YtTagExtractorClient')),
  'yt-title-generator': createToolComponent('yt-title-generator', () => import('@/app/tools/yt-title-generator/YtTitleGeneratorClient')),
};

interface ToolClientProps {
  slug: string;
}

export default function ToolClient({ slug }: ToolClientProps) {
  const Component = TOOL_COMPONENTS[slug];

  if (!Component) {
    return (
      <div className="w-full max-w-4xl mx-auto min-h-[200px] flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#111] p-8 text-center">
        <p className="text-white font-bold mb-2">Tool not found</p>
        <p className="text-gray-400 text-sm mb-4">This tool page does not exist or is not available yet.</p>
        <Link href="/tools" className="text-emerald-400 text-sm font-bold hover:underline">
          Browse all tools
        </Link>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Component />
    </ErrorBoundary>
  );
}
