/// <reference types="node" />
import * as fs from "node:fs";
import path from "node:path";

import { parseJson, str, stringifyJson } from "ultimus";

import { Path } from "../types";

export const filePath = (f: Path) => (Array.isArray(f) ? path.join(...f) : f);

export const fileExists = (f: Path) => fs.existsSync(filePath(f));

/**
 * Ensure that the path for the given file exists by creating any missing directories recursively.
 *
 * @param {string} filePath - The path of the file.
 */
export function ensurePathForFile(filePath) {
  const dirPath = path.dirname(filePath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  return filePath;
}

export const isDirectory = (f: Path) => fileExists(f) && fs.statSync(filePath(f)).isDirectory();

export const writeFileContent = (f: Path, c: string | Promise<string>) => {
  if (c == null) return;
  if (c instanceof Promise) return c.then((x) => writeFileContent(f, x));
  if (typeof c === "string") {
    fs.writeFileSync(ensurePathForFile(filePath(f)), str(c).trim(), "utf8");
  }
};

export const writeFileJsonContent = (f: Path, x: any) => {
  fs.writeFileSync(ensurePathForFile(filePath(f)), stringifyJson(x), "utf8");
  return x;
};

export const readFileContent = (f: Path, def = "") =>
  fileExists(f) ? fs.readFileSync(filePath(f), "utf8").toString() : def;

export const readFileJsonContent = (f: Path, def: any = null) => parseJson(readFileContent(f), def);

export const transformFileContent = (file: Path, fn: (arg0: string | null, ...args: any) => string, ...args: any[]) =>
  writeFileContent(file, fn(readFileContent(file) || null, ...args));

export const transformFileJsonContent = (file: Path, fn: (arg0: object | null, ...args: any) => any, ...args: any[]) =>
  writeFileJsonContent(file, fn(readFileJsonContent(file), ...args));
