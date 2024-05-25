import { Hash, StringHash } from "../../types";
import { scalarParse } from "../scalar/scalarParse";

export const decodus = (val: string): any => {
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

/**
 * Parses string into Url object.
 */
export const parseQueryString = (s: string, r: StringHash = {}): Hash => {
  s.split("&").forEach((param: string) => {
    const [key, value] = param.split("=");
    if (value) {
      r[decodeURIComponent(key)] = decodus(value);
    }
  });
  return r;
};
