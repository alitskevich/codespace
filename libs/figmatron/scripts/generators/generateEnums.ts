import { arrayGroupBy, capitalize, qname } from "ultimus";

export const generateEnum = ({ id: enumId, items }) => `
/**
 * Enumeration "${capitalize(enumId)}".
 */
export const ${capitalize(enumId)} = {
  ${items.map(({ itemId, name }) => `"${capitalize(qname(itemId))}": "${itemId}", // ${name}`).join("\n  ")}
};`;

export const generateEnums = ({ enumItems }) => {
  const Enums = arrayGroupBy(
    enumItems.filter((e) => e.enumId && e.itemId),
    "enumId"
  );
  const EnumsContent = Object.values(Enums).map(generateEnum).join("\n");
  const EnumsIndex = Object.keys(Enums)
    .map((name) => `${capitalize(name)},`)
    .join("\n  ");

  return `
${EnumsContent}

const Enums: Record<string, Record<string, string>> = {
  ${EnumsIndex}
};

export default Enums;
`;
};
