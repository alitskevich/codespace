import { Component } from "arrmatura";
import { capitalize } from "ultimus";

import { IndexedDbService } from "./IndexedDbService";

export class IndexedDbQuery extends Component {
  store = "items";

  db?: IndexedDbService;

  get trigger() {
    return this.db?.[`trigger${capitalize(this.store?.toLowerCase())}`];
  }

  __init() {
    const { index, keysOnly } = this;
    this.defineCalculatedProperty(
      `data`,
      (db, value, store) => db?.queryForValue(value, { store, index, keysOnly }) ?? null,
      ["db", `value`, "store", "trigger"]
    );
  }
}
