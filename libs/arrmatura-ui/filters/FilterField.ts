import { arraySortBy, arrayToObject } from "ultimus";
import type { Hash } from "ultimus/types";

import { OPT_NON_EMPTY, OPT_NAMES, OPT_EMPTY } from "./consts";

export class FilterField {
  names: Hash<any>;
  selections: Hash<boolean> = {};
  isSelected = false;
  type: any;
  id: any;
  toggleOption: (id: any) => void;
  settleOption: (id: any) => void;
  setIsSelected: (v: boolean) => void;
  $histo?: any[];
  isMultiType: any;
  isDateType: any;

  constructor(private readonly $ctrl, initials: any) {
    Object.assign(this, initials);
    const { type = 'text', typeSpec } = initials;

    this.isMultiType = type.startsWith("multi");
    this.isDateType = type.startsWith("date");

    this.names = (type === "enum" && typeSpec) ? arrayToObject(($ctrl.platform.getResource(`enums.${typeSpec}`) as Hash[]) || [], "id", "name") : {};
    this.toggleOption = (id) => {
      if (id in this.selections) {
        this.selections = Object.keys(this.selections).filter((key) => key !== id).reduce((acc, val) => ({ ...acc, [val]: true }), {}) || {};
      } else {
        if (id === OPT_NON_EMPTY) {
          this.selections = { [OPT_NON_EMPTY]: true };
        } else {
          delete this.selections[OPT_NON_EMPTY];
          this.selections[id] = true;
        }
      }
      this.$ctrl.touch();
    };

    this.settleOption = (id) => {
      this.selections = (Array.isArray(id) ? id : [id]).reduce((acc, val) => ({ ...acc, [val]: true }), {}) || {};
      this.$ctrl.touch();
    };

    this.setIsSelected = (v: boolean) => {
      if (!v) {
        this.selections = {};
      }
      this.isSelected = v;

      this.$ctrl.touch();
    };
  }

  matched(item: Hash) {
    const { id, isMultiType, isDateType, selections } = this;
    const value = String(item[id] ?? '');

    if (!value && selections[OPT_EMPTY]) return true;
    if (value && selections[OPT_NON_EMPTY]) return true;

    const vals = Object.keys(selections);

    if (vals.length === 0) return true;

    for (const val of vals) {
      if (isMultiType) {
        if (value.includes(val)) {
          return true;
        }
      } else if (isDateType) {
        if (value && value.startsWith(val)) {
          return true;
        }
      } else {
        if (value === val) {
          return true;
        }
      }
    }
    return false;
  }

  get histogram() {
    const { isMultiType, isDateType, names, selections } = this as any;
    const { data } = this.$ctrl;
    const hash: Hash<number> = {};
    const incKey = (key, inc = 1) => {
      hash[key] = inc + Number(hash[key] ?? 0);
    };
    const fields = this.$ctrl.fields.filter((field) => field !== this);
    const items = data.filter((item: Hash) => !fields.some((field) => !field.matched(item)));

    items.forEach((item: Hash) => {
      const val = String(item[this.id] ?? '');
      incKey(!val ? OPT_EMPTY : OPT_NON_EMPTY);
      if (!val) return;
      if (isMultiType) {
        val.split(",").forEach((key) => incKey(key.trim()));
      } else if (isDateType) {
        incKey(val.slice(0, 4));
        incKey(val.slice(0, 7));
      } else {
        incKey(val);

      }
    });

    const histo: any[] = Object.entries(hash).filter(([key, count]) => key !== OPT_EMPTY && key !== OPT_NON_EMPTY && count > 0)
      .map(([id, count]) => ({ id, name: names?.[id] ?? id, count, isSelected: !!selections[id] }));

    this.$histo = [
      { ...OPT_NAMES[OPT_EMPTY], count: hash[OPT_EMPTY] ?? 0, isSelected: !!selections[OPT_EMPTY] },
      { ...OPT_NAMES[OPT_NON_EMPTY], count: hash[OPT_NON_EMPTY] ?? 0, isSelected: !!selections[OPT_NON_EMPTY] },
      ...arraySortBy(histo, "name")
    ];

    return this.$histo;
  }
}
