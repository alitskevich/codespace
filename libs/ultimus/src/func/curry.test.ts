import { curry } from './curry';

function add(a, b, c): number {
  return a + b + c;
}

describe.only('curry', () => {
  it('should curry a function with no additional arguments', () => {
    const curriedAdd = curry(add) as any;
    expect(curriedAdd(1)(2)(3)).toEqual(6);
  });

  it('should curry a function with one additional argument', () => {
    const curriedAdd = curry(add, 1) as any;
    expect(curriedAdd(2)(3)).toEqual(6);
  });

  it('should curry a function with multiple additional arguments', () => {
    const curriedAdd = curry(add, 1, 2) as any;
    expect(curriedAdd(3)).toEqual(6);
  });
});