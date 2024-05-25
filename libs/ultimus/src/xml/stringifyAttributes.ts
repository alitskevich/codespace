import { escapeXml } from "./utils";

const stringifyAttr = ([k, v]: [string, any], i: number, sep: string): string =>
  `${i ? sep : " "}${k}="${typeof v === "object" ? escapeXml(JSON.stringify(v).slice(1, -1)) : v}"`;

export function stringifyAttributes(attrs: object, sep = " ") {
  return Object.entries(attrs)
    .filter(([_, v]) => v != null && v !== "")
    .map((pair, index) => stringifyAttr(pair, index, sep))
    .join("");
}
