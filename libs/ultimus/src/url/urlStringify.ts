import { Url } from "../../types";

import { encodus, stringifyUrlParams } from "./stringifyUrlParams";

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
    const sparams = stringifyUrlParams(params);
    if (sparams) {
      result += `?${sparams}`
    }
  }

  if (r.hash) {
    result += `${r.hash[0] === "#" ? "" : "#"}${encodus(r.hash)}`;
  }

  return result;
};
