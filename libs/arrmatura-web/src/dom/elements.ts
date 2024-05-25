import { IComponent, IArrmatron } from "arrmatura/types";
import { defineObjectRef } from "ultimus";
import type { Hash } from "ultimus/types";

import type { DomNode, IElement, IWebPlatform } from "../../types";
const SVGTAGS = ["svg", "path", "g", "defs"]; // "lineargradient", "circle", "polygon", "rect", 'stop'
/**
 * DOM Element abstraction.
 */
export class DomElement implements IComponent, IElement {
  declare readonly $element: DomNode;
  $listeners: any;
  declare readonly $changes: Map<string, any>;

  [key: string]: unknown;

  constructor(tag: string, initials: Hash<any>, private readonly $: IArrmatron) {

    defineObjectRef(this, '$', $);

    Object.defineProperty(this, '$', { get() { return $; }, enumerable: false, });

    const node = (SVGTAGS.includes(tag)
      ? document.createElementNS("http://www.w3.org/2000/svg", tag)
      : document.createElement(tag || 'div')
    ) as DomNode;

    defineObjectRef(node, 'component', this);

    defineObjectRef(this, '$element', node);

    defineObjectRef(this, '$changes', new Map<string, any>(Object.entries(initials)));

    this.applyStateChanges();
  }

  done() {
    this.$element?.parentElement?.removeChild(this.$element);
  }

  __stateChanged(changes: Map<string, any>) {
    changes.forEach((value, key) => {
      if (key[0] === "$") return;
      if (value !== this[key]) {
        this.$changes?.set(key, value);
      }
    });
  }

  getComponentByRef(id: string) {
    return this.$.getByRef(id)?.$component;
  }
  updateScope(delta: any) {
    this.$.scope?.up(delta)
  }
  get platform() {
    return this.$.platform as IWebPlatform;
  }

  attachToParent(p: ShadowRoot | HTMLElement, before?: ChildNode | HTMLElement | null): DomNode {
    const e = this.$element;
    if (!before) {
      if (p !== e.parentElement) {
        p.appendChild(e);
        this.setParent(p);
      }
    } else if (e !== before) {
      p.insertBefore(e, before);
      this.setParent(p);
    }
    return e;
  }

  setParent(_p: ShadowRoot | HTMLElement) {
    // no-op
  }

  applyStateChanges() {
    const e = this.$element;
    if (!this.$changes.size) return;
    // this.$.log('changes', changes)
    this.$changes.forEach((value, key) => {
      if (key[0] === "$") return;
      if (value !== this[key]) {
        this.platform.setElementAttribute(this, e, key, value);
        this[key] = value;
      }
    });
    this.$changes.clear();
  }
}
