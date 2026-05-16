import fs from 'fs';
import path from 'path';
import { ALL_TOOLS } from './tools-registry';
import { getUseCaseSlugs } from './use-cases';

const BASE = 'https://seloice.com';

export const STATIC_ROUTES: { path: string; priority: number; changeFrequency: 'daily' | 'weekly' | 'monthly' }[] = [
  { path: '', priority: 1.0, changeFrequency: 'daily' },
  { path: '/tools', priority: 0.95, changeFrequency: 'weekly' },
  { path: '/blogs', priority: 0.85, changeFrequency: 'daily' },
  { path: '/about', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/privacy', priority: 0.3, changeFrequency: 'monthly' },
  { path: '/terms', priority: 0.3, changeFrequency: 'monthly' },
];

export function getUseCaseSlugsForSitemap(): string[] {
  return getUseCaseSlugs();
}

export function getToolSlugsFromFilesystem(): string[] {
  const toolsDir = path.join(process.cwd(), 'src', 'app', 'tools');
  if (!fs.existsSync(toolsDir)) return ALL_TOOLS.map((t) => t.slug);
  return fs
    .readdirSync(toolsDir)
    .filter((f) => {
      const full = path.join(toolsDir, f);
      return fs.statSync(full).isDirectory() && f !== 'page.tsx';
    })
    .filter((f) => fs.existsSync(path.join(toolsDir, f, 'page.tsx')));
}

export function getToolLastModified(slug: string): Date {
  try {
    const toolPage = path.join(process.cwd(), 'src', 'app', 'tools', slug, 'page.tsx');
    const stat = fs.statSync(toolPage);
    return stat.mtime;
  } catch {
    return new Date();
  }
}

export function getBlogSlugs(): { slug: string; updatedAt?: string }[] {
  const blogPath = path.join(process.cwd(), 'src', 'data', 'blog-posts.json');
  if (!fs.existsSync(blogPath)) return [];
  try {
    const posts = JSON.parse(fs.readFileSync(blogPath, 'utf-8')) as { slug: string; updatedAt?: string }[];
    return posts;
  } catch {
    return [];
  }
}

export function getProgrammaticSlugs(): string[] {
  const seoPath = path.join(process.cwd(), 'src', 'data', 'seo-pages.json');
  if (!fs.existsSync(seoPath)) return [];
  try {
    const pages = JSON.parse(fs.readFileSync(seoPath, 'utf-8')) as { slug: string }[];
    return pages.map((p) => p.slug);
  } catch {
    return [];
  }
}

export function getStaticRouteLastModified(): Date {
  try {
    return fs.statSync(path.join(process.cwd(), 'src', 'app', 'layout.tsx')).mtime;
  } catch {
    return new Date();
  }
}

export { BASE };
