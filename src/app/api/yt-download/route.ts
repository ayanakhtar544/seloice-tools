// File: src/app/api/yt-download/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // 🔥 Frontend se Trim details bhi le rahe hain ab
    const { url, isTrimming, startTime, endTime } = await req.json();

    if (!url || (!url.includes('youtube.com') && !url.includes('youtu.be'))) {
      return NextResponse.json({ error: "Sahi YouTube link daal bhai!" }, { status: 400 });
    }

     // console.log(`🔥 Fetching Formats for: ${url} | Trimming: ${isTrimming}`);

    let title = "Seloice Pro Video";
    let thumbnail = "";
    let views = "N/A", likes = "N/A", duration = "N/A", shares = "N/A";
    let allFormats: any[] = [];

    const videoId = url.split('v=')[1]?.split('&')[0] || url.split('youtu.be/')[1]?.split('?')[0] || '';
    thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    try {
        const RAPID_API_KEY = process.env.RAPID_API_KEY;
        if (RAPID_API_KEY && videoId) {
            
            // 🔥 API Endpoint setup
            let API_ENDPOINT = `https://youtube-media-downloader.p.rapidapi.com/v2/video/details?videoId=${videoId}&urlAccess=normal&videos=auto&audios=auto`;
            
            // ✂️ Agar trimming ON hai toh parameters add karo
            if (isTrimming && startTime && endTime) {
               API_ENDPOINT += `&start=${startTime}&end=${endTime}`;
                // console.log(`✂️ Trim Order Sent: From ${startTime} to ${endTime}`);
            }

            const res = await fetch(API_ENDPOINT, {
                headers: {
                    'x-rapidapi-key': RAPID_API_KEY,
                    'x-rapidapi-host': 'youtube-media-downloader.p.rapidapi.com'
                }
            });
            const data = await res.json();
            
            if (data && data.title) {
                // Agar trim hua hai toh title me (Trimmed) add kar do
                title = isTrimming ? `${data.title} (Trimmed)` : data.title;
                thumbnail = data.thumbnails?.[data.thumbnails.length - 1]?.url || thumbnail;
                
                views = data.viewCount ? Number(data.viewCount).toLocaleString() : "Hidden";
                likes = data.likeCount ? Number(data.likeCount).toLocaleString() : "Hidden";
                duration = data.lengthSeconds ? `${Math.floor(data.lengthSeconds / 60)}:${String(data.lengthSeconds % 60).padStart(2, '0')}` : "N/A";
                shares = data.viewCount ? Math.floor(Number(data.viewCount) * 0.005).toLocaleString() : "N/A";

                if (data.videos && data.videos.items) {
                    data.videos.items.forEach((vid: any) => {
                        allFormats.push({
                            quality: vid.quality || `${vid.height}p Video`,
                            type: "Video / MP4",
                            url: vid.url,
                            size: vid.size ? (vid.size / (1024 * 1024)).toFixed(1) + " MB" : "Size N/A"
                        });
                    });
                }
                if (data.audios && data.audios.items) {
                    data.audios.items.forEach((aud: any) => {
                        allFormats.push({
                            quality: "Audio MP3",
                            type: "Audio / MP3",
                            url: aud.url,
                            size: aud.size ? (aud.size / (1024 * 1024)).toFixed(1) + " MB" : "Size N/A"
                        });
                    });
                }
            }
        }
    } catch (e) {
         // console.log("⚠️ API Error.");
    }

    if (allFormats.length === 0) {
        throw new Error("Video API se fetch nahi ho payi.");
    }

    return NextResponse.json({ 
      success: true,
      meta: { title, thumbnail, views, likes, duration, shares },
      formats: allFormats
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}