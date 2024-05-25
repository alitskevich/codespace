import { compileManifestNode, compileManifestNodes } from "arrmatura";
import {
  IArrmatron,
  IComponent,
  IComponentDescriptor,
  IManifestNode,
} from "arrmatura/types";
import { DomNode, IElement, IWebPlatform } from "arrmatura-web/types";
import * as libs from "ultimus";
import { mapEntries, xmlParse, mergeObject } from "ultimus";
import { Hash, Data, LogEntry } from "ultimus/types";
import type { Uid, XmlNode } from "ultimus/types";

import { ATTR_SETTERS } from "./dom/attributes";
import { DomElement } from "./dom/elements";
import { fnName } from "./utils/fnName";
import { reflow } from "./utils/reflow";


/**
 * Arramture platform implementation for regular Web browser DOM.
 */
export class WebPlatform implements IWebPlatform {
  rootElement: ShadowRoot | HTMLElement;
  reflowId?: unknown;
  typeRegistry = new Map<string, IComponentDescriptor>();
  compiledTemplates = new Map<string | XmlNode | XmlNode[], IManifestNode | Map<Uid, IManifestNode>>();
  private readonly resources: Hash<any> = {}

  constructor(root: ShadowRoot | HTMLElement | string = "root", resources: Hash<any> = {}, private readonly plugins?: Array<any>) {
    if (typeof root === "string") {
      root = document.getElementById(root) ?? window.document.body;
    }
    this.rootElement = root || window.document.body;

    this.updateResources(resources);
  }

  eachPlugin(key: string, value?: any) {
    this.plugins?.forEach((plugin) => {
      plugin[key]?.(this, value);
    });
  }

  init() {
    this.eachPlugin('init');
  }

  done() {
    this.eachPlugin('done');
  }

  registerTypes(types?: any[]) {
    if (!types) return;

    const register = (ctr: IComponentDescriptor) => {
      const tag = String(ctr.tag);
      this.compiledTemplates.delete(tag);
      this.typeRegistry.set(tag, ctr);
    }

    const registerType = (ctr) => {
      if (typeof ctr === "string") {
        ctr.replace(/<component\s+id="([^"]+)"(?:[^>]*)>([\s\S]*?)<\/component>/gm, (_, tag, template) => {
          register({ tag, template: template.trim() });
          return "";
        });
      } else if (typeof ctr === "function") {
        register({ Ctor: ctr, tag: ctr.name ?? fnName(ctr) });
      } else {
        register({ ...ctr, tag: ctr.tag ?? ctr.id });
      }
    };

    Array.isArray(types)
      ? types.filter(Boolean).forEach(registerType)
      : mapEntries(types, (tag, template) => register({ tag, template }))

  }

  getByTag(tag: string): IComponentDescriptor {
    const r = this.typeRegistry.get(tag) ?? window[tag as keyof typeof window];

    if (r) return r;
    const parts = tag.split(".");
    for (parts.pop(); parts.length; parts.pop()) {
      const r = this.typeRegistry.get(parts.join("."));
      if (r) return r;
    }

    return { tag, unknown: true };
  }

  getCompiledNodes(tag: XmlNode): IManifestNode;
  getCompiledNodes(tag: string): Map<string, IManifestNode>;
  getCompiledNodes(tag: XmlNode[]): Map<string, IManifestNode>;
  getCompiledNodes(tag: string | XmlNode | XmlNode[]) {
    if (typeof tag === "string") {
      const map = this.compiledTemplates;
      return map.has(tag) ? map.get(tag) : map.set(tag, compileManifestNodes(xmlParse(this.getByTag(tag)?.template))).get(tag);
    }
    if (Array.isArray(tag)) {
      return compileManifestNodes(tag);
    }
    return compileManifestNode(tag);
  }

  createComponent(def: IComponentDescriptor | string, initials: Hash, ctx: IArrmatron): IComponent {
    if (typeof def === "string") return this.createComponent(this.getByTag(def), initials, ctx);
    try {
      const { Ctor, tag, unknown, native } = def;
      if (native) return new DomElement(tag ?? "div", initials, ctx);
      if (Ctor) return new Ctor(initials, ctx);
      if (unknown) {
        this.log({
          level: "info",
          message: `<-- unknown tag: ${tag} -->`,
          source: "platform",
        });
        console.log(`<component id="${tag}"><div class="stub" title="${tag}">✧</div></component>`);
        return new DomElement("div", { ...initials, "#text": "✧", title: `<${tag}>` }, ctx);
      }
      return { ...initials };
    } catch (error: any) {
      return new DomElement("div", { ...initials, class: " bg-red-600 p-4 border", "#text": `✧ERROR: ${def.tag}: ${error.message}` }, ctx);
    }

  }
  setElementAttribute(element: IElement, node: DomNode, key: string, value: any) {
    const setter = ATTR_SETTERS[key];
    if (setter) {
      setter(element, node, value);
    } else {
      if (value != null) {
        node.setAttribute(key, value);
      } else {
        node.removeAttribute(key);
      }
    }
  }

  addElementAttributeSetters(attrs) {
    Object.assign(ATTR_SETTERS, attrs)
  }

  updateResources(delta: any) {
    mapEntries(delta, (key, value) => {
      if (key[0] === "$") return;
      if (key === "components") {
        this.registerTypes(value);
        return;
      }
      const keys = key.split(".");
      if (keys.length > 1) {
        const last = keys.pop() ?? '-';
        const target = keys.reduce<Hash>((r, e) => (r[e] ?? (r[e] = {})), this.resources);
        target[last] = mergeObject(target[last], value);
        return;
      }
      this.resources[key] = mergeObject(this.resources[key], value);
    })
  }

  getResource(key: string | string[]): Data {
    const [id, ...deep] = typeof key === "string" ? key.split(".") : key;
    const { resources } = this;
    const target = id ? resources[id] : resources;
    if (!target || deep.length === 0) {
      return target;
    }
    if (deep.length === 1) {
      return target[deep[0]];
    }
    return deep.reduce((r, k) => (r ? r[k] : null), target);
  }

  getFunction(id: string): (...args: any[]) => any {
    return ((libs as Hash)[id] || this.resources.functions?.[id]) as unknown as (...args: any[]) => any;
  }

  redraw(_: IArrmatron, root: IArrmatron) {
    // debounce
    if (this.reflowId) return;
    this.reflowId = setTimeout(() => {
      reflow(root.children, this.rootElement);
      this.reflowId = undefined;
    }, 10);
  }

  log({ level, source = "", message = "", error, params = [] }: LogEntry) {
    if (level === "error") {
      console.error(`⛔ ERROR:`, source ? `${source}:` : "", message, error?.message ?? "", ...params);
    } else if (level === "warning") {
      console.warn(`⚠ WARNING:`, source ? `${source}:` : "", message, error?.message ?? "", ...params);
    } else {
      console.log(source, message, ...params);
    }
  }
  toast(message: LogEntry, ctx: IArrmatron) {
    ctx.emit('toaster.send(data)', message);
  }
}
