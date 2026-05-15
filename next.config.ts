import type { NextConfig } from 'next';
import withPWAInit from '@ducanh2912/next-pwa';
import { WASM_COEP_TOOL_SLUGS } from './src/lib/adsense/constants';

const withPWA = withPWAInit({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === 'development',
  workboxOptions: {
    disableDevLogs: true,
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/pagead2\.googlesyndication\.com\/.*/i,
        handler: 'NetworkOnly',
        options: { cacheName: 'adsense-bypass' },
      },
      {
        urlPattern: /^https:\/\/(googleads|tpc)\.g\.doubleclick\.net\/.*/i,
        handler: 'NetworkOnly',
        options: { cacheName: 'doubleclick-bypass' },
      },
    ],
  },
});

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const wasmHeaders = [
  { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
];

const WASM_TOOL_SLUGS = [...WASM_COEP_TOOL_SLUGS];

const nextConfig: NextConfig = {
  turbopack: {},
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  async headers() {
    return [
      { source: '/(.*)', headers: securityHeaders },
      ...WASM_TOOL_SLUGS.map((tool) => ({
        source: `/tools/${tool}`,
        headers: wasmHeaders,
      })),
      ...WASM_TOOL_SLUGS.map((tool) => ({
        source: `/tools/${tool}/:path*`,
        headers: wasmHeaders,
      })),
    ];
  },
};

export default withPWA(nextConfig);
