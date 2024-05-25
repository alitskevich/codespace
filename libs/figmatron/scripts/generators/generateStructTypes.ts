import { dehydrateObject } from "figmatron/src/utils/dehydrateObject";
import { scalarParse } from "ultimus";

import { resolveClassName } from "../utils/resolveClassName";
import { resolveitemType } from "../utils/resolveitemType";

export function generateStructTypes({ structs, structItems }) {
  const paramsMap = {};
  structItems
    .filter((e) => e.item && !e.deleted && !e.item.startsWith("//"))
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map(({ $row, deleted, item, ts, ...e }) => ({
      ...dehydrateObject(e),
      id: item.includes(":") ? item.split(":")[1] : item, // cut off sorting prefix
    }))
    .map((e) => Object.entries(e).reduce((acc, e) => Object.assign(acc, { [e[0]]: scalarParse(e[1] as any) }), {}))
    .forEach(({ struct, ...field }) => {
      const target = paramsMap[struct] ?? (paramsMap[struct] = {});
      (target.fields ?? (target.fields = [])).push(field);
    });

  const types = structs.map(({ id, name, package: pkg }: any) => {
    const componentName = resolveClassName(id);
    const paramsList = paramsMap[id]?.fields.map(
      (item: any) => `"${item.id}"${item.required ? "" : "?"}: ${resolveitemType(item)}`
    );
    return `/**
    * ${componentName} type. 
    * Code \`${id}\` [${pkg}]
    * ${name}
    */
    export type ${componentName} = ${paramsList?.length ? `{\n    ${paramsList.join(",\n    ")}\n}` : "Record<string, never>"
      };
`;
  });

  const output = `
/**
 * Structures Types.
 * 
 * @copyright 2024 SomeBrand.
 */

// used as fallback
export type Orbitrary = Record<string, any>;


${types?.join("\n")}

`;
  return output;
}
