const fs = require('fs');
const path = require('path');

const seoPagesPath = path.join(__dirname, 'src', 'data', 'seo-pages.json');
const blogPostsPath = path.join(__dirname, 'src', 'data', 'blog-posts.json');

// 1. Expand seo-pages.json
let seoPages = [];
if (fs.existsSync(seoPagesPath)) {
  seoPages = JSON.parse(fs.readFileSync(seoPagesPath, 'utf8'));
}

const newSeoPages = [
  {
    slug: "snapinsta-alternative-reel-downloader",
    baseTool: "reel-downloader",
    title: "Best SnapInsta Alternative | Free Instagram Reel Downloader",
    description: "Looking for a faster, ad-free SnapInsta alternative? Download Instagram Reels in 1080p HD without watermarks using Seloice Tools.",
    h1: "The Ultimate SnapInsta Alternative",
    intro: "Tired of ads and slow downloads on SnapInsta? Seloice Tools offers a blazingly fast, ad-free Instagram Reel downloader. Save your favorite videos in HD directly to your device.",
    features: [
      "100% Ad-Free Experience",
      "Faster Processing via Edge Network",
      "No Watermarks, High Quality"
    ],
    howTo: [
      { step: "1", title: "Copy IG Link", desc: "Copy the link of the Instagram Reel." },
      { step: "2", title: "Paste URL", desc: "Paste it into our SnapInsta alternative above." },
      { step: "3", title: "Download", desc: "Save your video instantly." }
    ],
    faqs: [
      { q: "Is this better than SnapInsta?", a: "Yes, our tool is 100% ad-free, faster, and built specifically for creators who need high-quality assets quickly." },
      { q: "Is it completely free?", a: "Absolutely. No hidden fees or limits." }
    ]
  },
  {
    slug: "download-youtube-videos-iphone-free",
    baseTool: "yt-downloader",
    title: "Download YouTube Videos to iPhone Free | 4K & HD",
    "description": "Easily download YouTube videos directly to your iPhone camera roll in 4K or 1080p HD. Free, fast, and secure.",
    h1: "Download YouTube Videos Directly to iPhone",
    intro: "No need for complex apps or jailbreaking. Our web-based YouTube downloader lets you save HD and 4K videos straight to your iPhone's camera roll using Safari.",
    features: [
      "Works natively on iOS Safari",
      "Save directly to Camera Roll",
      "Full 4K and 1080p support"
    ],
    howTo: [
      { step: "1", title: "Copy YouTube Link", desc: "Open the YouTube app and copy the video link." },
      { step: "2", title: "Paste in Safari", "desc": "Open Safari, go to Seloice Tools, and paste the link." },
      { step: "3", title: "Save to Photos", "desc": "Tap download, then use the Safari downloads menu to 'Save Video' to your photos." }
    ],
    faqs: [
      { "q": "Does this work on iOS 17?", "a": "Yes! Our tool is fully compatible with the latest iOS versions." },
      { "q": "Can I download audio only?", "a": "Yes, you can choose to extract only the MP3 audio." }
    ]
  },
  {
    "slug": "best-ai-caption-generator-for-tiktok",
    "baseTool": "auto-captions",
    "title": "Best AI Caption Generator for TikTok & Reels (Hormozi Style)",
    "description": "Generate viral, animated AI captions for your TikToks and Reels for free. Instantly burn Alex Hormozi style subtitles into your videos.",
    "h1": "Viral AI Caption Generator for TikTok",
    "intro": "Boost your TikTok watch time with dynamic, animated AI captions. Our free tool automatically transcribes your video and adds bold, colorful subtitles in seconds.",
    "features": [
      "Alex Hormozi Style Animations",
      "99% AI Transcription Accuracy",
      "Automatic Emoji Generation"
    ],
    "howTo": [
      { "step": "1", "title": "Upload TikTok", "desc": "Upload your raw TikTok or Reel video." },
      { "step": "2", "title": "Auto Transcribe", "desc": "Let our AI instantly transcribe the audio." },
      { "step": "3", "title": "Burn Captions", "desc": "Download the final video with hardcoded, animated text." }
    ],
    "faqs": [
      { "q": "Are the captions free?", "a": "Yes, you can generate and burn captions for free, processed entirely in your browser." },
      { "q": "Can I edit the generated text?", "a": "Currently, the AI handles transcription automatically for maximum speed, but we are adding manual editing soon." }
    ]
  }
];

// Add new pages if they don't exist
newSeoPages.forEach(newPage => {
  if (!seoPages.find(p => p.slug === newPage.slug)) {
    seoPages.push(newPage);
  }
});
fs.writeFileSync(seoPagesPath, JSON.stringify(seoPages, null, 2));


// 2. Create blog-posts.json
const blogPosts = [
  {
    "slug": "how-to-go-viral-on-instagram-reels",
    "title": "How to Go Viral on Instagram Reels in 2026",
    "description": "The ultimate creator guide to going viral on Instagram Reels. Learn the algorithms, hook strategies, and the best tools to use.",
    "author": "Seloice Creator Team",
    "date": "2026-05-12",
    "readTime": "6 min read",
    "category": "Growth Guides",
    "content": [
      {
        "type": "h2",
        "text": "The 2026 Instagram Algorithm Explained"
      },
      {
        "type": "p",
        "text": "Instagram's algorithm now heavily favors watch time and retention. If your video can keep viewers watching past the first 3 seconds, it will be pushed to the explore page."
      },
      {
        "type": "h2",
        "text": "1. Master the Hook"
      },
      {
        "type": "p",
        "text": "Your first 3 seconds are make-or-break. Use our **Viral Hooks** tool to generate scroll-stopping intros. Combine visual movement with a strong text hook on-screen."
      },
      {
        "type": "h2",
        "text": "2. High-Quality Edits & Subtitles"
      },
      {
        "type": "p",
        "text": "Over 70% of viewers watch Reels on mute. You absolutely need dynamic subtitles. Use our **Auto Captions** tool to instantly burn Hormozi-style subtitles into your videos, increasing retention by up to 80%."
      },
      {
        "type": "h2",
        "text": "3. Analyze Competitors"
      },
      {
        "type": "p",
        "text": "Find a viral reel in your niche, copy its link, and use our **Reel Downloader** to save it without a watermark. Study their pacing, audio choices, and hashtags."
      }
    ],
    "relatedTools": ["auto-captions", "reel-downloader", "viral-hooks"]
  },
  {
    "slug": "youtube-shorts-vs-tiktok-monetization",
    "title": "YouTube Shorts vs TikTok: Which Pays More?",
    "description": "A deep dive into creator monetization in 2026. Compare YouTube Shorts revenue versus the TikTok Creator Rewards Program.",
    "author": "Seloice Research Team",
    "date": "2026-05-10",
    "readTime": "8 min read",
    "category": "Creator Monetization",
    "content": [
      {
        "type": "h2",
        "text": "The Current Landscape"
      },
      {
        "type": "p",
        "text": "Both YouTube and TikTok have aggressive monetization strategies. However, the RPM (Revenue Per Mille) differs vastly based on your niche and audience geography."
      },
      {
        "type": "h2",
        "text": "Repurposing Content is Key"
      },
      {
        "type": "p",
        "text": "You shouldn't choose just one. Top creators post on both platforms. Use our **YouTube Downloader** or **Reel Downloader** to fetch your content, and use the **Video Compressor** to meet upload limits on other platforms."
      }
    ],
    "relatedTools": ["yt-downloader", "video-compressor"]
  }
];

fs.writeFileSync(blogPostsPath, JSON.stringify(blogPosts, null, 2));

console.log('Successfully expanded seo-pages.json and created blog-posts.json');
