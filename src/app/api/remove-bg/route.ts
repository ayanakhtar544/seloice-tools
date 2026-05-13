// File: src/app/api/remove-bg/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json({ error: "Image kahan hai bhai?" }, { status: 400 });
    }

    console.log("🚀 Ansari Bhaiya's Free-API-First Engine Started...");

    let processedUrl = "";

    // ==============================================================
    // 🔥 PRIORITY 1: AEMT API (Fastest Free Public)
    // ==============================================================
    try {
      console.log("⚙️ Trying Priority 1 (AEMT)...");
      const apiData1 = new FormData();
      apiData1.append('image', imageFile);

      const res1 = await fetch('https://aemt.me/removebg', { method: 'POST', body: apiData1 });
      const type1 = res1.headers.get('content-type') || '';
      
      if (type1.includes('image')) {
        const buffer = await res1.arrayBuffer();
        processedUrl = `data:${type1};base64,${Buffer.from(buffer).toString('base64')}`;
      } else if (type1.includes('json')) {
        const data1 = await res1.json();
        if (data1.url) processedUrl = data1.url;
      }
    } catch (e) {
      console.log("⚠️ Priority 1 Failed.");
    }

    // ==============================================================
    // 🔥 PRIORITY 2: SIPUTZX API (Free Public Backup)
    // ==============================================================
    if (!processedUrl) {
      try {
        console.log("⚙️ Trying Priority 2 (SIPUTZX)...");
        const apiData2 = new FormData();
        apiData2.append('image', imageFile); 

        const res2 = await fetch('https://api.siputzx.my.id/api/tools/removebg', { method: 'POST', body: apiData2 });
        const type2 = res2.headers.get('content-type') || '';
        
        if (type2.includes('json')) {
          const data2 = await res2.json();
          if (data2.data && data2.data.url) processedUrl = data2.data.url;
        }
      } catch (e) {
        console.log("⚠️ Priority 2 Failed.");
      }
    }

    // ==============================================================
    // 🔥 PRIORITY 3: VREDEN API (Last Free Backup)
    // ==============================================================
    if (!processedUrl) {
        try {
          console.log("⚙️ Trying Priority 3 (VREDEN)...");
          const apiData3 = new FormData();
          apiData3.append('image', imageFile); 
  
          const res3 = await fetch('https://api.vreden.my.id/api/removebg', { method: 'POST', body: apiData3 });
          const type3 = res3.headers.get('content-type') || '';
          
          if (type3.includes('image')) {
            const buffer = await res3.arrayBuffer();
            processedUrl = `data:${type3};base64,${Buffer.from(buffer).toString('base64')}`;
          }
        } catch (e) {
          console.log("⚠️ Priority 3 Failed.");
        }
      }

    // ==============================================================
    // 🛡️ LAST RESORT: CLOUDINARY (Agar saari Free APIs marr jayein)
    // ==============================================================
    if (!processedUrl) {
      console.log("🛡️ Sab Free APIs fail ho gayi. Shifting to Cloudinary...");
      
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || process.env.CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
         throw new Error("Free APIs down hain aur Cloudinary keys bhi nahi mili! .env.local check kar.");
      }

      const cloudData = new FormData();
      cloudData.append('file', imageFile);
      cloudData.append('upload_preset', uploadPreset);

      const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: cloudData
      });

      const data = await cloudRes.json();

      if (data.error) throw new Error(`Cloudinary Error: ${data.error.message}`);

      // The Magic Bypass for unsigned upload
      processedUrl = data.secure_url.replace('/upload/', '/upload/e_background_removal/');
      console.log("✅ Cloudinary Success!");
    }

    return NextResponse.json({ success: true, url: processedUrl });

  } catch (error: any) {
    console.error("🚨 Final API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}