export const arrayExtract = <T = any>(sdata: T[], predicate: (e: T) => boolean) => {
  const elements: T[] = [];
  const data = sdata.filter((e) => {
    const r = predicate(e);
    if (r) {
      elements.push(e);
    }
    return !r;
  });
  return [elements, data];
};
