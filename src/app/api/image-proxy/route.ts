// File: src/app/api/image-proxy/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'edge'; // Superfast streaming on edge

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
      return new NextResponse('Missing URL', { status: 400 });
    }

    // Instagram API is stricter now. We need to pretend to be a server/browser.
    const res = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Referer': 'https://www.instagram.com/', // Crucial! Pretend we came from Instagram
      },
    });

    if (!res.ok) {
      return new NextResponse('Failed to fetch image', { status: res.status });
    }

    const contentType = res.headers.get('content-type');
    const imageBuffer = await res.arrayBuffer();

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType || 'image/jpeg',
        // Cache the image for 1 hour to save on API usage
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=600',
      },
    });

  } catch (error) {
    console.error("Image Proxy Error:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}