import type { NextConfig } from 'next';

const HOST_URL = process.env.VERCEL_URL
  ? 'https://wyattades.com'
  : 'http://localhost:3000';

const nextConfig: NextConfig = {
  env: {
    HOST_URL,
  },

  async redirects() {
    return [
      {
        source: '/projects/games/:game_id',
        destination: '/projects/:game_id',
        permanent: true,
      },
    ];
  },
};

// TODO: @next/bundle-analyzer

export default nextConfig;
