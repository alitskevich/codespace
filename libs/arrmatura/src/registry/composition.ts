import type { EContent, IManifestNode, IPlatform } from "arrmatura/types";
import type { Hash, XmlNode } from "ultimus/types";

import { Arrmatron } from "../core/Arrmatron";
import { ManifestNode } from "../core/ManifestNode";

export class Composite extends Arrmatron<CCompositeNode> {
  get displayName(): string {
    return `💠${this.manifest.tag}`;
  }

  get recontentScope(): Arrmatron {
    return this;
  }

  slotContent(slotId?: string): EContent | undefined {
    return this.manifest.getSlotContent(this.platform, slotId);
  }

  createComponent(initials: Hash) {
    return this.platform.createComponent(this.manifest.tag, initials, this);
  }
}

export class CCompositeNode extends ManifestNode {
  slotContent: Hash<EContent> | null = null;
  tag: string;
  nodes?: XmlNode["nodes"];
  #content?: Map<string, IManifestNode>;

  constructor({ id, tag, attrs, nodes }: XmlNode) {
    super(id);
    this.tag = tag;
    this.nodes = nodes;
    this.compileAttributes(attrs);
  }

  getSlotContent(platform: IPlatform, slotId?: string): EContent | undefined {
    if (!this.slotContent) {
      const slots = this.nodes?.reduce<Hash<XmlNode[]>>((groups, e) => {
        let gId = "default";
        let isContainer = false;
        if (e.tag.startsWith(`${this.tag}:`)) {
          gId = e.tag.split(":")[1];
          isContainer = true;
        }
        groups[gId] = (groups[gId] || []).concat(isContainer ? e.nodes ?? [] : e);
        return groups;
      }, {});

      this.slotContent = Object.entries(slots ?? {}).reduce<Hash<EContent>>((groups, [gId, nodes]) => {
        groups[gId] = platform.getCompiledNodes(nodes);
        return groups;
      }, {});
    }

    return this.slotContent[slotId || "default"] ?? undefined;
  }

  getSubNodes(platform: IPlatform) {
    return this.#content ?? (this.#content = platform.getCompiledNodes(this.tag));
  }

  get EntitronConstructor() {
    return Composite;
  }
}
