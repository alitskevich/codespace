export const loadJson = <T = any>({ url, body, headers, ...opts }: any): Promise<T> =>
  fetch(url, {
    method: body ? "POST" : "GET",
    mode: "cors",
    redirect: "follow",
    body: body ? JSON.stringify(body) : null,
    headers: {
      // work-around for `script.google.com`
      "Content-Type": url.startsWith("https://script.google.com/macros/s/")
        ? "text/plain"
        : "application/json",
      ...headers,
    },
    ...opts,
  })
    .then((res) => res.json())
    .then((res) => {
      if (res?.error) throw res.error;
      return res;
    });
