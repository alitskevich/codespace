import { execSync } from "child_process";

import { Path, filePath } from "ultimus-fs";

export const getChangedLineNumbers = (f: Path, repoPath: Path): any[] => {
  const diffCommand = `git -C ${filePath(repoPath)} diff --unified=0 ${filePath(f)}`;

  const stdout = execSync(diffCommand, { encoding: "utf-8" });

  const lines = stdout.split("\n");
  const changedLineNumbers = new Set();

  let currentLineNumber = -1;
  lines.forEach((line) => {
    if (line.startsWith("@@")) {
      const match = line.match(/\+(\d+)/);
      if (match) {
        currentLineNumber = parseInt(match[1], 10);
      }
    } else if (line.startsWith("+") && currentLineNumber !== -1) {
      changedLineNumbers.add(currentLineNumber);
      currentLineNumber++;
    } else if (line.startsWith(" ")) {
      currentLineNumber++;
    }
  });

  return Array.from(changedLineNumbers);
};
