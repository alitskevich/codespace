const CACHE = new WeakMap();
export const objectFingerprint = (x: any): any => {
  let r = '';

  if (x == null) return 0;

  const path = new Set();
  const cache = (typeof x === "object") ? (CACHE.has(x) ? CACHE.get(x) : CACHE.set(x, new Map()).get(x)) : null;

  const upString = x => {
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
    r += h;
  }

  const up = n => {
    r += n
    return r;
  }

  const upObject = x => {
    if (x instanceof Date) return up(x.getTime());

    if (path.size > 4) {
      return;
    }

    if (path.has(x)) return;

    path.add(x);

    if (x instanceof Map) {
      up("$$$Map$$${");
      x.forEach((v, k) => {
        upString(k);
        up(":");
        inner(v);
      })
      up('}')
    } else if (x instanceof Set) {
      up("$$$Set$$${");
      x.forEach((v) => {
        inner(v);
      })
      up('}')
    } else if (Array.isArray(x)) {
      up("[");
      x.forEach((v) => {
        inner(v);
      })
      up("]");
    } else {
      up("{");
      for (const k in x) {
        if (Object.prototype.hasOwnProperty.call(x, k) && k[0] !== '$') {
          upString(k)
          up(":");
          inner(x[k]);
        }
      }
      up('}')
    }

    return r;
  }
  const inner = (x: any): void => {

    if (x == null) return x;

    switch (typeof x) {
      case "object":
        upObject(x)
        break;
      case "string":
        upString(x)
        break;
      case "function":
        upString(String(x))
        break;
      default:
        r += String(x)
        break;
    }
  }

  inner(x);
  return r;
}