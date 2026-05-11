// File: src/app/api/ig-download/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || !url.includes('instagram.com')) {
      return NextResponse.json({ error: "Sahi Instagram link daal bhai!" }, { status: 400 });
    }

    const RAPID_API_KEY = process.env.RAPID_API_KEY as string; 
    const RAPID_API_HOST = "instagram-reels-downloader-api.p.rapidapi.com"; 
    
    const API_ENDPOINT = `https://${RAPID_API_HOST}/download?url=${encodeURIComponent(url)}`;

    const response = await fetch(API_ENDPOINT, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': RAPID_API_KEY,
        'x-rapidapi-host': RAPID_API_HOST,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok || !data?.data) {
      throw new Error("API ne data nahi bheja. Shayad limit cross ho gayi ya account private hai.");
    }

    const igData = data.data;

    // Sirf Video files filter kar rahe hain (Audio aur baaki kachra hata rahe hain)
    const videoFiles = igData.medias ? igData.medias.filter((m: any) => m.type === 'video' || m.extension === 'mp4') : [];

    if (videoFiles.length === 0 && !igData.url) {
        throw new Error("Is post mein koi video nahi mili.");
    }

    // Success! Frontend ko poori Meta Information bhej rahe hain
    return NextResponse.json({ 
      success: true,
      // Default video (highest quality usually)
      videoUrl: videoFiles.length > 0 ? videoFiles[0].url : igData.url,
      // Saari available qualities bhej rahe hain
      availableVideos: videoFiles, 
      // Meta details (Caption, Likes, etc.)
      meta: {
        author: igData.author || igData.owner?.username || 'Instagram User',
        caption: igData.title || '',
        likes: igData.like_count || 0,
        views: igData.view_count || 0,
        thumbnail: igData.thumbnail || ''
      }
    });
    
  } catch (error: any) {
    console.error("RapidAPI Error:", error);
    return NextResponse.json({ error: error.message || "Server issue aa gaya bhai." }, { status: 500 });
  }
}