const CACHE = new Map();

function upnum(r: number, n: number) {
  const rr = (r << 5) - r + n;
  return rr & rr;
}

const COLON_NUM = ":".charCodeAt(0);

function stringHash(x: string) {
  let h = 0;
  if (CACHE.has(x)) {
    h = CACHE.get(x) as number;
  } else {
    for (let i = 0; i < x.length; i++) {
      h = upnum(h, x.charCodeAt(i));
    }
    CACHE.set(x, h);
  }
  return h;
}

export class FingerprintMashine {
  r = 0;
  x?: any;
  $path?: Set<unknown>;

  get path() {
    return this.$path ?? (this.$path = new Set());
  }

  upNumber(n: number) {
    return (this.r = upnum(this.r, n));
  }

  upString(x: string) {
    return this.upNumber(stringHash(x));
  }

  upObject(x) {
    if (x.uid) return x.uid;

    if (x instanceof Date) return this.upNumber(x.getTime());

    if (this.path.size > 10 || this.path.has(x)) {
      return;
    }

    this.path.add(x);

    if (x instanceof Map) {
      this.upString("$$$Map$$$");
      x.forEach((v, k) => {
        this.upString(k);
        this.upNumber(COLON_NUM);
        this.upAny(v);
      });
    } else if (x instanceof Set) {
      this.upString("$$$Set$$$");
      x.forEach((v) => this.upAny(v));
    } else if (Array.isArray(x)) {
      this.upString("$$$Array$$$");
      x.forEach((v) => this.upAny(v));
    } else {
      this.upString("$$$Object$$$");
      for (const k in x) {
        if (Object.prototype.hasOwnProperty.call(x, k) && k[0] !== "$") {
          this.upString(k);
          this.upNumber(COLON_NUM);
          this.upAny(x[k]);
        }
      }
    }

    this.path.delete(x);

    return this.r;
  }
  upAny(x: any): void {
    if (x == null) {
      this.upString(String(x));
    } else if (typeof x === "number") {
      if (isNaN(x)) {
        this.upString(`$$$NaN$$$`);
      } else {
        this.upNumber(x);
      }
    } else if (typeof x === "object") {
      this.upObject(x);
    } else if (typeof x === "string") {
      this.upString(x);
    } else if (typeof x === "boolean") {
      this.upString(`$$$Boolean$$$${x}`);
    } else if (typeof x === "function") {
      // this.upString(`$$$Function$$$${x}`);
    } else {
      this.upString(String(x));
    }
  }

  do(x: any) {
    if (x == null) return x;

    if (typeof x !== "object") return x;

    if (Object.isFrozen(x)) return x;

    if (x.uid) return x.uid;

    this.r = 0;
    this.x = x;
    if (this.$path) {
      this.$path?.clear();
    }

    this.upObject(x);

    return this.r;
  }
}

const FM = new FingerprintMashine();

export const objectFingerprint = (x: any) => FM.do(x);
