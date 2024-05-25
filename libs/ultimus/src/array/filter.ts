 

import { Hash } from "../../types";

export const filter = <T extends Hash<any>>(x: T[], key = 'isSelected', val: unknown = true) => x?.filter?.((e: T) => e[key] == val);

export const filterByKeyword = <T extends Hash<any>>(array: T[], kliuq: any, propName = "name") => {
  if (!kliuq || !array) return array;
  const loKliuq = String(kliuq.value ?? kliuq).toLowerCase();
  const starters = array.filter((e) => String(e[propName]).toLowerCase().startsWith(loKliuq));
  if (starters.length) return starters;
  return array.filter((e) => String(e[propName]).toLowerCase().includes(loKliuq));
};

export const filterIdByPrefix = <T extends Hash<any>>(array: T[], prefix: string) => {
  if (!prefix || !array) return array;
  const starters = array.filter((e) => String(e.id).startsWith(prefix));
  return starters;
};
