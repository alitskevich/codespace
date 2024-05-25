import { PersistenceType } from "arrmatura-web/types";
import { parseJson } from "ultimus";
import { Delta, Hash, Op } from "ultimus/types";

class MemoryStore {
  #map = new Map<string, string>();

  clear() {
    return this.#map.clear();
  }

  getItem(key: string) {
    return this.#map.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.#map.set(key, value);
  }

  removeItem(key: string): void {
    this.#map.delete(key);
  }
}

export class ClientStorage {
  cache: Hash = {};
  scache: Hash<string | null> = {};
  storage: Omit<MemoryStore, "prototype">;

  static clearAll() {
    window.localStorage.clear();
    window.sessionStorage.clear();
  }

  constructor(mode?: PersistenceType, readonly ns = "") {
    this.storage =
      mode === "local" ? window.localStorage : mode === "session" ? window.sessionStorage : new MemoryStore();
  }

  clear() {
    this.cache = {};
    return this.storage.clear();
  }

  get(key: string) {
    if (key in this.cache) return this.cache[key];
    this.scache[key] = this.storage.getItem(`${this.ns}:${key}`);
    return (this.cache[key] = parseJson(this.scache[key], null));
  }

  set(key: string, val: unknown) {
    if (this.cache[key] === val) return;

    const sval = JSON.stringify(val);
    if (this.scache[key] === sval) return;

    this.cache[key] = val;
    this.scache[key] = sval;

    if (val != null) {
      this.storage.setItem(`${this.ns}:${key}`, sval);
    } else {
      this.storage.removeItem(`${this.ns}:${key}`);
    }
  }

  assign(delta: Delta) {
    Object.entries(delta).forEach(([key, val = null]) => this.set(key, val));
  }

  transform(key: string, fn: Op) {
    return this.set(key, fn(this.get(key)));
  }
}
