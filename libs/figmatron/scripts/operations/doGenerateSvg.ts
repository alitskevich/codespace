import { arraySortBy } from "ultimus";
import { fileExists, readFileContent, writeFileContent } from "ultimus-fs";

import { generateReactSvg } from "../to-react/generateReactSvg";
import { getChangedLineNumbers } from "../utils/getChangedLineNumbers";
import { prettify } from "../utils/prettify";
import { xmlParseUiSpec } from "../utils/xmlParseUiSpec";

/**
 * Generates an SVG files based on the provided UI specification.
 *
 * @param {Object} options - An object containing the `contractDir` paths.
 * @param {string} options.contractDir - The directory path where the meta data for the SVG files is located.
 * @return {Promise<void>} A promise that resolves when the SVG files have been generated.
 */
export async function doGenerateSvg({ contractDir, reactOutputDir }) {
  const input = readFileContent([contractDir, `ui.svg.xml`]);
  const nodes: any = xmlParseUiSpec(input)[0].nodes ?? [];

  const map = {};
  nodes.forEach((n) => {
    const { attrs } = n;
    let tag = attrs.id;
    if (tag.startsWith("Svg.")) {
      tag = tag.slice(4);
      attrs.id = tag;
    }
    map[tag] = n;
  });

  const changedLineNumbers = getChangedLineNumbers(
    [__dirname, "../../../lib/contract", "ui.svg.xml"],
    [__dirname, "../../../"]
  );
  const findComponentId = (lineNumber) => {
    const relevantLines = input
      .split("\n")
      .slice(0, lineNumber - 1)
      .reverse();

    const matchLine = relevantLines.find((line) => /<component id="([^"]+)">/.test(line));
    return matchLine ? matchLine.match(/<component id="([^"]+)">/)?.[1] : null;
  };
  const changedComponentIds = new Set(changedLineNumbers.map(findComponentId));

  const componentNames = Object.values(map).map((node: any) => {
    const tag = node.attrs.id;

    const svgFilePath = [reactOutputDir, "../svg", `${tag}.tsx`];
    if (fileExists(svgFilePath) && !changedComponentIds.has(tag)) {
      return tag;
    }
    const content = generateReactSvg(tag, node.nodes?.[0]);
    writeFileContent(svgFilePath, prettify(content));
    console.log(`✅ SVG: ${tag}`);

    return tag;
  });

  writeFileContent(
    [reactOutputDir, "../svg", `index.ts`],
    arraySortBy(componentNames, "id")
      ?.map((name) => `export * from "./${name}";`)
      .join("\n")
  );

  console.log("✅ SVG have been generated.");
}
