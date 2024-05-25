import * as fs from "node:fs";
import { Dirent } from "node:fs";

import { FileOp, Path } from "../types";

import { filePath, isDirectory } from "./core";

type FileMappingContext = { recurrsionLevel: number };

/**
 * Maps subdirectories of a given directory and applies a function to each one.
 *
 * @param {Path} d - The directory path to map subdirectories from.
 * @param {FileOp} fn - The function to apply to each subdirectory.
 * @return {any[]} A flatten array of values returned by the function applied to each subdirectory.
 */
export const mapSubDirs = (d: Path, fn: FileOp) => {
  const path = filePath(d);
  return mapInDirectory(path, (f) => (isDirectory([path, f]) ? fn(f, path) : null))?.flat();
};

/**
 * Maps files in a directory and applies a function to each file.
 *
 * @param {Path} d - The directory path to map files from.
 * @param {FileOp} fn - The function to apply to each file.
 * @param {number} recurrsiionLevel - The recursion level (default: 0).
 * @return {*} - A flatten result of mapping files in the directory.
 */
export const mapFilesInDirectory = <T = any>(
  d: Path,
  fn: FileOp,
  ctx: FileMappingContext = { recurrsionLevel: 0 }
): Array<T | null> => {
  return mapInDirectory<T>(d, (f: string, dir: string) => {
    const path = filePath([dir, f]);
    if (isDirectory(path))
      return ctx.recurrsionLevel
        ? mapSubDirs(path, (dir) =>
          mapFilesInDirectory(dir, fn, {
            ...ctx,
            recurrsionLevel: ctx.recurrsionLevel - 1,
          })
        )
        : null;
    return fn(f, dir);
  });
};

/**
 * A function that takes a directory path and a file operation function,
 * and returns an array of results from applying the file operation function
 * to each file/sub-directory in the directory.
 *
 * @param {Path} d - The directory path.
 * @param {FileOp<T>} fn - The file operation function.
 * @returns {Array<T | null>} - An flat array of results from applying the file
 * operation function to each file in the directory.
 */
export const mapInDirectory = <T = any>(d: Path, fn: FileOp<T>): Array<T | null> => {
  const path = filePath(d);
  if (!isDirectory(path)) return [];

  const results = fs.readdirSync(path).map((f) => fn(f, path));

  return ([] as Array<T | null>).concat(...results.filter(Boolean));
};

export const mapDirectoryRecurrsive = <T = any>(
  d: Path,
  fn: (arg0: Dirent, dir: string) => T | null
): Array<T | null> => {
  const path = filePath(d);
  if (!isDirectory(path)) return [];

  const results = fs.readdirSync(path, { withFileTypes: true, recursive: true }).map((f: Dirent) => fn(f, path));

  return ([] as Array<T | null>).concat(...results.filter(Boolean));
};
