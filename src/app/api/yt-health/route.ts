// File: src/app/api/yt-health/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { handle } = await req.json();
    
    if (!handle) return NextResponse.json({ error: "Please provide a YouTube Handle or URL." }, { status: 400 });

    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
    if (!YOUTUBE_API_KEY) return NextResponse.json({ error: "API Key missing in environment." }, { status: 500 });

    let username = handle.trim();
    if (username.includes('youtube.com/')) {
      const parts = username.split('/');
      username = parts[parts.length - 1];
    }
    if (!username.startsWith('@')) username = '@' + username;

    // 1. Get Channel Info
    const searchRes = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(username)}&key=${YOUTUBE_API_KEY}`);
    const searchData = await searchRes.json();
    if (!searchData.items || searchData.items.length === 0) return NextResponse.json({ error: "Channel not found. Check the handle." }, { status: 404 });
    
    const channelId = searchData.items[0].id.channelId;
    const channelName = searchData.items[0].snippet.title;
    // 🔥 LOGO FIX: Fetching High-Res thumbnail
    const channelAvatar = searchData.items[0].snippet.thumbnails.high?.url || searchData.items[0].snippet.thumbnails.default?.url;

    // 2. Get Channel Stats & Uploads Playlist
    const channelRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=contentDetails,statistics&id=${channelId}&key=${YOUTUBE_API_KEY}`);
    const channelData = await channelRes.json();
    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;
    const subscriberCount = parseInt(channelData.items[0].statistics.subscriberCount || '0');

    // 3. Get Last 15 Videos
    const playlistRes = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=15&key=${YOUTUBE_API_KEY}`);
    const playlistData = await playlistRes.json();
    const videoIds = playlistData.items.map((item: any) => item.snippet.resourceId.videoId).join(',');

    // 4. Get Deep Video Stats (Views, Likes, Comments, Tags)
    const statsRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoIds}&key=${YOUTUBE_API_KEY}`);
    const statsData = await statsRes.json();

    if (!statsData.items || statsData.items.length < 5) {
      return NextResponse.json({ error: "Need at least 5 videos to perform a deep audit." }, { status: 400 });
    }

    // 🧠 THE DEEP AUDIT MATH 🧠
    let totalViews = 0, totalLikes = 0, totalComments = 0;
    let seoScoreAcc = 0;
    let uploadDates: Date[] = [];

    statsData.items.forEach((item: any) => {
      const views = parseInt(item.statistics.viewCount || '0');
      const likes = parseInt(item.statistics.likeCount || '0');
      const comments = parseInt(item.statistics.commentCount || '0');
      
      totalViews += views;
      totalLikes += likes;
      totalComments += comments;
      uploadDates.push(new Date(item.snippet.publishedAt));

      // SEO Check: Has tags and description > 50 chars
      let hasTags = item.snippet.tags && item.snippet.tags.length > 0;
      let goodDesc = item.snippet.description && item.snippet.description.length > 50;
      if (hasTags && goodDesc) seoScoreAcc += 100;
      else if (hasTags || goodDesc) seoScoreAcc += 50;
    });

    const analyzableVideos = statsData.items.map((i: any) => parseInt(i.statistics.viewCount || '0')).slice(1);
    const recentVideos = analyzableVideos.slice(0, 3);
    const olderVideos = analyzableVideos.slice(3, 10);
    
    const avgRecent = recentVideos.reduce((a: number, b: number) => a + b, 0) / (recentVideos.length || 1);
    const avgOlder = olderVideos.reduce((a: number, b: number) => a + b, 0) / (olderVideos.length || 1);

    // Metric 1: Freeze Score
    let dropPercentage = avgOlder > 0 ? ((avgOlder - avgRecent) / avgOlder) * 100 : 0;
    let freezeScore = dropPercentage > 0 ? Math.max(0, 100 - (dropPercentage * 1.2)) : 100;

    // Metric 2: True Engagement Rate
    let engagementRate = totalViews > 0 ? ((totalLikes + totalComments) / totalViews) * 100 : 0;

    // Metric 3: SEO Health
    let seoHealth = seoScoreAcc / statsData.items.length;

    // Metric 4: Consistency (Avg days between uploads)
    uploadDates.sort((a, b) => b.getTime() - a.getTime()); // Newest first
    let daysBetweenUploads = 0;
    if (uploadDates.length > 1) {
      const msDiff = uploadDates[0].getTime() - uploadDates[uploadDates.length - 1].getTime();
      daysBetweenUploads = (msDiff / (1000 * 60 * 60 * 24)) / uploadDates.length;
    }

    // Determine Overall Status
    let status = 'HEALTHY';
    let message = 'Your channel is well-optimized! The algorithm is actively pushing your content.';
    if (freezeScore < 40) {
      status = 'FROZEN'; message = 'Algorithm Alert! Your recent views are dropping. YouTube is not finding the right audience for your new videos.';
    } else if (freezeScore < 70) {
      status = 'MODERATE'; message = 'Inconsistent performance. The algorithm is confused about your exact niche.';
    }

    return NextResponse.json({
      success: true,
      meta: { channelName, channelAvatar, username, subscriberCount },
      stats: {
        score: Math.round(freezeScore),
        status, message, dropPercentage: Math.max(0, Math.round(dropPercentage)),
        avgRecent: Math.round(avgRecent),
        avgOlder: Math.round(avgOlder),
        audit: {
          engagementRate: Number(engagementRate.toFixed(2)),
          seoHealth: Math.round(seoHealth),
          avgUploadGapDays: Number(daysBetweenUploads.toFixed(1)),
        }
      }
    });

  } catch (error: any) {
    console.error("YT Health Checker Error:", error);
    return NextResponse.json({ error: "Failed to run deep audit. Try again." }, { status: 500 });
  }
}