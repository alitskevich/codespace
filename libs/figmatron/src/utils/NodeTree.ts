import { FNode } from "../../types";

export class NodeTree {
  all = new Map();
  allChildren = new Map();
  top: any[] = [];

  addTop(node) {
    this.all.set(node.id, node);
    this.top.push(node.id);
    return node;
  };
  addChild(parentId: string, node) {
    if (!this.all.has(node.id)) {
      this.all.set(node.id, node);
    }
    node.parentId = parentId;
    const bundle = (this.allChildren.has(parentId) ? this.allChildren : this.allChildren.set(parentId, [])).get(parentId);
    bundle.push(node.id);
  };

  addVector(parentId: string, node: FNode, meta) {
    const name = node.name ?? meta?.name ?? node.id;
    this.addUsageChild(parentId, node, `Vector`, { type: name.replace(/^svg-?/i, '') });
  }

  addUsageChild(parentId: string, node: FNode, componentName, attrs) {
    this.addChild(parentId, {
      id: `U-${node.id}`,
      type: "USAGE",
      componentName,
      attrs,
      absoluteBoundingBox: node.absoluteBoundingBox,
      origin: node,
    });
  };
}
