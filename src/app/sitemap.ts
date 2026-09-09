import fs from "node:fs";
import path from "node:path";

import type { MetadataRoute } from "next";
import { projects } from "~/lib/projects";

const HOST_URL = process.env.HOST_URL!;

type Entry = MetadataRoute.Sitemap[number];

const BLOG_DIR = path.join(process.cwd(), "src/pages/blog");

/**
 * Read article slugs straight off disk rather than through `~/articles`.
 * That module pulls in each MDX file's React component tree, which cannot be
 * imported from an App Router server module.
 */
const getArticleEntries = (): Entry[] => {
  let filenames: string[];
  try {
    filenames = fs.readdirSync(BLOG_DIR);
  } catch {
    return [];
  }

  return filenames
    .filter((filename) => filename.endsWith(".mdx"))
    .map((filename) => {
      const source = fs.readFileSync(path.join(BLOG_DIR, filename), "utf8");
      const publishedAt = /publishedAt:\s*"([\d-]+)"/.exec(source)?.[1];

      return {
        url: `/blog/${filename.replace(/\.mdx$/, "")}`,
        ...(publishedAt ? { lastModified: new Date(publishedAt) } : {}),
        changeFrequency: "yearly",
        priority: 0.7,
      } satisfies Entry;
    });
};

export default function sitemap(): MetadataRoute.Sitemap {
  const hourMs = 60 * 60 * 1000; // milliseconds in an hour
  const lastMod = new Date(Math.floor(Date.now() / hourMs) * hourMs); // get past hour

  const entries: Entry[] = [
    { url: "/", changeFrequency: "monthly", priority: 1 },
    { url: "/projects", changeFrequency: "monthly", priority: 0.8 },
    { url: "/blog", changeFrequency: "weekly", priority: 0.8 },
    { url: "/about", changeFrequency: "yearly", priority: 0.6 },
    { url: "/contact", changeFrequency: "yearly", priority: 0.5 },
    { url: "/resume", changeFrequency: "yearly", priority: 0.5 },
    ...projects.map(
      (p): Entry => ({
        url: `/projects/${p.id}`,
        changeFrequency: "yearly",
        priority: 0.7,
      }),
    ),
    ...getArticleEntries(),
  ];

  return entries.map((entry) => ({
    ...entry,
    url: `${HOST_URL}${entry.url === "/" ? "" : entry.url}`,
    lastModified: entry.lastModified ?? lastMod,
  }));
}
