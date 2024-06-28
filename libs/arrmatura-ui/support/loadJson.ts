export const loadJson = <T = any>({ url, body, ...opts }: any): Promise<T> =>
  fetch(url, {
    method: body ? "POST" : "GET",
    mode: "cors",
    redirect: "follow",
    body: body && typeof body == "object" ? JSON.stringify(body) : body ?? null,
    ...opts,
  })
    .then((res) => res.json())
    .then((res) => {
      if (res?.error) throw res.error;
      return res;
    });
