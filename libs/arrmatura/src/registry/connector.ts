import { ManifestNode } from "../core/ManifestNode";
import { Arrmatron } from "../core/Arrmatron";
import { Fn, XmlNode } from "ultimus";
import { objectFingerprint } from "../utils/objectFingerprint";

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
    // const seq = ++this.counter
    // setTimeout(() => {
    //   if (this.isDone) return;
    const { trigger, data, change } = this.$component;
    const key = 'trigger' in this.$component ? trigger : data;
    const fprint = objectFingerprint(key);
    const changed = !('prevkey' in this) || this.prevkey != fprint
    if (!changed) return;
    //debounce
    // if (seq !== this.counter) return;

    this.prevkey = fprint;


    (change as Fn)?.(data);
    // this.log('connector touch', data)
    // }, Number(this.component.timeout ?? 0));
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
