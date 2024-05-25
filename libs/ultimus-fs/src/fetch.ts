/**
 * Fetches JSON data from a specified URL.
 *
 * @param {string} url - The URL to fetch JSON data from.
 * @param {any} opts - (Optional) Additional options for the fetch request.
 * @return {Promise<any>} A promise that resolves to the fetched JSON data.
 */
export const fetchJson = async <T = any>(url: string, opts?: any): Promise<T> =>
  fetch(url, {
    method: opts?.body ? "POST" : "GET",
    ...opts,
    body: typeof opts?.body === "object" ? JSON.stringify(opts.body) : opts?.body,
    headers: {
      "Content-Type": url.startsWith("https://script.google.com/macros/s/") ? "text/plain" : "application/json",
      ...opts?.headers,
    },
  })
    .then((r) => r.json())
    .catch((error) => ({ error: { message: error.message } }));
