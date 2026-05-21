const fs = require('fs');
const path = require('path');

const OUTPUT_PATH = path.join(__dirname, '../src/data/blog-posts.json');

const BLOG_POSTS = [
  {
    slug: 'youtube-shorts-algorithm-2026',
    title: 'How the YouTube Shorts Algorithm Works in 2026',
    description: 'A complete breakdown of the YouTube Shorts ranking algorithm, retention metrics, and why AI clipping tools dominate the feed.',
    h1: 'The 2026 Guide to the YouTube Shorts Algorithm',
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: 'Seloice Editorial',
    category: 'YouTube Growth',
    relatedTools: ['shorts-maker', 'yt-title-generator', 'yt-tag-extractor']
  },
  {
    slug: 'start-faceless-youtube-channel-ai',
    title: 'How to Start a Faceless YouTube Channel Using AI',
    description: 'Learn how to automate content creation and build a highly profitable faceless cash cow channel using local AI video tools.',
    h1: 'Automating a Faceless Channel from Scratch',
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: 'Seloice Editorial',
    category: 'Creator Economy',
    relatedTools: ['shorts-maker', 'tweet-generator', 'auto-captions']
  },
  {
    slug: 'anatomy-of-a-viral-hook',
    title: 'The Anatomy of a Perfect 3-Second Viral Hook',
    description: 'Discover the exact psychological triggers, visual patterns, and audio cues that stop users from scrolling on TikTok and Reels.',
    h1: 'Psychology of a 3-Second Viral Hook',
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: 'Seloice Editorial',
    category: 'Viral Storytelling',
    relatedTools: ['viral-hooks', 'shorts-maker', 'smart-captions']
  },
  {
    slug: 'repurpose-podcasts-ai-clips',
    title: 'Repurposing Podcasts: The AI Workflow for 10x Output',
    description: 'How to take a single 1-hour podcast and automatically extract 30 high-retention video clips using on-device AI clipping engines.',
    h1: 'How to Turn a 1 Hour Podcast into 30 Shorts',
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: 'Seloice Editorial',
    category: 'Content Automation',
    relatedTools: ['shorts-maker', 'mp4-to-text', 'audio-editor']
  },
  {
    slug: 'opus-clip-alternative-free',
    title: 'Seloice vs Opus Clip: The Best Free AI Shorts Maker in 2026',
    description: 'A detailed comparison of AI clipping tools. Why creators are shifting from cloud-based subscriptions to fast, local WebAssembly engines.',
    h1: 'The Best Free Opus Clip Alternative',
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: 'Seloice Editorial',
    category: 'AI Video Editing',
    relatedTools: ['shorts-maker', 'video-editor', 'video-compressor']
  }
];

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(BLOG_POSTS, null, 2));

console.log(`✅ Successfully generated ${BLOG_POSTS.length} pillar blog posts to blog-posts.json!`);
