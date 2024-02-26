export function defineObjectRef(obj, key, val) {

  Object.defineProperty(obj, key, {
    get() {
      return val;
    },
    enumerable: false,
  });

  return obj;
}
