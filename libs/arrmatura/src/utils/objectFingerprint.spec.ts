import { objectFingerprint } from './FingerprintMashine';

describe('objectFingerprint', () => {
  it('should return 0 for null or undefined input', () => {
    expect(objectFingerprint(null)).toBe(null);
    expect(objectFingerprint(undefined)).toBe(undefined);
    expect(objectFingerprint(0)).toBe(0);
    expect(objectFingerprint("")).toBe("");
  });

  it('should return the same hash value for the same input string, regardless of the case of its characters', () => {
    const str1 = 'Hello World';
    const str2 = 'Hello World';
    const str3 = 'Hello world';
    expect(objectFingerprint(str1)).toBe(objectFingerprint(str2));
    expect(objectFingerprint(str1)).not.toBe(objectFingerprint(str3));
  });

  it('should return a unique hash value for different input objects', () => {
    const obj1 = { foo: 'bar' };
    const obj2 = { bar: 'baz' };
    expect(objectFingerprint(obj1)).not.toBe(objectFingerprint(obj2));
  });

  it('should return the same hash value for the same input object, regardless of the order of its properties', () => {
    const obj0 = { foo: 'bar', baz: 'qux' };
    const obj1 = { foo: 'bar', baz: 'qux' };
    const obj2 = { baz: 'qux', foo: 'bar' };
    expect(objectFingerprint(obj1)).toBe(objectFingerprint(obj0));
    expect(objectFingerprint(obj1)).not.toBe(objectFingerprint(obj2));
  });

  it('should return the same hash value for the same input array, regardless of the order of its elements', () => {
    const arr0 = [1, 2, 3];
    const arr1 = [1, 2, 3];
    const arr2 = [3, 2, 1];
    expect(objectFingerprint(arr1)).toBe(objectFingerprint(arr0));
    expect(objectFingerprint(arr1)).not.toBe(objectFingerprint(arr2));
  });

  it('should return the same hash value for the same input map, regardless of the order of its entries', () => {
    const map0 = new Map([[1, 'one'], [2, 'two']]);
    const map1 = new Map([[1, 'one'], [2, 'two']]);
    const map2 = new Map([[2, 'two'], [1, 'one']]);
    expect(objectFingerprint(map1)).toBe(objectFingerprint(map0));
    expect(objectFingerprint(map1)).not.toBe(objectFingerprint(map2));
  });

  it('should return the same hash value for the same input set, regardless of the order of its elements', () => {
    const set0 = new Set([1, 2, 3]);
    const set1 = new Set([1, 2, 3]);
    const set2 = new Set([3, 2, 1]);
    expect(objectFingerprint(set1)).toBe(objectFingerprint(set0));
    expect(objectFingerprint(set1)).not.toBe(objectFingerprint(set2));
  });


  it('should return the same hash value for the same input number, regardless of its precision', () => {
    const num1 = 3.14159;
    const num2 = 3.14159;
    const num3 = 3.14158;
    expect(objectFingerprint(num1)).toBe(objectFingerprint(num2));
    expect(objectFingerprint(num1)).not.toBe(objectFingerprint(num3));
  });

  it('should return the same hash value for the same input boolean, regardless of its value', () => {
    expect(objectFingerprint(true)).toBe(objectFingerprint(true));
    expect(objectFingerprint(false)).toBe(objectFingerprint(false))
  });
})