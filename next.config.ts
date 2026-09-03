import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const HOST_URL = process.env.VERCEL_URL
  ? "https://wyattades.com"
  : "http://localhost:3000";

let nextConfig: NextConfig = {
  env: {
    HOST_URL,
  },

  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],

  async redirects() {
    return [
      {
        source: "/projects/games",
        destination: "/projects",
        permanent: true,
      },
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
    remarkPlugins: ["remark-gfm"],
  },
})(nextConfig);

export default nextConfig;
