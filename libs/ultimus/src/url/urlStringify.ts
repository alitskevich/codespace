import { Url } from "../../types";

/**
 *  Represents an Url object as a string
 *
 * @param {Partial<Url> | null} r Url object like `{type, host, path, params, hash }`
 * @returns string in format `type:host/path?params#hash`
 */
export const urlStringify = (r: Partial<Url> | null): string => {
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
