import { z } from 'zod';

// --- API REQUEST SCHEMAS ---

export const DownloadRequestSchema = z.object({
  url: z.string().url({ message: "Invalid URL provided" }),
  quality: z.enum(['720p', '1080p', '4k', 'mp3']).optional().default('1080p'),
  isTrimming: z.boolean().optional().default(false),
  startTime: z.number().optional().default(0),
  endTime: z.number().optional().default(0),
});

export const CaptionRequestSchema = z.object({
  videoId: z.string().min(1),
  language: z.string().min(2).max(5).default('en'),
});

// --- SANITIZATION UTILITIES ---

export function sanitizeInput(input: string): string {
  // Basic XSS prevention for string inputs
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

export function validateRequest<T>(
  schema: z.Schema<T>,
  data: unknown,
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      error: result.error.issues.map((e) => e.message).join(', '),
    };
  }
  return {
    success: true,
    data: result.data,
  };
}
