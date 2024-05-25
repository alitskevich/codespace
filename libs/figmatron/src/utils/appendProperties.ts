import { FNode } from "../../types";

export function appendProperties(parent: FNode, properties: any[]) {
  if (!properties) return;
  if (!parent.properties) {
    parent.properties = [];
  }
  properties
    .filter(({ id }) => !parent.properties.some(({ id: pId }) => pId === id))
    .forEach((p) => {
      parent.properties.push(p);
    });
}
