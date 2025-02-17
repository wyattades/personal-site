export class JsonStorage {
  constructor(type = "local", prefix = null) {
    this.type = type;
    this.prefix = prefix;
  }

  get storage() {
    return this.type === "session"
      ? window.sessionStorage
      : window.localStorage;
  }

  get(key) {
    try {
      if (this.prefix) key = `${this.prefix}:${key}`;
      const raw = this.storage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch {}
    return null;
  }

  set(key, value) {
    try {
      if (this.prefix) key = `${this.prefix}:${key}`;
      this.storage.setItem(key, JSON.stringify(value));
    } catch {}
  }

  fetch(key, fallback) {
    const val = this.get(key);
    if (val != null) return val;
    const fetched = fallback();
    if (fetched instanceof Promise) {
      return fetched.then((next) => {
        this.set(key, next);
        return next;
      });
    } else {
      this.set(key, fetched);
      return fetched;
    }
  }
}

export const sessionJsonStorage = new JsonStorage("session");
