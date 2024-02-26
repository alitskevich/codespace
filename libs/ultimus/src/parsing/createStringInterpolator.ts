import { Fn } from "../../types";
import { str } from "../string";

const RE_PLACEHOLDER = /\{([^}]+)\}/g;

/**
 * Creates a string interpolator function that replaces placeholders in the input string
 * with the string representation of the evaluated expressions.
 *
 * @param {string} template - The input string containing placeholders to replace.
 * @param {(expr: string) => Fn} placeholderFactory - A function that produces a function to evaluate an expression.
 * @return {(...args: any[]) => string} A function that, given arguments, evaluates the expressions and replaces the placeholders.
 */
export function createStringInterpolator(template: string, placeholderFactory: (expr: string) => Fn) {
  const fnx: Fn[] = [];

  const pattern = template.replace(RE_PLACEHOLDER, (_: string, expr: string) => {
    fnx.push(placeholderFactory(expr.trim()));
    return `{$$$}`;
  });

  if (!fnx.length) return () => pattern;

  const chunks = pattern.split(/\{\$\$\$\}/g);
  const tail = chunks.pop();
  return (...args: any[]) =>
    chunks.map((prefix: string, index: number) => `${prefix}${str(fnx[index](...args))}`).join("") + tail;
}
