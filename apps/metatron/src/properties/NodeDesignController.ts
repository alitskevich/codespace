import { XmlNode, Hash, StringHash, settus, mapEntries } from "ultimus";

import { UINode } from "../core/UINode";

const classSpec = {
  flex: ({ value }) => {
    if (!value) {
      return ({ 'container.type': 'flex', 'container.direction': 'row' });
    } else if (value === 'col' || value === 'row') {
      return ({ 'container.direction': value });
    } else if (value === 'wrap' || value === 'nowrap') {
      return ({ 'container.wrap': value === 'wrap' });
    } else {
      return ({ 'item.resizeShrink': value, 'item.resizeGrow': value });
    }
  },
  gap: ({ value }) => ({ 'container.gap': value }),
  justify: ({ value }) => ({ 'container.justify': value }),
  items: ({ value }) => ({ 'container.align': value }),
};

export function parseClasses(text = '') {
  return String(text).split(" ").reduce((r: any, id: string) => {
    const ns = id.split(":");
    const [type, value, subvalue = value] = (ns.pop() ?? '').split("-");
    const delta = classSpec[type]?.({ id, ns: ns.map(id => ({ id })), type, value, subvalue }, r)
    mapEntries(delta, (key, value) => {
      settus(r, key, value);
    });

    return r;
  }, { display: 'block', position: 'normal', padding: '0', margin: '0' });
}

export class NodeDesignController implements XmlNode {
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
    this.data = parseClasses(this.class)

    this.change = ({ id, value }) => {
      this.data = { ...this.data, [id]: value };
      this.node.root.touch();
    }
  }

  get class() {
    return this.node.class;
  }

  dataChanged(data: StringHash) {
    mapEntries(data, (key, value) => {
      settus(this.data, key, value);
    });
  }

}
