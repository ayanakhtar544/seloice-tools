const fs = require('fs');
const path = require('path');

const seoPath = path.join(__dirname, 'src', 'data', 'seo-pages.json');
let seoPages = JSON.parse(fs.readFileSync(seoPath, 'utf8'));

const newPages = [
  {
    slug: 'ai-subtitle-generator',
    baseTool: 'auto-captions',
    title: 'Free AI Subtitle Generator | Auto Captions Online',
    description: 'Automatically generate accurate subtitles for your videos using AI. Fast, free, and no watermarks.',
    h1: 'Free AI Subtitle Generator',
    intro: 'Add highly accurate AI subtitles to any video in seconds. Perfect for TikTok, Reels, and Shorts.',
    features: ['99% Accuracy', 'Multiple Languages', 'No Watermarks'],
    howTo: [
      { step: "1", title: "Upload Video", desc: "Select your MP4 file." },
      { step: "2", title: "Generate", desc: "Click transcribe and let AI do the work." },
      { step: "3", title: "Download", desc: "Save your video with hardcoded subtitles." }
    ],
    faqs: [{ q: "Is it really free?", a: "Yes, 100% free with no limits." }]
  },
  {
    slug: 'instagram-caption-generator',
    baseTool: 'caption-generator',
    title: 'AI Instagram Caption Generator | Viral Captions Free',
    description: 'Generate engaging, viral Instagram captions instantly using AI. Boost your engagement today.',
    h1: 'AI Instagram Caption Generator',
    intro: 'Never stare at a blank screen again. Generate highly engaging captions tailored for your niche.',
    features: ['AI Powered', 'Viral Hooks Included', 'Custom Tones'],
    howTo: [
      { step: "1", title: "Describe Post", desc: "Tell us what your post is about." },
      { step: "2", title: "Select Tone", desc: "Choose funny, professional, or engaging." },
      { step: "3", title: "Copy", desc: "Copy the best caption." }
    ],
    faqs: [{ q: "Does it include hashtags?", a: "Yes, relevant hashtags are automatically appended." }]
  },
  {
    slug: 'youtube-title-generator',
    baseTool: 'yt-title-generator',
    title: 'Free YouTube Title Generator | Get More Views',
    description: 'Create click-worthy, SEO-optimized YouTube titles instantly. Increase your CTR and views.',
    h1: 'YouTube Title Generator',
    intro: 'Your title makes or breaks your video. Let AI generate 10+ highly clickable titles for your next upload.',
    features: ['High CTR', 'SEO Optimized', 'Instant Generation'],
    howTo: [
      { step: "1", title: "Enter Topic", desc: "Type what your video is about." },
      { step: "2", title: "Generate", desc: "Get dozens of variations." },
      { step: "3", title: "Select", desc: "Pick the most click-worthy title." }
    ],
    faqs: [{ q: "Will this improve views?", a: "Yes, better titles lead to higher Click-Through-Rates (CTR)." }]
  },
  {
    slug: 'youtube-tags-generator',
    baseTool: 'yt-tag-extractor',
    title: 'YouTube Tags Generator & Extractor | Free SEO Tool',
    description: 'Generate and extract the best SEO tags for your YouTube videos to rank higher in search.',
    h1: 'YouTube Tags Generator',
    intro: 'Find the exact tags top creators are using. Rank higher on YouTube search instantly.',
    features: ['Competitor Extraction', 'SEO Ranking', 'Copy in 1-Click'],
    howTo: [
      { step: "1", title: "Enter Keyword", desc: "Type your main video topic." },
      { step: "2", title: "Find Tags", desc: "We find the most searched tags." },
      { step: "3", title: "Copy All", desc: "Paste them into YouTube." }
    ],
    faqs: [{ q: "Are tags still important?", a: "Yes, they help YouTube categorize your content accurately." }]
  },
  {
    slug: 'free-background-remover',
    baseTool: 'bg-remover',
    title: 'Free Image Background Remover | HD & Fast',
    description: 'Remove backgrounds from images instantly for free. 100% automatic, high quality, no signup required.',
    h1: 'Free Background Remover',
    intro: 'Create perfect transparent backgrounds in seconds using local AI. Your images never leave your device.',
    features: ['100% Local Privacy', 'Perfect Edges', 'Instant Processing'],
    howTo: [
      { step: "1", title: "Upload Image", desc: "Select any photo." },
      { step: "2", title: "Auto-Remove", desc: "Our AI detects the subject." },
      { step: "3", title: "Download PNG", desc: "Save the transparent image." }
    ],
    faqs: [{ q: "Is it private?", a: "Yes, processing happens directly in your browser." }]
  },
  {
    slug: 'online-video-editor',
    baseTool: 'video-compressor',
    title: 'Free Online Video Editor & Compressor | Seloice Tools',
    description: 'Edit, compress, and resize your videos entirely in your browser. Fast, private, and free.',
    h1: 'Online Video Editor',
    intro: 'The ultimate browser-based video toolkit. No large downloads, no watermarks, just fast editing.',
    features: ['Compression', 'Resizing', 'Local Processing'],
    howTo: [
      { step: "1", title: "Select Video", desc: "Upload your MP4." },
      { step: "2", title: "Edit", desc: "Compress or resize." },
      { step: "3", title: "Export", desc: "Save the final file." }
    ],
    faqs: [{ q: "Is there a file size limit?", a: "Depends on your device RAM, usually up to 1GB." }]
  },
  {
    slug: 'ai-reel-maker',
    baseTool: 'auto-captions',
    title: 'Free AI Reel Maker | Create Viral Reels Online',
    description: 'Turn long videos into viral Shorts and Reels instantly with our AI Reel Maker.',
    h1: 'Free AI Reel Maker',
    intro: 'The easiest way to generate engaging short-form content. Just upload, add captions, and post.',
    features: ['Auto Captions', 'Fast Export', 'No Watermark'],
    howTo: [
      { step: "1", title: "Upload Clip", desc: "Select your video." },
      { step: "2", title: "Add AI Magic", desc: "Generate captions and resize." },
      { step: "3", title: "Publish", desc: "Download and post." }
    ],
    faqs: [{ q: "Can I use this for TikTok?", a: "Yes, the format is perfect for TikTok, Reels, and Shorts." }]
  },
  {
    slug: 'shorts-editing-tools',
    baseTool: 'reel-fitter',
    title: 'Best YouTube Shorts Editing Tools | Free Suite',
    description: 'The ultimate suite of free editing tools for YouTube Shorts creators. Compress, resize, and add captions.',
    h1: 'YouTube Shorts Editing Tools',
    intro: 'Everything you need to create viral YouTube Shorts in one place.',
    features: ['All-in-One Suite', '100% Free', 'Browser Based'],
    howTo: [
      { step: "1", title: "Pick a Tool", desc: "Choose from captions, compression, or resizing." },
      { step: "2", title: "Process", desc: "Edit your Short." },
      { step: "3", title: "Download", desc: "Save your final video." }
    ],
    faqs: [{ q: "Do I need to create an account?", a: "No, all tools are free to use instantly." }]
  },
  {
    slug: 'tiktok-video-downloader',
    baseTool: 'reel-downloader',
    title: 'TikTok Video Downloader | No Watermark & Free',
    description: 'Download TikTok videos without the watermark in HD for free. Fast and secure.',
    h1: 'TikTok Video Downloader Without Watermark',
    intro: 'Save your favorite TikToks in original high quality without the annoying logo overlay.',
    features: ['No Watermark', 'HD Quality', 'Instant Download'],
    howTo: [
      { step: "1", title: "Copy Link", desc: "Copy the TikTok video URL." },
      { step: "2", title: "Paste", desc: "Paste it into the downloader." },
      { step: "3", title: "Save", desc: "Download the clean video." }
    ],
    faqs: [{ q: "Does it work on mobile?", a: "Yes, it works perfectly on iOS Safari and Android Chrome." }]
  },
  {
    slug: 'social-media-tools',
    baseTool: 'viral-hooks',
    title: '22+ Free Social Media Tools for Creators | Seloice',
    description: 'The ultimate suite of free social media tools. Downloaders, AI generators, compressors and more.',
    h1: 'Ultimate Social Media Tools Suite',
    intro: 'Stop paying for dozens of expensive subscriptions. We offer 22+ premium creator tools entirely for free.',
    features: ['22+ Tools', 'Zero Cost', 'Secure Processing'],
    howTo: [
      { step: "1", title: "Browse", desc: "Explore our collection of tools." },
      { step: "2", title: "Select", desc: "Pick the tool you need right now." },
      { step: "3", title: "Create", desc: "Use it for free, forever." }
    ],
    faqs: [{ q: "Why are they all free?", a: "We believe in empowering creators without paywalls." }]
  }
];

newPages.forEach(p => {
  if (!seoPages.find(existing => existing.slug === p.slug)) {
    seoPages.push(p);
  }
});

fs.writeFileSync(seoPath, JSON.stringify(seoPages, null, 2));
console.log('Added 10 new programmatic SEO pages.');
