import { Hash } from "ultimus/types";

export const mergeObject = (source: Hash<any>, target: Hash<any>) => {
  if (!source || typeof source !== "object") return target;
  if (!target || typeof target !== "object") return source;

  return Object.entries(target).reduce((src, [key, val]) => {

    if (typeof val === "object" && typeof src[key] === "object") {
      if (Array.isArray(src[key])) {
        src[key] = val;
      } else {
        src[key] = mergeObject(src[key], val);
      }
    } else {
      src[key] = val;
    }
    return src;
  }, source);
}
