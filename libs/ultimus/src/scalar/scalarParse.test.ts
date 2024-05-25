import { scalarParse } from './scalarParse';

describe('scalarParse function', () => {
  test('should return an empty string for empty string input', () => {
    expect(scalarParse("")).toBe("");
  });

  test('should return true for "true" input', () => {
    expect(scalarParse("true")).toBe(true);
  });

  test('should return false for "false" input', () => {
    expect(scalarParse("false")).toBe(false);
  });

  test('should return 0 for "0" input', () => {
    expect(scalarParse("0")).toBe(0);
  });

  test('should return 1 for "1" input', () => {
    expect(scalarParse("1")).toBe(1);
  });

  test('should convert numeric input to number', () => {
    expect(scalarParse("123")).toBe(123);
  });

  test('should return undefined for "undefined" input', () => {
    expect(scalarParse("undefined")).toBeUndefined();
  });

  test('should return null for "null" input', () => {
    expect(scalarParse("null")).toBeNull();
  });

  test('should return the input string as-is for other cases', () => {
    expect(scalarParse("random")).toBe("random");
  });
});