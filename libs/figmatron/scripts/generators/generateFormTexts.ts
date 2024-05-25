import { properCase, arrayToObject } from "ultimus";

export function generateFormTexts(items, kind, lang) {
  return arrayToObject(
    items,
    (e) => `${e[kind]}:${e.field}`,
    (e) => {
      return e[`name_${lang}`] || e["name"] || properCase(e.field);
    }
  );
}
