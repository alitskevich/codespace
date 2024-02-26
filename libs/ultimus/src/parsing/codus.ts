import { scalarParse } from "../scalar/scalarParse";

export const decodus = (val: string): unknown => {
  if (!val) return undefined;

  const value = decodeURIComponent(val);
  if ("{[".includes(value[0])) {
    try {
      return JSON.parse(value);
    } catch (e) {
      return undefined;
    }
  }
  return scalarParse(value);
};

export const encodus = (value: unknown): string => {
  if (typeof value === "undefined") {
    return "";
  }
  if (typeof value === "object") {
    return value ? encodeURIComponent(JSON.stringify(value)) : "null";
  }
  return encodeURIComponent(String(value));
};
