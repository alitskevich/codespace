import { properCase, strFormat } from "ultimus";
import { readFileContent } from "ultimus-fs";

import geometryOutline from "../heroicons.json";
import geometrySolid from "../heroicons_solid.json";

const template = readFileContent(["src/templates", "plain.xml"]),

const generate = (geometry, mode) =>
  Object.keys(geometry)
    .sort()
    .map((key) => {
      const children = geometry[key]
        .map((d) => `<path stroke-linecap="round" stroke-linejoin="round" d="${d}" />`)
        .join("\n");

      return strFormat(template, {
        $id: `${mode}.${properCase(key, "-")}`,
        $children: children,
      });
    })
    .join("\n\n");

console.log(generate(geometryOutline, "SvgIcon"));
console.log(generate(geometrySolid, "SvgIcon.Solid"));
