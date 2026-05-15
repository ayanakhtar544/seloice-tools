import type { LucideIcon } from 'lucide-react';
import {
  AudioWaveform,
  Download,
  Eraser,
  FileArchive,
  FileText,
  Grid,
  Hash,
  Image as ImageIcon,
  Layout,
  Maximize,
  MessageCircle,
  MessageSquare,
  Mic,
  Music,
  Palette,
  QrCode,
  RefreshCcw,
  Scissors,
  Shield,
  Sparkles,
  Stamp,
  Subtitles,
  TrendingUp,
  Type,
  Video,
  Wand2,
  Zap,
} from 'lucide-react';
import { ALL_TOOLS, type ToolCategory, type ToolRecord } from '@/lib/seo/tools-registry';

export const TOOL_COUNT = ALL_TOOLS.length;

export interface SearchToolItem {
  slug: string;
  name: string;
  shortTitle: string;
  href: string;
  desc: string;
  category: ToolCategory;
  keywords: string[];
}

export const SEARCH_TOOLS: SearchToolItem[] = ALL_TOOLS.map((t) => ({
  slug: t.slug,
  name: t.name,
  shortTitle: t.shortTitle,
  href: `/tools/${t.slug}`,
  desc: t.tagline,
  category: t.category,
  keywords: t.keywords,
}));

export function filterSearchTools(query: string, items: SearchToolItem[] = SEARCH_TOOLS): SearchToolItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;

  return items.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.shortTitle.toLowerCase().includes(q) ||
      t.desc.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.slug.replace(/-/g, ' ').includes(q) ||
      t.keywords.some((k) => k.toLowerCase().includes(q)),
  );
}

export const HUB_CATEGORIES = [
  'All',
  'Studio',
  'Download',
  'Video',
  'YouTube',
  'Social',
  'AI',
  'SEO',
  'Audio',
  'Design',
  'Utility',
] as const;

export type HubCategory = (typeof HUB_CATEGORIES)[number];

export const CATEGORY_GRADIENT: Record<ToolCategory, string> = {
  Studio: 'from-emerald-500 to-teal-400',
  Download: 'from-red-500 to-orange-400',
  Video: 'from-blue-500 to-cyan-400',
  YouTube: 'from-orange-500 to-amber-400',
  Social: 'from-pink-500 to-purple-400',
  AI: 'from-purple-500 to-fuchsia-400',
  SEO: 'from-emerald-500 to-green-400',
  Audio: 'from-rose-500 to-pink-400',
  Design: 'from-cyan-500 to-teal-400',
  Utility: 'from-slate-600 to-gray-400',
};

const SLUG_ICONS: Record<string, LucideIcon> = {
  'audio-editor': AudioWaveform,
  'auto-captions': Subtitles,
  'bg-remover': Scissors,
  'color-extractor': Palette,
  'file-converter': FileArchive,
  'grid-maker': Grid,
  'hashtag-extractor': Hash,
  'hashtag-generator': Sparkles,
  'image-converter': ImageIcon,
  'mp4-to-mp3': Music,
  'mp4-to-text': FileText,
  'photo-editor': Wand2,
  'qr-generator': QrCode,
  'reel-downloader': Download,
  'reel-fitter': Maximize,
  'safe-zone': Layout,
  'smart-captions': MessageSquare,
  'speech-to-text': Mic,
  'thumbnail-extractor': ImageIcon,
  'tweet-generator': MessageSquare,
  'video-compressor': Video,
  'video-editor': Video,
  'viral-hooks': Zap,
  'watermark-adder': Shield,
  'whatsapp-mockup': MessageCircle,
  'yt-downloader': Download,
  'yt-tag-extractor': Hash,
  'yt-title-generator': Type,
};

const CATEGORY_ICONS: Record<ToolCategory, LucideIcon> = {
  Studio: Wand2,
  Download: Download,
  Video: Video,
  YouTube: Download,
  Social: MessageSquare,
  AI: Sparkles,
  SEO: Hash,
  Audio: Music,
  Design: Palette,
  Utility: RefreshCcw,
};

export function getToolIcon(slug: string, category: ToolCategory): LucideIcon {
  return SLUG_ICONS[slug] ?? CATEGORY_ICONS[category] ?? Sparkles;
}

const TOOL_BADGES: Partial<Record<string, string>> = {
  'yt-downloader': 'HOT',
  'video-compressor': 'NEW',
  'auto-captions': 'PRO',
  'photo-editor': 'NEW',
  'audio-editor': 'PRO',
  'viral-hooks': 'AI',
  'speech-to-text': 'PRO',
};

const TOOL_COLORS: Partial<Record<string, string>> = {
  'yt-downloader': 'bg-red-500',
  'reel-downloader': 'bg-pink-500',
  'video-compressor': 'bg-orange-500',
  'auto-captions': 'bg-cyan-600',
  'mp4-to-text': 'bg-indigo-500',
  'reel-fitter': 'bg-sky-500',
  'watermark-adder': 'bg-teal-500',
  'hashtag-generator': 'bg-emerald-400',
  'viral-hooks': 'bg-yellow-500',
  'yt-title-generator': 'bg-red-400',
  'yt-tag-extractor': 'bg-orange-500',
  'tweet-generator': 'bg-blue-500',
  'qr-generator': 'bg-gray-400',
  'photo-editor': 'bg-indigo-600',
  'bg-remover': 'bg-purple-500',
  'image-converter': 'bg-violet-600',
  'grid-maker': 'bg-pink-400',
  'color-extractor': 'bg-yellow-400',
  'safe-zone': 'bg-teal-400',
  'audio-editor': 'bg-emerald-600',
  'mp4-to-mp3': 'bg-emerald-500',
  'speech-to-text': 'bg-green-500',
  'file-converter': 'bg-blue-500',
};

const CATEGORY_COLORS: Record<ToolCategory, string> = {
  Studio: 'bg-indigo-600',
  Download: 'bg-red-500',
  Video: 'bg-orange-500',
  YouTube: 'bg-red-400',
  Social: 'bg-pink-500',
  AI: 'bg-purple-500',
  SEO: 'bg-emerald-400',
  Audio: 'bg-emerald-500',
  Design: 'bg-violet-600',
  Utility: 'bg-blue-500',
};

export function getToolColor(slug: string, category: ToolCategory): string {
  return TOOL_COLORS[slug] ?? CATEGORY_COLORS[category];
}

export function getToolBadge(slug: string): string | undefined {
  return TOOL_BADGES[slug];
}

export interface HomeSection {
  id: string;
  name: string;
  categories: ToolCategory[];
}

export const HOME_SECTIONS: HomeSection[] = [
  { id: 'studio', name: 'Studio Suite', categories: ['Studio'] },
  { id: 'video', name: 'Video Powerhouse', categories: ['Download', 'Video', 'YouTube'] },
  { id: 'social', name: 'Social & Growth', categories: ['Social', 'SEO'] },
  { id: 'ai', name: 'AI Tools', categories: ['AI'] },
  { id: 'design', name: 'Image & Design', categories: ['Design'] },
  { id: 'audio', name: 'Audio & Utilities', categories: ['Audio', 'Utility'] },
];

export function getToolsForHomeSection(section: HomeSection): ToolRecord[] {
  return ALL_TOOLS.filter((t) => section.categories.includes(t.category));
}

export function filterHubTools(query: string, category: HubCategory): ToolRecord[] {
  const q = query.trim().toLowerCase();

  return ALL_TOOLS.filter((tool) => {
    const matchesCategory = category === 'All' || tool.category === category;
    if (!matchesCategory) return false;
    if (!q) return true;

    return (
      tool.name.toLowerCase().includes(q) ||
      tool.shortTitle.toLowerCase().includes(q) ||
      tool.tagline.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.category.toLowerCase().includes(q) ||
      tool.slug.replace(/-/g, ' ').includes(q) ||
      tool.keywords.some((k) => k.toLowerCase().includes(q))
    );
  });
}
