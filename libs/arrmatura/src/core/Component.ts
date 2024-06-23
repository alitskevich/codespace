import type { Delta, Hash, LogEntry } from "ultimus/types";

import type { TArrmatron, IArrmatron, IComponent } from "../../types";

/**
 * Base Ancestor for custom components.
 */
export abstract class Component implements IComponent {
  [key: string]: unknown;

  constructor(_: Hash, private readonly $ctx: TArrmatron) {
    //no-op
  }

  get refId() {
    return this.$ctx.refId;
  }

  get platform() {
    return this.$ctx.platform;
  }

  // hook on initialization
  // returned value will be used to update state
  __init(_: IArrmatron): Delta | null | undefined | unknown {
    return undefined;
  }

  // get from ctx state
  get(key: string) {
    return this.$ctx.get(key);
  }

  // update ctx state
  up(d) {
    return this.$ctx.up(d);
  }

  touch() {
    return this.$ctx.touch();
  }

  // emit action event to another component by key
  emit(key: string, data: Delta = {}) {
    return this.$ctx.emit(key, data);
  }

  // register callback to be called on done
  defer(fn: () => void) {
    this.$ctx.defer(fn);
  }

  defineCalculatedProperty(key, fn: (...args: any[]) => any, deps?: string[]) {
    let depKey = "";
    let depValue = undefined;
    Object.defineProperty(this, key, {
      get() {
        const args: any[] = deps?.length ? deps.map((k) => this.$ctx.get(k)) : [];
        const newKey = args.join(":");
        if (depKey !== newKey) {
          depKey = newKey;
          depValue = fn.apply(this, args);
        }
        return depValue;
      },
    });
  }

  toast(entry: LogEntry) {
    this.$ctx.toast(entry);
  }

  log(val: unknown, ...args: unknown[]) {
    this.$ctx.log(val, ...args);
  }

  logError(val: unknown, ...args: unknown[]) {
    this.$ctx.logError(val, ...args);
  }

  toString() {
    return this.$ctx.toString();
  }
}
