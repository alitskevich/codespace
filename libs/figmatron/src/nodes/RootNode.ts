import { nodeToHtml } from "../api/nodeToHtml";

import { ANode } from "./ANode";
import { ComponentNode } from "./ComponentNode";
import { ComponentSetNode } from "./ComponentSetNode";
import { ComponentSetVariantNode } from "./ComponentSetVariantNode";
import { PageNode } from "./PageNode";
import { TextNode } from "./TextNode";
import { UsageNode } from "./UsageNode";
import { VectorNode } from "./VectorNode";
import { REGISTRY } from "./registry";

Object.assign(REGISTRY, {
  COMPONENT_SET: ComponentSetNode,
  COMPONENT: ComponentNode,
  VECTOR: VectorNode,
  PAGE: PageNode,
  TEXT: TextNode,
  VARIANT: ComponentSetVariantNode,
  USAGE: UsageNode,
});

/**
 * Root Node.
 */
export class RootNode extends ANode {
  toHtml() {
    return nodeToHtml({ tag: "components", nodes: this.nodes });
  }
  toHtmlIf(filterFn: (ANode) => boolean) {
    return nodeToHtml({
      tag: "components",
      nodes: this.nodes?.filter(filterFn),
    });
  }
}
