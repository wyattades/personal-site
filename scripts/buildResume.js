const fs = require('fs');
const { pipeline } = require('stream');
const { promisify } = require('util');

const prettier = require('prettier');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const fetch = require('node-fetch');

const streamPipeline = promisify(pipeline);

const callOpenHtmlToPdf = async (type, html, outFile) => {
  const res = await fetch(`https://sandbox.openhtmltopdf.com/post-${type}`, {
    method: 'POST',
    body: new URLSearchParams({
      'upload-area': html,
    }),
  });

  if (!res.ok)
    throw new Error(`post-${type}: unexpected response ${res.statusText}`);

  if (type === 'logs') {
    const logs = await res.text();

    console.log('LOG OUTPUT:\n\n', logs);

    fs.writeFileSync(outFile, logs, 'utf8');

    if (/\bunhandled exception\b/i.test(logs))
      throw new Error('Logs contained fatal error');
  } else {
    await streamPipeline(res.body, fs.createWriteStream(outFile));
  }
};

const HOST = 'http://localhost:3000';

const fetchPageHtml = async (url) => {
  // NOTE: make sure xlaunch is running if using WSL2
  const browser = await puppeteer.launch();

  const page = await browser.newPage();

  // NOTE: make sure the dev server is running
  const res = await page.goto(url);

  if (res.status() !== 200)
    throw new Error(`Bad "goto" response: ${res.url()} - ${res.status()}`);

  const pageHtml = await page.content();

  await browser.close();

  return pageHtml;
};

const getPlainHtml = async (outFile) => {
  const pageHtml = await fetchPageHtml(HOST + '/resume');

  const $ = cheerio.load(pageHtml);

  for (const el of $('link[rel="stylesheet"][href]').toArray()) {
    const res = await fetch(new URL(el.attribs.href, HOST).href);
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('text/css'))
      throw new Error('Bad css content-type: ' + ct);

    const css = await res.text();
    $('head').append(
      `<style data-from-href="${el.attribs.href}">${css}</style>`,
    );
  }

  // remove unnecessary elements
  $(
    'script, link, noscript, meta:not([name="description"]), next-route-announcer, #__next-build-watcher, [data-next-hide-fouc]',
  ).remove();

  $('style')
    .contents()
    .each((_, el) => {
      if (el.type === 'text') {
        // remove source-map comments
        el.data = el.data.replace(/\/\*# sourceMappingURL=.*?\*\/$/, '');
      }
    });

  // remove all HTML comments
  $.root()
    .find('*')
    .contents()
    .filter((_, n) => n.type === 'comment')
    .remove();

  const outHtml = prettier.format($.html(), { parser: 'html' });

  fs.writeFileSync(outFile, outHtml, 'utf8');

  return outHtml;
};

(async () => {
  fs.mkdirSync('tmp', { recursive: true });

  const outHtml = await getPlainHtml('tmp/resume.html');

  await callOpenHtmlToPdf('logs', outHtml, 'tmp/build-resume-logs.txt');
  await callOpenHtmlToPdf('pdf', outHtml, 'public/resume.pdf');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
