const CACHE = new WeakMap();
export const objectFingerprint = (x: any): any => {
  let r = 0;

  if (x == null) return x;

  if (typeof x !== "object") return x;

  if (Object.isFrozen(x)) return x;

  if (x.$hash) return x.$hash;

  const path = new Set();
  const cache = (typeof x === "object") ? (CACHE.has(x) ? CACHE.get(x) : CACHE.set(x, new Map()).get(x)) : null;

  const upNumber = n => {
    r = ((r << 5) - r) + n;
    r &= r;
    return r;
  }

  const upString = x => upNumber(stringHash(x))


  const stringHash = x => {
    let h = 0;
    if (cache?.has(x)) {
      h = cache.get(x)
    } else {
      for (let i = 0; i < x.length; i++) {
        const n = x.charCodeAt(i);
        h = ((h << 5) - h) + n;
        h &= h;
      }
      cache?.set(x, h);
    }
    return h;
  }

  const upObject = x => {
    if (x instanceof Date) return upNumber(x.getTime());

    if (path.size > 4) {
      return;
    }

    if (path.has(x)) return;

    path.add(x);

    if (x instanceof Map) {
      upString("$$$Map$$$");
      x.forEach((v, k) => {
        upString(k);
        upString(":");
        upAny(v);
      })
    } else if (x instanceof Set) {
      upString("$$$Set$$$");
      x.forEach((v) => {
        upAny(v);
      })
    } else if (Array.isArray(x)) {
      upString("$$$Array$$$");
      x.forEach((v) => {
        upAny(v);
      })
    } else {
      upString("$$$Object$$$");
      for (const k in x) {
        if (Object.prototype.hasOwnProperty.call(x, k) && k[0] !== '$') {
          upString(k)
          upString(":");
          upAny(x[k]);
        }
      }
    }

    return r;
  }
  const upAny = (x: any): void => {

    if (x == null) {
      upString(String(x));
    } else if (typeof x === 'object') {
      upObject(x);
    } else if (typeof x === 'string') {
      upString(x);
    } else {
      upString(String(x))
    }
  }

  upObject(x);

  return r;
}