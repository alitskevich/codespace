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
  indexedDb = new IndexedDb();
  local?: ClientStorage;

  async __init() {
    await this.indexedDb.open(this.name, {
      version: this.version,
      stores: this.stores,
      initialData: this.initialData,
    });

    // const threadUpId = setInterval(() => this.emit('this.upstream()', {}), 10000);
    // const threadDownId = setInterval(() => this.emit('this.downstream()', {}), 5 * 60000);

    // this.defer(() => {
    //   clearInterval(threadUpId)
    //   clearInterval(threadDownId)
    // })

    Object.keys(this.stores).forEach((store) => {
      Object.defineProperty(this, `trigger${capitalize(store.toLowerCase())}`, {
        get(): string {
          return this.triggers[store] ?? 0;
        },
      });

      this.defineCalculatedProperty(
        `all${capitalize(store.toLowerCase())}`,
        () => this.indexedDb.getAll(store),
        [`trigger${capitalize(store.toLowerCase())}`]
      );
    });
  }

  queryForValue(value, options) {
    return this.indexedDb.queryForValue(String(value ?? ""), options);
  }

  async deleteAll(store) {
    await this.indexedDb.deleteAll(store);
  }

  async put(obj, store) {
    await this.indexedDb.put(obj, store);
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

    await this.indexedDb.update({ ...delta, id, ts: now }, store);

    $callback?.({});

    return {
      triggers: {
        ...this.triggers,
        [store]: (this.triggers[store] ?? 0) + 1,
      },
    };
  }
}
