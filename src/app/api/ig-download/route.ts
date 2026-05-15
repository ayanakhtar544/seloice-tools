import { NextResponse } from 'next/server';
import { DownloadRequestSchema, validateRequest } from '@/lib/security/validation';

// 🚀 THE MAGIC FIX: Vercel Timeout Bypass (Allow up to 60 seconds)
export const maxDuration = 60;

const fetchWithRetry = async (url: string, options: any, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      if (res.ok) return res;
      if (res.status === 429) { // Rate limit
        await new Promise(resolve => setTimeout(resolve, delay * 2));
        continue;
      }
      // If it's a 4xx error (not rate limit), return it to handle in main logic
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

    const { url } = validation.data;

    if (!url.includes('instagram.com')) {
      return NextResponse.json({ error: "Please enter a valid Instagram link!" }, { status: 400 });
    }

    const RAPID_API_KEY = process.env.RAPID_API_KEY; 
    const RAPID_API_HOST = "instagram-reels-downloader-api.p.rapidapi.com"; 
    
    // 🔥 DEBUG FIX: Log error specifically if API key is missing
    if (!RAPID_API_KEY) {
        console.error("CRITICAL ERROR: RAPID_API_KEY is missing on production server.");
        return NextResponse.json({ error: "Server Configuration Error: API Key missing in Production." }, { status: 500 });
    }

    const API_ENDPOINT = `https://${RAPID_API_HOST}/download?url=${encodeURIComponent(url)}`;

    const response = await fetchWithRetry(API_ENDPOINT, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': RAPID_API_KEY,
        'x-rapidapi-host': RAPID_API_HOST,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    // 🚀 Handle RapidAPI internal errors gracefully
    if (data.message || data.error) {
        console.error("RapidAPI returned an error:", data.message || data.error);
    }

    if (!response.ok || !data?.data) {
      throw new Error("Video not found. The account might be private, or the link is invalid.");
    }

    const igData = data.data;

    // Filter video files
    const videoFiles = igData.medias ? igData.medias.filter((m: any) => m.type === 'video' || m.extension === 'mp4') : [];

    if (videoFiles.length === 0 && !igData.url) {
        throw new Error("No playable video found in this post.");
    }

    return NextResponse.json({ 
      success: true,
      videoUrl: videoFiles.length > 0 ? videoFiles[0].url : igData.url,
      availableVideos: videoFiles, 
      meta: {
        author: igData.author || igData.owner?.username || 'Instagram User',
        caption: igData.title || '',
        likes: igData.like_count || 0,
        views: igData.view_count || 0,
        thumbnail: igData.thumbnail || ''
      }
    });
    
  } catch (error: any) {
    console.error("IG Downloader Final Catch Error:", error);
    return NextResponse.json({ error: error.message || "Server issue encountered." }, { status: 500 });
  }
}