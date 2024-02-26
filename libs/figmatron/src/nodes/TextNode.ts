import { ANode } from "./ANode";

export class TextNode extends ANode {
  getHtmlNode() {
    const { id, content: text, classes, styling } = this as any;
    const htmlNode = { tag: "Text", styling, classes, attrs: { text, key: id } };

    return htmlNode;
  }
}
