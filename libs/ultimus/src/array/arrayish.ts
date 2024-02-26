/* eslint-disable eqeqeq */

import { Hash } from "../../types";

// arrayish:
export const makeArray = (l: any, f: any = " ") => Array(l).fill(f);
export const isArray = (x: any) => Array.isArray(x);
export const includes = (x: any, p: string) => x?.includes?.(p) ?? false;
export const included = (p: string, x: any) => x?.includes?.(p) ?? false;
export const slice = <T>(x: T[], b = 0, e?: number): T[] => x?.slice?.(b, e) || [];
export const split = (x: string, key = " ") => x?.split?.(key) || [];
export const find = <T extends Hash<any>>(x: T[], val: unknown, key = "id") =>
  x?.find?.((e: T) => e[key] == val) ?? null;
