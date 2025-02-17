import type { MetadataRoute } from "next";
import projects from "~/lib/projects";

const HOST_URL = process.env.HOST_URL!;

export default function sitemap(): MetadataRoute.Sitemap {
  const hourMs = 60 * 60 * 1000; // milliseconds in an hour
  const lastMod = new Date(Math.floor(Date.now() / hourMs) * hourMs); // get past hour

  const pathnames = [
    "/",
    "/about",
    "/contact",
    "/resume",
    "/projects",
    "/projects/games",
    ...projects.filter((p) => !p.noPage).map((p) => `/projects/${p.id}`),
  ];

  return pathnames.map((pathname) => ({
    url: `${HOST_URL}${pathname}`,
    lastModified: lastMod,
    changeFrequency: "hourly",
    priority: 1,
  }));
}
