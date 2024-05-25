import { normalizeInput } from "figmatron";
import { readFileJsonContent, writeFileJsonContent } from "ultimus-fs";

/**
 * Normalize the raw figma data and write the normalized nodes and meta files to the specified directory.
 *
 * @param {Object} contractDir - The directory where the files will be written.
 * @return {void} This function does not return anything. 
 */
export function doNormalize({ contractDir, excludes }) {
  const figmaJson = readFileJsonContent([contractDir, `figma.json`]);

  const { nodes, meta } = normalizeInput(figmaJson, { excludes });

  writeFileJsonContent([contractDir, `figma.nodes.json`], nodes);

  writeFileJsonContent([contractDir, `figma.meta.json`], meta);

  console.log(`✅ Figma data has been normalized.`);
}
