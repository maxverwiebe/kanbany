export default class RateLimiter {
  constructor({ windowMs = 60000, max = 60 } = {}) {
    this.windowMs = windowMs;
    this.max = max;
    this.hits = new Map();
  }

  isAllowed(key) {
    const now = Date.now();
    const entry = this.hits.get(key);

    if (!entry) {
      this.hits.set(key, { count: 1, start: now });
      return true;
    }

    const elapsed = now - entry.start;
    if (elapsed < this.windowMs) {
      if (entry.count < this.max) {
        entry.count += 1;
        return true;
      }
      return false;
    }

    this.hits.set(key, { count: 1, start: now });
    return true;
  }

  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.hits) {
      if (now - entry.start > this.windowMs) {
        this.hits.delete(key);
      }
    }
  }
}
