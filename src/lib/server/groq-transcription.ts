import { fetchWithRetry } from "@/lib/server/http";

const GROQ_TRANSCRIPTION_URL =
  "https://api.groq.com/openai/v1/audio/transcriptions";

const DEFAULT_MODEL = process.env.GROQ_TRANSCRIBE_MODEL?.trim() || "whisper-large-v3";

type GroqResponseFormat = "json" | "verbose_json";

interface BaseTranscriptionResponse {
  text?: string;
}

interface VerboseSegment {
  start: number;
  end: number;
  text: string;
}

export interface VerboseTranscriptionResponse extends BaseTranscriptionResponse {
  segments?: VerboseSegment[];
}

function getGroqApiKey(): string {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured.");
  }
  return apiKey;
}

export async function transcribeWithGroq(
  file: Blob,
  {
    filename = "audio.mp3",
    language,
    responseFormat,
  }: {
    filename?: string;
    language?: string;
    responseFormat: GroqResponseFormat;
  }
): Promise<BaseTranscriptionResponse | VerboseTranscriptionResponse> {
  const groqFormData = new FormData();
  groqFormData.append("file", file, filename);
  groqFormData.append("model", DEFAULT_MODEL);
  groqFormData.append("response_format", responseFormat);

  if (language && language !== "auto") {
    groqFormData.append("language", language);
  }

  const response = await fetchWithRetry(GROQ_TRANSCRIPTION_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getGroqApiKey()}`,
    },
    body: groqFormData,
    retries: 2,
    retryDelayMs: 1_250,
    timeoutMs: 45_000,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Groq transcription request failed.");
  }

  return (await response.json()) as
    | BaseTranscriptionResponse
    | VerboseTranscriptionResponse;
}
