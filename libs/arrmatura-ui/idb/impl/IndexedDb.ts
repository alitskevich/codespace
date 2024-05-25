import { Hash, mapEntries } from "ultimus";
import { DeferedContext } from "ultimus/src/exec/DeferedContext";

import { IDB } from "./IDB";

/**
 * IndexedDb wrapper
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
 */
export class IndexedDb {
  open: (name: string, meta: { version?: number, stores: Hash, initialData?: any, forcePresist?: boolean }) => Promise<any>;
  ldb: any;

  static async deleteAll() {
    (await window.indexedDB?.databases())?.forEach(db => {
      if (db.name) {
        window.indexedDB.deleteDatabase(db.name);
      }
    });
  }

  static deleteDatabase(name = 'db') {
    return window.indexedDB?.deleteDatabase(name);
  }

  static async forcePersistMode() {
    if (!navigator.storage?.persisted || !navigator.storage?.persist) return
    if (await navigator.storage.persisted()) return
    return navigator.storage?.persist();
  }

  static isStoragePersisted = () => navigator.storage?.persisted?.();

  defered = new DeferedContext();

  constructor() {
    let db: any;

    this.open = async (name = 'db', options) => {
      if (options.forcePresist) {
        await IndexedDb.forcePersistMode()
      }

      return new Promise<void>((success: (r: any) => void, fail: (err: any) => void) => {
        let isVersionUpgraded = false;

        const request = window.indexedDB?.open(name, options.version ?? 1) ?? { result: {} }

        Object.assign(request, {
          onsuccess: async () => {
            db = request.result;

            if (isVersionUpgraded && options.initialData) {
              await Promise.all(mapEntries(options.stores, async (store) => {
                const ini: any = options.initialData[store];
                const data = typeof ini === 'function' ? await ini() : ini;

                return this.bulkPut(data, store)
              }))
            }

            this.defered.setContext(db);

            success({ db, isVersionUpgraded });
          },

          onerror: (event) => {
            console.error('indexedDB request error', event);
            fail(event);
          },

          onupgradeneeded: async (event) => {

            const db = event.target.result;
            const { stores = { items: {} } } = options;

            mapEntries(stores, (store, { keyPath = 'id', autoIncrement = false, indicies = {} }) => {
              const objStore = db.createObjectStore(store, {
                keyPath,
                autoIncrement
              });

              mapEntries(indicies, (name, { keyPath = name, unique = false, multiEntry = false } = {}) => {
                objStore.createIndex(name, keyPath, { unique, multiEntry });
              });
            });

            isVersionUpgraded = true;
          }
        });
      });
    }
  }

  clear(store = 'items') {
    return this.defered.invoke((db, cb) => IDB.clear(db, store, cb));
  }

  get<T = any>(key: string, store = 'items') {
    return this.defered.invoke<T | null>((db, cb) => IDB.get(db, key, store, cb));
  }

  getAll<T = any>(store = 'items') {
    return this.defered.invoke<T[] | null>((db, cb) => IDB.getAll(db, store, cb));
  }

  queryForValue<T = any>(value: string, store = 'items', index = null) {
    return this.defered.invoke<T[] | null>((db, cb) => IDB.queryForValue(db, value, index, store, cb));
  }

  put(obj: object, store = 'items') {
    return this.defered.invoke((db, cb) => IDB.put(db, obj, store, cb));
  }

  bulkPut(data: object, store) {
    return this.defered.invoke((db, cb) => IDB.bulkPut(db, data, store, cb));
  }

  update(obj: object, store = 'items') {
    return this.defered.invoke((db, cb) => IDB.update(db, obj, store, cb));
  }

  bulkUpdate(data: object, store) {
    return this.defered.invoke((db, cb) => IDB.bulkUpdate(db, data, store, cb));
  }

  delete(key: string, store = 'items') {
    return this.defered.invoke((db, cb) => IDB.delete(db, key, store, cb));
  }

  bulkDelete(data: any[], store = 'items') {
    return this.defered.invoke((db, cb) => IDB.bulkDelete(db, data, store, cb));
  }
}
