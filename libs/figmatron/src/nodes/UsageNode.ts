import { ANode } from "./ANode";

export class UsageNode extends ANode {
  getHtmlNode() {
    const { id, componentName: tag, attrs, classes, styling } = this as any;
    const htmlNode = { tag, styling, classes, attrs: { ...attrs, key: id } };

    return htmlNode;
  }
}
