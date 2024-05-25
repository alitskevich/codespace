import { Obj } from "../../types";
import { strEnhance } from "../string";

export * from "./isEmpty";
export * from "./mergeObject";
export * from "./defineObjectRef";
export * from "./gettus";
export * from "./settus";
export * from "./reduceEntries";

const DEFAULT_ENTRY_HANDLER = (id: string, n: any): any => ({ id, value: n });

// data structures
export const dot = (x: any, k = "name", pattern?: string) => x?.[pattern ? strEnhance(k, pattern) : k] ?? null;
export const join = (x: any[], delim = ', ') => (x ? x.join(delim) : null);
export const keysOf = (x: any) => (x ? Object.keys(x) : null);
export const valuesOf = (x: any) => (x ? Object.values(x) : null);
export const typeOf = (x: any) => (x == null ? "nullable" : Array.isArray(x) ? "array" : typeof x);
export const entriesOf = (x: any) => (x ? Object.entries(x).map(([id, value]) => ({ id, value })) : null);
export const stringify = (x: any, indent = 2) => (x == null ? "" : JSON.stringify(x, null, indent));

export const assign = (o: Obj, ...delta: unknown[]): object => {
  return Object.assign(o || {}, ...delta);
};

export const assignKeyValue = (o: Obj, key: string, value: unknown): object => {
  return Object.assign(o || {}, { [key]: value });
};

export const mapEntries = <T = any>(
  o: object | null | undefined,
  fn: (key: string, value: any) => T = DEFAULT_ENTRY_HANDLER
): T[] => {
  return !o ? [] : Object.entries(o).map(([key, value]: any) => fn(key, value));
};

export const isValuable = (x: any): boolean => {
  if (x == null) return false;
  if (Array.isArray(x)) return x.length > 0;
  if (typeof x === "object") return Object.values(x).find((v) => v != null) != null;
  return true;
};

export const assignFirstArgKeyValue =
  (fn: (...args: unknown[]) => unknown, key: string, val: unknown) =>
    (x: object, ...args: unknown[]) =>
      fn(Object.assign(x || {}, { [key]: val }), ...args.slice(1));

export const pack = (x?: unknown, key = "value"): object => {
  return { [key]: x };
};


