const HOST_URL = process.env.VERCEL_URL
  ? 'https://wyattades.com'
  : 'http://localhost:3000';

const staticFiles = ['sitemap.xml', 'robots.txt'];

/** @type {import('next/dist/server/config').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  env: {
    HOST_URL,
  },

  async rewrites() {
    return staticFiles.map((f) => ({
      source: '/' + f,
      destination: '/api/static_files',
    }));
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

module.exports = require('@next/bundle-analyzer')({
  enabled: process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL,
})(nextConfig);
