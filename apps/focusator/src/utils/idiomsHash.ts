export function idiomsHash(idioms) {
  const result = {};
  const register = (key, val) => {
    if (!result[key]) result[key] = [];
    result[key].push(val);
  };
  idioms?.forEach((item: any) => {
    item.stems?.forEach(e => {
      register(e, item);
    });
  }, result);

  return result;
}
