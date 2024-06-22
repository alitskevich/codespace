import { Component } from "arrmatura";
import type { TArrmatron } from "arrmatura/types";
import type { Hash } from "ultimus/types";

import { FilterField } from "./FilterField";

export class ItemsFilterController extends Component {
  selectedFieldsIds: string[] = [];
  fields: any[];
  change?: (data: any) => void;
  data: Hash[] = [];

  constructor(initials: Hash<unknown>, ctx: TArrmatron) {
    super(initials, ctx);

    this.fields =
      (initials.meta as any[])?.map(
        (e) =>
          new FilterField(
            this,
            Object.assign(e, {
              isSelected: false,
            })
          )
      ) ?? [];
  }

  get actualData() {
    return (
      this.data?.filter((item: Hash) => {
        for (const fields of this.fields) {
          if (!fields.matched(item)) return false;
        }
        return true;
      }) ?? null
    );
  }

  touch() {
    const fingerprint = this.fields.reduce((value, ff) => {
      return Object.assign(value, {
        [`filter_${ff.id}`]: ff.isSelected ? ff.selections : undefined,
      });
    }, {});

    const sfingerprint = JSON.stringify(fingerprint);

    if (this.fingerprint !== sfingerprint) {
      super.touch();

      this.fingerprint = sfingerprint;
      this.change?.(fingerprint);
    }
  }

  setValue(value = {}) {
    this.value = value;

    this.fields.forEach((ff) => {
      const selections = Object.keys(value?.[`filter_${ff.id}`] ?? {});
      ff.settleOption(selections);
      ff.setIsSelected(ff.isSelected || selections.length > 0);
    });
  }

  toggleField(id: string) {
    const field = this.fields.find((ff) => ff.id === id);
    field?.setIsSelected(!field.isSelected);
  }
}
