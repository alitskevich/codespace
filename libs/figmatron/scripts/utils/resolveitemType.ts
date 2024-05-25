import { resolveClassName } from "./resolveClassName";


export const resolveitemType = (item) => {
  const key = item.type || "string";
  const spec = item.typeSpec;

  if (key === "blob") return "string";
  if (key === "date") return "string";
  if (key === "enum") return "string";
  if (key === "eitLov") return "string";
  if (key === "custom") return spec;
  if (key === "struct") return !spec || spec === "any" ? "any" : resolveClassName(spec);
  if (key === "array") return `Array<${!spec || spec === "any" ? "any" : resolveClassName(spec)}>`;

  return key;
};
