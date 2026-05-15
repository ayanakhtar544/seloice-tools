import { NextResponse } from 'next/server';
import { hashToken } from '@/lib/security/admin-auth';

const ADMIN_COOKIE = 'admin_session';
const MAX_ATTEMPTS = 5;
const attemptMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = attemptMap.get(ip);
  if (!entry || now >= entry.resetAt) {
    attemptMap.set(ip, { count: 1, resetAt: now + 15 * 60_000 });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many login attempts. Try again later.' }, { status: 429 });
  }

  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'Admin login is not configured.' }, { status: 503 });
  }

  let password = '';
  try {
    const body = (await req.json()) as { password?: string };
    password = body.password ?? '';
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!password || password !== secret) {
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE, hashToken(secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 8,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
  return res;
}
