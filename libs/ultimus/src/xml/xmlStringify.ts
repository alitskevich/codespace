import { XmlNode } from "../../types";

import { stringifyAttributes } from "./stringifyAttributes";
import { escapeXml } from "./utils";

/**
 * String representation of a XMLNode object.
 *
 * @param {XmlNode} { tag, attrs, nodes = [] }
 * @param {string} [tab='']
 * @returns {string}
 */

export function xmlStringify({ tag, attrs, nodes = [], text }: XmlNode, tab = ""): string {
  const stext = text ? `${escapeXml(String(text || ""))}` : "";

  const ssubs = nodes.map((c) => xmlStringify(c, `  ${tab}`)).join("\n");

  const sattrs = attrs ? stringifyAttributes(attrs) : "";

  return `${tab}<${tag}${sattrs}${!ssubs && !stext ? "/>" : `>${ssubs ? `\n${ssubs}\n${tab}` : ""}${stext}</${tag}>`}`;
}
