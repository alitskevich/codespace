import type { EContent, IPlatform } from "arrmatura/types";
import type { Hash, XmlNode } from "ultimus/types";

import { Arrmatron } from "../core/Arrmatron";
import { ManifestNode } from "../core/ManifestNode";

export class Selector extends Arrmatron<CSelectorNode> {
  get displayName(): string {
    return `💠Selector`;
  }

  /**
   * Gets the content of the function.
   *
   * @return {any} The content of the function.
   */
  get contentManifests() {
    const cases = this.manifest.getCases(this.platform);
    const onKey = this.$component.On as string;
    const matchedCase = cases?.[onKey];
    if (!matchedCase) {
      this.log("unmatched case", onKey, cases);
    }
    return matchedCase ?? cases?.["default"] ?? Object.values(cases)[0];
  }
}

export class CSelectorNode extends ManifestNode {
  cases: Hash<EContent> | null = null;
  key = "";
  nodes?: XmlNode["nodes"];

  constructor({ id, tag, attrs, nodes }: XmlNode) {
    super(id);
    this.tag = tag;
    this.nodes = nodes;
    this.compileAttributes(attrs);
  }

  /**
   * Retrieves the cases nodes for a component.
   *
   * @param {IPlatform} platform - The platform to get cases for.
   * @return {Hash<EContent>} - The cases for the platform.
   */
  getCases(platform: IPlatform): Hash<EContent> {
    return (
      this.cases ??
      (this.cases = (this.nodes ?? []).reduce<Hash<EContent>>((groups, node) => {
        groups[node.attrs?.When as string] = platform.getCompiledNodes(node.nodes ?? []);
        return groups;
      }, {}))
    );
  }

  get EntitronConstructor() {
    return Selector;
  }
}
