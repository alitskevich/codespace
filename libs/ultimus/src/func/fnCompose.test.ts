import { fnCompose } from './fnCompose';

describe('fnCompose', () => {
  it('should compose two identity functions and return the input value', () => {
    const identityFn = (x: unknown) => x;
    const composedFn = fnCompose(identityFn, identityFn);
    const result = composedFn(5);
    expect(result).toBe(5);
  });

  it('should compose two functions with different operations and return the correct value', () => {
    const addOne = (x: unknown) => (x as number) + 1;
    const multiplyByTwo = (x: unknown) => (x as number) * 2;
    const composedFn = fnCompose(addOne, multiplyByTwo);
    const result = composedFn(3);
    expect(result).toBe(7);
  });

  it('should compose three functions and return the result of applying all three functions', () => {
    const addOne = (x: unknown) => (x as number) + 1;
    const multiplyByTwo = (x: unknown) => (x as number) * 2;
    const square = (x: unknown) => (x as number) ** 2;
    const composedFn = fnCompose(square, multiplyByTwo, addOne);
    const result = composedFn(3);
    expect(result).toBe(64);
  });
});