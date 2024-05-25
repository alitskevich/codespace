import { Component } from "arrmatura";
import { XmlNode, xmlParse, xmlStringify } from "ultimus";
import { arrayExtract } from "ultimus/src/array/arrayExtract";

import { UINode } from "../core/UINode";

export class EditorService extends Component {
  data: XmlNode[] = [];
  nodes: UINode[] = [];
  nodeId: string = "";
  all: Record<string, UINode> = {};

  setBody(body: string) {
    this.body = body;
    this.setData(xmlParse(body));
  }

  get currentNode() {
    return this.all[this.nodeId];
  }

  setData(sdata: XmlNode[]) {
    this.data = sdata;
    const [meta, data] = arrayExtract(sdata, (e) => e.tag === "Meta");
    this.meta = meta;
    this.nodes = data?.map((e: XmlNode) => new UINode(e, null, this, 1)) ?? [];
  }
  getNextBody() {
    return this.data?.map((e: XmlNode) => xmlStringify(e)).join("\n");
  }

  updateNode(data) {
    this.currentNode?.update(data);
    this.touch();
  }
}
