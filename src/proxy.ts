import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { buildAdSenseCsp } from '@/lib/adsense/csp';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { hashToken } from '@/lib/security/admin-auth';

export async function proxy(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';
  const { pathname } = request.nextUrl;

  const adminSecret = process.env.ADMIN_SECRET;
  const sessionVal = request.cookies.get('admin_session')?.value;
  const adminCookie = Boolean(adminSecret && sessionVal === hashToken(adminSecret));

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!adminCookie) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  if (pathname === '/admin/login' && adminCookie) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  if (pathname.startsWith('/api/')) {
    const userAgent = request.headers.get('user-agent') || '';
    const isBot = /bot|crawler|spider|crawl|selenium|puppeteer|scrapy/i.test(userAgent);
    const botProtectedPrefixes = [
      '/api/yt-download',
      '/api/ig-download',
      '/api/force-download',
      '/api/transcribe',
      '/api/remove-bg',
      '/api/generate-',
      '/api/admin/',
    ];
    const isBotProtectedApi = botProtectedPrefixes.some((p) => pathname.startsWith(p));

    if (isBot && isBotProtectedApi && !pathname.startsWith('/api/og')) {
      return new NextResponse(JSON.stringify({ error: 'Automated access is not allowed on this endpoint.' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { limited, retryAfter } = await checkRateLimit(ip, pathname);
    if (limited) {
      return new NextResponse(JSON.stringify({ error: 'Too many requests. Please try again later.' }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(retryAfter),
        },
      });
    }
  }

  const response = NextResponse.next();
  response.headers.set('x-pathname', pathname);
  response.headers.set('Content-Security-Policy', buildAdSenseCsp());
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|json|js|woff2?)$).*)'],
};
