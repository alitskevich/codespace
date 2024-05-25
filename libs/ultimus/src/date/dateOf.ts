import { Dateable } from "../../types";

import { dateParseISO8601 } from "./dateParseISO8601";

/**
 * Universal converter to Date.
 *
 * @returns Date instance or null
 */
export function dateOf(x: Dateable | null): Date | null {
  if (x == null) {
    return null;
  }
  if (typeof x === "number") {
    return new Date(x);
  } else if (typeof x === "string") {
    return dateParseISO8601(x);
  } else if (typeof x === "object") {
    // Date or has time
    const dx = x as { getTime?: () => number; };
    if (dx.getTime) {
      return new Date(dx.getTime());
    }
    // having a date representation
    const ddx = x as { toDate?: () => Date; };
    if (ddx.toDate) {
      return ddx.toDate();
    }
  }
  return null;
}
