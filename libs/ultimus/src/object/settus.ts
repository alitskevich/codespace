import { Obj, Fn } from "../../types";

export const settus = (
  o: Obj,
  key: Fn | string | string[] | ((e: Obj, v: unknown) => unknown),
  value: unknown
): Obj => {
  if (!o || !key || typeof o !== "object") return o;

  if (typeof key === "function") {
    key(o, value);
  } else {
    const keys = typeof key === "string" ? key.split(".") : key;
    const last = keys.pop();
    const target = keys.length ? keys.reduce<object>((r, e) => r[e] ?? (r[e] = {}), o) : o;
    if (last && target && typeof target === "object") {
      target[last] = value;
    }
  }
  return o;
};
