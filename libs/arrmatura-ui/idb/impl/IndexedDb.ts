import { Item } from "arrmatura-ui/support/Item";
import { Hash, arrayToObject, mapEntries } from "ultimus";

import { DeferedContext } from "./DeferedContext";

const withRwStoreTx = (db, store, oncomplete, fn) => {
  const tx = db.transaction(store, "readwrite");
  tx.oncomplete = oncomplete;
  fn(tx.objectStore(store));
  tx.commit();
};

/**
 * IndexedDb wrapper
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
 */
export class IndexedDb {
  open: (
    name: string,
    meta: { version?: number; stores: Hash; initialData?: any; forcePresist?: boolean }
  ) => Promise<any>;
  ldb: any;

  static async deleteAll() {
    (await window.indexedDB?.databases())?.forEach((db) => {
      if (db.name) {
        window.indexedDB.deleteDatabase(db.name);
      }
    });
  }

  static deleteDatabase(name = "db") {
    return window.indexedDB?.deleteDatabase(name);
  }

  static async forcePersistMode() {
    if (!navigator.storage?.persisted || !navigator.storage?.persist) return;
    if (await navigator.storage.persisted()) return;
    return navigator.storage?.persist();
  }

  static isStoragePersisted = () => navigator.storage?.persisted?.();

  defered = new DeferedContext();

  constructor() {
    let db: any;

    this.open = async (name = "db", options) => {
      if (options.forcePresist) {
        await IndexedDb.forcePersistMode();
      }

      return new Promise<void>((success: (r: any) => void, fail: (err: any) => void) => {
        let isVersionUpgraded = false;

        const request = window.indexedDB?.open(name, options.version ?? 1) ?? { result: {} };

        Object.assign(request, {
          onsuccess: async () => {
            db = request.result;

            if (isVersionUpgraded && options.initialData) {
              mapEntries(options.stores, async (store) => {
                const ini: any = options.initialData[store];
                const data = typeof ini === "function" ? await ini() : ini;

                return this.bulkPut(data, store);
              });
            }

            await this.defered.setContext(db);

            success({ db, isVersionUpgraded });
          },

          onerror: (event) => {
            console.error("indexedDB request error", event);
            fail(event);
          },

          onupgradeneeded: async (event) => {
            const db = event.target.result;
            const { stores = { items: {} } } = options;

            mapEntries(
              stores,
              (store, { keyPath = "id", autoIncrement = false, indicies = {} }) => {
                const objStore = db.createObjectStore(store, {
                  keyPath,
                  autoIncrement,
                });

                mapEntries(
                  indicies,
                  (name, { keyPath = name, unique = false, multiEntry = false } = {}) => {
                    objStore.createIndex(name, keyPath, { unique, multiEntry });
                  }
                );
              }
            );

            isVersionUpgraded = true;
          },
        });
      });
    };
  }

  clear(store = "items") {
    return this.defered.invoke((db, callback) =>
      withRwStoreTx(db, store, callback, (store) => store.clear())
    );
  }

  get<T = any>(key: string, store = "items") {
    return this.defered.invoke<T | null>(
      (db, callback) =>
        (db.transaction(store).objectStore(store).get(key).onsuccess = function (event) {
          const result = event.target.result ?? null;
          callback(result);
        })
    );
  }

  getAllKeys<T = any>(store = "items") {
    return this.defered.invoke<T[] | null>(
      (db, callback) =>
        (db.transaction(store).objectStore(store).getAllKeys().onsuccess = function (event) {
          const result = event.target.result ?? null;
          callback(result);
        })
    );
  }

  getAll<T = any>(store = "items") {
    return this.defered.invoke<T[] | null>(
      (db, callback) =>
        (db.transaction(store).objectStore(store).getAll().onsuccess = function (event) {
          const result = event.target.result ?? null;
          callback(result);
        })
    );
  }

  queryForValue<T = any>(value: string, store = "items", index = null) {
    return this.defered.invoke<T[] | null>((db, callback) => {
      if (!value) {
        callback(null);
        return;
      }

      if (value === "*") {
        db.transaction(store).objectStore(store).getAll().onsuccess = function (event) {
          const result = event.target.result ?? null;
          callback(result);
        };
        return;
      }

      const isPrefix = value.endsWith("*");
      if (isPrefix) {
        value = value.slice(0, -1);
      }
      const keyRangeValue = isPrefix
        ? IDBKeyRange.bound(value, `${value}\uffff`)
        : IDBKeyRange.only(value);
      const transaction = db.transaction([store], "readonly");
      const objectStore = transaction.objectStore(store);
      const datasource = index ? objectStore.index(index) : objectStore;
      const result: any[] = [];

      datasource.openCursor(keyRangeValue).onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          result.push(Object.freeze(cursor.value));

          cursor.continue();
        } else {
          callback(result);
        }
      };
    });
  }

  put(obj: object, store = "items") {
    return this.defered.invoke((db, callback) =>
      withRwStoreTx(db, store, callback, (store) => store.put(obj))
    );
  }

  bulkPut(data: object[], store) {
    return this.defered.invoke((db, callback) =>
      withRwStoreTx(db, store, callback, (store) => data?.forEach((obj) => store.put(obj)))
    );
  }

  update(obj: any, store = "items") {
    return this.defered.invoke(
      (db, callback) =>
        (db.transaction(store).objectStore(store).get(obj.id).onsuccess = function (event) {
          const item = event.target.result ?? {};
          withRwStoreTx(db, store, callback, (store) => store.put({ ...item, ...obj }));
        })
    );
  }

  bulkUpdate(data: any[], store) {
    return this.defered.invoke((db, callback) => {
      return (db.transaction(store).objectStore(store).getAll().onsuccess = function (event) {
        const items = arrayToObject(event.target.result, "id");
        withRwStoreTx(db, store, callback, (store) => {
          data?.map((e) => ({ ...items[e.id], ...e })).forEach((obj) => store.put(obj));
        });
      });
    });
  }

  delete(key: string, store = "items") {
    return this.defered.invoke((db, callback) =>
      withRwStoreTx(db, store, callback, (store) => store.delete(key))
    );
  }

  bulkDelete(data: Item[], store = "items") {
    return this.defered.invoke((db, callback) =>
      withRwStoreTx(db, store, callback, (store) =>
        data.forEach((obj) => store.delete(typeof obj === "string" ? obj : obj.id))
      )
    );
  }
}
