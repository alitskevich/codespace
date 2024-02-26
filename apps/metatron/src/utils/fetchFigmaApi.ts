// const fileKey = "HJZ2n7avAOMFJnyh9TYAuO";
// const token = "figd_QZYjtGLxkwtXCtACS4fCyb1esKY4u9L_1E67ROeC";

import { urlParse } from "ultimus";

export async function fetchFigmaApi(path: string) {
  const url = `https://api.figma.com/v1/${path}`; //`

  const { params } = urlParse(window.location.href);

  const {
    // file: fileKey = "bXt9NPqRZ82YO4IUCIdrpO", // my test
    // figma_token = "figd_QZYjtGLxkwtXCtACS4fCyb1esKY4u9L_1E67ROeC",
    figma_token = "figd_mYOOCbB09rPHMKpxIDGSimPhqKATx2ls-OUmjGzT",
  } = params;

  if (figma_token) {
    window.localStorage.setItem('figma_token', figma_token);
  }

  const token = window.localStorage.getItem('figma_token');

  if (!token) {
    return Promise.resolve({ error: { message: 'No Figma API token' } });
  }

  const title = window.document.title;
  window.document.title = 'Loading...';

  return fetch(url, {
    headers: {
      "X-Figma-Token": token,
    },
  })
    .then((r) => r.json())
    .then((json) => {
      // log(json, "json");
      // window.document.body.innerHTML = '';
      if (json.err) {
        return { error: { message: json.err } };
      }
      return json;
    })
    .catch((error) => ({ error: { message: error.message } }))
    .finally(() => {
      window.document.title = title;
    });
}

