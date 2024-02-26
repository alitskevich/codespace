import type { DomNode } from "../../types";
import type { Predicat } from "ultimus/types";

export const findParentElement = (c: DomNode, fn: Predicat) => {
  for (let p: any = c; p; p = p.parentElement) {
    if (fn(p)) {
      return p;
    }
  }
  return null;
};
