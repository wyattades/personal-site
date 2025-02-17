/** @returns {HTMLElement | null} */
export const $ = (s, d) => (d ? s : document).querySelector(d || s);

/** @returns {HTMLElement[]} */
export const $$ = (s, d) =>
  Array.from((d ? s : document).querySelectorAll(d || s));

/**
 * @param {HTMLElement} el
 * @param {number} depth
 */
export const findFixedParent = (el, depth = 4) => {
  if (depth <= 0) return null;
  const parent = el.parentElement;
  if (!parent || parent === document.body) return null;
  if (window.getComputedStyle(parent).position === "fixed") return parent;
  return findFixedParent(parent, depth - 1);
};
