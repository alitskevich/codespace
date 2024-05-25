import type { EContent, IArrmatron, IPlatform } from "arrmatura/types";
import type { XmlNode } from "ultimus/types";

import { Arrmatron } from "../core/Arrmatron";
import { ManifestNode } from "../core/ManifestNode";
import { compilePlaceholder } from "../utils/compileExpression";

import { Composite } from "./composition";

class Conditional extends Arrmatron<CIfNode> {
  get contentManifests() {
    const branches = this.manifest.getBranches(this.platform);
    return this.$component.condition ? branches.then : branches.else;
  }

  get displayName(): string {
    return "🔹if";
  }
}

export class CIfNode extends ManifestNode {
  #xml: XmlNode;
  #branches?: { then?: EContent; else?: EContent };
  constructor(xml: XmlNode, expr: string) {
    super(xml.id);
    this.#xml = xml;
    this.compileCondition(expr);
  }

  get EntitronConstructor() {
    return Conditional;
  }

  getBranches(platform: IPlatform) {
    if (this.#branches) {
      return this.#branches;
    }

    this.#branches = {};

    const { nodes } = this.#xml;

    let $then: XmlNode[] | undefined = [this.#xml];
    if (nodes?.length) {
      const ifElse = nodes.find((e) => e.tag === "Else");
      const ifThen = nodes.find((e) => e.tag === "Then");
      if (ifElse) {
        this.#branches.else = ifElse.nodes ? platform.getCompiledNodes(ifElse.nodes) : undefined;
        $then = ifThen
          ? ifThen.nodes
          : [
            Object.assign(this.#xml, {
              nodes: nodes.filter((e) => e !== ifElse),
            }),
          ];
      } else if (ifThen) {
        $then = ifThen.nodes;
      }
    }
    this.#branches.then = $then ? platform.getCompiledNodes($then) : undefined;

    return this.#branches;
  }

  compileCondition(expr: string): void {
    if (expr[0] === "<" && expr[1] === "-") {
      this.addConnector(expr.slice(2), "condition");
    } else if (expr.slice(0, 5) === "slot(") {
      const slotId = expr.slice(5, -1);
      // DO NOT place inside iterations.
      this.addPropertyResolver((c: IArrmatron) => !!(c.scope as Composite).slotContent?.(slotId)?.size, "condition");
    } else {
      const resolver = compilePlaceholder(expr);
      this.addPropertyResolver((c) => !!resolver(c), "condition");
    }
  }
}
