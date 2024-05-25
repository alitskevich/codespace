import { XmlNode, Hash } from "ultimus";

import { resolveNodeTypeBytag } from "../utils/resolveNodeTypeBytag";

export class UINode implements XmlNode {
  id: string;
  nodes: UINode[];
  text?: string | undefined;
  tag: string;
  attrs: Hash<any>;
  type: string;

  constructor(public node: XmlNode, readonly parent, public root: any, readonly level = 0) {
    this.tag = node.tag;
    this.type = resolveNodeTypeBytag(this.tag);
    this.attrs = node.attrs ?? {};
    this.id = node.id;
    this.root.all[this.id] = this;
    this.nodes = node.nodes?.map(
      (e: XmlNode) => new UINode(e, this, this.root, level + 1)
    ) ?? [];

  }

  update({ id, value }) {
    if (id === 'type') {
      this.type = value
      this.tag = value === 'html' ? 'div' : ''
    } else if (id === 'tag') {
      this.tag = value
    } else if (id === 'class') {
      this.attrs = { ...this.attrs, [id]: value };
    } else {
      this.attrs = { ...this.attrs, [id]: value };
    }
  }

  get class() {
    return this.attrs.class ?? '';
  }
}

