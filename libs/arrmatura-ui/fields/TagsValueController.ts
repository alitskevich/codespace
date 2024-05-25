import { Component } from "arrmatura";
import { filterByKeyword } from "ultimus";
import type { Hash, Datum } from "ultimus/types";

export class TagsValueController extends Component {
  value?: string;
  values: string[] = [];
  categoryValue?: string;
  kliuq?: string;
  prefixValue = "";
  options: Datum[] = [];
  optionsMap?: Map<string, Datum>;

  change(_data?: Hash) {
    // no-op
  }

  get evaluatedOptions() {
    return (
      this.options?.map?.(({ id, name = id, type }) => ({
        id,
        isSelected: this.values?.includes(id),
        name,
        type,
      })) ?? []
    );
  }

  get selectedOptions() {
    const options = this.evaluatedOptions;
    return this.values?.length ? options.filter(({ isSelected }) => isSelected) : [];
  }

  get availableOptions() {
    let options = this.evaluatedOptions;
    if (this.values?.length) {
      options = options.filter(({ isSelected }) => !isSelected);
    }
    if (this.kliuq) {
      options = filterByKeyword(options, this.kliuq);
    }
    return options;
  }

  setOptions(value: Datum[]) {
    if (this.options !== value) {
      this.options = value;
      if (this.values?.length && this.options?.length) {
        // this.setValue(this.values?.filter(v => value.some(e => e.id === v)).join(',') ?? '')
      }
    }
  }

  setValue(value: string) {
    const hadValue = this.value !== undefined;
    if (this.value !== value) {
      this.value = value;
      this.values = this.value
        ? String(this.value)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
        : [];
      if (hadValue) {
        this.change({ value });
      }
    }
  }

  doToggle({ value = "" }) {
    if (this.disabled) return;

    let val = this.values.filter((e) => e !== value);
    if (val.length === this.values.length) {
      val.unshift(value);
    }
    if (!this.multi) {
      val = val.slice(0, 1);
    }
    return { value: val.join(",") };
  }

  doKliuq({ value = "" }) {
    if (this.disabled) return;

    return { kliuq: String(value ?? "") };
  }

  doToggleAndClearKliuq(datum: Hash) {
    if (this.disabled) return;
    return { ...this.doToggle(datum), kliuq: "" };
  }

  doReset() {
    if (this.disabled) return;

    return { value: "", kliuq: "" };
  }
}
