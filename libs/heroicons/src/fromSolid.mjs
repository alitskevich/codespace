import { arrayToObject, mapFilesInDirectory, readFileContent, writeFileContent } from "ultimus-fs";

const map = mapFilesInDirectory("solid", (f, dir) => {
  const content = readFileContent([dir, f]),
   pathes = [...content.matchAll(/d="(.*?)"/g)].map((d) => d[1]),
   id = f.split(".")[0];

  return { id, pathes };
}),

 output = arrayToObject(map, "id", "pathes");

writeFileContent("heroicons_solid.json", JSON.stringify(output, null, 2));
