import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { access } from "node:fs/promises";
import { createServer } from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

import puppeteer from "puppeteer";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const HOST = "127.0.0.1";
const VIEWPORT = { width: 1280, height: 900 };

const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const getOpenPort = async () => {
  const server = createServer();
  server.listen(0, HOST);
  await once(server, "listening");

  const address = server.address();
  assert(address && typeof address !== "string");

  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });

  return address.port;
};

const resolveChrome = async () => {
  const candidates = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    puppeteer.executablePath(),
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    process.env.PROGRAMFILES &&
      path.join(
        process.env.PROGRAMFILES,
        "Google/Chrome/Application/chrome.exe",
      ),
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {}
  }

  throw new Error(
    "Chrome was not found. Run `pnpm exec puppeteer browsers install chrome`.",
  );
};

const startApp = async (port) => {
  const nextBin = path.join(ROOT, "node_modules/next/dist/bin/next");
  const app = spawn(
    process.execPath,
    [nextBin, "start", "-H", HOST, "-p", String(port)],
    {
      cwd: ROOT,
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  let logs = "";
  app.stdout.on("data", (chunk) => {
    logs += chunk;
  });
  app.stderr.on("data", (chunk) => {
    logs += chunk;
  });

  const url = `http://${HOST}:${port}`;
  const deadline = Date.now() + 20_000;

  while (Date.now() < deadline) {
    if (app.exitCode !== null) {
      throw new Error(`Next.js exited before startup:\n${logs}`);
    }

    try {
      const response = await fetch(url);
      if (response.ok) return { app, url };
    } catch {}

    await delay(100);
  }

  throw new Error(`Next.js did not start within 20 seconds:\n${logs}`);
};

const stopApp = async (app) => {
  if (app.exitCode !== null || app.pid === undefined) return;

  const exited = once(app, "exit");

  app.kill("SIGTERM");

  await Promise.race([exited, delay(500)]);

  if (app.exitCode === null) {
    app.kill("SIGKILL");
    await exited;
  }
};

/**
 * Polls `check` until it returns something truthy. Useful for assertions that
 * run in Node instead of the browser, which `page.waitForFunction` can't do.
 *
 * @param {() => unknown | Promise<unknown>} check
 * @param {{ description: string, timeout?: number, interval?: number }} options
 */
export const waitFor = async (
  check,
  { description, timeout = 15_000, interval = 100 },
) => {
  const deadline = Date.now() + timeout;

  while (Date.now() < deadline) {
    if (await check()) return;
    await delay(interval);
  }

  throw new Error(`Timed out after ${timeout}ms waiting for ${description}`);
};

/**
 * Serves the production build, opens a page in headless Chrome, and hands both
 * to `run` along with the browser errors collected during the run. Everything
 * is torn down before this resolves.
 *
 * @param {(context: {
 *   page: import("puppeteer").Page,
 *   url: string,
 *   runtimeErrors: string[],
 * }) => Promise<void>} run
 */
export const withPage = async (run) => {
  const executablePath = await resolveChrome();
  const { app, url } = await startApp(await getOpenPort());
  let browser;

  try {
    browser = await puppeteer.launch({
      executablePath,
      headless: true,
      args: ["--no-sandbox"],
    });

    const page = await browser.newPage();
    await page.setViewport(VIEWPORT);

    const runtimeErrors = [];
    page.on("pageerror", (error) => {
      runtimeErrors.push(error.message);
    });
    page.on("console", (message) => {
      if (message.type() === "error") runtimeErrors.push(message.text());
    });

    await run({ page, url, runtimeErrors });
  } finally {
    await browser?.close();
    await stopApp(app);
  }
};
