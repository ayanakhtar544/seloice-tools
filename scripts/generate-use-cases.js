/**
 * Generates programmatic SEO use-case pages into src/data/use-cases.json
 * Run: node scripts/generate-use-cases.js
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '../src/data/use-cases.json');

const templates = [
  { slug: 'youtube-shorts-editor', platform: 'YouTube Shorts', primaryTool: 'video-editor', intent: 'Shorts Editor' },
  { slug: 'tiktok-caption-generator', platform: 'TikTok', primaryTool: 'tweet-generator', intent: 'Caption Generator' },
  { slug: 'instagram-reel-editor', platform: 'Instagram Reels', primaryTool: 'video-editor', intent: 'Reel Editor' },
  { slug: 'ai-meme-generator', platform: 'Social Media', primaryTool: 'photo-editor', intent: 'Meme Generator' },
  { slug: 'online-video-trimmer', platform: 'All Platforms', primaryTool: 'video-editor', intent: 'Video Trimmer' },
  { slug: 'instagram-reel-downloader-hd', platform: 'Instagram', primaryTool: 'reel-downloader', intent: 'Reel Downloader HD' },
  { slug: 'youtube-thumbnail-downloader-hd', platform: 'YouTube', primaryTool: 'thumbnail-extractor', intent: 'Thumbnail Downloader' },
  { slug: 'hormozi-style-captions', platform: 'Short-Form Video', primaryTool: 'auto-captions', intent: 'Hormozi Captions' },
  { slug: 'tiktok-hashtag-generator', platform: 'TikTok', primaryTool: 'hashtag-generator', intent: 'Hashtag Generator' },
  { slug: 'instagram-hashtag-extractor', platform: 'Instagram', primaryTool: 'hashtag-extractor', intent: 'Hashtag Extractor' },
  { slug: 'youtube-title-generator-ctr', platform: 'YouTube', primaryTool: 'yt-title-generator', intent: 'Title Generator' },
  { slug: 'youtube-tag-extractor-free', platform: 'YouTube', primaryTool: 'yt-tag-extractor', intent: 'Tag Extractor' },
  { slug: 'compress-video-for-whatsapp', platform: 'WhatsApp', primaryTool: 'video-compressor', intent: 'Video Compressor' },
  { slug: 'remove-background-from-image', platform: 'Design', primaryTool: 'bg-remover', intent: 'Background Remover' },
  { slug: 'mp4-to-mp3-converter-online', platform: 'Audio', primaryTool: 'mp4-to-mp3', intent: 'MP4 to MP3' },
  { slug: 'speech-to-text-podcast', platform: 'Podcast', primaryTool: 'speech-to-text', intent: 'Speech to Text' },
  { slug: 'video-transcript-generator', platform: 'Video', primaryTool: 'mp4-to-text', intent: 'Video Transcript' },
  { slug: 'instagram-grid-maker-free', platform: 'Instagram', primaryTool: 'grid-maker', intent: 'Grid Maker' },
  { slug: 'reel-safe-zone-checker', platform: 'Instagram Reels', primaryTool: 'safe-zone', intent: 'Safe Zone Checker' },
  { slug: 'vertical-video-resizer-9-16', platform: 'Reels & TikTok', primaryTool: 'reel-fitter', intent: 'Vertical Resizer' },
  { slug: 'viral-hook-generator-tiktok', platform: 'TikTok', primaryTool: 'viral-hooks', intent: 'Viral Hook Generator' },
  { slug: 'watermark-video-online-free', platform: 'Video', primaryTool: 'watermark-adder', intent: 'Watermark Adder' },
  { slug: 'qr-code-generator-with-logo', platform: 'Marketing', primaryTool: 'qr-generator', intent: 'QR Generator' },
  { slug: 'webp-to-png-converter', platform: 'Images', primaryTool: 'image-converter', intent: 'Image Converter' },
  { slug: 'color-palette-from-image', platform: 'Design', primaryTool: 'color-extractor', intent: 'Color Extractor' },
  { slug: 'online-photo-editor-free', platform: 'Photography', primaryTool: 'photo-editor', intent: 'Photo Editor' },
  { slug: 'podcast-audio-editor-online', platform: 'Podcast', primaryTool: 'audio-editor', intent: 'Audio Editor' },
  { slug: 'smart-subtitles-generator', platform: 'Video', primaryTool: 'smart-captions', intent: 'Smart Captions' },
  { slug: 'twitter-thread-generator', platform: 'Twitter/X', primaryTool: 'tweet-generator', intent: 'Thread Generator' },
  { slug: 'whatsapp-chat-mockup-generator', platform: 'Marketing', primaryTool: 'whatsapp-mockup', intent: 'Chat Mockup' },
];

function buildPage(t) {
  const year = new Date().getFullYear();
  return {
    slug: t.slug,
    title: `Free ${t.intent} Online (${year}) | Seloice`,
    description: `Free ${t.intent.toLowerCase()} for ${t.platform}. Browser-based, no watermark on core exports. Built for creators.`,
    h1: `Free ${t.intent} for ${t.platform}`,
    platform: t.platform,
    primaryTool: t.primaryTool,
    relatedTools: ['video-compressor', 'auto-captions', 'viral-hooks'].filter((s) => s !== t.primaryTool).slice(0, 3),
    faqs: [
      {
        question: `Is this ${t.intent.toLowerCase()} free?`,
        answer: 'Yes. Seloice tools are free for creators with no watermark on standard exports.',
      },
      {
        question: 'Does it work on mobile?',
        answer: 'Yes. Open the tool in Safari or Chrome on your phone.',
      },
    ],
  };
}

const pages = templates.map(buildPage);
fs.writeFileSync(OUT, JSON.stringify(pages, null, 2));
console.log(`Wrote ${pages.length} use-case pages to ${OUT}`);
