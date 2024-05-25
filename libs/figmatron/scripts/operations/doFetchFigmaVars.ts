import { writeFileJsonContent } from "ultimus-fs";

import { fetchFigmaFile } from "../utils/fetchFigmaFile";

export async function doFetchFigmaVars({ contractDir, figmaToken, figmaFileKey }) {
  const url = `files/${figmaFileKey}/variables/local`; //`;?geometry=paths

  const output = await fetchFigmaFile(url, figmaToken);

  if (output.error) {
    console.error(output.error.message);
    return null;
  }

  writeFileJsonContent([contractDir, `figma.json`], output);

  console.log(`✅ Figma Files fetched`);

  return output;
}
