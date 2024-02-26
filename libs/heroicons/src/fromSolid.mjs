import { readFileContent, writeFileContent, arrayToObject, mapFilesInDirectory } from "ultimus-fs";

const map = mapFilesInDirectory("solid", (f, dir) => {
  const content = readFileContent([dir, f]);
  const pathes = [...content.matchAll(/d="(.*?)"/g)].map((d) => d[1]);
  const id = f.split(".")[0];

  return { id, pathes };
});

const output = arrayToObject(map, "id", "pathes");

writeFileContent("heroicons_solid.json", JSON.stringify(output, null, 2));
