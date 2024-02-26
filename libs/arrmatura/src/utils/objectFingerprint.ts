import { hash } from "ultimus";

export const objectSerialize = (x: any): string => {
  const path = new Set()
  const resolver = (k: string | number, x: any): any => {
    try {
      if (k[0] == '$') return undefined;

      if (x == null || typeof x === "boolean" || typeof x === "number") return x;

      if (typeof x === "string") return hash(x);

      if (typeof x === "function") return '-';

      if (typeof x !== "object") return hash(String(x));

      if (x instanceof Date) return (String(x.getTime()));

      if (path.size > 4) {
        return '-';
      }

      if (path.has(x)) return '-';


      path.add(x);

      if (x instanceof Map) {
        return `Map{${[...x.entries()].map(([e, k]) => resolver(k, e)).join(',')}}`;
      }

      if (x instanceof Set) {
        return `Set{${[...x.values()].map((e) => resolver('-', e)).join(',')}`;
      }

      const result = x;

      return result;
    } catch (e) {
      return '-'
    }
  };

  return JSON.stringify(x, resolver);
}

export const objectFingerprint = (x: any): any => {

  if (x == null) return x;

  if (typeof x !== "object") return x;

  if (x instanceof Date) return (x.getTime());

  return objectSerialize(x);
}