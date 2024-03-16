import { mergeObject } from './mergeObject';

describe('mergeObject function', () => {
  it('should merge two objects with nested objects', () => {
    const source = {
      a: 1,
      b: {
        c: 2,
        d: 3
      }
    };
    const target = {
      b: {
        c: 5,
        e: 7
      },
      f: 4
    };
    const expected = {
      a: 1,
      b: {
        c: 5,
        d: 3,
        e: 7
      },
      f: 4
    };
    expect(mergeObject(source, target)).toEqual(expected);
  });

  it('should merge two objects with nested arrays', () => {
    const source = {
      a: 1,
      b: [2, 3]
    };
    const target = {
      b: [4, 5],
      c: [6, 7]
    };
    const expected = {
      a: 1,
      b: [4, 5],
      c: [6, 7]
    };
    expect(mergeObject(source, target)).toEqual(expected);
  });

  it('should merge two objects with different data types', () => {
    const source = {
      a: 1,
      b: 'hello'
    };
    const target = {
      b: 'world',
      c: true
    };
    const expected = {
      a: 1,
      b: 'world',
      c: true
    };
    expect(mergeObject(source, target)).toEqual(expected);
  });
});