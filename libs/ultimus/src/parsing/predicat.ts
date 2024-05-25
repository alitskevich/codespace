import { Data, Hash, Predicat } from "../../types";

const compilePredicatChunk = (s: string): Predicat<Data> => {
  const tokens = s.match(/(\w+)\s*(!?)=\s*([,\wа-яА-Я]+)/);
  if (!tokens) {
    return s[0] === "!" ? (d) => !d[s.slice(1)] : (d) => !!d[s];
  }
  const [, key, neg, val] = tokens;
  const fn = (d: Data) => val.includes(String(d[key]));

  return neg ? (d) => !!d[key] && !fn(d) : fn;
};

const compilePredicat = (s: string | boolean): Predicat<Data> => {
  if (!s || s === "FALSE" || s === "false") return () => false;
  if (s === "ALWAYS" || s === "TRUE" || s === "true" || s === true) return () => true;

  const expr = String(s)
    .split("&&")
    .map((s) => s.trim())
    .filter(Boolean)
    .map(compilePredicatChunk);

  return (data) => !!expr.find((fn) => fn(data));
};

const PREDICATS: Hash<Predicat<Data>> = {};

/**
 * Compiles a predicate function for a given string value segment.
 *
 * @param {string} s - The string value segment to compile a predicate function for.
 * @returns {Predicat<Data>} - A compiled predicate function.
 */
export const getPredicat = (s: string | boolean = "") =>
  PREDICATS[String(s)] || (PREDICATS[String(s)] = compilePredicat(s));
