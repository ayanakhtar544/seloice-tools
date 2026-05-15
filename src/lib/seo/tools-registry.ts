import { ALL_TOOL_SEO, getToolSEOBySlug, type ToolSEOExtension } from './tool-seo-database';

export type ToolCategory =
  | 'Download'
  | 'Video'
  | 'YouTube'
  | 'Social'
  | 'AI'
  | 'Audio'
  | 'Design'
  | 'SEO'
  | 'Studio'
  | 'Utility';

export interface ToolFAQ {
  question: string;
  answer: string;
}

export interface ToolRecord extends ToolSEOExtension {
  slug: string;
  name: string;
  shortTitle: string;
  category: ToolCategory;
  tagline: string;
  description: string;
  metaDescription: string;
  keywords: string[];
  relatedSlugs: string[];
  faqs: ToolFAQ[];
  features: string[];
  howToSteps: { title: string; desc: string }[];
  useCases: { title: string; desc: string }[];
  creatorTips: string[];
  troubleshooting: { issue: string; fix: string }[];
  benefits: string[];
  comparisonNote: string;
  featuredSnippet: string;
}

function seoToToolRecord(seo: NonNullable<ReturnType<typeof getToolSEOBySlug>>): ToolRecord {
  return {
    slug: seo.slug,
    name: seo.name,
    shortTitle: seo.shortTitle,
    category: seo.category,
    tagline: seo.tagline,
    description: seo.description,
    metaDescription: seo.metaDescription,
    keywords: [seo.primaryKeyword, ...seo.semanticKeywords],
    relatedSlugs: seo.relatedSlugs,
    faqs: seo.faqs,
    features: seo.features,
    howToSteps: seo.howToSteps,
    seoTitle: seo.seoTitle,
    h1: seo.h1,
    primaryKeyword: seo.primaryKeyword,
    semanticKeywords: seo.semanticKeywords,
    useCases: seo.useCases,
    comparisonNote: seo.comparisonNote,
    featuredSnippet: seo.featuredSnippet,
    creatorTips: seo.creatorTips,
    troubleshooting: seo.troubleshooting,
    benefits: seo.benefits,
    wasmHeavy: seo.wasmHeavy,
    videoTool: seo.videoTool,
    discoverTitle: seo.discoverTitle,
  };
}

export const ALL_TOOLS: ToolRecord[] = ALL_TOOL_SEO.map(seoToToolRecord);

export const WASM_TOOL_SLUGS = ALL_TOOLS.filter((t) => t.wasmHeavy).map((t) => t.slug);

export function getToolBySlug(slug: string): ToolRecord | undefined {
  return ALL_TOOLS.find((t) => t.slug === slug);
}

export function getRelatedTools(slug: string, limit = 6): ToolRecord[] {
  const tool = getToolBySlug(slug);
  if (!tool) return ALL_TOOLS.slice(0, limit);
  const related = tool.relatedSlugs
    .map((s) => getToolBySlug(s))
    .filter((t): t is ToolRecord => Boolean(t));
  if (related.length >= limit) return related.slice(0, limit);
  const fillers = ALL_TOOLS.filter((t) => t.slug !== slug && !related.includes(t));
  return [...related, ...fillers].slice(0, limit);
}

export function getToolsByCategory(category: ToolCategory): ToolRecord[] {
  return ALL_TOOLS.filter((t) => t.category === category);
}

export function getAllToolSlugs(): string[] {
  return ALL_TOOLS.map((t) => t.slug);
}
