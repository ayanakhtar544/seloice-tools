// File: src/app/api/yt-download/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { url, startTime, endTime, isTrimming } = await req.json();

    if (!url || (!url.includes('youtube.com') && !url.includes('youtu.be'))) {
      return NextResponse.json({ error: "Sahi YouTube link daal bhai!" }, { status: 400 });
    }

    // SENIOR DEV LOGIC: YouTube URL se Video ID nikalna
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
        return NextResponse.json({ error: "Video ID nahi mili link se. Sahi link daal." }, { status: 400 });
    }

    const RAPID_API_KEY = process.env.RAPID_API_KEY as string; 
    const RAPID_API_HOST = "youtube-media-downloader.p.rapidapi.com"; 
    
    // TERA ASLI ENDPOINT JO TUNE CURL SE BHEJA HAI
    // Note: Is API ke hisaab se videos=auto aur audios=auto lagana zaroori hai
    let API_ENDPOINT = `https://${RAPID_API_HOST}/v2/video/details?videoId=${videoId}&urlAccess=normal&videos=auto&audios=auto`;

    // Agar trimming on hai, toh parameter add kar rahe hain (Agar teri API trim support karti hogi toh work karega)
    if (isTrimming && startTime && endTime) {
      API_ENDPOINT += `&start=${startTime}&end=${endTime}`;
      console.log("✂️ Trimming request bheji: ", startTime, "to", endTime);
    }

    const response = await fetch(API_ENDPOINT, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': RAPID_API_KEY,
        'x-rapidapi-host': RAPID_API_HOST,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log("🚨 YT API RESPONSE:", JSON.stringify(data, null, 2));

    if (!response.ok || !data) {
      throw new Error("API limit cross ho gayi ya video unavailable hai.");
    }

    // --- DATA MAPPER FOR THIS SPECIFIC API ---
    // Ye API video files ko data.videos me aur audio ko data.audios me bhejti hai
    let allFormats: any[] = [];
    
    if (data.videos && data.videos.items) {
       data.videos.items.forEach((vid: any) => {
           allFormats.push({
               quality: vid.quality || vid.height + "p",
               type: "video/mp4",
               url: vid.url,
               // Size ko bytes se MB me convert kar rahe hain (agar available hai)
               size: vid.size ? (vid.size / (1024 * 1024)).toFixed(1) + " MB" : "N/A"
           });
       });
    }

    if (data.audios && data.audios.items) {
        data.audios.items.forEach((aud: any) => {
           allFormats.push({
               quality: aud.audioQuality || "Audio",
               type: "audio/mp3",
               url: aud.url,
               size: aud.size ? (aud.size / (1024 * 1024)).toFixed(1) + " MB" : "N/A"
           });
       });
    }
   return NextResponse.json({ 
      success: true,
      meta: {
        title: data.title || "YouTube Video",
        author: data.author?.name || data.channel?.name || "YouTube Channel",
        views: data.viewCount || 0,
        likes: data.likeCount || 0, // NAYA: Likes
        commentsCount: data.commentCount || 0, // NAYA: Total Comments Count
        shares: Math.floor((data.viewCount || 0) / 150), // Trick: Shares aksar API nahi deti, toh views ke basis par estimate kar rahe hain
        duration: data.lengthSeconds ? `${Math.floor(data.lengthSeconds/60)}:${data.lengthSeconds%60}` : "N/A",
        thumbnail: data.thumbnails && data.thumbnails.length > 0 ? data.thumbnails[data.thumbnails.length - 1].url : ""
      },
      // NAYA: Kuch sample comments bhej rahe hain UI test karne ke liye
      // Asli app me tu yahan ek aur fetch maar sakta hai /video/comments endpoint par
      sampleComments: [
        { user: "Technical Sahil", text: "Bhai kya mast tool banaya hai! 🔥", time: "2 hours ago" },
        { user: "Coding King", text: "JEE ke saath development... Respect Abushahma! 🙌", time: "5 hours ago" },
        { user: "Ayaan Ali", text: "Download speed is crazy fast. Next level.", time: "1 day ago" }
      ],
      formats: allFormats
    });
  } catch (error: any) {
    console.error("YT API Error:", error);
    return NextResponse.json({ error: error.message || "Server issue aa gaya bhai." }, { status: 500 });
  }
}