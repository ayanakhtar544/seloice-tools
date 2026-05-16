import { NextResponse } from 'next/server';
import ytdl from '@distube/ytdl-core';
import { DownloadRequestSchema, validateRequest } from '@/lib/security/validation';
import { fetchWithRetry } from '@/lib/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const formatBytes = (bytes?: string | number) => {
  if (!bytes) return 'Unknown size';
  const value = typeof bytes === 'string' ? Number(bytes) : bytes;
  if (Number.isNaN(value)) return 'Unknown size';
  return value >= 1024 * 1024
    ? `${(value / (1024 * 1024)).toFixed(1)} MB`
    : `${(value / 1024).toFixed(1)} KB`;
};

type YouTubeFormat = {
  url?: string;
  hasVideo?: boolean;
  hasAudio?: boolean;
  container?: string;
  qualityLabel?: string;
  audioQuality?: string;
  contentLength?: string | number;
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

const reduceFormats = (formats: YouTubeFormat[]) =>
  formats
    .filter((format) => format.url)
    .map((format) => {
      const isAudio = !format.hasVideo && format.hasAudio;
      const ext = format.container || (isAudio ? 'mp3' : 'mp4');
      return {
        quality: format.qualityLabel || format.audioQuality || `${ext.toUpperCase()} format`,
        type: isAudio ? `Audio / ${ext.toUpperCase()}` : `Video / ${ext.toUpperCase()}`,
        url: format.url,
        size: format.contentLength ? formatBytes(format.contentLength) : 'Unknown size',
        ext,
      };
    })
    .filter((item) => item.url)
    .slice(0, 20);

const fetchYouTubeInfo = async (videoUrl: string) => {
  const info = await ytdl.getBasicInfo(videoUrl, {
    requestOptions: {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      },
    },
  });

  return {
    title: info.videoDetails.title || 'YouTube Video',
    thumbnail:
      info.videoDetails.thumbnails?.[info.videoDetails.thumbnails.length - 1]?.url ||
      `https://img.youtube.com/vi/${info.videoDetails.videoId}/maxresdefault.jpg`,
    views: info.videoDetails.viewCount ? Number(info.videoDetails.viewCount).toLocaleString() : 'Hidden',
    likes: info.videoDetails.likes ? Number(info.videoDetails.likes).toLocaleString() : 'Hidden',
    duration: info.videoDetails.lengthSeconds
      ? `${Math.floor(Number(info.videoDetails.lengthSeconds) / 60)}:${String(Number(info.videoDetails.lengthSeconds) % 60).padStart(2, '0')}`
      : 'N/A',
    shares: 'N/A',
    formats: reduceFormats(info.formats),
  };
};

const fetchRapidApiInfo = async (videoId: string) => {
  const RAPID_API_KEY =
    process.env.RAPID_API_KEY?.trim() ||
    process.env.RAPIDAPI_KEY?.trim();
  if (!RAPID_API_KEY) {
    throw new Error('Server Configuration Error: API Key missing in Production.');
  }

  const API_ENDPOINT = `https://youtube-media-downloader.p.rapidapi.com/v2/video/details?videoId=${videoId}&urlAccess=normal&videos=auto&audios=auto`;
  const res = await fetchWithRetry(API_ENDPOINT, {
    headers: {
      'x-rapidapi-key': RAPID_API_KEY,
      'x-rapidapi-host': 'youtube-media-downloader.p.rapidapi.com',
    },
    retries: 2,
    retryDelayMs: 1200,
    timeoutMs: 15_000,
  });
  const data = (await res.json()) as RapidApiResponse;

  if (!res.ok || !data?.title) {
    throw new Error(data?.error || data?.message || 'RapidAPI lookup failed.');
  }

  const formats: YouTubeFormat[] = [];
  if (data.videos?.items) {
    data.videos.items.forEach((vid: Record<string, unknown>) => {
      const url = typeof vid.url === 'string' ? vid.url : undefined;
      const sizeValue = typeof vid.size === 'string' || typeof vid.size === 'number' ? Number(vid.size) : undefined;
      formats.push({
        quality: typeof vid.quality === 'string' ? vid.quality : `${typeof vid.height === 'string' || typeof vid.height === 'number' ? vid.height : 'unknown'}p Video`,
        type: 'Video / MP4',
        url,
        size: sizeValue ? `${(sizeValue / (1024 * 1024)).toFixed(1)} MB` : 'Unknown size',
        ext: 'mp4',
      });
    });
  }
  if (data.audios?.items) {
    data.audios.items.forEach((aud: Record<string, unknown>) => {
      const url = typeof aud.url === 'string' ? aud.url : undefined;
      const sizeValue = typeof aud.size === 'string' || typeof aud.size === 'number' ? Number(aud.size) : undefined;
      formats.push({
        quality: 'Audio MP3',
        type: 'Audio / MP3',
        url,
        size: sizeValue ? `${(sizeValue / (1024 * 1024)).toFixed(1)} MB` : 'Unknown size',
        ext: 'mp3',
      });
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
            : urlObj.pathname.split('/').pop()) ||
          '';
      } else if (urlObj.hostname.includes('youtu.be')) {
        videoId = urlObj.pathname.split('/').pop() || '';
      }
    } catch {
      return NextResponse.json({ error: 'Invalid YouTube URL structure' }, { status: 400 });
    }

    if (!videoId) {
      return NextResponse.json({ error: 'Could not extract Video ID from the link.' }, { status: 400 });
    }

    if (!ytdl.validateID(videoId)) {
      return NextResponse.json({ error: 'Invalid YouTube video ID.' }, { status: 400 });
    }

    try {
      const info = await fetchYouTubeInfo(`https://www.youtube.com/watch?v=${videoId}`);
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
    } catch (primaryError: unknown) {
      console.warn('YouTube primary fetch failed, falling back to RapidAPI:', primaryError);
      try {
        const fallback = await fetchRapidApiInfo(videoId);
        if (!fallback.formats.length) {
          throw new Error('No formats returned from fallback service.');
        }
        return NextResponse.json({
          success: true,
          meta: {
            title: fallback.title,
            thumbnail: fallback.thumbnail,
            views: fallback.views,
            likes: fallback.likes,
            duration: fallback.duration,
            shares: fallback.shares,
          },
          formats: fallback.formats,
        });
      } catch (fallbackError: unknown) {
        console.error('YouTube fallback route failed:', fallbackError);
        const fallbackMessage = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
        return NextResponse.json({ error: fallbackMessage || 'Unable to fetch YouTube download information.' }, { status: 500 });
      }
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message || 'Server error.' }, { status: 500 });
  }
}
