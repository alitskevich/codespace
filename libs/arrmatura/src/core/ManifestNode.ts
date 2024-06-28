import type { IPlatform, IArrmatron, IManifestNode } from "arrmatura/types";
import { nextId } from "ultimus";
import type { Delta, ExpressionText, Hash, Uid } from "ultimus/types";

import { compilePipeExpression } from "../utils/compileExpression";

import { Arrmatron } from "./Arrmatron";
import { resolveExpression } from "./resolveExpression";

type PropertyResolver = (c: IArrmatron, acc: Delta) => Delta;

type PropertyGetter = (c: IArrmatron) => unknown;

/**
 * ManifestNode is a abstract factory for Arrmatron.
 *
 * Each specific kind of Arrmatron has its own descending implementation of ManifestNode.
 */
export abstract class ManifestNode implements IManifestNode {
  protected $content?: Map<Uid, IManifestNode> | undefined;
  uid: Uid;
  refId?: string;
  private readonly propertyResolvers: PropertyResolver[] = [];
  private initialState: Hash<(c: IArrmatron) => any> = {};
  connectors?: Map<string, (c: IArrmatron, x: unknown) => unknown>;
  tag: any;

  constructor(xid: Uid) {
    this.uid = `${nextId("N")}:${xid}`;
  }

  abstract get EntitronConstructor(): new (
    platform: IPlatform,
    node: typeof this,
    parent?: Arrmatron,
    scope?: Arrmatron
  ) => Arrmatron;

  /**
   * Create a context object.
   *
   * @param {IPlatform} platform - The platform object.
   * @param {IArrmatron} parent - The parent context object (optional).
   * @param {IArrmatron} scope - The scope context object (optional).
   * @return {IArrmatron} The created context object.
   */
  createArrmatron(platform: IPlatform, parent?: Arrmatron, scope?: Arrmatron): Arrmatron {
    return new this.EntitronConstructor(platform, this, parent, scope);
  }

  getSubNodes(_platform: IPlatform): Map<Uid, IManifestNode> | undefined {
    return this.$content;
  }

  addPropertyResolver(getter: PropertyGetter, propKey: string) {
    this.propertyResolvers.push((c: IArrmatron, delta: Delta) => {
      delta[propKey] = getter(c);
      return delta;
    });
    return this;
  }

  private addDataPropertyResolver(getter: PropertyGetter, propKey: string) {
    this.propertyResolvers.push((c: IArrmatron, delta: Delta) => {
      const val = getter(c);
      delta.data = Object.assign((delta.data as object) || {}, {
        [propKey]: val,
      });
      return delta;
    });
    return this;
  }

  private addPropertiesResolver(getter: PropertyGetter) {
    this.propertyResolvers.push((c: IArrmatron, delta: Delta) => {
      const value = getter(c);
      if (value && typeof value === "object") {
        Object.entries(value).forEach(([key, val]) => {
          delta[key] = val;
        });
      }
      return delta;
    });
    return this;
  }

  addConnector(expr: ExpressionText, propName: string) {
    const { key, pipec } = compilePipeExpression(expr);
    (this.connectors ?? (this.connectors = new Map())).set(`${key}|${propName}`, pipec);
  }

  private addEmitter(expr: ExpressionText, k: string) {
    const { key, pipec } = compilePipeExpression(expr);
    const rkey = key + (expr.endsWith(")") ? "()" : "");
    this.initialState[k] = (c) => (data: unknown) => c.scope?.emit(rkey, pipec(c, data) as Delta);
  }

  resolveInitialProps(c: IArrmatron) {
    return this.propertyResolvers.reduce(
      (delta, resolver) => resolver(c, delta),
      Object.entries(this.initialState).reduce((acc, [key, fn]) => {
        acc[key] = fn(c);
        return acc;
      }, {} as Hash)
    );
  }

  resolveProps(c: IArrmatron) {
    return this.propertyResolvers.reduce((delta, resolver) => resolver(c, delta), {});
  }

  compileAttribute(k: string, v: unknown) {
    if (k.startsWith("data-")) {
      this.addDataPropertyResolver(resolveExpression(v), k.slice(5));
    } else if (k === "Ref") {
      this.refId = String(v);
    } else if (k === "Props") {
      const sv = String(v);
      if (sv.startsWith("<-")) {
        this.addConnector(sv.slice(2), "");
      } else {
        this.addPropertiesResolver(resolveExpression(sv));
      }
    } else {
      if (typeof v !== "string") {
        this.initialState[k] = () => v;
      } else {
        if (!v.includes("{")) {
          if (v.startsWith("<-")) {
            if (v.endsWith(".This")) {
              const refId = v.slice(2, -5).trim();
              this.initialState[k] = (c) => c.getByRef(refId)?.$component;
            } else {
              this.addConnector(v.slice(2), k);
            }
          } else if (v.startsWith("->")) {
            this.addEmitter(v.slice(2).trim() || "*", k);
          } else {
            this.initialState[k] = () => v;
          }
        } else {
          this.addPropertyResolver(resolveExpression(v), k);
        }
      }
    }
  }

  compileAttributes(attrs?: Hash) {
    if (attrs) {
      Object.entries(attrs).forEach((keyValue) => this.compileAttribute(...keyValue));
    }
  }
}
