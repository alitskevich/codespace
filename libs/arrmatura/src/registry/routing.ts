import type { XmlNode } from "ultimus/types";

import { Arrmatron } from "../core/Arrmatron";
import { ManifestNode } from "../core/ManifestNode";

class DynamicTag extends Arrmatron<CDynamicTagNode> {
  get displayName(): string {
    return "dynamics";
  }

  get contentManifests() {
    const tag = this.$component.tag;
    const uid = `${this.uid}:${String(tag ?? "")}`;
    return new Map([
      [uid, Object.assign(this.platform.getCompiledNodes({ ...this.manifest.xml, tag } as XmlNode), { uid })],
    ]);
  }
}

export class CDynamicTagNode extends ManifestNode {
  xml: XmlNode & { tag: string };

  constructor(xml: XmlNode, expr: string) {
    super(xml.id);
    this.compileAttribute("tag", expr);
    this.xml = xml;
  }

  get EntitronConstructor() {
    return DynamicTag;
  }
}
