import { stringifyAttributes } from "ultimus";

import { ANode } from "../nodes/ANode";

const pairedTags = ["component", "div", "section", "svg"];

/**
 * Converts a given node object to an HTML string representation.
 *
 * @param {any} inode - The node object to convert.
 * @param {string} indent - The indentation level for the HTML output. Defaults to empty string.
 * @return {string} - The HTML string representation of the node.
 */
export function nodeToHtml(inode: Partial<ANode>, indent = "") {
  const { tag: tag = "div", attrs = {}, classes, styling, nodes: xnodes } = inode;
  const nodes = xnodes ? (Array.isArray(xnodes) ? xnodes : [xnodes]) : null;
  const hasChildren = nodes?.length;
  const singleTag = !hasChildren && !pairedTags.includes(tag);

  const classesAll = [
    styling?.If === false ? "hidden" : "",
    ...Object.keys(classes ?? {}),
    String(attrs.class ?? ""),
  ];

  const allAttrs = {
    ...attrs,
    class: classesAll.filter(Boolean).sort().join(" "),
    // styling: mapEntries(styling, (k, v) => `${k}: ${v}`).join('; '),
    If: styling?.If,
  };

  const output: string[] = [];
  output.push(`${indent}<${tag}${stringifyAttributes(allAttrs, ` `)}${singleTag ? " /" : ""}>`);
  if (hasChildren) {
    output.push(
      ...nodes.map((child: any) => (child.toHtml ? child.toHtml(`${indent}  `) : nodeToHtml(child, `${indent}  `)))
    );
  }
  if (!singleTag) {
    output.push(`${indent}</${tag}>`);
  }

  return output.join("\n");
}
