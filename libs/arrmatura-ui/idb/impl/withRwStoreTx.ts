
export const withRwStoreTx = (db, store, oncomplete, fn) => {
  const tx = db.transaction(store, 'readwrite');
  tx.oncomplete = oncomplete;
  fn(tx.objectStore(store));
  tx.commit();
};
