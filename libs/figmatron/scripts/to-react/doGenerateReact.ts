import { arraySortBy, arrayToObject } from "ultimus";
import {
  fileExists,
  mapSubDirs,
  readFileContent,
  readFileJsonContent,
  writeFileContent,
  writeFileJsonContent,
} from "ultimus-fs";

import { prettify } from "../utils/prettify";
import { xmlParseUiSpec } from "../utils/xmlParseUiSpec";

import { generateReactStory } from "./generateReactStory";
import { generateReactTsx } from "./generateReactTsx";

const writeStory = (filePath, meta) => {
  if (!fileExists(filePath)) {
    const story = generateReactStory(meta);
    writeFileContent(filePath, prettify(story));
  }
};

/**
 * Generates React components based on the provided  UI specification.
 *
 * @param {object} options - The options object.
 * @param {string} options.contractDir - The directory where the meta files are located.
 * @return {Promise<void>} - A promise that resolves when the React components have been generated.
 */
export async function doGenerateReact(config) {
  doGenerateReactForType("components", config);
  doGenerateReactForType("pages", config);
  doGenerateReactForType("svg", config);
}
export async function doGenerateReactForType(type, { contractDir, reactOutputDir, copyright, preserveExistingReact }) {
  const input = readFileContent([contractDir, `ui.${type}.xml`]);

  const index = arrayToObject(readFileJsonContent([reactOutputDir, type, `metadata.json`])?.components, "id");

  const nodes: any = [...(xmlParseUiSpec(input)?.[0]?.nodes ?? [])];

  // console.log(nodes)
  const withPathBase = (file) => [reactOutputDir, type, file];

  const componentNames =
    nodes
      .filter((n) => n.attrs.id)
      .map((n) => {
        const { attrs, nodes } = n;
        const componentName = attrs?.id;
        if (componentName) {
          const withPathBase = (file) => [reactOutputDir, type, componentName, file];
          const metaDefault = {
            id: componentName,
            group: type,
            title: `${componentName}`,
            labels: ["auto", "atomic", "react", type],
            description: `${componentName}`,
            copyright,
            ...index[componentName],
          };

          if (index[componentName]?.group !== "ignored") {
            const meta = readFileJsonContent(withPathBase(`${componentName}.meta.json`), metaDefault);

            const previousContent = readFileContent(withPathBase(`${componentName}.tsx`));

            if (previousContent && preserveExistingReact) return;

            const content = generateReactTsx(nodes, componentName, meta);

            writeFileJsonContent(withPathBase(`${componentName}.meta.json`), { ...meta });

            writeFileContent(withPathBase(`${componentName}.tsx`), prettify(content));

            writeStory(withPathBase(`${componentName}.stories.ts`), meta);

            writeFileContent(withPathBase(`index.ts`), `export * from "./${componentName}";`);

            console.log(`✅ FC: ${componentName} ${previousContent ? "(updated)" : " (new)"}`);
          }

          return metaDefault;
        }
      })
      ?.filter(Boolean) ?? [];

  writeFileJsonContent(withPathBase(`metadata.json`), {
    components: arraySortBy(componentNames, "id")?.map(({ id, name, group, labels, description }) => ({
      id,
      name,
      group,
      description,
      labels,
    })),
  });

  writeFileContent(
    withPathBase(`index.ts`),
    prettify(mapSubDirs([reactOutputDir, type], (n) => `export * from "./${n}";`).join("\n"))
  );

  console.log(`✅ React components have been generated. ${componentNames.length}`);
}
