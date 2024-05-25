import { ComponentConstructor } from "arrmatura/types";

let COUNTER = 1;

export const fnName = (ctor: ComponentConstructor) => (/^function\s+([\w$]+)\s*\(/.exec(ctor.toString()) ?? [])[1] ?? `C${String(COUNTER++)}`;
