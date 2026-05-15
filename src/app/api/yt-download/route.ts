// File: src/app/api/yt-download/route.ts
import { NextResponse } from 'next/server';
import { DownloadRequestSchema, validateRequest } from '@/lib/security/validation';

// 🚀 Vercel Timeout Bypass
export const maxDuration = 60;

const fetchWithRetry = async (url: string, options: any, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      if (res.ok) return res;
      if (res.status === 429) { 
        await new Promise(resolve => setTimeout(resolve, delay * 2));
        continue;
      }
      if (res.status >= 400 && res.status < 500 && res.status !== 429) {
          return res;
      }
      throw new Error(`HTTP error! status: ${res.status}`);
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error("Max retries reached");
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ─── 1. SECURITY VALIDATION ─────────────────────────────────
    const validation = validateRequest(DownloadRequestSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { url, isTrimming, startTime, endTime } = validation.data;

    let title = "Seloice Pro Video";
    let thumbnail = "";
    let views = "N/A", likes = "N/A", duration = "N/A", shares = "N/A";
    let allFormats: any[] = [];

    // ─── 2. EXTRACT VIDEO ID (HARDENED) ──────────────────────────
    let videoId = "";
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('youtube.com')) {
        videoId = urlObj.searchParams.get('v') || urlObj.pathname.split('/').pop() || '';
      } else if (urlObj.hostname.includes('youtu.be')) {
        videoId = urlObj.pathname.split('/').pop() || '';
      }
    } catch {
      return NextResponse.json({ error: "Invalid YouTube URL structure" }, { status: 400 });
    }

    if (!videoId) {
        return NextResponse.json({ error: "Could not extract Video ID from the link." }, { status: 400 });
    }

    thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    const RAPID_API_KEY = process.env.RAPID_API_KEY;
    if (!RAPID_API_KEY) {
        return NextResponse.json({ error: "Server Configuration Error: API Key missing in Production." }, { status: 500 });
    }
    
    let API_ENDPOINT = `https://youtube-media-downloader.p.rapidapi.com/v2/video/details?videoId=${videoId}&urlAccess=normal&videos=auto&audios=auto`;
    
    if (isTrimming && startTime && endTime) {
       API_ENDPOINT += `&start=${startTime}&end=${endTime}`;
    }

    const res = await fetchWithRetry(API_ENDPOINT, {
        headers: {
            'x-rapidapi-key': RAPID_API_KEY,
            'x-rapidapi-host': 'youtube-media-downloader.p.rapidapi.com'
        }
    });
    
    const data = await res.json();
    
    if (data && data.title) {
        title = isTrimming ? `${data.title} (Trimmed)` : data.title;
        thumbnail = data.thumbnails?.[data.thumbnails.length - 1]?.url || thumbnail;
        
        views = data.viewCount ? Number(data.viewCount).toLocaleString() : "Hidden";
        likes = data.likeCount ? Number(data.likeCount).toLocaleString() : "Hidden";
        duration = data.lengthSeconds ? `${Math.floor(data.lengthSeconds / 60)}:${String(data.lengthSeconds % 60).padStart(2, '0')}` : "N/A";
        shares = data.viewCount ? Math.floor(Number(data.viewCount) * 0.005).toLocaleString() : "N/A";

        if (data.videos && data.videos.items) {
            data.videos.items.forEach((vid: any) => {
                allFormats.push({
                    quality: vid.quality || `${vid.height}p Video`,
                    type: "Video / MP4",
                    url: vid.url,
                    size: vid.size ? (vid.size / (1024 * 1024)).toFixed(1) + " MB" : "Size N/A"
                });
            });
        }
        if (data.audios && data.audios.items) {
            data.audios.items.forEach((aud: any) => {
                allFormats.push({
                    quality: "Audio MP3",
                    type: "Audio / MP3",
                    url: aud.url,
                    size: aud.size ? (aud.size / (1024 * 1024)).toFixed(1) + " MB" : "Size N/A"
                });
            });
        }
    }

    if (allFormats.length === 0) {
        throw new Error("Could not fetch video formats. The video might be private.");
    }

    return NextResponse.json({ 
      success: true,
      meta: { title, thumbnail, views, likes, duration, shares },
      formats: allFormats
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}