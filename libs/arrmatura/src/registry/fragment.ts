import type { IPlatform } from "arrmatura/types";
import type { XmlNode } from "ultimus/types";

import { Arrmatron } from "../core/Arrmatron";
import { ManifestNode } from "../core/ManifestNode";

export class CFragmentNode extends ManifestNode {
  #nodes: XmlNode[] | undefined;

  constructor({ id, nodes }: XmlNode) {
    super(id);
    this.#nodes = nodes;
  }

  getSubNodes(platform: IPlatform) {
    return this.#nodes ? platform.getCompiledNodes(this.#nodes) : undefined;
  }

  get EntitronConstructor() {
    return Arrmatron;
  }
}
