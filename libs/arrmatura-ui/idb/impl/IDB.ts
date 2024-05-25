import { arrayToObject } from "ultimus";

import { withRwStoreTx } from "./withRwStoreTx";


export const IDB: any = {
  clear(db, store, callback) {
    withRwStoreTx(db, store, callback, (store) => store.clear());
  },
  get(db, key, store, callback) {
    db.transaction(store).objectStore(store).get(key).onsuccess = function (event) {
      const result = (event.target.result) ?? null;
      callback(result);
    };
  },
  put(db, obj, store, callback) {
    withRwStoreTx(db, store, callback, (store) => store.put(obj));
  },
  bulkPut(db, data, store, callback) {
    withRwStoreTx(db, store, callback, (store) => data?.forEach(obj => store.put(obj)));
  },
  update(db, obj, store, callback) {
    db.transaction(store).objectStore(store).get(obj.id).onsuccess = function (event) {
      const item = (event.target.result) ?? {};
      IDB.put(db, { ...item, ...obj }, store, callback);
    };
  },
  bulkUpdate(db, data, storeId, callback) {
    db.transaction(storeId).objectStore(storeId).getAll().onsuccess = function (event) {
      const items = arrayToObject(event.target.result, 'id');
      IDB.bulkPut(db, data.map(e => ({ ...items[e.id], ...e })), storeId, callback);
    };
  },
  delete(db, key, store, callback) {
    withRwStoreTx(db, store, callback, (store) => store.delete(key));

  },
  bulkDelete(db, data, store, callback) {
    withRwStoreTx(db, store, callback, (store) => data.forEach(obj => store.delete(typeof obj === 'string' ? obj : obj.id)));
  },

  getAllKeys(db, store, callback) {
    db.transaction(store).objectStore(store).getAllKeys().onsuccess = function (event) {
      const result = (event.target.result) ?? null;
      callback(result);
    };
  },
  getAll(db, store, callback) {
    db.transaction(store).objectStore(store).getAll().onsuccess = function (event) {
      const result = (event.target.result) ?? null;
      callback(result);
    };
  },
  queryForValue(db, value, index, store, callback) {
    if (!value) {
      callback(null);
      return;
    }

    if (value === '*') {
      IDB.getAll(db, store, callback);
      return;
    }

    const isPrefix = value.endsWith('*');
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
  },
};
