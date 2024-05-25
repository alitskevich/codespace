/**
 * Useful low-level Functions.
 */

import { Fn } from "../../types";

// checks
export const isTrue = (x: any) => x === true;
export const isFalse = (x: any) => x === false;
export const isNotANumber = (x: any) => isNaN(x);
export const isUndefined = <T = unknown>(x: T): boolean => typeof x === "undefined";

// logical
export const then = (x: any, p = "", n = "") => (x ? p : n);
export const truthy = (x: any) => !!x;
export const not = (x: any) => !x;
export const or = (x: any, s: any) => x || s;
export const and = (x: any, s: any) => x && s;
export const coalesce = (x: any, s: any) => x ?? s;

// math
 
export const equals = (x: any, p: any, thenn: any = true, elsee: any = false) => (x == p ? thenn : elsee);
export const notEquals = (x: any, p: any, thenn: any = true, elsee: any = false) => (x != p ? thenn : elsee);

export const greater = (x: any, p: any, thenn: any = true, elsee: any = false) => (x > p ? thenn : elsee);
export const less = (x: any, p: any, thenn: any = true, elsee: any = false) => (x < p ? thenn : elsee);
export const between = (x: any, a: any, b: any) => x >= a && x <= b;

export const min = Math.min;
export const max = Math.max;
export const round = (x: any = 0) => Math.round(Number(x));
export const increment = (x: any, alt = 1) => Number(x) + Number(alt);
export const plus = (x: any, alt: any) => x + alt;
export const sum = (x: any, alt: any) => +x + +alt;
export const minus = (x: any, alt: any) => +x - +alt;
export const multiply = (x: any, alt: any) => +x * +alt;
export const numToFixed = (num: number): string => {
  return num.toFixed(2).replace(/\.0+$/, "");
};

// functions
export const fnBind = (fn: () => unknown, ...args: []) => fn?.bind(null, ...args);

export const fnCall = (fn: () => unknown, ...args: []) => fn.call(null, ...args);

export const fnSwapArgs = (fn: Fn) => (a: unknown, b: unknown) => fn(b, a);

export const assert = (b: unknown, error: string | Error, ErrorType = Error) => {
  if (!b) {
    throw typeof error === "string" ? new ErrorType(error) : error;
  }
};

export const log = (x: any, pre: string) => {
  console.log(pre || "pipe", x);
  return x;
};

/**
 * Create a debounced version of a function.
 *
 * @param {function} func - The function to be debounced.
 * @param {number} delay - The delay in milliseconds.
 * @return {function} The debounced function.
 */
export function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
