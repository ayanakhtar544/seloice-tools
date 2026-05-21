import { NextResponse } from 'next/server';

interface YouTubeWebhookPayload {
  videoId: string;
  channelId: string;
  channelName: string;
  videoTitle: string;
  videoUrl: string;
  creatorEmail: string; // assumed extracted or passed via Make.com/Zapier
}

export async function POST(req: Request) {
  try {
    const body: YouTubeWebhookPayload = await req.json();

    if (!body.videoUrl || !body.channelName || !body.creatorEmail) {
      return NextResponse.json(
        { error: 'Missing required payload fields: videoUrl, channelName, creatorEmail' },
        { status: 400 }
      );
    }

    // SIMULATED: Trigger Seloice AI core to process the video in the background
    // In a real scenario, this would ping a Python/Go worker, and return an async job ID.
    // We mock the generated shorts URLs for the email payload.
    
    const mockShorts = [
      `https://seloice.com/shared/clip_98vA2x`,
      `https://seloice.com/shared/clip_34kL9p`,
      `https://seloice.com/shared/clip_77mQ1n`,
    ];

    // Build the high-converting cold outreach email template
    const emailSubject = `I made 3 shorts from your new video: ${body.videoTitle}`;
    
    const emailBodyHTML = `
      <p>Hey ${body.channelName},</p>
      
      <p>I loved your recent video <strong>"${body.videoTitle}"</strong>. Great insights.</p>
      
      <p>I ran it through an AI tool I built that finds the most viral moments in long videos and crops them for TikTok/Reels.</p>
      
      <p>It found 3 moments that scored 95+ on the virality index. I already processed them with captions so you can just download and post them directly (no watermark):</p>
      
      <ul>
        <li><a href="${mockShorts[0]}">Clip 1: The main hook</a></li>
        <li><a href="${mockShorts[1]}">Clip 2: High-retention segment</a></li>
        <li><a href="${mockShorts[2]}">Clip 3: Controversial take</a></li>
      </ul>
      
      <p>Let me know if you end up posting them! Would love to see how they perform.</p>
      
      <p>Best,<br/>Ayan<br/>Founder, Seloice</p>
    `;

    // In a real scenario, we would trigger Resend or SendGrid here:
    // await resend.emails.send({
    //   from: 'Ayan <ayan@seloice.com>',
    //   to: [body.creatorEmail],
    //   subject: emailSubject,
    //   html: emailBodyHTML
    // });

    return NextResponse.json({
      success: true,
      message: 'Video queued for AI processing and creator email prepared.',
      data: {
        emailSubject,
        emailBodyHTML,
        jobId: `job_${Math.random().toString(36).substring(7)}`,
        status: 'simulated_success'
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
