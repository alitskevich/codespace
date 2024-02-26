import { ManifestNode } from "../core/ManifestNode";
import { Arrmatron } from "../core/Arrmatron";
import type { Hash, XmlNode } from "ultimus/types";
import type { EContent, IPlatform } from "arrmatura/types";

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
    const matchedCase = cases?.[this.$component.on as string];
    if (!matchedCase) {
      this.log("unmatched case", this.$component.on, cases);
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
        groups[node.attrs?.when as string] = platform.getCompiledNodes(node.nodes ?? []);
        return groups;
      }, {}))
    );
  }

  get EntitronConstructor() {
    return Selector;
  }
}
