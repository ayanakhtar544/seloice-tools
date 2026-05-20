// File: src/app/api/ig-shadowban/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { username } = await req.json();
    
    if (!username) {
      return NextResponse.json({ error: "Please provide an Instagram username." }, { status: 400 });
    }

    const RAPID_API_KEY = process.env.RAPID_API_KEY || process.env.RAPIDAPI_KEY;
    if (!RAPID_API_KEY) {
      return NextResponse.json({ error: "API Key missing in environment." }, { status: 500 });
    }

    let cleanUsername = username.trim().replace('@', '');
    if (cleanUsername.includes('instagram.com/')) {
      cleanUsername = cleanUsername.split('instagram.com/')[1].split('/')[0];
    }

    const RAPID_API_HOST = "instagram-scraper-stable-api.p.rapidapi.com"; 
    const API_ENDPOINT = `https://${RAPID_API_HOST}/ig_get_fb_profile_hover.php?username_or_url=${cleanUsername}`; 

    const res = await fetch(API_ENDPOINT, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': RAPID_API_KEY,
        'x-rapidapi-host': RAPID_API_HOST,
        'Content-Type': 'application/json'
      }
    });

    const data = await res.json();

    const user = data?.user_data;
    if (!res.ok || !user) {
      throw new Error(data?.message || "Account not found or Invalid Username.");
    }

    if (user.is_private) {
      return NextResponse.json({ error: "Cannot audit private accounts. Make it public first." }, { status: 400 });
    }

    // 🚀 EXTRACTING ALL RAW DATA
    const followers = user.follower_count ?? 0;
    const following = user.following_count ?? 0;
    const mediaCount = user.media_count ?? 0;
    const isVerified = user.is_verified || false;
    const accountId = user.pk || user.id || 'N/A';
    const hasFbLinked = !!user.fbid_v2; // Checks if Facebook ID exists
    const fullName = user.full_name || user.username || cleanUsername;
    const igImageUrl = user.hd_profile_pic_url_info?.url || user.profile_pic_url || '';
    // Wrap the original URL in our proxy endpoint, and keep a dummy fallback
    const avatarUrl = igImageUrl 
      ? `/api/image-proxy?url=${encodeURIComponent(igImageUrl)}` 
      : `https://ui-avatars.com/api/?name=${cleanUsername}&background=E1306C&color=fff`;

    // 🧠 ADVANCED TRUST & SHADOWBAN MATH       
    let score = 100;
    
    // Follower/Following Ratio check
    const ratio = following > 0 ? followers / following : followers;
    if (following > 1500 && ratio < 0.5) {
      score -= 30; // Spam behavior
    } else if (ratio > 10) {
      score += 5; // Healthy ratio bonus
    }

    // Activity check
    if (mediaCount === 0) score -= 40; 
    else if (mediaCount < 5) score -= 15;

    // Trust Signals
    if (isVerified) score = 100; // Verified accounts are rarely shadowbanned
    if (hasFbLinked) score += 5; // Linked FB increases trust

    // Estimations (Since API lacks real likes)
    let estimatedEngagementRate = 0;
    if (followers > 0) {
      if (followers < 1000) estimatedEngagementRate = 4.8;
      else if (followers < 10000) estimatedEngagementRate = 2.5;
      else estimatedEngagementRate = 1.2;
      
      // Affect engagement based on trust score
      estimatedEngagementRate = (estimatedEngagementRate * score) / 100;
    }
    const estimatedAvgLikes = Math.round((followers * (estimatedEngagementRate / 100)));

    score = Math.max(0, Math.min(100, Math.round(score)));

    let status = 'HEALTHY';
    let message = 'Your profile architecture is solid. Instagram sees you as a trusted creator.';
    if (score < 50) {
      status = 'SHADOWBANNED'; 
      message = 'Your account metrics show spam patterns (e.g., bad following ratio). Reach is heavily restricted.';
    } else if (score < 80) {
      status = 'RESTRICTED'; 
      message = 'Moderate Risk. Your profile lacks trust signals (low media or missing FB link). Distribution might be limited.';
    }

    return NextResponse.json({
      success: true,
      meta: { 
        username: user.username || cleanUsername, 
        fullName: fullName, 
        avatar: avatarUrl,
        followers: followers,
        following: following,
        mediaCount: mediaCount,
        isVerified: isVerified,
        accountId: accountId,
        hasFbLinked: hasFbLinked
      },
      stats: {
        score, status, message,
        engagementRate: Number(estimatedEngagementRate.toFixed(2)),
        avgLikes: estimatedAvgLikes,
        followRatio: Number(ratio.toFixed(1))
      }
    });

  } catch (error: any) {
    console.error("IG Shadowban Checker Error:", error);
    return NextResponse.json({ error: error.message || "Failed to analyze account." }, { status: 500 });
  }
}