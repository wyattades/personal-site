const HOST_URL = process.env.VERCEL_URL
  ? 'https://wyattades.com'
  : 'http://localhost:3000';

const nextConfig = {
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

module.exports = require('@next/bundle-analyzer')({
  enabled: process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL,
})(nextConfig);
