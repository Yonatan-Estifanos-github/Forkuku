/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'foxezhxncpzzpbemdafa.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async redirects() {
    return [
      {
        source: '/sms-opt-in-proof.jpg',
        destination: 'https://foxezhxncpzzpbemdafa.supabase.co/storage/v1/object/public/wedding-ui/rsvp3.jpg',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
