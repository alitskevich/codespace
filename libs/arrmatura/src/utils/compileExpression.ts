import type { IArrmatron } from "arrmatura/types";
import { scalarParse, gettus } from "ultimus";
import type { ExpressionText, Fn, StringHash } from "ultimus/types";

type PipeFn = (c: IArrmatron, argValue: unknown) => unknown;

// function tokenize(expression) {
//   return expression.split(/[\(\)\<\>=\?!:']+/g);
// }
// class Node {
//   constructor(public type, public value: string | null = null, public left = null, public right = null) {
//   }
// }

// function parse(tokens) {
//   let current = 0;

//   function walk(priority = 0) {
//     const token = tokens[current++];
//     const nextToken = tokens[current];

//     if (priority >= 0 && token === '(') {
//       const node = walk();
//       current++;
//       return node;
//     }

//     if (priority >= 0 && ['>', '<', '==', '!=', '&&', '||', '??'].includes(nextToken)) {
//       return new Node('binary', nextToken, walk(), walk());
//     }

//     if (priority >= 0 && ['>', '<', '==', '!=', '&&', '||', '??'].includes(nextToken)) {
//       return new Node('binary', nextToken, walk(), walk());
//     }

//     if (priority >= 0 && ['>', '<', '==', '!=', '&&', '||', '??'].includes(nextToken)) {
//       return new Node('binary', nextToken, walk(), walk());
//     }

//     if (priority >= 0 && nextToken === '?') {
//       const node = new Node('coalesce', walk());
//       if (tokens[current] !== ':') {
//         throw new TypeError('Expected colon after "?" in coalesce operation');
//       }
//       current++;
//       node.right = new Node('colon', token, walk(), walk());
//       return node;
//     }
//     return new Node('operand', (token));;
//   }

//   return walk();
// }

// function evaluate(node) {
//   switch (node.type) {
//     case 'number':
//       return node.value;
//     case 'operator':
//       switch (node.value) {
//         case '>':
//           return evaluate(node.left) > evaluate(node.right);
//         case '<':
//           return evaluate(node.left) < evaluate(node.right);
//         case '==':
//           return evaluate(node.left) == evaluate(node.right);
//         case '!=':
//           return evaluate(node.left) != evaluate(node.right);
//         default:
//           throw new TypeError(`Unknown operator: ${node.value}`);
//       }
//     case 'coalesce':
//       const condition = evaluate(node.left);
//       return condition ? evaluate(node.middle) : evaluate(node.right);
//     default:
//       throw new TypeError(`Unknown node type: ${node.type}`);
//   }
// }

// // Example usage
// const expression = '1 < 2 ? 3 : 4';
// const tokens = tokenize(expression);
// const ast = parse(tokens);
// console.log(evaluate(ast)); // Outputs: 3


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

const isConstKey = (key: string) => "'+-0123456789".includes(key[0]) || key === 'true' || key === 'false';

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
  };

  if (a[0] === "#" && a[1] === "#") {
    const vv = strings?.[Number(a.slice(2))];
    return () => vv;
  }

  if (isConstKey(a)) return compileConstant(a);

  return compilePropGet(a);
};

const splitExpression = (v: ExpressionText) =>
  v.trim()
    .replace(/(&&|!=|==|>|<|\[|\]|\|\||\?\??)/g, (_, s) => `${OP_SHORTCUTS[s]}`)
    .split("|")
    .map((s) => s.trim());

function withPipes(pipes: string[]) {
  if (!pipes.length) return withNoPipes;

  const compiledPipes = pipes.map((key) => {
    const strings: string[] = [];

    const expr = key.replaceAll(/'[^']*'/g, (s) => {
      strings.push(s.slice(1, -1))
      return `##${strings.length - 1}`
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
  if (!hardValue || hardValue === '*') return pipec;

  if (hardValue.startsWith('*.')) {
    const propKey = hardValue.slice(2)
    return (c: IArrmatron, ini: any) => pipec(c, gettus(ini, propKey));
  }
  if (hardValue.startsWith('data.')) {
    const propKey = hardValue.slice(5)
    return (c: IArrmatron, ini: any) => pipec(c, gettus(ini, propKey));
  }

  const iniFn = isConstKey(hardValue) ? compileConstant(hardValue) : compilePlaceholder(hardValue);

  return (c: IArrmatron) => pipec(c, iniFn(c));
}

export function compilePipeExpression(v: ExpressionText) {
  if (v.endsWith(')')) {
    const parts = v.slice(0, -1).split('(')
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

