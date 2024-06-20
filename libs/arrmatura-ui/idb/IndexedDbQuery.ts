import { Component } from "arrmatura";
import { capitalize } from "ultimus";

import { IndexedDbService } from "./IndexedDbService";

function doQuery(db, store, index, value) {
  return db?.indexedDb.queryForValue(String(value ?? ""), store, index) ?? null;
}

export class IndexedDbQuery extends Component {
  store = "items";

  db?: IndexedDbService;

  get trigger() {
    return this.db?.[`trigger${capitalize(this.store.toLowerCase())}`];
  }

  init() {
    this.defineCalculatedProperty(`data`, doQuery, ["db", "store", "index", `value`, "trigger"]);
  }
}
