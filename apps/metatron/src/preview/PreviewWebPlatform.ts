import { IArrmatron, IComponent, IComponentDescriptor } from "arrmatura/types";
import { WebPlatform } from "arrmatura-web";
import { DomNode } from "arrmatura-web/types";

const ALL = new Map();
let prevElt: DomNode;

export class PreviewWebPlatform extends WebPlatform {
  createComponent(def: IComponentDescriptor | string, initials: any, ctx: IArrmatron): IComponent {
    return addElement(super.createComponent(def, initials, ctx), ctx);
  }

  // TODO move to plugin
  watchClicks() {
    window.document.body.addEventListener("click", (ev: any) => {
      const [, eltId] = ev.target.component?.$.uid.split(":") ?? "";
      if (eltId) {
        window.top?.postMessage(JSON.stringify({ type: "selectElement", data: eltId }), "*");
      }
    });
  }
}

export const addElement = (elt, ctx: IArrmatron) => {
  if (elt.$element) {
    const [, id] = ctx.uid.split(":");
    ALL.set(id, elt.$element);
  }

  return elt;
};

let pointer: any = null;
export const highlightElement = (eid) => {
  if (!pointer) {
    pointer = document.createElement("div");
    pointer.style.position = "absolute";
    document.body.appendChild(pointer);
  }
  const elt = ALL.get(eid);
  if (elt) {
    const { x, y, width: w, height: h } = elt.getBoundingClientRect();
    pointer.style.top = y;
    pointer.style.left = x;
    pointer.style.width = w;
    pointer.style.height = h;
    elt.classList.add("highlight");
  }
  prevElt?.classList.remove("highlight");
  prevElt = elt;
  // log(elt, 'highlightElement')
};
