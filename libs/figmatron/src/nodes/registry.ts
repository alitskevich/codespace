import { FNode } from "../../types";

import { ANode } from "./ANode";

export const REGISTRY = {};

export function createSubMode(origin: FNode, parent: ANode) {
  const C = REGISTRY[origin?.type] ?? ANode;
  return new C(origin || {}, parent, parent.root ?? parent);
}
