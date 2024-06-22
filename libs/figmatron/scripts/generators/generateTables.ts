import { dehydrateObject } from "figmatron/src/utils/dehydrateObject";
import { arrayToObject, scalarParse, arrayGroupBy } from "ultimus";

export function generateTables({ tables, tableItems, actions }) {
  const actionsMap = arrayGroupBy(actions, "entity");
  const items = tableItems
    .filter((e) => e.table && !e.deleted)
     
    .map(({ $row, deleted, field, ...e }) => ({ ...dehydrateObject(e), id: field }))
    .map((e) => Object.entries(e).reduce((acc, e) => Object.assign(acc, { [e[0]]: scalarParse(e[1] as any) }), {}));

  const tablesMap = arrayToObject(
    tables.map((table: any) => ({
      ...table,
      actions: actionsMap[table.id]?.items ?? [],
    }))
  );

  const itemsMap = arrayGroupBy(items, "table", tablesMap);

  return itemsMap;
}
