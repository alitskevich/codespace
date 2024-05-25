import { Url } from "../../types";

import { parseQueryString } from "./parseQueryString";

/**
 * Parses the given URL string and returns an object containing its different components.
 *
 * @param {string} x - The URL string to be parsed
 * @return {Url} The parsed URL object
 */
export const urlParse = (x: string): Url => {
  const r: Url = { path: [], params: {}, host: "" };
  if (!x) {
    return r;
  }
  let p: number;
  let s = String(x).replace(/\+/g, " ");
  // extract hash:
  p = s.indexOf("#");
  if (p > -1) {
    r.hash = decodeURIComponent(s.slice(p + 1));
    s = s.slice(0, p);
  }
  // extract query params:
  p = s.indexOf("?");
  if (p > -1) {
    parseQueryString(s.slice(p + 1), r.params);
    s = s.slice(0, p);
  }
  // extract type:
  p = s.indexOf(":");
  if (p > -1) {
    r.protocol = s.slice(0, p);
    s = s.slice(p + 1);
  }

  // host and path:
  r.path = s.split("/").map(decodeURIComponent);
  if (r.path.length > 2 && !r.path[0] && !r.path[1]) {
    r.path.shift();
    r.path.shift();
    r.host = r.path.shift() ?? "";
  }

  return r;
};
