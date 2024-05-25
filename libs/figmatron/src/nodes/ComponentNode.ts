// import { slug } from "../utils";
import { ANode } from "./ANode";

export class ComponentNode extends ANode {
  getHtmlNode() {
    const { id, tag, attrs, nodes, classes, styling, componentName } = this;

    const htmlNode = {
      tag: "component",
      attrs: { id: componentName },
      nodes:
        tag === ""
          ? nodes
          : {
            tag: tag ?? "section",
            styling,
            classes,//: [...classes, `--${slug(name)}`, `{@class}`],
            attrs: {
              ...attrs,
              key: id,
              // data: "@data", click: "@click"
            },
            nodes,
          },
    };

    return htmlNode;
  }
}
