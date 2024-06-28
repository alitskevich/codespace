import { Component } from "arrmatura";

export class IndexedDbQuery extends Component {
  __created({ index, keysOnly }) {
    this.defineCalculatedProperty(
      `data`,
      (db, value, store = "items") => db?.queryForValue(value, { store, index, keysOnly }) ?? null,
      ["db", `value`, "store", "trigger"]
    );
  }
}
