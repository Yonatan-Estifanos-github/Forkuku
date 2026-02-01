/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'foxezhxncpzzpbemdafa.supabase.co' },
    ],
  },
};

export default nextConfig;