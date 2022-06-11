import * as ReactDOM from 'react-dom/server';
import { parse as parseUrl } from 'url';

import projects from 'lib/projects';

const HOST_URL = process.env.HOST_URL;

const staticFileGetters = {
  'robots.txt': () => `
Sitemap: ${HOST_URL}/sitemap.xml
`,
  'sitemap.xml': () => {
    const hourMs = 60 * 60 * 1000; // milliseconds in an hour
    const lastMod = new Date(
      Math.floor(Date.now() / hourMs) * hourMs,
    ).toISOString(); // get past hour

    const pathnames = [
      '/',
      '/about',
      '/contact',
      '/resume',
      '/projects',
      '/projects/games',
      ...projects.filter((p) => !p.noPage).map((p) => `/projects/${p.id}`),
    ];

    return (
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      ReactDOM.renderToStaticMarkup(
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
          {pathnames.map((pathname, i) => (
            <url key={i}>
              <loc>
                {HOST_URL}
                {pathname}
              </loc>
              <lastmod>{lastMod}</lastmod>
              <priority>1.00</priority>
              <changefreq>hourly</changefreq>
            </url>
          ))}
        </urlset>,
      )
    );
  },
};

const contentTypes = {
  txt: 'text/plain',
  xml: 'application/xml',
};

/** @type {import('next').NextApiHandler} */
export default async function staticFiles(req, res) {
  if (req.method !== 'GET') return res.status(404);

  const { pathname } = parseUrl(req.url);

  const [, filename, ext] = pathname.match(/^\/([\w/-]+(?:\.(\w+))?)$/) || [];

  const genFile = filename && staticFileGetters[filename];

  if (genFile) {
    try {
      const txt = await genFile();

      res.setHeader('cache-control', 'public, max-age=86400, immutable');
      res.setHeader(
        'content-type',
        `${contentTypes[ext] || contentTypes.txt}; charset=UTF-8`,
      );

      return res.send(txt);
    } catch {}
  }

  res.status(404);
}
