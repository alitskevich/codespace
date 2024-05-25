import { Obj, Fn } from "../../types";


export const gettus = (o: Obj, key: Fn | string | string[] | ((e: Obj) => unknown)): unknown => {
  if (!o || !key || typeof o !== "object") return undefined;
  if (typeof key === "function") return key(o);
  if (typeof key === "string") {
    if (!key.includes(".")) return o[key];
    key = key.split(".");
  }
  return key.reduce<Obj | undefined>((r, e) => (r ? (r[e] as Obj) : undefined), o);
};
