const fs = require('fs');
const path = require('path');

const seoPath = path.join(__dirname, '../src/data/seo-pages.json');
let seoPages = [];

if (fs.existsSync(seoPath)) {
  seoPages = JSON.parse(fs.readFileSync(seoPath, 'utf8'));
}

const niches = [
  'Real Estate', 'Pastors', 'Gamers', 'Podcasters', 'Comedians', 
  'Fitness Coaches', 'Marketing Agencies', 'VTubers', 'Educators', 'Crypto Influencers'
];

const competitors = [
  'Opus Clip', 'Veed.io', 'Klap', 'Kapwing', 'Munch', 'Submagic'
];

const newPages = [];

// Generate Niche Pages
niches.forEach(niche => {
  const lowerNiche = niche.toLowerCase().replace(/ /g, '-');
  newPages.push({
    slug: `${lowerNiche}-ai-shorts-generator`,
    baseTool: 'shorts-maker',
    title: `Best AI Shorts Generator for ${niche} | Free Tool`,
    description: `Automate your content creation. The perfect AI Shorts generator designed specifically for ${niche} to go viral on TikTok and Reels.`,
    h1: `AI Shorts Generator for ${niche}`,
    intro: `Stop editing manually. Our AI understands what makes ${niche} content go viral. Upload your long-form videos and let the AI find the perfect moments.`,
    features: [
      `Tailored for ${niche} Content`,
      'Auto 9:16 Crop & Zoom',
      'One-Click Export'
    ],
    howTo: [
      { step: "1", title: "Upload", desc: `Upload your ${niche} video or podcast.` },
      { step: "2", title: "AI Magic", desc: `Our AI finds the highest retention moments.` },
      { step: "3", title: "Post", desc: "Download and post to TikTok or Reels." }
    ],
    faqs: [
      { q: `Does this work well for ${niche}?`, a: `Yes! Our AI is trained to recognize the speech patterns and engagement hooks specific to ${niche}.` }
    ]
  });
});

// Generate Competitor Alternative Pages
competitors.forEach(comp => {
  const lowerComp = comp.toLowerCase().replace(/ /g, '-').replace(/\./g, '');
  newPages.push({
    slug: `best-free-${lowerComp}-alternative`,
    baseTool: 'shorts-maker',
    title: `Best Free ${comp} Alternative | AI Shorts Maker`,
    description: `Looking for a better, free alternative to ${comp}? Seloice is the ultimate AI video clipper without the expensive paywalls.`,
    h1: `The Best ${comp} Alternative`,
    intro: `Why pay massive monthly fees for ${comp}? Switch to the fastest, most accurate AI shorts generator that processes entirely in your browser.`,
    features: [
      '100% Free Processing',
      'No Server Uploads Required',
      `More accurate than ${comp}`
    ],
    howTo: [
      { step: "1", title: "Switch to Seloice", desc: `Cancel your ${comp} subscription.` },
      { step: "2", title: "Upload locally", desc: "Process your video directly in your browser." },
      { step: "3", title: "Export", desc: "Get identical or better results instantly." }
    ],
    faqs: [
      { q: `Why is this better than ${comp}?`, a: `Unlike ${comp}, we process video locally in your browser, ensuring maximum privacy, zero upload wait times, and it's completely free.` }
    ]
  });
});

let addedCount = 0;
newPages.forEach(p => {
  if (!seoPages.find(existing => existing.slug === p.slug)) {
    seoPages.push(p);
    addedCount++;
  }
});

fs.writeFileSync(seoPath, JSON.stringify(seoPages, null, 2));
console.log(`Successfully generated and added ${addedCount} massive pSEO pages to the database.`);
