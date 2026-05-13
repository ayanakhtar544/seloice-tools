// File: src/app/api/force-download/route.ts
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const videoUrl = searchParams.get('url');
    const title = searchParams.get('title') || 'Seloice_Video';
    const ext = searchParams.get('ext') || 'mp4';

    if (!videoUrl) {
      return new NextResponse("URL is missing", { status: 400 });
    }

    console.log("🔥 Forcing Download for:", title);

    // Original link se file stream fetch karna
    const response = await fetch(videoUrl);

    if (!response.ok) {
      throw new Error("Download server se file nahi mili.");
    }

    // Naye headers banana jo browser ko "zabardasti download" karne ka order denge
    const headers = new Headers(response.headers);
    headers.set('Content-Disposition', `attachment; filename="${title.replace(/[^a-zA-Z0-9]/g, '_')}.${ext}"`);
    headers.set('Content-Type', 'application/octet-stream'); // Browser ko lagega ki ye koi normal file hai, video nahi

    // Stream ko wapas frontend par bhej dena
    return new NextResponse(response.body, {
      status: 200,
      headers: headers,
    });

  } catch (error: any) {
    console.error("🚨 Force Download Error:", error.message);
    return new NextResponse("Download failed", { status: 500 });
  }
}