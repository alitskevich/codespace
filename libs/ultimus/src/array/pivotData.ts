import { StringHash } from "../../types";

import { arraySortBy } from "./arraySortBy";
import { arrayToObject } from "./arrayToObject";

export const pivotData = (
  data: StringHash[],
  rowId: string,
  colId: string,
  enums: any = {},
  form: StringHash[] = []
) => {
  if (!rowId)
    return {
      title: "Select axie for rows and columns...",
    };
  const rowhash: any = {};
  const colhash: any = {};
  let totalCount = 0;
  let cellCount = 0;
  const rField = form.find((e) => e.id == rowId) ?? {};
  const cField = colId ? form.find((e) => e.id == colId) : null;
  const rEnum = rField.typeSpec ? arrayToObject(enums[rField.typeSpec], "id", "name") : {};
  const cEnum = cField?.typeSpec ? arrayToObject(enums[cField.typeSpec], "id", "name") : {};

  data?.forEach((e: StringHash) => {
    totalCount++;

    String(e[rowId] ?? "-")
      .split(",")
      .forEach((rId) => {
        String(e[colId] ?? "-")
          .split(",")
          .forEach((cId) => {
            cellCount++;

            const row =
              rowhash[rId] ??
              (rowhash[rId] = {
                id: rId,
                name: rEnum[rId] ?? rId,
                value: 0,
                cells: {},
                items: [],
              });
            row.items.push(e);
            row.value++;

            const cTitle = cField ? ` / ${cField.name ?? colId}: ${cEnum[cId] || cId || "Ø"}` : "";

            const cell =
              row.cells[cId] ??
              (row.cells[cId] = {
                id: cId,
                name: `${rField.name ?? rowId}: ${rEnum[rId] || rId || "Ø"}${cTitle}`,
                value: 0,
                items: [],
              });

            cell.value++;
            cell.items.push(e);

            if (colId) {
              const col =
                colhash[cId] ??
                (colhash[cId] = {
                  id: cId,
                  name: cEnum[cId] ?? cId,
                  value: 0,
                  items: [],
                });
              col.items.push(e);
              col.value++;
            }
          });
      });
  });

  const columnsKeys = arraySortBy(Object.values(colhash) as any).map((e: any) => e.id);

  const rows = arraySortBy(Object.values(rowhash) as any).map((e: any) => ({
    ...e,
    columns: columnsKeys.map((cId) => e.cells?.[String(cId)] ?? { id: cId, value: 0 }),
  }));

  const cTitle = cField ? ` / ${cField?.name ?? colId}` : "";

  return {
    title: `${rField.name ?? rowId}${cTitle}`,
    rows,
    columns: columnsKeys.map((cId) => colhash[String(cId)] ?? { id: cId, value: '-' }),
    totalCount: cellCount === totalCount ? cellCount : `${cellCount} / ${totalCount}`,
  };
};
