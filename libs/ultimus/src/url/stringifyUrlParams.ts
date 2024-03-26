export const encodus = (value: unknown): string => {
  return encodeURIComponent(typeof value === "object" ? JSON.stringify(value) : String(value));
};

export const stringifyUrlParams = (params: unknown): string => {
  if (!params) return "";

  const keys = Object.keys(params).filter((key) => key && params[key] != null);

  return keys.map((key) => `${encodeURIComponent(key)}=${encodus(params[key])}`).join("&").replace(/ /g, "+");
};
