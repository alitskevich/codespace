import { Hash } from "ultimus";
const attributesToString = (v?: Hash): string => {
  if (typeof v === "object") {
    if (Array.isArray(v)) {
      return !v.length ? "[]" : `[${attributesToString(v[0]) ?? ""} x${String(v.length)}]`;
    }
    return `{${Object.keys(v).toString()}}`;
  }
  return v ?? "";
};

const stringifyState = (attrs?: object | Hash) => {
  if (!attrs) {
    return "";
  }

  const r: string[] = [];
  Object.entries(attrs).forEach(([k, v]) => {
    if (v && k[0] !== "$") {
      r.push(` ${k}="${attributesToString(v)}"`);
    }
  });

  return r.length ? r.join("") : "";
};

export const stringify = (T: any, tab = ""): string => {
  const { uid, displayName: tag = uid, component: impl, children } = T;

  const ssubs: string = children?.size ? [...children.values()].map((c) => stringify(c, `  ${tab}`)).join("\n") : "";

  return `${tab}<${tag}${stringifyState(impl)}${!ssubs ? "/>" : `>\n${ssubs}\n${tab}</${tag}>`}`;
};
