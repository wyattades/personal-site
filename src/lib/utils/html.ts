export const $ = (s: string, d?: HTMLElement): HTMLElement | null =>
  (d ?? document).querySelector(s);

export const $$ = (s: string, d?: HTMLElement): HTMLElement[] =>
  Array.from((d ?? document).querySelectorAll(s));

export const findFixedParent = (
  el: HTMLElement,
  depth = 4,
): HTMLElement | null => {
  if (depth <= 0) return null;
  const parent = el.parentElement;
  if (!parent || parent === document.body) return null;
  if (window.getComputedStyle(parent).position === "fixed") return parent;
  return findFixedParent(parent, depth - 1);
};
