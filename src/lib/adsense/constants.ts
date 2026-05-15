/** Google AdSense publisher + slot IDs (numeric slots only). */
export const ADSENSE_CLIENT = 'ca-pub-7632798085856544';

export const AD_SLOTS = {
  banner: '8857456383',
  responsive: '5965139122',
  inArticle: '4049422228',
} as const;

export type AdSlotKey = keyof typeof AD_SLOTS;

/** Tools that set COEP/COOP for WASM — AdSense iframes cannot load there. */
export const WASM_COEP_TOOL_SLUGS = new Set([
  'video-compressor',
  'video-editor',
  'audio-editor',
  'photo-editor',
  'file-converter',
  'mp4-to-mp3',
  'bg-remover',
  'auto-captions',
  'mp4-to-text',
  'speech-to-text',
  'image-converter',
]);

export const ADSENSE_SCRIPT_URL = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
