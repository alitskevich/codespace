import { Uid, XmlNode } from "ultimus";

import { IManifestNode } from "../../types";

import { CForNode } from "./Iterative";
import { CCompositeNode } from "./composition";
import { CIfNode } from "./conditionals";
import { ConnectorNode } from "./connector";
import { CElementNode } from "./elementary";
import { CFragmentNode } from "./fragment";
import { CDynamicTagNode } from "./routing";
import { CSelectorNode } from "./selection";
import { CSlotNode } from "./slot";

const cloneNode = (x: XmlNode, eliminateAttr: string): XmlNode => {
  const { [eliminateAttr]: _, ...attrs } = x.attrs ?? {};
  return {
    text: x.text,
    tag: x.tag,
    id: x.id,
    attrs,
    nodes: x.nodes?.map((n) => n),
  };
};

const __compileManifestNode = (x: XmlNode): IManifestNode => {
  const { tag = "div", attrs } = x;
  if (attrs?.["Each"]) {
    return new CForNode(cloneNode(x, "Each"), String(attrs["Each"]).trim().split(" "));
  }
  if (attrs?.["If"]) {
    return new CIfNode(cloneNode(x, "If"), String(attrs["If"]));
  }
  if (tag === "div" || tag[0]?.match(/[A-Z0-9]/) == null) {
    return new CElementNode(x);
  }
  if (tag === "Dynamic") {
    return new CDynamicTagNode(cloneNode(x, "As"), String(attrs?.As ?? "Error.Dynamic"));
  }
  if (tag === "Slot") {
    return new CSlotNode(x);
  }
  if (tag === "Selector") {
    return new CSelectorNode(x);
  }
  if (tag === "Connector") {
    return new ConnectorNode(x);
  }
  if (tag === "Fragment" || tag === "Then" || tag === "Else") {
    return new CFragmentNode(x);
  }
  return new CCompositeNode(x);
};

const CTXNODES = new Map();

export const compileManifestNode = (x: XmlNode): IManifestNode => {
  return CTXNODES.has(x) ? CTXNODES.get(x) : CTXNODES.set(x, __compileManifestNode(x)).get(x);
};

export const compileManifestNodes = (x: XmlNode[]): Map<Uid, IManifestNode> =>
  new Map<Uid, IManifestNode>(x?.map(compileManifestNode).map((c) => [c.uid, c]) ?? []);
