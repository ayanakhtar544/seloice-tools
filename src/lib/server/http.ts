export interface RetryFetchOptions extends RequestInit {
  retries?: number;
  retryDelayMs?: number;
  timeoutMs?: number;
  retryOnStatuses?: number[];
}

const DEFAULT_RETRY_STATUSES = [408, 425, 429, 500, 502, 503, 504];

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchWithRetry(
  input: string | URL,
  {
    retries = 2,
    retryDelayMs = 1_000,
    timeoutMs = 20_000,
    retryOnStatuses = DEFAULT_RETRY_STATUSES,
    signal,
    ...init
  }: RetryFetchOptions = {}
): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const abortListener = () => controller.abort();
    signal?.addEventListener("abort", abortListener, { once: true });

    try {
      const response = await fetch(input, {
        ...init,
        signal: controller.signal,
      });

      if (!retryOnStatuses.includes(response.status) || attempt === retries) {
        return response;
      }

      lastError = new Error(`Upstream request failed with status ${response.status}`);
    } catch (error) {
      lastError = error;
      if (attempt === retries) {
        throw error;
      }
    } finally {
      clearTimeout(timeoutId);
      signal?.removeEventListener("abort", abortListener);
    }

    await sleep(retryDelayMs * (attempt + 1));
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Request failed after retries.");
}
