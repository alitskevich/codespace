import { UrlParams } from "../../types";

import { stringifyUrlParams } from "./stringifyUrlParams";


/**
 * Generates a new URL by appending query parameters to the input URL.
 *
 * @param {string} url - The base URL to which parameters will be appended.
 * @param {UrlParams} params - The key-value pairs to be added as query parameters.
 * @return {string} The updated URL with the appended query parameters.
 */
export const urlAppendParams = (url = "", params: UrlParams = {}): string => {
  const queryString = stringifyUrlParams(params);

  return [url, queryString].filter(Boolean).join(url.includes("?") ? "&" : "?");
};
