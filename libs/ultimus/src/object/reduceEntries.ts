
export const reduceEntries = <T extends object = any>(
  target: T,
  o: object | null | undefined,
  fn: (key: string, value: any) => T
): null | T => {
  return !o
    ? null
    : Object.entries(o).reduce((acc, [key, value]: any) => {
      const res = fn(key, value);
      if (res?.[0]) {
        acc[res[0]] = res[1];
      }
      return acc;
    }, target ?? ({} as T));
};
