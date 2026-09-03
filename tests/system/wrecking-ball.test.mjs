import assert from "node:assert/strict";
import test from "node:test";

import { waitFor, withPage } from "./harness.mjs";

const CARD = '[data-testid="project-card"]';
const TOGGLE = '[data-testid="wrecking-ball-toggle"]';

const hasNoTransforms = (selector) =>
  [...document.querySelectorAll(selector)].every(
    (element) => !element.style.transform,
  );

// `HTMLPhysics` writes `translate(...) rotate(...)` onto each element it
// simulates, so a knocked-over block has both moved and tilted.
const countToppled = (cards) => {
  const normalizeAngle = (angle) =>
    Math.abs(Math.atan2(Math.sin(angle), Math.cos(angle)));

  return cards.filter((card) => {
    const translation = card.style.transform.match(
      /translate\(([-\d.]+)px, ([-\d.]+)px\)/,
    );
    const rotation = card.style.transform.match(/rotate\(([-\d.]+)rad\)/);

    if (!translation || !rotation) return false;

    const distance = Math.hypot(Number(translation[1]), Number(translation[2]));

    return distance > 20 && normalizeAngle(Number(rotation[1])) > 0.1;
  }).length;
};

test(
  "the wrecking ball knocks project blocks over and resets them",
  { timeout: 45_000 },
  async () => {
    await withPage(async ({ page, url, runtimeErrors }) => {
      await page.goto(`${url}/projects`, { waitUntil: "domcontentloaded" });

      await page.waitForSelector(CARD);
      await page.waitForFunction(hasNoTransforms, {}, CARD);

      const cardCount = await page.$$eval(CARD, (cards) => cards.length);
      assert(cardCount > 0, "expected project cards to render");

      await page.click(TOGGLE);
      await page.waitForSelector("canvas");
      await waitFor(async () => await page.$$eval(CARD, countToppled), {
        description: "a project block to topple",
      });

      assert.match(
        await page.$eval(TOGGLE, (button) => button.textContent ?? ""),
        /Fix/,
      );

      await page.click(TOGGLE);
      await page.waitForFunction(() => !document.querySelector("canvas"));
      await page.waitForFunction(hasNoTransforms, {}, CARD);

      assert.match(
        await page.$eval(TOGGLE, (button) => button.textContent ?? ""),
        /Break/,
      );
      assert.deepEqual(runtimeErrors, []);
    });
  },
);
