import { Hash, XmlNode } from "../../types";
import { scalarParse } from "../scalar/scalarParse";

import { decodeXmlEntities, skipQoutes } from "./utils";

const defaultOpts = {
  RE_ATTRS: /([a-zA-Z{()][a-zA-Z0-9-:<.})@]*)(="[^"]*")?/g,
  RE_EMPTY: /^\s*$/,
  RE_XML_COMMENT: /<!--((?!-->)[\s\S])*-->/g,
  RE_XML_TAG: /(<)(\/?)([a-z][a-z0-9\-_:.]*)((?:\s+[a-zA-Z{()][a-z0-9-:<.})@]*(?:="[^"]*")?)*)\s*(\/?)>/gi,
  SINGLE_TAGS: { img: 1, input: 1, br: 1, hr: 1, col: 1, source: 1 } as Hash,
};

export function xmlParserFactory(opts?: Partial<typeof defaultOpts>) {
  const { RE_XML_TAG, RE_EMPTY, RE_XML_COMMENT, RE_ATTRS, SINGLE_TAGS } = {
    ...defaultOpts,
    ...opts,
  } as typeof defaultOpts;

  const addNode = (c: XmlNode, tag: string, id: string) => {
    const node: XmlNode = { tag, id };
    (c.nodes ?? (c.nodes = [])).push(node);

    return node;
  };

  const parseAttrs = (node: XmlNode, s: string) => {
    if (!s) return;
    node.attrs = {};
    for (let e = RE_ATTRS.exec(s); e; e = RE_ATTRS.exec(s)) {
      if (e[1].startsWith('{...')) {
        node.attrs['(...)'] = e[1].slice(4, -1);
      } else {
        const value = !e[2] ? true : scalarParse(decodeXmlEntities(skipQoutes(e[2].slice(1))));
        node.attrs[e[1]] = value;
      }
    }
  };
  return (_s?: string): XmlNode[] => {
    let COUNTER = 0;
    const ctx: XmlNode[] = [{ tag: "#root", id: String(COUNTER) }];
    const s = String(_s).trim().replace(RE_XML_COMMENT, "");
    let lastIndex = 0;
    // head text omitted
    for (let e = RE_XML_TAG.exec(s); e; e = RE_XML_TAG.exec(s)) {
      // preceding text
      const text = e.index && s.slice(lastIndex, e.index);
      // closing tag
      if (e[2]) {
        if (text && !ctx[0].nodes?.length && (text === " " || !text.match(RE_EMPTY))) {
          ctx[0].text = decodeXmlEntities(text.trim());
        }
        if (ctx[0].tag !== e[3]) {
          throw new Error(
            ` XML Parse closing tag does not match at: ${String(e.index)} near ${e.input.slice(
              Math.max(e.index - 150, 0),
              e.index
            )}^^^^${e.input.slice(e.index, Math.min(e.index + 150, e.input.length))}`
          );
        }
        ctx.shift();
      } else {
        const elt = addNode(ctx[0], e[3], `X${String(++COUNTER)}`);
        parseAttrs(elt, e[4].trim());
        // not single tag
        if (!(e[5] || e[3] in SINGLE_TAGS)) {
          ctx.unshift(elt);
          if (ctx.length === 1) {
            throw new Error(`Parse error at: ${e[0]}`);
          }
        }
      }
      lastIndex = RE_XML_TAG.lastIndex;
    }
    // tail text omitted
    return ctx[0].nodes ?? [];
  };
}
