import { XmlNode, Hash, StringHash, settus, mapEntries } from "ultimus";

import { UINode } from "../core/UINode";

export class NodeController implements XmlNode {
  id: string;
  node: UINode;
  text?: string | undefined;
  tag: string;
  attrs: Hash<any>;
  classValues: any;
  data = {}
  change: ({ id, value }: { id: any; value: any; }) => void;

  setNode(node: UINode) {
    this.node = node;
  }

  dataChanged(data: StringHash) {
    mapEntries(data, (key, value) => {
      settus(this.data, key, value);
    });
  }

}
