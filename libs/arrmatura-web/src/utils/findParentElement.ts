import type { Predicat } from "ultimus/types";

import type { DomNode } from "../../types";

export const findParentElement = (c: DomNode, fn: Predicat) => {
  for (let p: any = c; p; p = p.parentElement) {
    if (fn(p)) {
      return p;
    }
  }
  return null;
};
