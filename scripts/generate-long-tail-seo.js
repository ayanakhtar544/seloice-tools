const fs = require('fs');
const path = require('path');

// Programmatic SEO - Long Tail Generator
// Capable of generating 100,000+ targeted keywords for creator tools.

const PLATFORMS = [
  "YouTube", "YouTube Shorts", "Instagram", "Instagram Reels", "TikTok",
  "Twitter/X", "Facebook", "LinkedIn", "Pinterest", "Snapchat", "Twitch",
  "Podcast", "Marketing", "Design", "Photography", "Audio", "Video", "All Platforms"
];

const ACTIONS = [
  { action: "Editor", slug: "editor" },
  { action: "Downloader", slug: "downloader" },
  { action: "Converter", slug: "converter" },
  { action: "Compressor", slug: "compressor" },
  { action: "Generator", slug: "generator" },
  { action: "Extractor", slug: "extractor" },
  { action: "Resizer", slug: "resizer" },
  { action: "Remover", slug: "remover" },
  { action: "Maker", slug: "maker" }
];

const MODIFIERS = [
  "Free", "Online", "No Watermark", "HD", "4K", "Fast", "AI", "Without Login", "High Quality"
];

// Map actions to primary tools
const TOOL_MAP = {
  "editor": "video-editor",
  "downloader": "yt-downloader",
  "converter": "file-converter",
  "compressor": "video-compressor",
  "generator": "yt-title-generator",
  "extractor": "thumbnail-extractor",
  "resizer": "reel-fitter",
  "remover": "bg-remover",
  "maker": "grid-maker"
};

function generateCombinations(limit = 1000) {
  const results = [];
  let count = 0;

  // We loop through combinations and create robust use-cases
  for (const platform of PLATFORMS) {
    for (const act of ACTIONS) {
      for (const mod1 of MODIFIERS) {
        for (const mod2 of MODIFIERS) {
          if (mod1 === mod2) continue;
          
          if (count >= limit) break;

          const h1 = `${mod1} ${platform} ${act.action} ${mod2}`;
          const title = `${h1} (2026) | Seloice Tools`;
          const slug = `${platform.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${act.slug}-${mod1.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${mod2.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
          const description = `The best ${mod1.toLowerCase()} ${platform} ${act.action.toLowerCase()} ${mod2.toLowerCase()}. Browser-based, no watermark on core exports. Built for creators.`;

          const primaryTool = TOOL_MAP[act.slug] || "video-editor";

          results.push({
            slug,
            title,
            description,
            h1,
            platform,
            primaryTool,
            relatedTools: ["video-compressor", "auto-captions", "viral-hooks"],
            faqs: [
              {
                question: `Is this ${platform} ${act.action.toLowerCase()} really free?`,
                answer: "Yes. Seloice tools are completely free for creators with no hidden fees or watermarks on standard exports."
              },
              {
                question: "Does it work on mobile?",
                answer: "Yes. It's fully browser-based and optimized for Safari and Chrome on both iOS and Android."
              }
            ]
          });

          count++;
        }
      }
    }
  }

  return results;
}

const outPath = path.join(__dirname, '..', 'src', 'data', 'use-cases-generated.json');
const data = generateCombinations(5000); // Generate 5k as a test, can be scaled to 100k
fs.writeFileSync(outPath, JSON.stringify(data, null, 2));

console.log(`Successfully generated ${data.length} programmatic SEO pages.`);
console.log(`Saved to ${outPath}`);
