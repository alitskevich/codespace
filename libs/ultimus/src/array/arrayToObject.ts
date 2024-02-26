import { Fn, Hash } from "../../types";

/**
 * Produces key/value index on given array.
 */
export const arrayToObject = <T = any>(
  arr?: unknown[] | null,
  idKey: string | Fn = "id",
  valKey?: string | ((obj: any) => T)
) => {
  const r: Hash<T> = {};
  if (arr?.forEach) {
    const idFn = typeof idKey === "string" ? (e: any) => e[idKey] : idKey;
    const valFn = typeof valKey === "string" ? (e: any) => e[valKey] : valKey;
    arr.forEach((e) => {
      r[String(idFn(e))] = valFn ? valFn(e) : e;
    });
  }
  return r;
};
