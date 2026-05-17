// File: src/app/api/ig-download/route.ts
import { NextResponse } from 'next/server';
import { DownloadRequestSchema, validateRequest } from '@/lib/security/validation';
import { fetchWithRetry } from '@/lib/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Vercel hobby pe ye ignore hota hai (10s limit), but safe for Pro

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

    const RAPID_API_KEY = process.env.RAPID_API_KEY?.trim() || process.env.RAPIDAPI_KEY?.trim();
    const RAPID_API_HOST = "instagram-reels-downloader-api.p.rapidapi.com"; 
    
    // 🔥 CRITICAL FIX: Ensure API key exists
    if (!RAPID_API_KEY) {
        console.error("CRITICAL ERROR: RAPID_API_KEY is missing on production server.");
        return NextResponse.json({ error: "Server Configuration Error: API Key missing in Production." }, { status: 500 });
    }

    const API_ENDPOINT = `https://${RAPID_API_HOST}/download?url=${encodeURIComponent(url)}`;

    // 🔥 VERCEL TIMEOUT FIX
    // Timeout kam kar diya hai taaki Vercel kill karne se pehle humara catch block chal jaye aur proper error mile.
    const response = await fetchWithRetry(API_ENDPOINT, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': RAPID_API_KEY,
        'x-rapidapi-host': RAPID_API_HOST,
        'Content-Type': 'application/json'
      },
      retries: 1,           // Changed from 2
      retryDelayMs: 500,    // Changed from 1200
      timeoutMs: 8000,      // Changed from 15000 to 8s max
    });

    const data = await response.json();

    if (data.message || data.error) {
        console.error("RapidAPI returned an error:", data.message || data.error);
    }

    // 🚀 Robust check for different API response structures
    if (!response.ok || !data || (!data.data && !data.medias && !data.url)) {
      throw new Error("Video not found. The account might be private, or the link is invalid.");
    }

    const igData = data.data || data;

    // Filter video files dynamically
    const videoFiles = Array.isArray(igData.medias)
      ? igData.medias
          .filter((media: { type?: string; extension?: string; url?: string }) =>
            Boolean(media.url) &&
            (media.type === 'video' || media.extension === 'mp4')
          )
          .map((media: { extension?: string; quality?: string; url: string }) => ({
            url: media.url,
            quality: media.quality || 'MP4',
            extension: media.extension || 'mp4',
          }))
      : [];

    // Fallback urls based on common RapidAPI structures
    const finalVideoUrl = videoFiles.length > 0 ? videoFiles[0].url : (igData.videoUrl || igData.url);

    if (!finalVideoUrl) {
        throw new Error("No playable video found in this post.");
    }

    return NextResponse.json({ 
      success: true,
      videoUrl: finalVideoUrl,
      availableVideos: videoFiles,
      meta: {
        author: igData.author || igData.owner?.username || 'Instagram User',
        caption: igData.title || igData.caption || '',
        likes: igData.like_count || igData.likes || 0,
        views: igData.view_count || igData.play_count || 0,
        thumbnail: igData.thumbnail || igData.cover_url || ''
      }
    });
    
  } catch (error: unknown) {
    console.error("IG Downloader Final Catch Error:", error);
    const message = error instanceof Error ? error.message : "Server issue encountered.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}