import Link from 'next/link';
import { AlertTriangle, Info } from 'lucide-react';

const DISCLAIMERS: Record<
  string,
  { title: string; body: string; variant: 'download' | 'mockup' }
> = {
  'reel-downloader': {
    title: 'Responsible use notice',
    variant: 'download',
    body:
      'Only download public Instagram content you own or have explicit permission to use. Seloice does not bypass login walls or private accounts. Downloaded media remains subject to Instagram’s terms and copyright law — do not repost others’ work without rights.',
  },
  'yt-downloader': {
    title: 'Copyright & fair use',
    variant: 'download',
    body:
      'Use this tool only for videos you created, licensed, or are legally allowed to download (e.g. Creative Commons, your own channel). Downloading copyrighted content without permission may violate YouTube’s Terms of Service and local law.',
  },
  'whatsapp-mockup': {
    title: 'Fictional content only',
    variant: 'mockup',
    body:
      'This tool creates mockup screenshots for memes, marketing storyboards, and entertainment. Do not use outputs to impersonate real people, spread misinformation, or defraud others. Clearly label fictional content when publishing.',
  },
};

export default function ToolDisclaimer({ slug }: { slug: string }) {
  const data = DISCLAIMERS[slug];
  if (!data) return null;

  const Icon = data.variant === 'mockup' ? Info : AlertTriangle;
  const border = data.variant === 'mockup' ? 'border-amber-500/30 bg-amber-500/5' : 'border-orange-500/30 bg-orange-500/5';
  const iconColor = data.variant === 'mockup' ? 'text-amber-400' : 'text-orange-400';

  return (
    <aside
      className={`w-full max-w-4xl mx-auto mb-6 rounded-2xl border p-4 md:p-5 ${border}`}
      role="note"
      aria-label={data.title}
    >
      <div className="flex gap-3">
        <Icon size={20} className={`${iconColor} shrink-0 mt-0.5`} aria-hidden />
        <div>
          <p className="text-sm font-bold text-white mb-1">{data.title}</p>
          <p className="text-xs md:text-sm text-gray-400 leading-relaxed">{data.body}</p>
          <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-widest font-bold">
            <Link href="/terms" className="hover:text-gray-300 underline-offset-2 hover:underline">
              Terms
            </Link>
            {' · '}
            <Link href="/privacy" className="hover:text-gray-300 underline-offset-2 hover:underline">
              Privacy
            </Link>
          </p>
        </div>
      </div>
    </aside>
  );
}
