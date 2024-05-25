import type { EContent, IPlatform } from "arrmatura/types";
import { xmlParse } from "ultimus";
import type { Hash, XmlNode } from "ultimus/types";

import { Arrmatron } from "../core/Arrmatron";
import { ManifestNode } from "../core/ManifestNode";

import { CCompositeNode } from "./composition";

class RootCtx extends Arrmatron<CCompositeNode> {
  get displayName(): string {
    return `ROOT`;
  }

  get recontentScope(): Arrmatron {
    return this;
  }

  slotContent(_slotId?: string): EContent | undefined {
    return undefined;
  }

  createComponent(initials: Hash) {
    return this.platform.createComponent({}, initials, this);
  }
}

export class CRootNode extends ManifestNode {
  slotContent: Hash<EContent>;
  nodes?: XmlNode["nodes"];

  constructor(private template: string) {
    super('R0');
    this.slotContent = {};
  }

  getSubNodes(platform: IPlatform) {
    return platform.getCompiledNodes(xmlParse(this.template));
  }

  getSlotContent(_platform: IPlatform, _slotId?: string) {
    return undefined;
  }

  get EntitronConstructor() {
    return RootCtx;
  }
}
