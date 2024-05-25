import { IPlatform } from "arrmatura/types";
import type { Hash, XmlNode } from "ultimus/types";

import { Arrmatron } from "../core/Arrmatron";
import { ManifestNode } from "../core/ManifestNode";

class NativeElementEntitron extends Arrmatron<CElementNode> {
  get displayName(): string {
    return this.manifest.tag;
  }

  createComponent(initials: Hash) {
    return this.platform.createComponent({ tag: this.manifest.tag, native: true }, initials, this);
  }
}

export class CElementNode extends ManifestNode {
  #nodes: XmlNode[] | undefined;

  constructor({ id, tag, attrs, nodes, text }: XmlNode) {
    super(id);
    this.tag = tag;
    this.compileAttributes(attrs);
    if (text) {
      this.compileAttribute("#text", text);
    }
    this.#nodes = nodes;
  }

  getSubNodes(platform: IPlatform) {
    return this.#nodes ? platform.getCompiledNodes(this.#nodes) : undefined;
  }

  get EntitronConstructor() {
    return NativeElementEntitron;
  }
}
