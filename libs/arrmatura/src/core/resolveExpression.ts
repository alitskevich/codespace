import { createStringInterpolator } from "ultimus/src/parsing/createStringInterpolator";

import {
  compileConstant,
  compileJsExpression,
  compilePlaceholder,
} from "../utils/compileExpression";
// \{\{([\w\.]+)\}\}

const CACHE = new Map();

function compileExpression(v: unknown) {
  if (typeof v !== "string") return () => v;

  if (v.startsWith("js:")) return compileJsExpression(v.slice(3));

  if (v.includes("{")) {
    const vCutOne = v.slice(1, -1);
    if (v[0] === "{" && v[v.length - 1] === "}" && !vCutOne.includes("{")) {
      return compilePlaceholder(vCutOne);
    }
    return createStringInterpolator(v.replace(/\s+/g, " "), compilePlaceholder);
  }
  return compileConstant(v);
}

export const resolveExpression = (x: unknown) => {
  return CACHE.has(x) ? CACHE.get(x) : CACHE.set(x, compileExpression(x)).get(x);
};
