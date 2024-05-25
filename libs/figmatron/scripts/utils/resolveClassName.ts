import { qname, camelize, capitalize } from "ultimus";

export const SCALAR_TYPES = ["string", "number", "boolean", "object"];

export const resolveClassName = (id) => {
  if (!id) return "";
  if (id.endsWith("[]")) return `${resolveClassName(id.slice(0, -2))}[]`;
  if (SCALAR_TYPES.includes(id)) return id;
  return capitalize(qname(camelize(id)));
};
