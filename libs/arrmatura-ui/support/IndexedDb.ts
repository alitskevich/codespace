import { Hash, mapEntries } from "ultimus";

/**
 * IndexedDb wrapper
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
 */
export class IndexedDb {
  open: (name: string, meta: { collections: Hash, initialData: Hash<any[]> }) => Promise<void>;
  invoke: <T>(fn: any) => Promise<T>;
  ldb: any;

  static async deleteAll() {
    (await window.indexedDB?.databases()).forEach(db => {
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

  constructor() {
    let db: any;
    const defered = new Set<any>();

    this.open = (name = 'db', options) => {
      return new Promise<void>((success: () => void, fail: (err: any) => void) => {

        const request = window.indexedDB?.open(name, 1) ?? { result: {} }

        Object.assign(request, {
          onsuccess: () => {
            db = request.result;
            defered.forEach(f => f())
            defered.clear()
            success();
          },
          onerror: (event) => {
            console.error('indexedDB request error');
            console.log(event);
            fail(event);
          },

          onupgradeneeded: async (event) => {
            const db = event.target.result;
            const { collections, initialData } = options;

            await Promise.all(mapEntries(collections, (collection, value) => {
              return db.createObjectStore(collection, typeof value === 'object' ? value : {
                keyPath: value,
                autoIncrement: false
              });
            }));

            if (initialData) {
              const txn = event.target.transaction;;
              txn.oncomplete = function () { console.log('Success!'); };
              await Promise.all(mapEntries(collections, (collection) => {
                const ini: any = initialData[collection];
                const data = typeof ini === 'function' ? ini() : ini;

                (data ?? []).forEach(obj => {
                  txn.objectStore(collection).put(obj)
                });
              }))
              txn.commit();
            }
          }
        });
      });
    }

    this.invoke = <T = unknown>(fn) => {
      return new Promise<T>((resolve, reject) => {
        if (!db) {
          defered.add(() => fn(resolve));
        } else {
          try {
            fn(resolve);
          } catch (error) {
            reject(error)
          }
        }
      })
    }
    this.ldb = {
      get(key, coll, callback) {
        db.transaction(coll).objectStore(coll).get(key).onsuccess = function (event) {
          const result = (event.target.result) ?? null;
          callback(result);
        };
      },
      put: function (obj, coll, callback) {
        const txn = db.transaction(coll, 'readwrite');
        txn.oncomplete = callback
        txn.objectStore(coll).put(obj);
        txn.commit();
      },
      update: function (obj, coll, callback) {
        db.transaction(coll).objectStore(coll).get(obj.id).onsuccess = function (event) {
          const item = (event.target.result) ?? {};
          const txn = db.transaction(coll, 'readwrite');
          txn.oncomplete = callback
          txn.objectStore(coll).put({ ...item, ...obj });
          console.log('Indexed object updated', item, obj)
          txn.commit();
        };
      },
      delete: function (key, coll, callback) {
        db.transaction(coll, 'readwrite').objectStore(coll).delete(key).onsuccess = callback;
      },
      getAllKeys: function (coll, callback) {
        db.transaction(coll).objectStore(coll).getAllKeys().onsuccess = function (event) {
          const result = (event.target.result) ?? null;
          callback(result);
        };
      },
      getAll: function (coll, callback) {
        db.transaction(coll).objectStore(coll).getAll().onsuccess = function (event) {
          const result = (event.target.result) ?? null;
          callback(result);
        };
      },
      clear: function (coll, callback) {
        db.transaction(coll, 'readwrite').objectStore(coll).clear().onsuccess = callback;
      }
    }


  }

  clear(coll = 's') {
    return this.invoke((cb) => this.ldb.clear(coll, cb));
  }

  get<T = any>(key: string, coll = 's') {
    return this.invoke<T | null>((cb) => this.ldb.get(key, coll, cb));
  }

  getAll<T = any>(coll = 's') {
    return this.invoke<T[] | null>((cb) => this.ldb.getAll(coll, cb));
  }

  put(obj: object, coll = 's') {
    return this.invoke((cb) => this.ldb.put(obj, coll, cb));
  }

  update(obj: object, coll = 's') {
    return this.invoke((cb) => this.ldb.update(obj, coll, cb));
  }

  delete(key: string, coll = 's') {
    return this.invoke((cb) => this.ldb.delete(key, coll, cb));
  }
}
