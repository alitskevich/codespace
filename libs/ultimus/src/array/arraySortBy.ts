export enum ComparatorDirection {
  DESC = -1,
  ASC = 1,
}

export enum ComparatorResult {
  EQ = 0,
  LESS = -1,
  MORE = 1,
}

type Comparator<T> = (a: T, b: T) => ComparatorResult;

const createComparator = <T = any>(
  fn: string | ((e: T) => number | string),
  dir: ComparatorDirection = 1
): Comparator<T> => {
  let order: ComparatorResult = dir === 1 ? 1 : -1;
  let negOrder: ComparatorResult = dir === 1 ? -1 : 1;
  if (typeof fn === "string") {
    let key = fn;
    if (key[0] === "-") {
      order = -1;
      negOrder = 1;
      key = fn.substr(1);
    }
    return (a: T, b: T): ComparatorResult => {
      const aa = a?.[key];
      const bb = b?.[key];
      return aa < bb ? negOrder : aa > bb ? order : 0;
    };
  }
  return (a: T, b: T): ComparatorResult => {
    const aa = fn(a);
    const bb = fn(b);
    return aa < bb ? negOrder : aa > bb ? order : 0;
  };
};

/**
 * It sorts an array of objects based on a specified property.
 * The property parameter can be a string representing the property name or a function that takes an object and returns a string.
 * The default value for property is "name".
 * The order parameter determines the sorting order (ascending or descending) and its default value is ascending.
 * The function returns a new sorted array.
 */
export const arraySortBy = function <T = any>(
  arr: T[],
  property: string | ((e: T) => string) = "name",
  order: ComparatorDirection = ComparatorDirection.ASC
): T[] {
  return !arr ? [] : [...arr].sort(createComparator<T>(property, order));
};
