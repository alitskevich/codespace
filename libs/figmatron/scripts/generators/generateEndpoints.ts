import { dehydrateObject } from "figmatron/src/utils/dehydrateObject";
import { scalarParse, arraySortBy } from "ultimus";

import { resolveClassName } from "../utils/resolveClassName";
// import { resolveitemType } from "../utils/resolveitemType";

const structItemTypes = {
  number: "Number",
  blob: "BLOB",
  string: "String",
  date: "String",
  enum: "String",
};
const typedValuesResolvers = {
  number: (v, { required }) => (required ? `Number(${v} ?? 0)` : `helpers.numberOrUndefined(${v})`),
  string: (v, { required }) => (required ? `String(${v})` : `helpers.stringOrUndefined(${v})`),
  date: (v, { required }) =>
    required ? `helpers.isoDate(${v})` : `${v} ? helpers.isoDate(${v}) : null`,
  enum: (v, { required }) => (required ? `String(${v})` : `helpers.stringOrUndefined(${v})`),
  array: (v, { required }) => (required ? `${v} ?? []` : v),
  bool: (v) => `!!${v}`,
  blob: (v) => v,
  struct: (v) => v,
};
const resolveTypedValue = (item) => {
  const v = item.binding || `params.${item.id}`; //+ ' as ' + item.type
  const op = typedValuesResolvers[item.type || "string"];
  if (op) return op(v, item);
  return;
};

export function generateEndpoints({ endpoints, structItems }) {
  const paramsMap = {};

  arraySortBy(structItems, (e) => `${e.struct}.${e.position}.${e.item}`)
    .filter((e) => e.item && !e.deleted && !e.item.startsWith("//"))
     
    .map(({ $row, deleted, item, ts, ...e }) => ({
      ...dehydrateObject(e),
      id: item.includes(":") ? item.split(":")[1] : item, // cut off sorting prefix
      dataType: structItemTypes[e.type] ?? "String",
    }))
    .map(
      (e) => Object.entries(e).reduce((acc, e) => Object.assign(acc, { [e[0]]: scalarParse(e[1] as any) }), {}) as any
    )
    .forEach(({ struct, ...field }) => {
      const target = paramsMap[struct] ?? (paramsMap[struct] = {});
      (target.fields ?? (target.fields = [])).push(field);
    });

  const functions = endpoints
    .filter((e) => !e.deleted && e.status !== "ignored")
    .map(
      ({
        id,
        url,
        inputType,
        inputForm,
        resultAdapter,
        outputType,
        resultType,
        description,
        // packageName,
        // procedureName,
        method,
      }: any) => {
        const componentName = `do${resolveClassName(id)}`;
        const inputParamsFormName = resolveClassName(inputForm);
        const resultTypeName = resolveClassName(resultType);
        const urlParams = method && new URLSearchParams({ method }).toString();
        const urlWithParams = url + (urlParams ? (url.includes("?") ? "&" : "?") + urlParams : "");

        console.log(`✅ Endpoint: ${id}`);

        const fields = paramsMap[inputType]?.fields ?? [];

        const paramsListMapping = fields.map((item: any) => `"${item.id}": ${resolveTypedValue(item)}`);
        const inputParameters = fields.map(
          (item: any) => `{ name: "${item.id}", type: "${item.dataType}", value: values["${item.id}"] ?? null }`
        );
        return `// Endpoint \`${id}\`.
// ${description ?? ""}
export function ${componentName}(params: FormTypes.${inputParamsFormName || "Orbitrary"
          }, user: UserContext): Promise<StructTypes.${resultTypeName || "Orbitrary"}> {
  // for sake of type matching check
  const values: StructTypes.${resolveClassName(inputType ?? "Orbitrary")} = {
    ${paramsListMapping?.join(",\n    ")}
  };
  // order matters
  const inputParameters: InputParameters[] = [
    ${inputParameters?.join(",\n    ")}
  ];
  return submitApiEndpoint<InputParameters[], StructTypes.${resolveClassName(outputType) || "Orbitrary"
          }>("${urlWithParams}", inputParameters 
  ).then(({ data }) => {
    return ${`${resultAdapter ?? "data"}`};
  });
}`;
        // return ${id in Adapters ? `Adapters["${id}"](${resultAdapter ?? "data"}, user)` : `${resultAdapter ?? "data"}`};
      }
    );

  const output = `"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { submitApiEndpoint } from "../apiclient";
import { UserContext, InputParameters, EndpointOperation } from "../types";
import * as FormTypes from "@/contract/forms.types";
import * as StructTypes from "@/contract/structs.types";
import * as Adapters from "./adapters";
import { helpersHub as helpers } from "../utils/helpersHub";

${functions?.join("\n\n")}

export enum EndpointsKeys {
  ${endpoints
      .filter((e) => !e.deleted && e.status !== "ignored")
      .map(({ id }: any) => `"${id}" = "${id}"`)
      .join(",\n  ")},
};

export const EndpointsMap: Record<string, (params: any, user: UserContext) => Promise<any>> = {
  ${endpoints
      .filter((e) => !e.deleted && e.status !== "ignored")
      .map(({ id }: any) => `"${id}": do${resolveClassName(id)}`)
      .join(",\n  ")},
};


`;
  return output;
}
