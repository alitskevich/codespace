import { qname } from "ultimus";

import { jsxStringify } from "../utils/jsxStringify";

const normalizeNode = (node) => {
  node.attrs = Object.entries(node?.attrs ?? {}).reduce(
    (r, [k, v]) => (k === "class" ? r : Object.assign(r, { [qname(k)]: v })),
    {}
  );

  node.nodes?.forEach((n) => normalizeNode(n));

  return node;
};
const generateJsx = (xnode) => {
  if (!xnode) return "{ null }";

  const className = xnode?.attrs?.class
    ? `{\`${xnode.attrs.class.replace("{@class}", "")} \${className}\`}`
    : `{className}`;

  const node = normalizeNode(xnode);

  // adjust className
  node.attrs.className = className;

  return jsxStringify(node, "  ");
};

export const generateReactSvg = (componentName, xnode) => {
  const jsx = generateJsx(xnode);
  const output = `"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React, { FC } from "react";

export const ${componentName}: FC<{className?: string}> = ({ className = "" }) => {
  return <>
${jsx}
  </>;
}`;

  return output;
};
