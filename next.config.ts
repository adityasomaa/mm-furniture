import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Catalog photography is pre-derived to AVIF/WebP at build time by
  // scripts/fetch-assets.mjs, so the runtime optimizer stays out of the hot path.
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
  },

  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      {
        // Content-addressed by filename; safe to pin hard.
        source: '/catalog/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      { source: '/llms.txt', headers: [{ key: 'Content-Type', value: 'text/plain; charset=utf-8' }] },
    ];
  },

  async redirects() {
    return [
      // Legacy WordPress plumbing that is now dead weight in the index.
      { source: '/feed', destination: '/', permanent: true },
      { source: '/comments/feed', destination: '/', permanent: true },
      { source: '/xmlrpc.php', destination: '/', permanent: true },
      { source: '/wp-admin/:path*', destination: '/', permanent: true },
      { source: '/wp-login.php', destination: '/', permanent: true },
      // NOTE: there is deliberately no /blog redirect here. An earlier build folded the
      // legacy (empty) blog into /about; /blog is now a real section and a redirect
      // would swallow it.
      // Legacy category slug that differed from its label.
      { source: '/catalog/rak-almari', destination: '/catalog/almari', permanent: true },
      { source: '/en/catalog/rak-almari', destination: '/en/catalog/almari', permanent: true },
    ];
  },
};

export default nextConfig;
