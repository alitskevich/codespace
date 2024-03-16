import { StringHash } from "../../types";

/**
 * Parses string into Url object.
 */
export const parseQueryString = (s: string, r: StringHash = {}): StringHash => {
  s.split("&").forEach((param: string) => {
    const [key, value] = param.split("=");
    if (value) {
      r[decodeURIComponent(key)] = value === "false" ? "" : decodeURIComponent(value);
    }
  });
  return r;
};
