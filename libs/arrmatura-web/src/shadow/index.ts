import { launch } from "arrmatura";
import { IArrmatron } from "arrmatura/types";
import * as lib from "ultimus";

import { LaunchWebOptions } from "../../types";
import { WebPlatform } from "../platform";

export function defineCustomElement(
  config: LaunchWebOptions & {
    tag: string;
    attributes: string | string[];
    css?: string;
  }
) {

  const { tag, attributes = [], functions, types = [], resources = {} } = config;
  const rattributes = typeof attributes === "string" ? attributes.split(",").map((s) => s.trim()) : attributes;
  const template = `<${lib.properCase(tag, "-")} ${rattributes.map((name) => `${name}="{@${name}}"`).join(" ")}/>`;

  class Custom extends HTMLElement {
    top: IArrmatron;
    rootElement: ShadowRoot;
    static get observedAttributes() {
      return rattributes;
    }
    constructor() {
      // Always call super first in constructor
      super();

      // Create a shadow root
      this.rootElement = this.attachShadow({ mode: "open" });

      this.rootElement.adoptedStyleSheets = [...document.adoptedStyleSheets];

      const functionsAll = { ...lib, ...functions };

      const platform = new WebPlatform(this.rootElement, {
        ...resources,
        functions: functionsAll,
      });

      platform.registerTypes(([] as any[]).concat(types));

      platform.init();

      this.top = launch(platform, template);
    }

    attributeChangedCallback(name: string, _oldValue: unknown, newValue: unknown) {
      void this.top.up({ [name]: newValue });
    }

    connectedCallback() {
      // console.log('Custom element added to page.');
    }
    disconnectedCallback() {
      // console.log("Custom element removed from page.");
    }

    adoptedCallback() {
      // console.log("Custom element moved to new page.");
    }
  }

  customElements.define(tag, Custom);
}
