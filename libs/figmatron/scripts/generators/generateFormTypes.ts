import { dehydrateObject } from "figmatron/src/utils/dehydrateObject";
import { arrayToObject, scalarParse } from "ultimus";

import { resolveClassName } from "../utils/resolveClassName";
import { resolveitemType } from "../utils/resolveitemType";

export function generateFormTypes({ forms, formItems, formItemTypes }) {
  const itemTypesMap = arrayToObject(formItemTypes, "id", "dataType");
  const paramsMap = {};
  formItems
    .filter((e) => e.field && !e.deleted && !e.field?.startsWith("//"))
     
    .map(({ $row, deleted, field: item, ts, ...e }) => ({
      ...dehydrateObject(e),
      id: item,
      type: itemTypesMap[e.type] ?? e.type,
    }))
    .map((e) => Object.entries(e).reduce((acc, e) => Object.assign(acc, { [e[0]]: scalarParse(e[1] as any) }), {}))
    .forEach(({ form: struct, ...field }) => {
      const target = paramsMap[struct] ?? (paramsMap[struct] = {});
      (target.fields ?? (target.fields = new Map())).set(field.id, field);
    });

  const types = forms.map(({ id, name }: any) => {
    const componentName = resolveClassName(id);
    const paramsList = [...(paramsMap[id]?.fields.values() ?? [])].map(
      (item: any) => `"${item.id}": ${resolveitemType(item)}`
    );
    return `/**
    * ${componentName} form type. 
    * Code \`${id}\`
    * ${name}
    */
    export type ${componentName} =  ${paramsList?.length ? `{\n    ${paramsList.join(",\n    ")}\n}` : "Record<string, never>"
      }
  ;
`;
  });

  const output = `
/**
 * Forms Types.
 * 
 * @copyright 2024 SomeBrand.
 */

// used as fallback
export type Orbitrary = Record<string, any>;

${types?.join("\n")}

`;
  return output;
}
