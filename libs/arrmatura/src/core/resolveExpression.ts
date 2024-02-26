import { createStringInterpolator } from "ultimus/src/parsing/createStringInterpolator";
import { compileConstant, compileJsExpression, compilePlaceholder } from "../utils/compileExpression";

const CACHE = new Map();

function compileExpression(v: unknown) {
  if (typeof v !== "string") return () => v;

  if (v[0] === "@" || v[0] === "!") return compilePlaceholder(v);

  if (v.startsWith("js:")) return compileJsExpression(v.slice(3));

  if (v.includes("{")) return createStringInterpolator(v.replace(/\s+/g, " "), compilePlaceholder);

  return compileConstant(v);
}

export const resolveExpression = (x: unknown) => {
  return CACHE.has(x) ? CACHE.get(x) : CACHE.set(x, compileExpression(x)).get(x);
}
