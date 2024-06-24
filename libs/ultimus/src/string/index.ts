import { Hash } from "../../types";

export function str(x: unknown) {
  return x == null ? "" : String(x);
}
export function stringifyJson(x: unknown, indent = 2) {
  return JSON.stringify(x, null, indent);
}

export function capitalize(x: unknown) {
  const s = x == null ? "" : String(x);
  return s.length ? s[0].toUpperCase() + s.slice(1) : "";
}
export function strLowerize(x: unknown) {
  const s = str(x);
  return s.length ? s[0].toLowerCase() + s.slice(1) : "";
}

export function strMapChunks(
  x: unknown,
  fn: (chunk: string, index: number) => string,
  sep = "_",
  sep2 = sep
) {
  return x == null ? "" : String(x).split(sep).filter(Boolean).map(fn).filter(Boolean).join(sep2);
}
export function camelize(x: unknown, sep = "_") {
  return strMapChunks(str(x), (t, i) => (i ? capitalize(t) : t), sep, "");
}
export function qname(x: unknown, re = /\W+/g) {
  return x == null
    ? ""
    : strMapChunks(
        String(x).trim().replaceAll(re, "_"),
        (t, i) => (i ? capitalize(t) : strLowerize(t)),
        "_",
        ""
      );
}

export const snakeCase = (x: string) =>
  str(x)
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .toLowerCase();
export const properCase = (x: string, sep?: string) => capitalize(camelize(x, sep));
export const upperCase = (x: string) => str(x).toUpperCase();
export const lowerCase = (x: string) => str(x).toLowerCase();

export function strFormat(template: string, params: Hash = {}, regExp = /\$\{([\S]+)\}/gi) {
  return str(template).replaceAll(regExp, (_, key) =>
    params[key] != null ? str(params[key]) : ""
  );
}

export const strEnhance = (x: string, template?: string, def?: string) => {
  return !x ? "" : `${template || "*"}`.replace("*", x ?? def ?? "");
};

export const strTail = (x: string, sep = " ") => {
  if (!x) {
    return "";
  }
  const pos = x.lastIndexOf(sep);
  return pos === -1 ? x : x.slice(pos + sep.length);
};

export const strHead = (x: string, sep = /[\s:/]/) => {
  if (!x) {
    return "";
  }
  const [result] = str(x).split(sep);

  return result;
};
export const strHeadOrSelf = (x: string, sep = /[\s:/]/) => {
  return strHead(x, sep) ?? x;
};

export const strReplace = (x: string, rep, by, def = "") => {
  return String(x).replace(rep, by ?? def);
};

export const abbreviate = (x: string, sep = " ") =>
  !x
    ? ""
    : str(x)
        .split(sep)
        .map((s) => s[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

export const mirror = (x: string) =>
  str(x)
    .split("")
    .reduce((r, c) => c + r, "");

export function padLeft(x: string | number, size = 1, fill = " ") {
  let s = str(x);
  while (s.length < size) {
    s = `${fill}${s}`;
  }
  return s;
}
