// File: src/app/api/generate-blog/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) throw new Error("API Key .env.local file mein nahi mil rahi hai!");

    const { topic } = await req.json();

    const prompt = `You are an expert SEO Content Writer. Write a highly engaging blog about: "${topic}".
    CRITICAL: You MUST respond ONLY with a raw JSON object. Do NOT wrap it in markdown.
    Format exactly like this:
    {"title": "Title", "slug": "slug", "metaTitle": "SEO Title", "metaDescription": "Desc", "excerpt": "Short", "content": "HTML Content", "category": "Tutorial", "tags": ["tag1"], "faqs": [], "relatedTools": [], "ogDescription": "OG"}`;

    console.log(`[SYSTEM] Fetching available models for your API Key...`);

    // 🚀 STEP 1: API ko call karke Models ki list nikaalo
    const listModelsUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const listRes = await fetch(listModelsUrl);
    const listData = await listRes.json();

    if (!listRes.ok) {
      throw new Error(`ListModels Error: ${listData.error?.message}`);
    }

    // Sirf wahi models filter karo jo text generation ('generateContent') support karte hain aur jinke naam me 'gemini' hai
    const validModels = (listData.models || []).filter((m: any) => 
      m.name.includes("gemini") && 
      m.supportedGenerationMethods?.includes("generateContent")
    );

    if (validModels.length === 0) {
      throw new Error("Tumhari API Key par koi bhi valid Gemini Text model enable nahi hai!");
    }

    // Terminal me list print karo taaki hume pata chale key me kya-kya hai
    console.log("✅ Valid Models for your Key:", validModels.map((m: any) => m.name));

    // Sabse best model auto-select karo
    let selectedModelName = validModels[0].name; // Default pehla model
    
    // Priority set kar rahe hain: Flash -> Pro -> Normal
    for (const m of validModels) {
      if (m.name.includes("1.5-flash")) {
        selectedModelName = m.name;
        break; // Flash mil gaya toh ruk jao, ye sabse fast hai
      } else if (m.name.includes("1.5-pro")) {
        selectedModelName = m.name;
      }
    }

    console.log(`[SYSTEM] Dynamically Selected Model: ${selectedModelName} 🔥`);

    // 🚀 STEP 2: Selected model se Blog Generate karo
    // Note: selectedModelName me 'models/gemini-xxx' already likha hoga
    const generateUrl = `https://generativelanguage.googleapis.com/v1beta/${selectedModelName}:generateContent?key=${apiKey}`;

    const response = await fetch(generateUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Generation Error: ${data.error?.message || "Unknown Error"}`);
    }

    let text = data.candidates[0].content.parts[0].text;

    // 🚀 BULLETPROOF JSON EXTRACTION
    const startIndex = text.indexOf('{');
    const endIndex = text.lastIndexOf('}');
    if (startIndex !== -1 && endIndex !== -1) { 
      text = text.substring(startIndex, endIndex + 1); 
    }

    console.log("[SUCCESS] Magic Complete! JSON Data frontend ko bhej diya.");
    return NextResponse.json(JSON.parse(text));

  } catch (error: any) {
    console.error("Dynamic API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}