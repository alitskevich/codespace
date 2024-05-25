import { IArrmatron } from "arrmatura/types";
import type { Uid } from "ultimus/types";

import type { DomNode } from "../../types";
import { DomElement } from "../dom/elements";

/**
 * Reflows the given children within the parent element, updating the DOM layout.
 *
 * @param {Map<Uid, IArrmatron> | undefined} children - The children to reflow
 * @param {ShadowRoot | DomNode | HTMLElement} parent - The parent element to reflow within
 * @param {DomNode} cursor - The cursor for positioning the reflowed elements
 * @return {DomNode} The updated cursor position after reflowing the children
 */
export function reflow(children: Map<Uid, IArrmatron> | undefined, parent: ShadowRoot | DomNode | HTMLElement, cursor?: DomNode) {
  if (children) {
    for (const p of children.values()) {
      const e = p.$component.$element as DomNode;
      if (e) {
        reflow(p.children, e);
        const pImpl = p.$component as DomElement;
        pImpl.applyStateChanges();
        cursor = pImpl.attachToParent(parent, cursor ? cursor.nextSibling : parent.firstChild);
      } else {
        cursor = reflow(p.children, parent, cursor);
      }
    }
  }
  return cursor;
}
