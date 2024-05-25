import { properCase, arrayToObject } from "ultimus";

export function generateEnumTexts(items, lang) {
  return arrayToObject(
    items,
    (e) => `${e.enumId}:${e.itemId}`,
    (e) => {
      return e[`name_${lang}`] || e["name"] || properCase(e.field);
    }
  );
}
