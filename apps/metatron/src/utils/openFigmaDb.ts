import { IndexedDb } from "arrmatura-ui/idb/impl/IndexedDb";


export function openFigmaDb() {
  const db = new IndexedDb();

  db.open(`figma`, {
    version: 1,
    stores: {
      files: 'id'
    },
    initialData: {}
  });
  return db;
}
