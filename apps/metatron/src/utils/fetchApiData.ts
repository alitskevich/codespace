import { parseJson } from "ultimus";

export async function fetchApiData(storeKey: string, url: string) {
  const title = window.document.title;
  window.document.title = 'Loading...';

  return Promise.resolve(true)
    .then(() => {
      const stored = window.localStorage.getItem(storeKey);
      if (stored) {
        return stored;
      }

      return fetch(url)
        .then((res) => res.text())
        .then((text) => {
          window.localStorage.setItem(storeKey, text);
          return text;
        });
    })
    .then((text) => parseJson(text))
    .finally(() => {
      window.document.title = title;
    });
}
