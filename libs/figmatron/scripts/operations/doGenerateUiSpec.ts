import { buildTree } from "figmatron";
import { readFileJsonContent, writeFileContent } from "ultimus-fs";

export function doGenerateUiSpec({ contractDir }) {
  const nodes = readFileJsonContent([contractDir, `figma.nodes.json`]);

  const root = buildTree({ nodes });

  const output = root.toHtmlIf((n) => n.type !== "VECTOR" && n.type !== "PAGE");
  writeFileContent([contractDir, `ui.components.xml`], output);

  const svgOutput = root.toHtmlIf((n) => n.type === "VECTOR");
  writeFileContent([contractDir, `ui.svg.xml`], svgOutput);

  const pagesOutput = root.toHtmlIf((n) => n.type === "PAGE");
  writeFileContent([contractDir, `ui.pages.xml`], pagesOutput);

  console.log(`✅ UI spec has been generated.`);
}
