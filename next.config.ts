import type { NextConfig } from 'next';
import webpack from 'webpack';
import withPWAInit from '@ducanh2912/next-pwa';
const withPWA = withPWAInit({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === 'development',
});

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

/** credentialless: WASM tools can load FFmpeg from CDN without CORP headers on every host. */
const wasmHeaders = [
  { key: 'Cross-Origin-Embedder-Policy', value: 'credentialless' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
];

const WASM_TOOL_SLUGS = ['auto-captions', 'video-editor', 'audio-editor', 'video-compressor', 'mp4-to-text', 'speech-to-text', 'pdf-grid-maker', 'photo-editor'];

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
  webpack(config, { isServer }) {
    config.ignoreWarnings = config.ignoreWarnings || [];
    config.ignoreWarnings.push({
      message: /Critical dependency: the request of a dependency is an expression/,
      module: /@protobufjs\/inquire/
    });

    if (!isServer) {
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        fs: false,
      };
    }

    return config;
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
