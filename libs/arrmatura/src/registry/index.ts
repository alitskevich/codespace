import { CForNode } from "./iterations";
import { CCompositeNode } from "./composition";
import { CIfNode } from "./conditionals";
import { CElementNode } from "./elementary";
import { CDynamicTagNode } from "./routing";
import { CSlotNode } from "./slot";
import { CFragmentNode } from "./fragment";
import { CSelectorNode } from "./selection";
import { ConnectorNode } from "./connector";

import { Uid, XmlNode } from "ultimus";
import { IManifestNode } from "../../types";

const cloneNode = (x: XmlNode, eliminateAttr: string): XmlNode => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  const { tag = 'div', attrs } = x;
  if (attrs?.["each"]) {
    return new CForNode(cloneNode(x, "each"), String(attrs["each"]).trim().split(" "));
  }
  if (attrs?.["if"]) {
    return new CIfNode(cloneNode(x, "if"), String(attrs["if"]));
  }
  if (tag === "div" || tag[0]?.match(/[A-Z0-9]/) == null) {
    return new CElementNode(x);
  }
  if (tag === "Dynamic") {
    return new CDynamicTagNode(cloneNode(x, "as"), String(attrs?.as ?? "Error.Dynamic"));
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
