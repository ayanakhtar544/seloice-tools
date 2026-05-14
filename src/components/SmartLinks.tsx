import React from 'react';
import Link from 'next/link';
import { Link as LinkIcon, Sparkles } from 'lucide-react';
import { getPublishedBlogs } from '@/lib/blogService';

interface SmartLinksProps {
  currentTool?: string; // The base tool slug, if on a tool page
  currentBlog?: string; // The blog slug, if on a blog page
}

// Global registry of all tools for quick lookup
const toolDirectory = [
  { slug: 'reel-downloader', name: 'Instagram Reel Downloader', category: 'Download' },
  { slug: 'yt-downloader', name: 'YouTube Downloader', category: 'Download' },
  { slug: 'thumbnail-extractor', name: 'Thumbnail Downloader', category: 'Download' },
  { slug: 'photo-editor', name: 'Photo Editor', category: 'Design' },
  { slug: 'audio-editor', name: 'Audio Editor', category: 'Audio' },
  { slug: 'mp4-to-mp3', name: 'MP4 to MP3', category: 'Audio' },
  { slug: 'video-compressor', name: 'Video Compressor', category: 'Video' },
  { slug: 'reel-fitter', name: 'Reel Resizer', category: 'Video' },
  { slug: 'auto-captions', name: 'Auto Captions', category: 'AI' },
  { slug: 'speech-to-text', name: 'Speech to Text', category: 'Audio' },
  { slug: 'tweet-generator', name: 'Caption Generator', category: 'AI' },
  { slug: 'viral-hooks', name: 'Viral Hooks', category: 'AI' },
  { slug: 'hashtag-generator', name: 'Hashtag Generator', category: 'SEO' },
  { slug: 'yt-title-generator', name: 'Title Generator', category: 'SEO' },
  { slug: 'bg-remover', name: 'Background Remover', category: 'Design' },
  { slug: 'safe-zone', name: 'Auto Crop', category: 'Design' },
  { slug: 'yt-tag-extractor', name: 'SEO Tags Extractor', category: 'SEO' },
  { slug: 'qr-generator', name: 'QR Builder', category: 'Misc' },
  { slug: 'image-converter', name: 'Image Converter', category: 'Design' },
];

export default function SmartLinks({ currentTool, currentBlog }: SmartLinksProps) {
  const [blogPosts, setBlogPosts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      const data = await getPublishedBlogs();
      setBlogPosts(data);
      setLoading(false);
    }
    loadData();
  }, []);

  // If we're on a tool, find related blogs
  let relatedBlogs: any[] = [];
  let relatedTools: any[] = [];

  if (!loading) {
    if (currentTool) {
      relatedBlogs = blogPosts.filter(b => b.relatedTools?.includes(currentTool));
      // Find tools in the same category
      const toolInfo = toolDirectory.find(t => t.slug === currentTool);
      if (toolInfo) {
        relatedTools = toolDirectory.filter(t => t.category === toolInfo.category && t.slug !== currentTool);
      }
    }

    // If we're on a blog, find tools it mentions
    if (currentBlog) {
      const blogInfo = blogPosts.find(b => b.slug === currentBlog);
      if (blogInfo) {
        relatedTools = toolDirectory.filter(t => blogInfo.relatedTools?.includes(t.slug));
      }
    }

    // Fallbacks to ensure we always show internal links
    if (relatedTools.length === 0) {
      relatedTools = toolDirectory.slice(0, 3); // Pick first 3
    }
    if (relatedBlogs.length === 0 && blogPosts.length > 0) {
      relatedBlogs = [blogPosts[0]]; // Pick latest blog
    }
  }

  if (loading) return null; // Or a skeleton

  return (
    <div className="w-full bg-[#111] border border-white/10 rounded-2xl p-6 mt-12 mb-12">
      <h3 className="text-lg font-black italic uppercase mb-6 flex items-center gap-2 text-indigo-400">
        <Sparkles size={16} /> Explore Related Resources
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Tool Links */}
        {relatedTools.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Creator Tools</h4>
            <ul className="space-y-3">
              {relatedTools.map(t => (
                <li key={t.slug}>
                  <Link href={`/tools/${t.slug}`} className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors group">
                    <LinkIcon size={14} className="text-gray-600 group-hover:text-indigo-400" />
                    <span className="group-hover:underline">{t.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Blog Links */}
        {relatedBlogs.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Growth Guides</h4>
            <ul className="space-y-3">
              {relatedBlogs.map(b => (
                <li key={b.slug}>
                  <Link href={`/blogs/${b.slug}`} className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors group">
                    <LinkIcon size={14} className="text-gray-600 group-hover:text-pink-400" />
                    <span className="group-hover:underline line-clamp-1">{b.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
