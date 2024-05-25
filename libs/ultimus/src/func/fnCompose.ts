
/**
 * Composes multiple functions into a single function.
 *
 * @param {Array<(e: unknown) => unknown>} ff - An array of functions to compose
 * @return {(x0: unknown) => unknown} The composed function
 */
export function fnCompose(...ff: Array<(e: unknown) => unknown>) {
  return (x0: unknown) => ff.reduceRight((x: unknown, fn) => fn(x), x0);
} 
