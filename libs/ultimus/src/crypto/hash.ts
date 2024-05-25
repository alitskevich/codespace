
/* Simple hash function. */
export const stringHash32 = (s: string) => {
  let a = 1;
  let c = 0;
  let h;
  let o;
  if (s) {
    a = 0;
    for (h = s.length - 1; h >= 0; h--) {
      o = s.charCodeAt(h);
      a = ((a << 6) & 268435455) + o + (o << 14);
      c = a & 266338304;
      a = c !== 0 ? a ^ (c >> 21) : a;
    }
  }
  return a;
};

/**
 * Calculate a 32 bit FNV-1a hash
 * Found here: https://gist.github.com/vaiorabbit/5657561
 * Ref.: http://isthe.com/chongo/tech/comp/fnv/
 *
 * @param {string} str the input value
 * @param {boolean} [asString=false] set to true to return the hash value as 
 *     8-digit hex string instead of an integer
 * @param {integer} [seed] optionally pass the hash of the previous chunk
 * @returns {integer | string}
 */
export function stringHashFNV1a(str, seed = 0x811c9dc5) {
  /*jshint bitwise:false */
  let i, l, hval = seed;

  for (i = 0, l = str.length; i < l; i++) {
    hval ^= str.charCodeAt(i);
    hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
  }
  // Convert to 8 digit hex string
  return (`0000000${(hval >>> 0).toString(16)}`).slice(-8);
  // return hval >>> 0;
}

export function stringHash(str, seed) {
  const h1 = stringHashFNV1a(str, seed);  // returns 32 bit (as 8 byte hex string)
  return h1 + stringHashFNV1a(h1 + str, seed);  // 64 bit (as 16 byte hex string)
}