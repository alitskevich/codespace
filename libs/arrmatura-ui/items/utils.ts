import { Obj } from "ultimus/types";

import { Item } from "../support/Item";

export const applyNavInfo = (data: Item[]) => {
  let prev: Item | null = null;
  return !data
    ? null
    : data.map((item: Item, index) => {
      item.$navInfo = { prev, index, total: data.length };
      if (prev?.$navInfo) {
        prev.$navInfo.next = item.id;
      }
      prev = item;
      return item;
    });
};

export const showCounts = (counts: Obj, nicNema = "", _neZnojdzeno = "0", loading = "…") => {
  if (!counts) {
    return loading;
  }
  const { total, actual } = counts;
  if (!total) {
    return nicNema;
  }
  if (actual === total) {
    return total;
  }
  return `${String(actual)} / ${String(total)}`;
};
