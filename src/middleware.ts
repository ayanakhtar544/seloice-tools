// File: src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const adminCookie = request.cookies.get('admin_access');
  const { pathname } = request.nextUrl;

  // 🛡️ Admin Protection Logic
  // Agar user /admin ke kisi bhi page pe jana chahta hai (par login page nahi)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Agar cookie nahi hai, toh login pe bhej do
    if (!adminCookie) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Agar user already login hai aur wapas login page kholta hai, toh usey admin dashboard bhej do
  if (pathname === '/admin/login' && adminCookie) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

// Ye define karta hai ki middleware kin pages pe chalega
export const config = {
  matcher: '/admin/:path*',
};