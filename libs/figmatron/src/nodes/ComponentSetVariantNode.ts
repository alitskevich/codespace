import { qname } from "ultimus";
import { selectorCaseKey } from "../utils";
import { ANode } from "./ANode";

export class ComponentSetVariantNode extends ANode {
  getHtmlNode() {
    const { meta: { properties = [] } = {} } = this;

    const when = selectorCaseKey(properties);

    return {
      tag: "Case",
      attrs: { when },
      nodes: this.innerNode(),
    };
  }

  innerNode() {
    const { id, name, styling, attrs, nodes } = this;
    return {
      tag: "article",
      styling,
      attrs: {
        ...attrs,
        class: `{@class}`,
        key: `${qname(name)}-${id}`,
      },
      nodes,
    };
  }
}
