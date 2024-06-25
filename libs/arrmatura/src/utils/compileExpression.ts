import type { IArrmatron } from "arrmatura/types";
import { scalarParse, gettus } from "ultimus";
import type { ExpressionText, Fn, StringHash } from "ultimus/types";

type PipeFn = (c: IArrmatron, argValue: unknown) => unknown;

const OP_SHORTCUTS: StringHash = {
  "&&": "|and:",
  "==": "|equals:",
  "!=": "|notEquals:",
  "||": "|or:",
  "<": "|less:",
  "[": "|dot:",
  "]": "",
  ">": "|greater:",
  "??": "|coalesce:",
  "?": "|then:",
};

const withNoPipes = (_: unknown, v: unknown) => v;

const isConstKey = (key: string) =>
  "'+-0123456789".includes(key[0]) || key === "true" || key === "false";

export function compileConstant(a: string) {
  const vv = scalarParse(a[0] === "'" ? a.slice(1, a.length - 1) : a);
  return () => vv;
}

const compilePropGet = (key: string) => {
  return (c: IArrmatron) => c.getFromScope(key);
};

const compileArgument = (a: string, strings?: string[]) => {
  if (a[0] === "!") {
    const getter = compilePropGet(a.slice(1));
    return (c: IArrmatron) => !getter(c);
  }

  if (a[0] === "#" && a[1] === "#") {
    const vv = strings?.[Number(a.slice(2))];
    return () => vv;
  }

  if (isConstKey(a)) return compileConstant(a);

  return compilePropGet(a);
};

const splitExpression = (v: ExpressionText) =>
  v
    .trim()
    .replace(/(&&|!=|==|>|<|\[|\]|\|\||\?\??)/g, (_, s) => `${OP_SHORTCUTS[s]}`)
    .split("|")
    .map((s) => s.trim());

function withPipes(pipes: string[]) {
  if (!pipes.length) return withNoPipes;

  const compiledPipes = pipes.map((key) => {
    const strings: string[] = [];

    const expr = key.replaceAll(/'[^']*'/g, (s) => {
      strings.push(s.slice(1, -1));
      return `##${strings.length - 1}`;
    });

    const [pipeId, ...args] = expr.split(":").map((s) => s.trim());
    return {
      pipeId,
      args: args.map((a) => compileArgument(a, strings)),
    };
  });

  return (c: IArrmatron, initialValue: unknown) =>
    compiledPipes.reduce((value, { pipeId, args }) => {
      try {
        const fn = c.platform.getFunction(pipeId);
        if (typeof fn !== "function") {
          throw new Error(`${fn != null ? "must be a function" : "not found"}`);
        }
        if (value instanceof Promise) {
          return value.then((val) => {
            const args0 = [val, ...args.map((fn) => fn(c))];
            const result = fn.apply(c, args0);
            return result;
          });
        } else {
          const args0 = [value, ...args.map((fn) => fn(c))];
          return fn.apply(c, args0);
        }
      } catch (ex) {
        c.logError(`ERROR: Function ${pipeId || "<empty>"}`, ex);
        return value;
      }
    }, initialValue);
}

function withHardValue(hardValue: ExpressionText, pipec: PipeFn): PipeFn {
  if (!hardValue || hardValue === "it") return pipec;

  if (hardValue.startsWith("it.")) {
    const propKey = hardValue.slice(3);
    return (c: IArrmatron, ini: any) => pipec(c, gettus(ini, propKey));
  }

  const iniFn = isConstKey(hardValue) ? compileConstant(hardValue) : compilePlaceholder(hardValue);

  return (c: IArrmatron) => pipec(c, iniFn(c));
}

export function compilePipeExpression(v: ExpressionText) {
  if (v.endsWith(")")) {
    const parts = v.slice(0, -1).split("(");
    return compilePipeExpression(`${parts[0]}=${parts[1]}`);
  }

  const [_key, ...pipes] = splitExpression(v);
  const [key, hardValue] = _key.split("=").map((s) => s.trim());

  return { key, pipec: withHardValue(hardValue, withPipes(pipes)) };
}

export function compilePlaceholder(expr: string): Fn {
  const [key, ...pipesExpressions] = splitExpression(expr);

  const pipec = withPipes(pipesExpressions);

  const fn = compileArgument(key);

  return (c) => pipec(c as IArrmatron, fn(c));
}

export function compileJsExpression(x: string) {
  return new Function("c", x.replaceAll(/[^'a-z]([a-z][a-z0-9-.]+)/gi, 'c.prop("$1")'));
}
