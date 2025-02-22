import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import remarkGfm from "remark-gfm";

const HOST_URL = process.env.VERCEL_URL
  ? "https://wyattades.com"
  : "http://localhost:3000";

// eslint-disable-next-line import/no-mutable-exports
let nextConfig: NextConfig = {
  env: {
    HOST_URL,
  },

  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],

  async redirects() {
    return [
      {
        // TEMP: support legacy routes
        source: "/projects/games/:game_id",
        destination: "/projects/:game_id",
        permanent: true,
      },
    ];
  },
};

// TODO: @next/bundle-analyzer

nextConfig = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
  },
})(nextConfig);

export default nextConfig;
