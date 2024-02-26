
export function addNextIds(items) {
  return items.map((e, index, all) => ({ ...e, nextId: all[index + 1]?.id ?? null, }));
}
