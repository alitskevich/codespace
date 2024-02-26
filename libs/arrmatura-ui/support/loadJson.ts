import { parseJson } from "ultimus";

export const loadJson = (url: string, body?: object | null, opts?: any) =>
  !url ? Promise.reject(new Error('No URL')) : fetch(url, {
    method: body ? "POST" : "GET",
    mode: "cors",
    redirect: "follow",
    // credentials: "include",
    body: body ? JSON.stringify(body) : null,
    ...opts,
    headers: {
      "Content-Type": url.startsWith("https://script.google.com/macros/s/") ? "text/plain" : "application/json",
      ...opts?.headers,
    },
  })
    .then((res) => res.text())
    .then((res) => parseJson(res))
    .then((json) => {
      if (json?.error) {
        throw json.error;
      }
      return json;
    });