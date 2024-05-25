import { qname, strJoin } from "ultimus";

import { ANode } from "./ANode";

export class ComponentSetVariantNode extends ANode {
  getHtmlNode() {
    const { properties = [], selectorProps } = this as any;

    const When = strJoin(",", ...selectorProps.map(({ id, defaultValue }) => `${id}=${properties.find((p) => p.id === id)?.value ?? defaultValue ?? "Default"}`));

    return {
      tag: "Case",
      attrs: { When },
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
        class: `variant {class}`,
        key: `${qname(name)}-${id}`,
      },
      nodes,
    };
  }
}
