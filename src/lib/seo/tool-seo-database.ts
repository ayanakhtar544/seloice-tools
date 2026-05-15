import type { ToolRecord, ToolCategory } from './tools-registry';

/** Enterprise SEO extensions merged into every tool record */
export interface ToolSEOExtension {
  seoTitle: string;
  h1: string;
  metaDescription: string;
  primaryKeyword: string;
  semanticKeywords: string[];
  useCases: { title: string; desc: string }[];
  comparisonNote: string;
  featuredSnippet: string;
  wasmHeavy?: boolean;
  videoTool?: boolean;
  discoverTitle?: string;
}

type ToolSEOInput = ToolSEOExtension & {
  slug: string;
  name: string;
  shortTitle: string;
  category: ToolCategory;
  tagline: string;
  description: string;
  relatedSlugs: string[];
  features: string[];
  howToSteps: { title: string; desc: string }[];
  faqs: { question: string; answer: string }[];
  benefits: string[];
  creatorTips: string[];
  troubleshooting: { issue: string; fix: string }[];
};

function t(input: ToolSEOInput): ToolSEOInput {
  return input;
}

export const TOOL_SEO_DATABASE: ToolSEOInput[] = [
  t({
    slug: 'yt-downloader',
    name: 'YouTube Video Downloader',
    shortTitle: 'YouTube Downloader',
    category: 'Download',
    tagline: 'Download YouTube videos in HD or MP3',
    description:
      'Save YouTube videos, Shorts, and music as MP4 or MP3 in your browser. Free HD downloader with no signup — works on iPhone, Android, and desktop.',
    seoTitle: 'YouTube Downloader — Free MP4 & MP3 (2026) | Seloice',
    h1: 'Free YouTube Video Downloader',
    metaDescription:
      'Download YouTube videos in 1080p, 4K, or MP3 free. No signup, no watermark. Paste URL → save MP4 instantly on mobile or PC.',
    primaryKeyword: 'youtube downloader',
    semanticKeywords: ['download youtube video', 'yt to mp4', 'youtube to mp3', 'youtube shorts downloader', 'save youtube video'],
    relatedSlugs: ['thumbnail-extractor', 'mp4-to-mp3', 'yt-tag-extractor', 'video-compressor'],
    features: ['1080p & 4K MP4', 'MP3 audio extraction', 'YouTube Shorts support', 'No account required'],
    howToSteps: [
      { title: 'Copy video URL', desc: 'Open YouTube, tap Share → Copy link on any public video or Short.' },
      { title: 'Paste & analyze', desc: 'Paste the link into Seloice and wait for available formats.' },
      { title: 'Save file', desc: 'Choose MP4 quality or MP3 and download to your device.' },
    ],
    faqs: [
      { question: 'How do I download a YouTube video on mobile?', answer: 'Open this page in Safari or Chrome, paste the video URL, select quality, and tap download. Files save to your gallery or Downloads folder.' },
      { question: 'Can I download YouTube videos as MP3?', answer: 'Yes. After pasting the URL, choose an audio/MP3 format to extract music or podcasts.' },
      { question: 'Is this YouTube downloader free?', answer: 'Yes — 100% free for personal use with no watermarks on saved files.' },
      { question: 'Do you store my videos?', answer: 'No. We fetch public metadata and stream; we do not host your downloads long-term.' },
    ],
    benefits: ['No software install', 'Works on mobile', 'Multiple quality options', 'Fast link processing'],
    creatorTips: ['Download in 1080p for editing; compress later with our Video Compressor.', 'Pair with YT Tag Extractor to research competitor SEO before uploading.', 'Always respect copyright — only download content you own or have rights to use.'],
    troubleshooting: [
      { issue: 'Video not found', fix: 'Ensure the video is public and the URL is correct. Private or age-restricted videos may fail.' },
      { issue: 'Download does not start', fix: 'Allow pop-ups/downloads in browser settings or use the force-download proxy link.' },
      { issue: 'Slow fetch', fix: 'Try again on stable Wi-Fi; peak times may slow API responses.' },
    ],
    useCases: [
      { title: 'Content repurposing', desc: 'Save clips for fair-use commentary, edits, or offline review.' },
      { title: 'Music & podcasts', desc: 'Extract MP3 audio tracks for personal listening.' },
      { title: 'Thumbnail research', desc: 'Combine with Thumbnail Extractor to study viral packaging.' },
    ],
    comparisonNote: 'Unlike desktop apps, Seloice runs in your browser — no install, no account, instant access on any device.',
    featuredSnippet: 'To download a YouTube video free: copy the video URL, paste it into a YouTube downloader, choose MP4 or MP3 quality, and save the file to your device.',
  }),
  t({
    slug: 'reel-downloader',
    name: 'Instagram Reel Downloader',
    shortTitle: 'Reel Downloader',
    category: 'Download',
    tagline: 'Save Instagram Reels in HD',
    description:
      'Download public Instagram Reels in HD MP4 without watermark. Paste a reel link — no login, no app install. Works on iPhone and Android browsers.',
    seoTitle: 'Instagram Reel Downloader — HD, No Watermark (2026)',
    h1: 'Instagram Reel Downloader — Save Reels Free',
    metaDescription:
      'Download Instagram Reels in HD with no watermark. Paste reel link, save MP4 instantly. Free — no IG login required.',
    primaryKeyword: 'instagram reel downloader',
    semanticKeywords: ['download instagram reel', 'ig reel saver', 'save reel without watermark', 'reel to mp4'],
    relatedSlugs: ['reel-fitter', 'hashtag-extractor', 'auto-captions', 'video-compressor'],
    features: ['HD MP4 export', 'No Instagram login', 'Public Reels only', 'Mobile-friendly UI'],
    howToSteps: [
      { title: 'Copy Reel link', desc: 'In Instagram, open a Reel → Share → Copy link.' },
      { title: 'Paste URL', desc: 'Paste into Seloice and tap fetch to load video options.' },
      { title: 'Download MP4', desc: 'Save the reel to your camera roll or downloads.' },
    ],
    faqs: [
      { question: 'How to download Instagram Reels without watermark?', answer: 'Paste a public Reel URL here. If the source has no platform watermark, you get a clean HD MP4.' },
      { question: 'Do I need to log into Instagram?', answer: 'No login required for public Reels accessible via link.' },
      { question: 'Can I download private Reels?', answer: 'No — only public content available via share link is supported.' },
      { question: 'Is this legal?', answer: 'Download only content you created or have permission to use. Respect creators\' rights.' },
    ],
    benefits: ['No app install', 'HD quality', 'Fast on mobile', 'Free forever'],
    creatorTips: ['Save competitor Reels for frame-by-frame study (don\'t repost without rights).', 'Compress large reels before re-uploading with Video Compressor.', 'Extract hashtags from the same post with Hashtag Extractor.'],
    troubleshooting: [
      { issue: 'Reel not loading', fix: 'Confirm the account is public and the link is fresh from Share → Copy link.' },
      { issue: 'CORS download error', fix: 'Use the built-in download button which routes through our safe proxy.' },
      { issue: 'Low quality file', fix: 'Select the highest quality option when multiple formats appear.' },
    ],
    useCases: [
      { title: 'Inspiration library', desc: 'Archive Reel references for editing style and pacing.' },
      { title: 'Client deliverables', desc: 'Save drafts shared via link for review offline.' },
      { title: 'Cross-posting prep', desc: 'Download, resize with Reel Fitter, add captions.' },
    ],
    comparisonNote: 'Faster than screen recording — get true MP4 quality without quality loss from capture.',
    featuredSnippet: 'To save an Instagram Reel: copy the reel link from Share, paste it into a reel downloader, and download the MP4 file in HD.',
  }),
  t({
    slug: 'video-compressor',
    name: 'Video Compressor',
    shortTitle: 'Video Compressor',
    category: 'Video',
    tagline: 'Compress MP4 without losing quality',
    description:
      'Reduce MP4 file size up to 80% in your browser with FFmpeg WebAssembly. Private local processing — files never leave your device. Perfect for WhatsApp, Discord, and email.',
    seoTitle: 'Video Compressor Online — Reduce MP4 Size Free (2026)',
    h1: 'Free Online Video Compressor',
    metaDescription:
      'Compress MP4 videos online free — up to 80% smaller files, private browser processing. No upload to servers. Perfect for WhatsApp & Reels.',
    primaryKeyword: 'video compressor online',
    semanticKeywords: ['compress mp4', 'reduce video file size', 'video compressor free', 'shrink video for whatsapp'],
    relatedSlugs: ['reel-fitter', 'watermark-adder', 'mp4-to-mp3', 'yt-downloader'],
    features: ['Local WASM processing', 'Quality presets', 'Progress indicator', 'No server upload'],
    howToSteps: [
      { title: 'Upload MP4', desc: 'Select a video file from your phone or computer.' },
      { title: 'Choose compression', desc: 'Pick target quality or size reduction level.' },
      { title: 'Export', desc: 'Download the compressed file when processing completes.' },
    ],
    faqs: [
      { question: 'How much can I compress a video?', answer: 'Most users achieve 50–80% size reduction depending on source quality and settings.' },
      { question: 'Is my video uploaded?', answer: 'No — compression runs locally via WebAssembly in your browser.' },
      { question: 'What is the max file size?', answer: 'Depends on device RAM; most phones handle several hundred MB, desktops handle 1GB+.' },
      { question: 'Will quality drop visibly?', answer: 'Smart presets balance size and clarity; use higher quality if you notice artifacts.' },
    ],
    benefits: ['100% private', 'No watermark', 'Free unlimited use', 'Mobile supported'],
    creatorTips: ['Compress before uploading to Instagram if you hit file size limits.', 'Keep an uncompressed master for YouTube, compressed copy for Stories.', 'Close other tabs — WASM uses significant RAM on mobile.'],
    troubleshooting: [
      { issue: 'FFmpeg failed to load', fix: 'Refresh page, use Chrome/Safari latest, disable strict extensions blocking WASM.' },
      { issue: 'Process stuck at 0%', fix: 'Try a smaller clip first; very large files may timeout on low-RAM devices.' },
      { issue: 'Output won\'t play', fix: 'Re-export with a different preset or ensure source MP4 isn\'t corrupted.' },
    ],
    useCases: [
      { title: 'WhatsApp sharing', desc: 'Shrink videos under 16MB limit.' },
      { title: 'Faster uploads', desc: 'Upload Reels and Shorts quicker with smaller files.' },
      { title: 'Email attachments', desc: 'Send client previews without cloud links.' },
    ],
    comparisonNote: 'Unlike cloud compressors, Seloice processes on-device — your footage stays private.',
    featuredSnippet: 'To compress a video online: upload your MP4, choose a compression level, wait for browser processing, and download the smaller file.',
    wasmHeavy: true,
    videoTool: true,
  }),
  t({
    slug: 'video-editor',
    name: 'Online Video Editor',
    shortTitle: 'Video Editor',
    category: 'Studio',
    tagline: 'Edit videos in your browser',
    description:
      'Free browser video editor with multi-track timeline, trim, captions, and 1080p export. No watermark, no cloud upload — private WebAssembly rendering for creators.',
    seoTitle: 'Free Online Video Editor — No Watermark (2026) | Seloice',
    h1: 'Free Online Video Editor for Creators',
    metaDescription:
      'Edit videos online free — timeline, trim, captions, 1080p export. No watermark, browser-based, private WASM processing.',
    primaryKeyword: 'online video editor free',
    semanticKeywords: ['video editor browser', 'edit video online no watermark', 'shorts editor', 'reel editor online'],
    relatedSlugs: ['auto-captions', 'video-compressor', 'watermark-adder', 'reel-fitter'],
    features: ['Multi-track timeline', 'Trim & split', 'Caption burn-in', '1080p local export'],
    howToSteps: [
      { title: 'Import clips', desc: 'Add video, audio, and image assets to the timeline.' },
      { title: 'Edit & caption', desc: 'Trim, arrange layers, and add text or auto captions.' },
      { title: 'Export MP4', desc: 'Render the final video locally — no watermark.' },
    ],
    faqs: [
      { question: 'Is this video editor really free?', answer: 'Yes — core editing and export are free with no watermark.' },
      { question: 'Do files upload to your servers?', answer: 'No — editing and export run in your browser via WASM.' },
      { question: 'Can I edit vertical Reels?', answer: 'Yes — use 9:16 project settings for TikTok, Reels, and Shorts.' },
      { question: 'What export quality is supported?', answer: 'Up to 1080p HD depending on source footage and device power.' },
    ],
    benefits: ['No install', 'No watermark', 'Privacy-first', 'Creator-focused timeline'],
    creatorTips: ['Edit Shorts in under 5 minutes: import → trim hook → add captions → export.', 'Export master file, then compress with Video Compressor for mobile upload.', 'Use Viral Hooks generator before filming to script your opener.'],
    troubleshooting: [
      { issue: 'Timeline laggy', fix: 'Use shorter proxy clips, close other tabs, prefer desktop for long projects.' },
      { issue: 'Export failed', fix: 'Reduce timeline length or resolution; ensure sufficient free disk/RAM.' },
      { issue: 'Audio out of sync', fix: 'Re-import clip or split at scene cuts and re-align.' },
    ],
    useCases: [
      { title: 'YouTube Shorts', desc: 'Fast vertical edits with captions.' },
      { title: 'Instagram Reels', desc: '9:16 timeline with brand overlays.' },
      { title: 'TikTok clips', desc: 'Hook-first edits with kinetic text.' },
    ],
    comparisonNote: 'Lighter than installing Premiere — instant access, private local export, built for short-form creators.',
    featuredSnippet: 'To edit a video online free: upload clips to a browser editor, trim on the timeline, add captions, and export MP4 without watermark.',
    wasmHeavy: true,
    videoTool: true,
  }),
  t({
    slug: 'auto-captions',
    name: 'Auto Captions Generator',
    shortTitle: 'Auto Captions',
    category: 'AI',
    tagline: 'Burn viral captions into video',
    description:
      'Generate animated Hormozi-style captions for TikTok, Reels, and YouTube Shorts. Auto-sync speech to text, customize fonts and colors, export with burned-in subtitles.',
    seoTitle: 'Auto Caption Generator — Viral Subtitles Free (2026)',
    h1: 'Auto Caption Generator for Reels & Shorts',
    metaDescription:
      'Free auto caption generator — kinetic subtitles for TikTok, Reels & Shorts. Hormozi style, custom fonts, no watermark.',
    primaryKeyword: 'auto caption generator',
    semanticKeywords: ['burn captions on video', 'subtitle generator free', 'hormozi captions', 'tiktok captions'],
    relatedSlugs: ['speech-to-text', 'mp4-to-text', 'viral-hooks', 'video-editor'],
    features: ['Auto speech sync', 'Kinetic text styles', 'Custom colors & fonts', 'SRT + burned export'],
    howToSteps: [
      { title: 'Upload video', desc: 'Add your MP4 — vertical or horizontal.' },
      { title: 'Generate captions', desc: 'AI transcribes and times each word.' },
      { title: 'Style & export', desc: 'Pick animation style and download captioned video.' },
    ],
    faqs: [
      { question: 'What are Hormozi-style captions?', answer: 'Bold, word-by-word highlighted subtitles proven to increase watch time on short-form video.' },
      { question: 'Can I edit caption text?', answer: 'Yes — fix names, slang, and timing before export.' },
      { question: 'Does it work for TikTok?', answer: 'Yes — export 9:16 captioned MP4 ready for TikTok upload.' },
      { question: 'Is transcription accurate?', answer: 'High accuracy for clear English audio; noisy environments may need manual fixes.' },
    ],
    benefits: ['Higher retention', 'Accessible content', 'Faster than manual subs', 'Trending visual style'],
    creatorTips: ['First 3 seconds need a visual hook AND bold caption — combine with Viral Hooks tool.', 'Use high contrast colors (yellow on black) for mobile readability.', 'Export SRT for YouTube long-form, burned-in for Shorts.'],
    troubleshooting: [
      { issue: 'Wrong words transcribed', fix: 'Manually edit transcript; use cleaner audio source or external mic.' },
      { issue: 'Timing off', fix: 'Adjust word timestamps in editor before burn-in export.' },
      { issue: 'Export slow', fix: 'Shorter clips process faster; close background apps on mobile.' },
    ],
    useCases: [
      { title: 'Talking-head Shorts', desc: 'Auto-caption educational and opinion content.' },
      { title: 'Podcast clips', desc: 'Repurpose audio highlights with dynamic text.' },
      { title: 'Global audience', desc: 'Improve comprehension without voiceover dubs.' },
    ],
    comparisonNote: 'Faster than CapCut manual captions — batch-ready styles built for viral short-form.',
    featuredSnippet: 'To add auto captions: upload your video, run AI transcription, choose a kinetic caption style, and export with burned-in subtitles.',
    wasmHeavy: true,
    videoTool: true,
  }),
  t({
    slug: 'bg-remover',
    name: 'Background Remover',
    shortTitle: 'Background Remover',
    category: 'AI',
    tagline: 'Remove image backgrounds instantly',
    description:
      'AI background remover with hair-level edge detection. Upload JPG or PNG, get transparent PNG in seconds. Runs in browser — private, free, no signup.',
    seoTitle: 'Background Remover — Free Transparent PNG (2026)',
    h1: 'Free AI Background Remover',
    metaDescription:
      'Remove image backgrounds free — AI cutout, transparent PNG, hair-level edges. Browser-based, private, instant download.',
    primaryKeyword: 'background remover free',
    semanticKeywords: ['remove bg online', 'transparent png maker', 'ai background eraser', 'cut out image'],
    relatedSlugs: ['photo-editor', 'image-converter', 'watermark-adder', 'grid-maker'],
    features: ['AI subject detection', 'Hair & edge precision', 'PNG transparency', 'Local processing'],
    howToSteps: [
      { title: 'Upload image', desc: 'JPG or PNG with clear subject.' },
      { title: 'AI processing', desc: 'Model isolates foreground from background.' },
      { title: 'Download PNG', desc: 'Save transparent file for designs.' },
    ],
    faqs: [
      { question: 'What image formats work?', answer: 'JPG and PNG up to 25MB; PNG preserves best quality for cutouts.' },
      { question: 'Is it free for commercial use?', answer: 'Free to use; ensure you have rights to the source image for commercial projects.' },
      { question: 'Does it work on product photos?', answer: 'Excellent on products, people, and logos with good contrast.' },
      { question: 'Are images uploaded to servers?', answer: 'Processing runs in your browser — images stay on your device.' },
    ],
    benefits: ['No Photoshop needed', 'Instant cutouts', 'E-commerce ready', 'Private'],
    creatorTips: ['Shoot on plain backgrounds for fastest, cleanest cutouts.', 'Combine with Photo Editor for shadows and color grades.', 'Use PNG for thumbnails with custom backdrops.'],
    troubleshooting: [
      { issue: 'Jagged edges', fix: 'Use higher resolution source; avoid busy backgrounds behind hair.' },
      { issue: 'Model slow to load', fix: 'First visit downloads AI weights — wait for load on good connection.' },
      { issue: 'Subject partially erased', fix: 'Retry with higher contrast image or touch up in Photo Editor.' },
    ],
    useCases: [
      { title: 'YouTube thumbnails', desc: 'Cut out face/product for composite thumbs.' },
      { title: 'Shop listings', desc: 'White-background product images from any shot.' },
      { title: 'Profile photos', desc: 'Clean PNG avatars for social platforms.' },
    ],
    comparisonNote: 'No subscription like remove.bg — free, in-browser, unlimited personal use.',
    featuredSnippet: 'To remove a background free: upload your image to an AI background remover, wait for processing, and download a transparent PNG.',
    wasmHeavy: true,
  }),
  t({
    slug: 'viral-hooks',
    name: 'Viral Hooks Generator',
    shortTitle: 'Viral Hooks',
    category: 'AI',
    tagline: 'AI scroll-stopping video hooks',
    description:
      'Generate psychology-backed 3-second video hooks for TikTok, Reels, and Shorts. AI writes openers that boost retention — copy, film, and test instantly.',
    seoTitle: 'Viral Hook Generator — TikTok & Reels Openers (2026)',
    h1: 'Viral Hook Generator for Short-Form Video',
    metaDescription:
      'Free viral hook generator — AI intros for TikTok, Reels & YouTube Shorts. Stop the scroll, boost watch time. Copy in one click.',
    primaryKeyword: 'viral hook generator',
    semanticKeywords: ['tiktok hook ideas', 'video intro lines', 'shorts opener generator', 'scroll stopper hooks'],
    relatedSlugs: ['yt-title-generator', 'tweet-generator', 'hashtag-generator', 'auto-captions'],
    features: ['Niche-specific output', '10+ variations per run', 'Psychology triggers', 'One-click copy'],
    howToSteps: [
      { title: 'Enter topic', desc: 'Describe your video niche and audience.' },
      { title: 'Generate', desc: 'AI produces multiple hook variations.' },
      { title: 'Film & test', desc: 'Record the best hook and A/B test on posts.' },
    ],
    faqs: [
      { question: 'What makes a viral hook?', answer: 'Curiosity gaps, bold claims, pattern interrupts, and direct audience callouts in the first 3 seconds.' },
      { question: 'Can I use hooks for YouTube Shorts?', answer: 'Yes — hooks work across Shorts, Reels, and TikTok.' },
      { question: 'Are outputs unique?', answer: 'Each generation creates fresh lines based on your prompt.' },
      { question: 'Is it free?', answer: 'Yes — unlimited generations for creators.' },
    ],
    benefits: ['Higher retention', 'Faster scripting', 'More A/B tests', 'Platform-agnostic'],
    creatorTips: ['Film 3 hook variants per video — post the winner as a follow-up.', 'Match hook energy to caption style from Auto Captions.', 'Pair with YT Title Generator for packaging consistency.'],
    troubleshooting: [
      { issue: 'Hooks feel generic', fix: 'Add specific niche, audience pain point, and outcome to your prompt.' },
      { issue: 'API error', fix: 'Retry in a moment; check connection and avoid empty prompts.' },
      { issue: 'Too long for 3 seconds', fix: 'Trim to under 12 words for spoken delivery at normal pace.' },
    ],
    useCases: [
      { title: 'Educational Shorts', desc: 'Open with a surprising stat or myth-bust.' },
      { title: 'Storytime Reels', desc: 'Start mid-action — "I almost quit YouTube when…"' },
      { title: 'Product demos', desc: 'Lead with the outcome, not the feature list.' },
    ],
    comparisonNote: 'Specialized for short-form retention — not generic ChatGPT walls of text.',
    featuredSnippet: 'A viral video hook is a 1–3 second opener that creates curiosity. Generate hooks by describing your topic to an AI hook tool, then film the best line first.',
  }),
];

function buildRemainingTools(): ToolSEOInput[] {
  const defs: Array<{
    slug: string;
    name: string;
    shortTitle: string;
    category: ToolCategory;
    primaryKeyword: string;
    seoTitle: string;
    h1: string;
    metaDescription: string;
    tagline: string;
    description: string;
    relatedSlugs: string[];
    wasmHeavy?: boolean;
    videoTool?: boolean;
  }> = [
    { slug: 'photo-editor', name: 'Photo Editor', shortTitle: 'Photo Editor', category: 'Studio', primaryKeyword: 'online photo editor free', seoTitle: 'Free Online Photo Editor — Filters & Crop (2026)', h1: 'Free Online Photo Editor', metaDescription: 'Edit photos online free — filters, curves, crop, layers. Private browser editor, no install.', tagline: 'Pro photo editing in browser', description: 'Edit photos with presets, curves, layers, and export — all private in your browser. No Photoshop subscription needed.', relatedSlugs: ['bg-remover', 'image-converter', 'color-extractor', 'grid-maker'], wasmHeavy: true },
    { slug: 'audio-editor', name: 'Audio Editor', shortTitle: 'Audio Editor', category: 'Studio', primaryKeyword: 'online audio editor', seoTitle: 'Free Audio Editor Online — Trim & EQ (2026)', h1: 'Free Online Audio Editor', metaDescription: 'Edit audio online — trim, EQ, normalize, export MP3/WAV. Waveform editor in browser.', tagline: 'Podcast & music workstation', description: 'Trim podcasts, normalize volume, apply EQ and reverb, export MP3 or WAV — full waveform editor in your browser.', relatedSlugs: ['mp4-to-mp3', 'speech-to-text', 'file-converter', 'video-editor'], wasmHeavy: true },
    { slug: 'smart-captions', name: 'Smart Captions', shortTitle: 'Smart Captions', category: 'AI', primaryKeyword: 'smart captions ai', seoTitle: 'Smart Captions AI — Scene-Aware Subtitles Free', h1: 'Smart AI Captions for Video', metaDescription: 'AI smart captions with scene detection. SRT export for YouTube, TikTok & Reels.', tagline: 'Scene-aware subtitles', description: 'AI captions that understand scene context — auto descriptions, SRT export, multi-language support for accessibility.', relatedSlugs: ['auto-captions', 'mp4-to-text', 'speech-to-text', 'video-editor'], wasmHeavy: true, videoTool: true },
    { slug: 'whatsapp-mockup', name: 'WhatsApp Chat Mockup', shortTitle: 'Chat Mockup', category: 'Social', primaryKeyword: 'whatsapp chat mockup', seoTitle: 'WhatsApp Chat Mockup Generator — Meme & Marketing', h1: 'WhatsApp Chat Mockup Generator', metaDescription: 'Create WhatsApp chat screenshots for memes & marketing mockups. iOS & Android UI. Fiction only.', tagline: 'Realistic chat screenshots', description: 'Design fictional WhatsApp conversations for memes, ads, and story content. iOS and Android styles — not for impersonation.', relatedSlugs: ['tweet-generator', 'grid-maker', 'qr-generator', 'photo-editor'] },
    { slug: 'thumbnail-extractor', name: 'YouTube Thumbnail Downloader', shortTitle: 'Thumbnail Downloader', category: 'YouTube', primaryKeyword: 'youtube thumbnail download', seoTitle: 'YouTube Thumbnail Downloader — HD Cover Free', h1: 'YouTube Thumbnail Downloader', metaDescription: 'Download YouTube thumbnails in max HD resolution. Paste URL, save cover image instantly.', tagline: 'Grab HD thumbnails', description: 'Extract the highest resolution thumbnail from any public YouTube video for research and inspiration.', relatedSlugs: ['yt-downloader', 'yt-tag-extractor', 'photo-editor'] },
    { slug: 'mp4-to-mp3', name: 'MP4 to MP3 Converter', shortTitle: 'MP4 to MP3', category: 'Audio', primaryKeyword: 'mp4 to mp3 converter', seoTitle: 'MP4 to MP3 Converter — Free Online (2026)', h1: 'MP4 to MP3 Converter Free', metaDescription: 'Convert MP4 to MP3 online free — 320kbps, fast, private browser extraction.', tagline: 'Extract audio from video', description: 'Strip high-quality audio from MP4 video files in one click. Local processing, no upload limits on capable devices.', relatedSlugs: ['yt-downloader', 'audio-editor', 'file-converter'], wasmHeavy: true },
    { slug: 'speech-to-text', name: 'Speech to Text', shortTitle: 'Speech to Text', category: 'AI', primaryKeyword: 'speech to text online', seoTitle: 'Speech to Text — Free Audio Transcription (2026)', h1: 'Free Speech to Text Online', metaDescription: 'Transcribe audio to text free — podcasts, interviews, voice memos. Multi-language support.', tagline: 'Accurate transcription', description: 'Upload audio and get accurate transcripts with punctuation. Export for blogs, captions, and scripts.', relatedSlugs: ['mp4-to-text', 'auto-captions', 'audio-editor'], wasmHeavy: true },
    { slug: 'mp4-to-text', name: 'MP4 to Text', shortTitle: 'MP4 to Text', category: 'AI', primaryKeyword: 'mp4 to text', seoTitle: 'MP4 to Text — Video Transcript Generator Free', h1: 'MP4 to Text Transcription', metaDescription: 'Convert MP4 video to text free — AI transcription with timestamps. Extract scripts from video.', tagline: 'Video script extractor', description: 'Extract full transcripts from MP4 files using AI — timestamps, punctuation, speaker-ready output.', relatedSlugs: ['speech-to-text', 'auto-captions', 'video-editor'], wasmHeavy: true, videoTool: true },
    { slug: 'hashtag-generator', name: 'Hashtag Generator', shortTitle: 'Hashtag Generator', category: 'SEO', primaryKeyword: 'hashtag generator', seoTitle: 'Hashtag Generator — Viral IG & TikTok Tags (2026)', h1: 'AI Hashtag Generator', metaDescription: 'Generate viral Instagram & TikTok hashtags free. Niche-targeted, banned-tag filter.', tagline: 'Viral hashtag sets', description: 'AI generates targeted hashtag sets from keywords or images — boost reach on Reels and TikTok.', relatedSlugs: ['hashtag-extractor', 'viral-hooks', 'reel-downloader'] },
    { slug: 'hashtag-extractor', name: 'Hashtag Extractor', shortTitle: 'Hashtag Extractor', category: 'SEO', primaryKeyword: 'hashtag extractor', seoTitle: 'Instagram Hashtag Extractor — Copy Viral Tags', h1: 'Hashtag Extractor for Instagram', metaDescription: 'Extract hashtags from any public post or Reel URL. Copy viral tags in one click.', tagline: 'Find viral hashtags', description: 'Paste a post or Reel link and extract every hashtag used — research competitors and trending tags.', relatedSlugs: ['hashtag-generator', 'reel-downloader', 'yt-tag-extractor'] },
    { slug: 'yt-title-generator', name: 'YouTube Title Generator', shortTitle: 'YT Title Generator', category: 'SEO', primaryKeyword: 'youtube title generator', seoTitle: 'YouTube Title Generator — High CTR Titles (2026)', h1: 'YouTube Title Generator AI', metaDescription: 'AI YouTube title generator — click-worthy, SEO-friendly titles. Boost CTR and views free.', tagline: 'High-CTR titles', description: 'Generate 10+ YouTube title variations optimized for clicks and search — niche-aware AI for creators.', relatedSlugs: ['viral-hooks', 'yt-tag-extractor', 'thumbnail-extractor'] },
    { slug: 'yt-tag-extractor', name: 'YouTube Tag Extractor', shortTitle: 'YT Tag Extractor', category: 'SEO', primaryKeyword: 'youtube tag extractor', seoTitle: 'YouTube Tag Extractor — Steal Competitor Tags Free', h1: 'YouTube Tag Extractor Tool', metaDescription: 'Extract tags from any YouTube video. See competitor SEO keywords and copy in one click.', tagline: 'Competitor tag research', description: 'Analyze viral YouTube videos and extract the exact tags used for ranking — essential SEO research.', relatedSlugs: ['yt-title-generator', 'thumbnail-extractor', 'yt-downloader'] },
    { slug: 'tweet-generator', name: 'Caption & Thread Generator', shortTitle: 'Caption Generator', category: 'AI', primaryKeyword: 'caption generator ai', seoTitle: 'AI Caption Generator — Viral Social Copy (2026)', h1: 'AI Caption & Thread Generator', metaDescription: 'Generate viral Instagram, Twitter & LinkedIn captions free. Hooks, threads, tone control.', tagline: 'Viral social copy', description: 'Turn ideas into engaging captions and Twitter threads with AI — hooks, formatting, and tone selection.', relatedSlugs: ['viral-hooks', 'hashtag-generator', 'whatsapp-mockup'] },
    { slug: 'reel-fitter', name: 'Reel Resizer', shortTitle: 'Reel Fitter', category: 'Video', primaryKeyword: 'reel resizer 9:16', seoTitle: 'Reel Resizer — Fit Video to 9:16 Free (2026)', h1: 'Instagram Reel Resizer 9:16', metaDescription: 'Resize video to 9:16 for Reels & TikTok. Blur background fill, no cropping. Free online.', tagline: 'Perfect vertical fit', description: 'Convert landscape video to 9:16 vertical with blurred background — no awkward cropping for Reels and TikTok.', relatedSlugs: ['video-compressor', 'safe-zone', 'auto-captions'], wasmHeavy: true, videoTool: true },
    { slug: 'safe-zone', name: 'Safe Zone Checker', shortTitle: 'Safe Zone', category: 'Design', primaryKeyword: 'instagram safe zone', seoTitle: 'Safe Zone Checker — TikTok, Reels & Shorts UI', h1: 'Social Media Safe Zone Preview', metaDescription: 'Preview video safe zones for TikTok, Instagram Reels & YouTube Shorts. Avoid UI overlap.', tagline: 'Check UI overlaps', description: 'Overlay platform UI masks on your video to ensure text and faces aren\'t hidden by buttons and captions.', relatedSlugs: ['reel-fitter', 'grid-maker', 'video-editor'] },
    { slug: 'grid-maker', name: 'Instagram Grid Maker', shortTitle: 'Grid Maker', category: 'Design', primaryKeyword: 'instagram grid maker', seoTitle: 'Instagram Grid Maker — Split Panorama Free', h1: 'Instagram Grid Splitter', metaDescription: 'Split images into 3x3 Instagram grid posts. HD quality, zip download, free.', tagline: 'Profile grid splitter', description: 'Slice panoramas into perfect square tiles for Instagram profile grids — 3x1 or 3x3 layouts.', relatedSlugs: ['photo-editor', 'image-converter', 'color-extractor'] },
    { slug: 'image-converter', name: 'Image Converter', shortTitle: 'Image Converter', category: 'Utility', primaryKeyword: 'image converter online', seoTitle: 'Image Converter — WebP, PNG, JPG Free (2026)', h1: 'Free Image Format Converter', metaDescription: 'Convert images to WebP, PNG, JPG online. Batch convert, quality control, private.', tagline: 'WebP, PNG, JPG', description: 'Convert images between formats locally — shrink file size with WebP for faster websites and uploads.', relatedSlugs: ['photo-editor', 'bg-remover', 'file-converter'], wasmHeavy: true },
    { slug: 'file-converter', name: 'File Converter', shortTitle: 'File Converter', category: 'Utility', primaryKeyword: 'file converter online', seoTitle: 'Online File Converter — 100+ Formats Free', h1: 'Universal File Converter', metaDescription: 'Convert audio, video & image formats online. Fast browser-based file converter.', tagline: 'Universal formats', description: 'Convert between popular audio, video, and image formats without desktop software.', relatedSlugs: ['mp4-to-mp3', 'image-converter', 'audio-editor'], wasmHeavy: true },
    { slug: 'color-extractor', name: 'Color Palette Extractor', shortTitle: 'Color Extractor', category: 'Design', primaryKeyword: 'color palette extractor', seoTitle: 'Color Palette Extractor — HEX from Image Free', h1: 'Image Color Palette Extractor', metaDescription: 'Extract dominant colors & HEX codes from any image. Brand palette tool for designers.', tagline: 'Steal color palettes', description: 'Upload an image and get dominant colors with HEX and RGB codes — perfect for brand consistency.', relatedSlugs: ['photo-editor', 'grid-maker', 'image-converter'] },
    { slug: 'qr-generator', name: 'QR Code Generator', shortTitle: 'QR Generator', category: 'Utility', primaryKeyword: 'qr code generator free', seoTitle: 'QR Code Generator — Custom Logo & Colors Free', h1: 'Free QR Code Generator', metaDescription: 'Create custom QR codes with logo & colors. SVG/PNG export for links, Wi-Fi, payments.', tagline: 'Branded QR codes', description: 'Generate branded QR codes for URLs, Wi-Fi, and payments — embed your logo and brand colors.', relatedSlugs: ['image-converter', 'whatsapp-mockup', 'photo-editor'] },
    { slug: 'watermark-adder', name: 'Watermark Adder', shortTitle: 'Watermark Adder', category: 'Video', primaryKeyword: 'add watermark to video', seoTitle: 'Watermark Adder — Logo on Video & Image Free', h1: 'Video & Image Watermark Tool', metaDescription: 'Add logo or text watermark to videos and images. Batch apply, opacity control, free.', tagline: 'Protect your content', description: 'Apply logo or text watermarks to protect your videos and images — opacity and position control.', relatedSlugs: ['video-editor', 'photo-editor', 'video-compressor'], wasmHeavy: true, videoTool: true },
  ];

  return defs.map((d) => {
    const semantic = [d.primaryKeyword, `${d.shortTitle.toLowerCase()} free`, `online ${d.slug.replace(/-/g, ' ')}`, 'seloice tools', `${d.category.toLowerCase()} tool`];
    return t({
      ...d,
      semanticKeywords: semantic,
      features: ['100% free', 'No watermark', 'Mobile-friendly', 'Instant in browser'],
      howToSteps: [
        { title: 'Open the tool', desc: `Go to Seloice ${d.shortTitle} — no account needed.` },
        { title: 'Add input', desc: 'Upload a file or paste a link depending on the tool.' },
        { title: 'Get result', desc: 'Download or copy your output immediately.' },
      ],
      faqs: [
        { question: `Is ${d.shortTitle} free?`, answer: 'Yes — Seloice tools are free for creators with no watermark on exports.' },
        { question: 'Does it work on mobile?', answer: 'Yes — all tools are optimized for iPhone and Android browsers.' },
        { question: 'Are my files private?', answer: 'Browser-based tools process locally when possible; downloaders use secure APIs only to fetch public content.' },
        { question: 'Do I need to sign up?', answer: 'No signup required for standard features.' },
      ],
      benefits: ['Free forever', 'Creator-focused', 'Fast workflow', 'No install'],
      creatorTips: [`Use ${d.shortTitle} early in your editing workflow to save time.`, 'Combine with related Seloice tools linked at the bottom of this page.', 'Bookmark this page for one-click access from mobile.'],
      troubleshooting: [
        { issue: 'Page not loading', fix: 'Hard refresh, disable ad-blockers on seloice.com, try Chrome or Safari.' },
        { issue: 'Slow performance', fix: 'Close unused tabs; WASM tools need free RAM on mobile.' },
        { issue: 'Unexpected error', fix: 'Retry with a smaller file or different browser.' },
      ],
      useCases: [
        { title: 'Content creators', desc: `Streamline ${d.category.toLowerCase()} tasks for daily posting.` },
        { title: 'Small businesses', desc: 'Professional output without expensive software.' },
        { title: 'Students & educators', desc: 'Quick projects and presentations.' },
      ],
      comparisonNote: `Seloice ${d.shortTitle} is free, browser-based, and built specifically for social creators — no bloated desktop software.`,
      featuredSnippet: `To use ${d.name.toLowerCase()}: open the free online tool, add your file or link, and download the result — no install required.`,
    });
  });
}

export const ALL_TOOL_SEO: ToolSEOInput[] = [...TOOL_SEO_DATABASE, ...buildRemainingTools()];

export function getToolSEOBySlug(slug: string): ToolSEOInput | undefined {
  return ALL_TOOL_SEO.find((t) => t.slug === slug);
}
