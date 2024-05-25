import type { DomNode, IElement, IWebPlatform } from "../../types";
import { setEventListener } from "../utils/setEventListener";

const attrs = {
  draggable: function ($: IElement, elt: DomNode, val) {
    elt.setAttribute("draggable", String(!!val));
    const className = String(elt.getAttribute("draggableClass") ?? "dragging");
    setEventListener($, "draggable:dragend", (_e) => {
      elt.classList.remove(className);
    });
    setEventListener($, "draggable:dragstart", (e) => {
      elt.classList.add(className);
      e.dataTransfer.effectAllowed = "all";
      e.dataTransfer.setData("text/plain", JSON.stringify(elt.$dataset ?? {}));
      // e.preventDefault()
    });
  },

  dragstart: function ($: IElement, elt: DomNode) {
    setEventListener($, "dragstart", (e) => {
      e.preventDefault();
      setTimeout(() => {
        $.dragstart?.({ ...elt.$dataset, nativeEvent: e });
      }, 0);
    });
  },
  dragend: function ($: IElement, elt: DomNode) {
    setEventListener($, "dragend", (e) => {
      e.preventDefault();
      setTimeout(() => {
        $.dragend?.({ ...elt.$dataset, nativeEvent: e });
      }, 0);
    });
  },
  dragover: function ($: IElement, elt: DomNode) {
    setEventListener($, "dragover", (e) => {
      e.preventDefault();
      setTimeout(() => {
        $.dragover?.({ ...elt.$dataset, nativeEvent: e });
      }, 0);
    });
  },

  dragdrop: function ($: IElement, elt: DomNode) {
    const className = String(elt.getAttribute("dragdropClass") ?? "dragdrop");

    setEventListener($, "dragenter", (e) => {
      e.preventDefault();
      e.target.classList.add(className);
    });
    setEventListener($, "dragover", (e) => {
      e.preventDefault();
      e.target.classList.add(className);
    });
    setEventListener($, "dragleave", (e) => {
      e.target.classList.remove(className);
    });
    setEventListener($, "drop", (e) => {
      e.target.classList.remove(className);

      const raw = e.dataTransfer.getData("text/plain");
      const source = JSON.parse(raw || "{}");

      $.dragdrop?.({ target: { ...elt.$dataset }, source, nativeEvent: e });
    });
  },
};

export const draggingPlugin = {
  init(platform: IWebPlatform) {
    platform.addElementAttributeSetters(attrs)
  }
}