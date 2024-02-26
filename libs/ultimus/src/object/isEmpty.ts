/**
 * Checks if argument is empty .
 */
export const isEmpty = (x: unknown): boolean => {
  if (!x) {
    return true;
  }
  if (typeof x === "object") {
    if (x === null) {
      return true;
    }
    // (zero-length array)
    if (Array.isArray(x)) {
      return x.length === 0;
    }
    // (zero-size map)
    if (x instanceof Map) {
      return x.size === 0;
    }
    // (has no props)
    return Object.keys(x).length === 0;
  }
  return false;
};
