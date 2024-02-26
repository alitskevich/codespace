/* eslint-disable eqeqeq */
import { arraySortBy } from "ultimus";
import { Hash, Tag } from "ultimus/types";
import { Item } from "./Item";

export const analyzeDataByTags = (
  data: Item[],
  selection: Hash<boolean>,
  initials = "",
  tags: Tag[] = [],
  labelsFields?: string
): Item[] => {
  const sel = Object.entries(selection)
    .filter(([_, val]) => val)
    .map(([key]) => key);
  const level = sel.length;
  if (labelsFields) {
    const lFields = labelsFields.split(",");
    const fields = lFields.slice(0, level);
    const actualData = !level ? data : data.filter((e) => !fields.find((field, index) => e[field] != sel[index]));
    const tagsHash: Hash<Tag> = {};
    if (level) {
      tagsHash["*"] = {
        id: sel[level - 1],
        name: sel.join(" / "),
        count: 0,
        selected: level > 0,
      };
    }

    actualData.forEach((e) => {
      const id = String(e[lFields[level]] || "");
      if (!id) return;
      const tag = tagsHash[id] ?? (tagsHash[id] = { id, name: id, count: 0, selected: !!selection[id] });
      if (!tag.selected) {
        tag.count++;
      }
    });

    tags.push(...arraySortBy<Tag>(Object.values(tagsHash), (e) => (e.selected ? "0" : "1") + e.name));
    // tags.sort((a, b) => (a.selected === b.selected ? (a.id > b.id ? 1 : -1) : !a.selected ? 1 : -1));
    return actualData;
  }
  if (level || !initials) {
    const actualData = data.filter((e) => sel.reduce((r, s) => r && e.getLabels().has(s), true));
    const tagsHash: Hash<Tag> = {};
    sel.forEach((id) => {
      tagsHash[id] = { id, name: id, count: 0, selected: true };
    });
    actualData.forEach((e) => {
      e.getLabels().forEach((id: string) => {
        const tag =
          tagsHash[id] ||
          (tagsHash[id] = {
            id,
            name: id,
            count: 0,
            selected: selection[id],
            nonSelectable: true,
          });
        if (!tag.selected) {
          tag.nonSelectable = false;
          tag.count++;
        }
      });
    });

    tags.push(...Object.values(tagsHash));
    tags.sort((a, b) => (a.selected === b.selected ? (a.id > b.id ? 1 : -1) : !a.selected ? 1 : -1));
    return actualData;
  } else {
    tags.push(...initials.split(",").map((id) => ({ id, name: id, count: 0, selected: false })));
    data.forEach((e: Item) => {
      tags.forEach((tag) => {
        if (e.getLabels().has(tag.id)) {
          tag.count++;
        }
      });
    });
    return data;
  }
};
