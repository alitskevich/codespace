import { loadJson } from "../support";

export class ApiEndpoint {
  url = "/api";
  token = "";
  onUnauthorized?: (error: Error) => void;

  /**
   * API invocation with options.
   *
   * @param {type} data - description of parameter
   * @return {T} retrieved value object
   */
  invoke<T>(options) {
    const url = options.url ?? this.url;

    return loadJson<T>({
      url,
      token: this.token,
      onUnauthorized: this.onUnauthorized,
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        ...options.headers,
      }
    }).catch((error: any) => {
      if (error?.code == 401 && this.onUnauthorized) {
        this.onUnauthorized?.(error);
      } else {
        throw error;
      }
    });
  }
}
