import { Hash, Obj, Fn } from "../../types";
import { gettus } from "../object/gettus";

type GroupOf<T> = {
  id: string;
  count: number;
  items: T[];
}

/**
 * Builds histogram on given field for given list.
 *
 * @param {*} list source
 * @param {*} field to be used as group key
 */
export const arrayGroupBy = function <T extends Obj>(
  list: T[] | null,
  field: string | Fn = "type",
  result: Hash<GroupOf<T>> = {}
) {
  const iter = (id: string, entry: T) => {
    const slot = result[id] || (result[id] = { id, count: 0, items: [] });
    slot.count = 1 + (slot.count ?? 0);
    (slot.items ?? (slot.items = [])).push(entry);
  };

  list?.forEach((e: T) => iter(gettus(e, field) as string, e));

  return result;
};
