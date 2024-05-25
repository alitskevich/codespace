import { Component } from "arrmatura";
import { capitalize } from "ultimus";

import { IndexedDbService } from "./IndexedDbService";

function doQuery(db, storeId, index, value) {
  return db?.indexedDb.queryForValue(String(value ?? ''), storeId, index) ?? null
}

export class IndexedDbQuery extends Component {
  storeId = "items";

  db?: IndexedDbService;

  get trigger() {
    return this.db?.[`trigger${capitalize(this.storeId.toLowerCase())}`]
  }

  init() {
    this.defineCalculatedProperty(`data`, doQuery, ['db', 'storeId', 'index', `value`, 'trigger'])
  }
}
