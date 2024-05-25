import { Hash } from "ultimus/types";

import type { DomNode, IElement } from "../../types";

import { LISTENERS } from "./events";

// DOM custom attribute setters
export const ATTR_SETTERS: Hash<($: IElement, e: DomNode, v: unknown) => void> = {
  // inner text
  "#text": (_, e, v) => (e.innerText = v as string),
  // dataset
  data: function (_, e, u) {
    e.$dataset = typeof u === "string" ? u : { ...u as object };
  },
  // class
  classNames: (_, e, v) => {
    e.setAttribute("class", String(v));
  },
  innerHtml: (_, e, v) => {
    e.innerHTML = String(v).replaceAll(/<(script|img|picture|i?frame)/g, "");
  },
  // inputs specic
  disabled: (_, e, v) => (e.disabled = v ? true : null),
  selected: (_, e, v) => (e.selected = v ? true : null),
  value: (_, e, v) => (e.value = v == null ? "" : v),
  checked: (_, e, v) => (e.checked = !!v),
  autofocus: (_, e, v) => { if (v) setTimeout(() => e.focus(), 10); },

  ...LISTENERS,
};
