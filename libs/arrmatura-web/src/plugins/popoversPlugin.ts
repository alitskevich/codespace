import { debounce } from "ultimus";

import { DomNode } from "../../types";
import { findParentElement } from "../utils/findParentElement";

export const popoversPlugin = {
  init() {

    let currentPopover: DomNode | null = null;

    const handlerIn = ({ target }) => {
      const sourceElement = findParentElement(target, (p: any) => p.component?.popoverRef)
      const isUnderCurrentPopover = !!findParentElement(target, (p: any) => p === currentPopover)
      if (isUnderCurrentPopover) return;

      if (!sourceElement) {
        if (currentPopover) {
          currentPopover.style.display = 'none';
          currentPopover = null;
        }
        return false;
      }

      const popover = target.component.$.getByRef(sourceElement.component.popoverRef) ?? target.component.$.getByRef('popover');
      if (!popover) return false;

      const screenPadding = Number(0);
      const tooltipGap = Number(0);

      const popoverElement = [...popover.$children.values()][0]?.component.$element;
      if (!popoverElement) return;

      popover.up({ data: target.$dataset });

      if (currentPopover && currentPopover !== popoverElement) {
        currentPopover.style.display = 'none';
        currentPopover = null;
      }

      currentPopover = popoverElement;

      const popStyle = popoverElement.style;
      popStyle.left = '-10000px'
      popStyle.top = '-10000px'
      popStyle.display = 'block';

      const { x, y, height: h } = sourceElement.getBoundingClientRect();
      const { width: ww, height: hh } = popoverElement.getBoundingClientRect();
      const { width: w0, height: h0 } = window.document.body.getBoundingClientRect();

      popStyle.left = `${Math.max(0, Math.min(x, w0 - ww)) - screenPadding}px`;
      popStyle.top = (y + h + hh + screenPadding > h0) ? `${y - hh - tooltipGap}px` : `${y + h + tooltipGap}px`;
      popStyle.position = 'fixed';

      return false;
    }

    document.addEventListener("touchstart", debounce(handlerIn, 50), true)
    document.addEventListener("mousedown", debounce(handlerIn, 50), true)
  }

}