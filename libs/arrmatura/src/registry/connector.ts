import { Fn, XmlNode } from "ultimus";

import { Arrmatron } from "../core/Arrmatron";
import { ManifestNode } from "../core/ManifestNode";
import { objectFingerprint } from "../utils/FingerprintMashine";

class Connector extends Arrmatron<ConnectorNode> {
  prevkey: any;

  counter = 0;

  /**
   * Triggers an with changes after a specified timeout.
   *
   * @return {void} No return value.
   */
  touch() {
    super.touch();
    //   if (this.isDone) return;
    const { trigger, data, change } = this.$component;
    const key = 'trigger' in this.$component ? trigger : data;
    const fprint = objectFingerprint(key);
    const changed = !('prevkey' in this) || this.prevkey != fprint;

    if (!changed) return;

    this.prevkey = fprint;

    (change as Fn)?.(data);
  }

  get displayName(): string {
    return "🔹Connector";
  }
}

export class ConnectorNode extends ManifestNode {
  constructor({ attrs, id }: XmlNode) {
    super(id);
    this.compileAttributes(attrs);
  }

  get EntitronConstructor() {
    return Connector;
  }

}
