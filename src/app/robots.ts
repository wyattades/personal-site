import type { MetadataRoute } from "next";

const HOST_URL = process.env.HOST_URL!;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/private/",
    },
    sitemap: `${HOST_URL}/sitemap.xml`,
  };
}
