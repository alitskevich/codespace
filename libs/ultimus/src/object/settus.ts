import { Obj, Fn } from "../../types";

export const settus = (
  o: Obj,
  key: Fn | string | string[] | ((e: Obj, v: unknown) => unknown),
  value: unknown
): void => {
  if (!o || !key || typeof o !== "object") return;

  if (typeof key === "function") {
    key(o, value);
  } else {
    const keys = typeof key === "string" ? key.split(".") : key;
    if (keys.length) {
      const last = keys.pop();
      const target = keys.reduce<object>((r, e) => r[e] ?? (r[e] = {}), o);
      if (last && target && typeof target === "object") {
        target[last] = value;
      }
    }
  }
};
