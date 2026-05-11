// File: src/app/api/yt-tags/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || (!url.includes('youtube.com') && !url.includes('youtu.be'))) {
      return NextResponse.json({ error: "Sahi YouTube link daal bhai!" }, { status: 400 });
    }

    let videoId = "";
    if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('youtube.com/watch')) {
        const urlParams = new URL(url).searchParams;
        videoId = urlParams.get('v') || "";
    } else if (url.includes('youtube.com/shorts/')) {
        videoId = url.split('shorts/')[1].split('?')[0];
    }

    if(!videoId) {
        return NextResponse.json({ error: "Video ID nahi mili link se." }, { status: 400 });
    }

    // 🔥 SENIOR DEV HACK: DIRECT HTML SCRAPING 🔥
    // RapidAPI tags nahi de rahi, toh hum seedha YouTube ki website se HTML code mangwa rahe hain
    const ytResponse = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
        headers: {
            // YouTube ko lagna chahiye ki koi browser request kar raha hai, code nahi
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    });
    
    const html = await ytResponse.text();

    // Regex se HTML me se <meta name="keywords" content="tag1, tag2"> nikal rahe hain
    const keywordMatch = html.match(/<meta name="keywords" content="([^"]+)">/);
    let hiddenTags: string[] = [];
    
    if (keywordMatch && keywordMatch[1]) {
        // Keywords ko comma se tod kar array bana rahe hain
        hiddenTags = keywordMatch[1].split(',').map(tag => tag.trim());
    }

    // 🚨 RAPID API (Sirf Thumbnail aur Description ke liye use kar rahe hain)
    const RAPID_API_KEY = "b7d0902615msh1bd5a642973fb8cp12f811jsn158e61f2cf42"; 
    const RAPID_API_HOST = "youtube-media-downloader.p.rapidapi.com"; 
    const API_ENDPOINT = `https://${RAPID_API_HOST}/v2/video/details?videoId=${videoId}`;

    const response = await fetch(API_ENDPOINT, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': RAPID_API_KEY,
        'x-rapidapi-host': RAPID_API_HOST
      }
    });

    const data = await response.json();

    // Description me se #Hashtags nikalna (Regex se)
    const description = data?.description || "";
    const hashtagRegex = /#[\p{L}\p{N}_]+/gu; 
    const descHashtags = [...new Set(description.match(hashtagRegex) || [])];

    return NextResponse.json({ 
      success: true,
      data: {
        title: data?.title || "YouTube Video",
        thumbnail: data?.thumbnails && data.thumbnails.length > 0 ? data.thumbnails[data.thumbnails.length - 1].url : "",
        keywords: hiddenTags, // Yahan ab apna asli scraped data jayega!
        hashtags: descHashtags
      }
    });

  } catch (error: any) {
    console.error("YT Tags API Error:", error);
    return NextResponse.json({ error: error.message || "Server issue aa gaya bhai." }, { status: 500 });
  }
}