import { XmlNode, xmlStringify } from "ultimus";
import { escapeXml } from "ultimus/src/xml/utils";

const stringifyAttr = ([k, v]: [string, any], i: number, sep: string): string =>
  `${i ? sep : " "}${k}=${v[0] === "{" ? v : `"${v}"`}`;

export function stringifyJsxAttributes(attrs: object, sep = " ") {
  return Object.entries(attrs)
    .filter(([_, v]) => v != null && v !== "")
    .map((pair, index) => stringifyAttr(pair, index, sep))
    .join("");
}

export function jsxStringify({ tag, attrs, nodes = [], text }: XmlNode, tab = ""): string {
  const stext = text ? `${escapeXml(String(text || ""))}` : "";

  const ssubs = nodes.map((c) => xmlStringify(c, `  ${tab}`)).join("\n");

  const sattrs = attrs ? stringifyJsxAttributes(attrs) : "";

  return `${tab}<${tag}${sattrs}${!ssubs && !stext ? "/>" : `>${ssubs ? `\n${ssubs}\n${tab}` : ""}${stext}</${tag}>`}`;
}
