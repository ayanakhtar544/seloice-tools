import { WASM_COEP_TOOL_SLUGS } from './constants';

/** Ads cannot render on COEP-isolated WASM tool routes (iframe CORP mismatch). */
export function canShowAdsOnTool(slug: string | null): boolean {
  if (!slug) return true;
  return !WASM_COEP_TOOL_SLUGS.has(slug);
}
