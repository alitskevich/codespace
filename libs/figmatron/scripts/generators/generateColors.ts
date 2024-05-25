import { mapEntries } from "ultimus";

const strExtractGroup = (s, re) => [...s.matchAll(re)]?.[0]?.[1];
const strExtractInlineColor = (s) => `#${strExtractGroup(s, /#([abcdef\d]{3,})/g)}`;
const extractColor = (s) =>
  strExtractGroup(s, /color-(\w+-\d+)/g) ?? strExtractGroup(s, /base-(\w+)/g) ?? `[${strExtractInlineColor(s)}]`;
export function generateColors({ Light, Dark }) {
  const registry = {};
  const items = mapEntries(Dark.colors, (key, val) => {
    const prefix = key.includes("background") ? "bg" : "text";
    const fromKey = extractColor(val);
    const toKey = strExtractInlineColor(Light.colors[key]);
    if (fromKey === toKey) return null;
    if (registry[fromKey]) {
      if (registry[fromKey] !== toKey)
        return (
          `/*${key
          }\n  :is(.dark .${prefix
          }-${fromKey
          }) { ${prefix === "text" ? "color" : "background-color"
          }: ${toKey
          }; }*/`
        );
      return null;
    }
    registry[fromKey] = toKey;
    return `/*${key}*/\n  :is(.dark .${prefix}-${fromKey}) { ${prefix === "text" ? "color" : "background-color"
      }: ${toKey}; }`;
  });

  return `
  /* CAUTION: This auto-generated code. Do not alter it manually.*/
  ${items.filter(Boolean).join("\n\n  ")}
  `;
}
