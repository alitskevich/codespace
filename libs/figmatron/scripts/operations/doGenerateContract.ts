import { arrayGroupBy, arrayToObject } from "ultimus";
import { readFileJsonContent, writeFileContent, writeFileJsonContent } from "ultimus-fs";

import { generateEndpoints } from "../generators/generateEndpoints";
import { generateEnumTexts } from "../generators/generateEnumTexts";
import { generateEnums } from "../generators/generateEnums";
import { generateFormTexts } from "../generators/generateFormTexts";
import { generateFormTypes } from "../generators/generateFormTypes";
import { generateForms } from "../generators/generateForms";
import { generateStructTypes } from "../generators/generateStructTypes";
import { generateTables } from "../generators/generateTables";
import { prettify } from "../utils/prettify";


/**
 * Generates contract related files based on the given metadata.
 *
 * This code snippet defines a function called doGenerateContract
 * that generates contract-related files based on the given metadata.
 * It takes two parameters, contractDir, which represent the paths
 * to the meta directory and library directory, respectively.
 * The function reads the content of a JSON file in the meta directory,
 *  generates enums, forms, and tables using the metadata,
 * and writes the generated code to corresponding files in the library directory.
 *
 * @param {object} contractDir - The directory path to the meta directory.
 */
export function doGenerateContract({ contractDir }) {
  const meta = readFileJsonContent([contractDir, `app.contract.json`]);

  writeFileContent([contractDir, `enums.ts`], prettify(generateEnums(meta)));
  writeFileContent([contractDir, "../endpoints", `endpoints.ts`], prettify(generateEndpoints(meta)));
  writeFileContent([contractDir, `structs.types.ts`], prettify(generateStructTypes(meta)));
  writeFileContent([contractDir, `forms.types.ts`], prettify(generateFormTypes(meta)));

  writeFileJsonContent([contractDir, `forms.json`], generateForms(meta));
  writeFileJsonContent([contractDir, `tables.json`], generateTables(meta));

  // writeFileJsonContent([contractDir, `consts.json`], arrayToObject(meta.consts, "id", "value"));

  writeFileJsonContent([contractDir, `texts.enums.en.json`], generateEnumTexts(meta.enumItems, "en"));
  writeFileJsonContent([contractDir, `texts.enums.ar.json`], generateEnumTexts(meta.enumItems, "ar"));

  const textByDomains = Object.entries(arrayGroupBy(meta.texts, "domain"));
  writeFileJsonContent(
    [contractDir, `texts.en.json`],
    textByDomains.reduce((r, [s, { items }]) => Object.assign(r, { [s]: arrayToObject(items, "itemId", "en") }), {})
  );
  writeFileJsonContent(
    [contractDir, `texts.ar.json`],
    textByDomains.reduce((r, [s, { items }]) => Object.assign(r, { [s]: arrayToObject(items, "itemId", "ar") }), {})
  );

  writeFileJsonContent([contractDir, `texts.tables.en.json`], generateFormTexts(meta.tableItems, "table", "en"));
  writeFileJsonContent([contractDir, `texts.tables.ar.json`], generateFormTexts(meta.tableItems, "table", "ar"));

  console.log("✅ Contracts have been generated.");
}
