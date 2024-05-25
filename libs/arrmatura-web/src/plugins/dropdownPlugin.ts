import { debounce } from "ultimus";

// import { findParentElement } from "../utils/findParentElement";
import type { DomNode, IElement, IWebPlatform } from "../../types";
import { findParentElement } from "../utils/findParentElement";

let currentDropdown
function syncDropdownPosition() {
  if (!currentDropdown) return true;

  const element = currentDropdown.$element;
  const parent = currentDropdown.originalParent;

  const popStyle = element.style;

  const { x, y } = parent.getBoundingClientRect();

  const { width: ww, height: hh } = element.getBoundingClientRect();
  const { width: w00, height: h0 } = window.document.body.getBoundingClientRect();
  const w0 = Math.min(w00, window.document.body.clientWidth);

  if (ww <= w0) { //&& w0 > 375
    popStyle.left = `${Math.max(0, Math.min(x, w00 - ww - 5)) - 0}px`;
    popStyle.top = (y + hh + 0 > h0) ? `${y - hh - 5}px` : `${y - 4}px`;
  } else {
    popStyle.left = `4px`;
    popStyle.right = `4px`;
    popStyle.minWidth = `${w0 - 8}px`;
    popStyle.top = `${(h0 - Math.max(40, hh)) / 2}px`;
  }
  popStyle.position = 'fixed';
  popStyle.zIndex = '100';
}

const dropdown = ($: IElement, element: DomNode): void => {
  if ($.dropdown) return;

  $.attachToParent = (parent) => {
    const portalId = 'dropdown';
    const portals: any = $.platform.portals ?? ($.platform.portals = {});
    let portal = portals[`${portalId}`];
    if (!portal) {
      (portals[`${portalId}`] = document.createElement('div'));
      portal = portals[`${portalId}`];
      document.body.appendChild(portal);
    }
    if (portal === element.parentElement) return;
    if (currentDropdown?.$.uid === $.$.uid) return;

    // currentDropdown?.dropdown();

    currentDropdown = $;
    currentDropdown.originalParent = parent;
    if (portal !== element.parentElement) {
      element.parentElement?.removeChild(element);
      portal.appendChild(element);
    }
    const popStyle = element.style;
    popStyle.position = 'relative';
    popStyle.left = '-10000px';
    popStyle.top = '-10000px';
    popStyle.display = 'block';
    syncDropdownPosition()
  };
};

function autoCloseCurrentDropdownOnClickOutside(event) {
  if (!currentDropdown) return true;

  const target = event.target;
  const inDropdown = findParentElement(target, (p: any) => p === currentDropdown.$element);
  if (!inDropdown) {
    currentDropdown.dropdown()
    currentDropdown = null
  }
}

const handler = debounce(autoCloseCurrentDropdownOnClickOutside, 10);
let timer;

export const dropdownPlugin = {
  init(platform: IWebPlatform) {
    platform.addElementAttributeSetters({ dropdown })
    document.addEventListener("touchstart", handler, { capture: true })
    document.addEventListener("mousedown", handler, { capture: true })
    timer = setInterval(syncDropdownPosition, 500);
  },
  done() {
    document.removeEventListener("touchstart", handler)
    document.removeEventListener("mousedown", handler)

    clearInterval(timer);
  }
}