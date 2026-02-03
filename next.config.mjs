/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'foxezhxncpzzpbemdafa.supabase.co' },
    ],
  },
  async headers() {
    return [
      {
        source: '/registry',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://widget.zola.com https://*.zola.com",
              "frame-src https://*.zola.com https://widget.zola.com",
              "style-src 'self' 'unsafe-inline' https://*.zola.com",
              "img-src 'self' data: https://*.zola.com https://*.cloudfront.net",
              "connect-src 'self' https://*.zola.com",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;