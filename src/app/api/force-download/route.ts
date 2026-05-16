import { NextResponse } from 'next/server';
import { isSafeExternalUrl } from '@/lib/security/ssrf';
import { fetchWithRetry } from '@/lib/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const videoUrl = searchParams.get('url');
    const title = (searchParams.get('title') || 'Seloice_Video').slice(0, 120);
    const ext = (searchParams.get('ext') || 'mp4').replace(/[^a-z0-9]/gi, '') || 'mp4';

    if (!videoUrl) {
      return new NextResponse('URL is missing', { status: 400 });
    }

    if (!isSafeExternalUrl(videoUrl)) {
      return new NextResponse('Download URL is not allowed.', { status: 403 });
    }

    const response = await fetchWithRetry(videoUrl, {
      redirect: 'follow',
      headers: { 'User-Agent': 'SeloiceTools/1.0' },
      retries: 2,
      retryDelayMs: 1_250,
      timeoutMs: 55_000,
    });

    if (!response.ok) {
      return new NextResponse('Upstream file unavailable.', { status: 502 });
    }

    const safeName = title.replace(/[^a-zA-Z0-9._-]/g, '_');
    const headers = new Headers();
    const contentType = response.headers.get('content-type');
    if (contentType) headers.set('Content-Type', contentType);
    headers.set('Content-Disposition', `attachment; filename="${safeName}.${ext}"`);
    headers.set('Cache-Control', 'no-store');

    return new NextResponse(response.body, { status: 200, headers });
  } catch {
    return new NextResponse('Download failed', { status: 500 });
  }
}
