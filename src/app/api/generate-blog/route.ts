// File: src/app/api/generate-blog/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey!);

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();
    
    // We use gemini-1.5-pro for better long-form content generation if possible, else flash
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = `You are an elite, Staff-level SEO Content Architect and Expert Copywriter. 
Your goal is to write a highly engaging, viral, and SEO-optimized blog post about the following topic: "${topic}".
The content must feel human-written, creator-focused, and highly actionable.

You MUST return a strict JSON object with the following schema:
{
  "title": "A highly clickable, viral H1 title",
  "metaTitle": "SEO optimized title under 60 characters",
  "metaDescription": "Compelling meta description under 160 characters designed for high CTR",
  "slug": "seo-friendly-url-slug",
  "excerpt": "A short, engaging hook/summary for the blog index page (2-3 sentences)",
  "content": "The full blog article in valid, clean HTML format. Include an engaging introduction, multiple H2 and H3 tags, actionable bullet points, and a strong conclusion with a Call to Action (CTA). DO NOT use markdown, strictly HTML tags (<h1>, <h2>, <p>, <ul>, <li>, <strong>, <em>, <br/>). Do not include the main title inside the content body, start directly with the intro paragraph.",
  "faqs": [
    {
      "question": "A common user question related to the topic?",
      "answer": "A clear, concise, and helpful answer."
    }
  ],
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "category": "Choose one: Tutorial, Case Study, Guide, Tool Review, Creator Strategy, Automation",
  "relatedTools": ["yt-title-generator", "hashtag-generator", "video-compressor"],
  "ogDescription": "OpenGraph description optimized for social sharing (Twitter, LinkedIn, Facebook)."
}

IMPORTANT: Ensure the JSON is perfectly valid. Do not wrap it in markdown code blocks if responseMimeType handles it, but since we are enforcing it via prompt, make absolutely sure it parses correctly. Make the 'content' field massive, detailed, and extremely valuable.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Safety parse
    const cleanText = text.replace(/```json|```/gi, "").trim();
    
    return NextResponse.json(JSON.parse(cleanText));
  } catch (error: any) {
    console.error("Final Error Trace:", error);
    return NextResponse.json({ error: "AI Error", details: error.message }, { status: 500 });
  }
}