import { Component } from "arrmatura";
import { Delta, capitalize } from "ultimus";

import { ClientStorage } from "../support";

import { IndexedDb } from "./IndexedDb";
export class IndexedDbService extends Component {
  trigger: unknown;
  name = "items";
  version = 1;
  stores = {
    items: { keyPath: "id", indicies: { kind: {}, parent: {}, links: { multiEntry: true } } },
  };
  triggers: any = {};
  initialData?: any;
  idb = new IndexedDb();
  local?: ClientStorage;

  async __init() {
    await this.idb.open(this.name, {
      version: this.version,
      stores: this.stores,
      initialData: this.initialData,
    });

    Object.keys(this.stores).forEach((store) => {
      Object.defineProperty(this, `trigger${capitalize(store.toLowerCase())}`, {
        get(): string {
          return this.triggers[store] ?? 0;
        },
      });

      this.defineCalculatedProperty(
        `all${capitalize(store.toLowerCase())}`,
        () => this.idb.getAll(store),
        [`trigger${capitalize(store.toLowerCase())}`]
      );
    });
  }

  queryForValue(value, options) {
    return this.idb.queryForValue(String(value ?? ""), options);
  }

  async deleteAll(store) {
    await this.idb.deleteAll(store);
  }

  async put({ store, ...obj }: any = {}) {
    await this.idb.put(obj, store);
  }

  async deleteDatabase(reload) {
    await IndexedDb.deleteDatabase(this.name);
    if (reload) {
      window.location.reload();
    }
  }

  async upsert(data: Delta) {
    const now = Date.now();

    const { id = `${now}`, store = "items", $callback, ...delta } = data;

    const result = await this.idb.update({ ...delta, id, ts: now }, store);

    $callback?.(result);

    return {
      triggers: {
        ...this.triggers,
        [store]: (this.triggers[store] ?? 0) + 1,
      },
    };
  }
}
