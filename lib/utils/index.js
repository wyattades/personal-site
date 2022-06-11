import * as _ from 'lodash-es';

export const wait = (millis) =>
  new Promise((resolve) => setTimeout(resolve, millis));

export const matchAll = (str, regexp, cb = _.identity) => {
  const arr = [];
  let i = 0;
  for (const m of str.matchAll(regexp)) {
    arr.push(cb(m, i));
    i++;
  }
  return arr;
};

export const jsonStorage = new (class {
  get(key) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch {}
    return null;
  }

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }
})();
