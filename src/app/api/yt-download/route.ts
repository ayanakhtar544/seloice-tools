import { NextResponse } from 'next/server';
// ytdl-core import hata diya kyunki production me ye sirf timeout karwata hai
import { DownloadRequestSchema, validateRequest } from '@/lib/security/validation';
import { fetchWithRetry } from '@/lib/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// Vercel hobby plan max is 10s/15s anyway, but keeping it for safety if you upgrade
export const maxDuration = 60; 

type YouTubeFormat = {
  url?: string;
  quality?: string;
  type?: string;
  size?: string;
  ext?: string;
};

type RapidApiResponse = {
  title?: string;
  thumbnails?: Array<{ url?: string }>;
  viewCount?: string | number;
  likeCount?: string | number;
  lengthSeconds?: string | number;
  videos?: { items?: Array<Record<string, unknown>> };
  audios?: { items?: Array<Record<string, unknown>> };
  error?: string;
  message?: string;
};

// Seedha RapidAPI ko hit karenge (No ytdl-core delay)
const fetchRapidApiInfo = async (videoId: string) => {
  const RAPID_API_KEY = process.env.RAPID_API_KEY?.trim() || process.env.RAPIDAPI_KEY?.trim();
  
  if (!RAPID_API_KEY) {
    throw new Error('Server Configuration Error: RapidAPI Key is missing in Vercel Environment Variables.');
  }

  const API_ENDPOINT = `https://youtube-media-downloader.p.rapidapi.com/v2/video/details?videoId=${videoId}&urlAccess=normal&videos=auto&audios=auto`;
  
  const res = await fetchWithRetry(API_ENDPOINT, {
    headers: {
      'x-rapidapi-key': RAPID_API_KEY,
      'x-rapidapi-host': 'youtube-media-downloader.p.rapidapi.com',
    },
    retries: 2,
    retryDelayMs: 1000,
    timeoutMs: 8000, // Reduced timeout so Vercel doesn't kill the whole function
  });
  
  const data = (await res.json()) as RapidApiResponse;

  if (!res.ok || !data?.title) {
    throw new Error(data?.error || data?.message || 'RapidAPI lookup failed.');
  }

  const formats: YouTubeFormat[] = [];
  
  // Video Formats Parsing
  if (data.videos?.items) {
    data.videos.items.forEach((vid: Record<string, unknown>) => {
      const url = typeof vid.url === 'string' ? vid.url : undefined;
      const sizeValue = typeof vid.size === 'string' || typeof vid.size === 'number' ? Number(vid.size) : undefined;
      if (url) {
        formats.push({
          quality: typeof vid.quality === 'string' ? vid.quality : `${vid.height || 'unknown'}p Video`,
          type: 'Video / MP4',
          url,
          size: sizeValue ? `${(sizeValue / (1024 * 1024)).toFixed(1)} MB` : 'Unknown size',
          ext: 'mp4',
        });
      }
    });
  }
  
  // Audio Formats Parsing
  if (data.audios?.items) {
    data.audios.items.forEach((aud: Record<string, unknown>) => {
      const url = typeof aud.url === 'string' ? aud.url : undefined;
      const sizeValue = typeof aud.size === 'string' || typeof aud.size === 'number' ? Number(aud.size) : undefined;
      if (url) {
        formats.push({
          quality: 'Audio MP3',
          type: 'Audio / MP3',
          url,
          size: sizeValue ? `${(sizeValue / (1024 * 1024)).toFixed(1)} MB` : 'Unknown size',
          ext: 'mp3',
        });
      }
    });
  }

  return {
    title: data.title || 'YouTube Video',
    thumbnail: data.thumbnails?.[data.thumbnails.length - 1]?.url || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    views: data.viewCount ? Number(data.viewCount).toLocaleString() : 'Hidden',
    likes: data.likeCount ? Number(data.likeCount).toLocaleString() : 'Hidden',
    duration: data.lengthSeconds
      ? `${Math.floor(Number(data.lengthSeconds) / 60)}:${String(Number(data.lengthSeconds) % 60).padStart(2, '0')}`
      : 'N/A',
    shares: data.viewCount ? Math.floor(Number(data.viewCount) * 0.005).toLocaleString() : 'N/A',
    formats,
  };
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = validateRequest(DownloadRequestSchema, body);
    
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { url } = validation.data;
    let videoId = '';

    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('youtube.com')) {
        videoId =
          urlObj.searchParams.get('v') ||
          (urlObj.pathname.startsWith('/shorts/')
            ? urlObj.pathname.split('/')[2]
            : urlObj.pathname.split('/').pop()) || '';
      } else if (urlObj.hostname.includes('youtu.be')) {
        videoId = urlObj.pathname.split('/').pop() || '';
      }
    } catch {
      return NextResponse.json({ error: 'Invalid YouTube URL structure' }, { status: 400 });
    }

    if (!videoId) {
      return NextResponse.json({ error: 'Could not extract Video ID from the link.' }, { status: 400 });
    }

    // 🚀 DIRECT HIT TO RAPID API (No ytdl-core delay)
    try {
      const info = await fetchRapidApiInfo(videoId);
      
      if (!info.formats.length) {
        throw new Error('No downloadable formats were found.');
      }
      
      return NextResponse.json({
        success: true,
        meta: {
          title: info.title,
          thumbnail: info.thumbnail,
          views: info.views,
          likes: info.likes,
          duration: info.duration,
          shares: info.shares,
        },
        formats: info.formats,
      });
      
    } catch (apiError: unknown) {
      console.error('RapidAPI Fetch Failed:', apiError);
      const message = apiError instanceof Error ? apiError.message : String(apiError);
      return NextResponse.json({ error: message || 'Failed to fetch video details.' }, { status: 500 });
    }
    
  } catch (error: unknown) {
    console.error('Server Route Error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}