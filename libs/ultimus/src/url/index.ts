import { StringHash, Url, UrlParams } from "../../types";

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

export const urlParse = (x: string): Url => {
  const r: Url = { path: [], params: {}, host: "" };
  if (!x) {
    return r;
  }
  let p: number;
  let s = String(x).replace(/\+/g, " ");
  // extract type:
  p = s.indexOf(":");
  if (p > -1) {
    r.protocol = s.slice(0, p);
    s = s.slice(p + 1);
  }
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
  // host and path:
  r.path = s.split("/").map(decodeURIComponent);
  const path = r.path;
  if (path.length > 2 && !path[0] && !path[1]) {
    path.shift();
    path.shift();
    r.host = path.shift() ?? "";
  }

  return r;
};

/**
 *  Represents an Url object as a string
 *
 * @param {object} r Url object like `{type, host, path, params, hash }`
 * @returns string in format `type:host/path?params#hash`
 */
export const urlStringify = (r: Partial<Url>): string => {
  let result = "";
  if (!r) {
    return result;
  }
  if (r.host) {
    if (r.protocol) {
      result += `${r.protocol}:`;
    }
    result += `//${r.host}`;
  }
  if (r?.path?.length) {
    result += `/${r.path.filter(Boolean).map(encodeURIComponent).join("/")}`;
  }
  const { params } = r;

  if (params) {
    const keys = Object.keys(params).filter((key) => key && params[key] != null);
    if (keys.length) {
      result += `?${keys
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join("&")}`.replace(/ /g, "+");
    }
  }

  if (r.hash) {
    result += `${r.hash[0] === "#" ? "" : "#"}${encodeURIComponent(r.hash)}`;
  }

  return result;
};

export const urlAppendParams = (url = "", params: UrlParams = {}): string => {
  const queryString = Object.entries(params)
    ?.map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");

  return [url, queryString].filter(Boolean).join(url.includes("?") ? "&" : "?");
};
