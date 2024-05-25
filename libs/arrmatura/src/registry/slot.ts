import type { XmlNode } from "ultimus/types";

import { Arrmatron } from "../core/Arrmatron";
import { ManifestNode } from "../core/ManifestNode";

import { Composite } from "./composition";

class Slot extends Arrmatron {
  get displayName(): string {
    return "🔸";
  }

  get compositeScope(): Composite {
    return this.scope as Composite;
  }

  get contentManifests() {
    return this.compositeScope.slotContent((this.manifest as CSlotNode).key);
  }

  get recontentScope(): Arrmatron {
    return this.compositeScope.scope;
  }
}

export class CSlotNode extends ManifestNode {
  key?: string;

  constructor(x: XmlNode) {
    super(x.id);
    this.key = x.attrs?.Key as string;
  }

  get EntitronConstructor() {
    return Slot;
  }
}
