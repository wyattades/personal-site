export class JsonStorage {
  constructor(
    readonly type: "local" | "session",
    readonly prefix?: string,
  ) {}

  get storage() {
    return this.type === "session"
      ? window.sessionStorage
      : window.localStorage;
  }

  get(key: string) {
    try {
      if (this.prefix) key = `${this.prefix}:${key}`;
      const raw = this.storage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch {}
    return null;
  }

  set(key: string, value: unknown) {
    try {
      if (this.prefix) key = `${this.prefix}:${key}`;
      this.storage.setItem(key, JSON.stringify(value));
    } catch {}
  }

  fetch<T>(key: string, fallback: () => T): T {
    const val = this.get(key);
    if (val != null) return val;
    const fetched = fallback();
    if (fetched instanceof Promise) {
      return fetched.then((next) => {
        this.set(key, next);
        return next;
      }) as T;
    } else {
      this.set(key, fetched);
      return fetched;
    }
  }
}

export const sessionJsonStorage = new JsonStorage("session");
