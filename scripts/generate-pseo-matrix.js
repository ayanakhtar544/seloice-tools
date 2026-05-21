const fs = require('fs');
const path = require('path');

const OUTPUT_PATH = path.join(__dirname, '../src/data/use-cases-generated.json');

const SOURCES = ['YouTube', 'Twitch', 'Zoom', 'Podcast', 'Webinar', 'Gaming', 'Interview', 'Vlog', 'Live Stream', 'Conference'];
const DESTINATIONS = ['TikTok', 'Instagram Reels', 'YouTube Shorts', 'LinkedIn Clips', 'Twitter Video'];

const GENERATED_PAGES = [];

SOURCES.forEach((source) => {
  DESTINATIONS.forEach((destination) => {
    // Basic pSEO template logic
    const slug = `${source.toLowerCase().replace(/\s+/g, '-')}-to-${destination.toLowerCase().replace(/\s+/g, '-')}-ai`;
    
    // Some logic to ensure we don't map YouTube to YouTube Shorts trivially in weird wording, though it's still a valid search
    if (source === 'YouTube' && destination === 'YouTube Shorts') return; // Handled specially

    const page = {
      slug,
      title: `${source} to ${destination} AI | Auto Video Clipper Free`,
      description: `Don't waste hours editing. Use our free AI to automatically analyze, crop, and convert your ${source} videos into high-retention ${destination} instantly. No watermark.`,
      h1: `Convert ${source} to ${destination} Instantly with AI`,
      platform: destination,
      primaryTool: 'shorts-maker',
      relatedTools: ['video-compressor', 'auto-captions', 'reel-fitter'],
      faqs: [
        {
          question: `Can I export directly for ${destination}?`,
          answer: `Yes, the output is perfectly framed in a 9:16 vertical format which is natively optimized for ${destination} uploads.`
        },
        {
          question: `Does the AI recognize when someone is speaking in a ${source} video?`,
          answer: `Absolutely. Our local WebAssembly AI tracks speaker movements, audio pacing, and sentence structure to find the best moments without cloud uploads.`
        },
        {
          question: `Are there watermarks on the final download?`,
          answer: `No. Seloice provides 100% free, unwatermarked high-definition exports.`
        }
      ]
    };
    
    GENERATED_PAGES.push(page);
  });
});

// Add custom high-intent pages
const CUSTOM_PAGES = [
  {
    slug: 'youtube-video-to-shorts-ai',
    title: 'YouTube Video to Shorts AI | Convert Links to 9:16 Clips Free',
    description: 'Repurpose your existing YouTube catalog. Let our AI isolate top hook segments, and download ready-to-post 9:16 Shorts immediately.',
    h1: 'YouTube Video to Shorts AI',
    platform: 'YouTube Shorts',
    primaryTool: 'shorts-maker',
    relatedTools: ['yt-downloader', 'auto-captions', 'yt-title-generator'],
    faqs: [
      { question: 'Do I need to download the video first?', answer: 'No, our engine can analyze local video files instantly.' },
      { question: 'Will captions match the audio?', answer: 'Yes, our on-device speech-to-text perfectly syncs kinetic captions to the audio.' }
    ]
  },
  {
    slug: 'ai-reel-clip-generator',
    title: 'AI Reel Clip Generator | High-Retention Video Crops for Instagram',
    description: 'Boost your Instagram engagement rates. Convert talking-head videos into highly visual Reels with styled sub-titles.',
    h1: 'AI Reel Clip Generator',
    platform: 'Instagram Reels',
    primaryTool: 'shorts-maker',
    relatedTools: ['reel-downloader', 'hashtag-generator', 'reel-fitter'],
    faqs: [
      { question: 'Does this work for TikTok?', answer: 'Yes, the generated 9:16 clips are perfectly formatted for Instagram Reels, TikTok, and Shorts.' },
      { question: 'Can I batch process?', answer: 'The AI identifies multiple viral segments from a single long video allowing batch creation.' }
    ]
  },
  {
    slug: 'faceless-youtube-shorts-maker',
    title: 'Faceless YouTube Shorts Maker | Automate Cash Cow Channels',
    description: 'Automate your faceless YouTube channel. Generate viral, high-retention shorts from raw clips instantly without being on camera.',
    h1: 'Automated Faceless Shorts Generator',
    platform: 'YouTube Shorts',
    primaryTool: 'shorts-maker',
    relatedTools: ['tweet-generator', 'video-editor'],
    faqs: [
      { question: 'Can I use this for Reddit story channels?', answer: 'Yes, this is perfect for compiling kinetic typography over gameplay or stock footage.' }
    ]
  }
];

const ALL_DATA = [...GENERATED_PAGES, ...CUSTOM_PAGES];

// Write the database
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(ALL_DATA, null, 2));

console.log(`✅ Successfully generated ${ALL_DATA.length} programmatic SEO landing pages to use-cases-generated.json!`);
