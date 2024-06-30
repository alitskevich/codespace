import { Datum } from "ultimus/types";

import { TagsValueController } from "./TagsValueController";

export class SmartareaController extends TagsValueController {
  get lastBitIncluded() {
    const bits = this.values;
    if (!bits.length) return false;
    const lastBit = bits[bits.length - 1] || "";
    return this.options.some((e: Datum) => e.id === lastBit);
  }

  get smartOptions() {
    let options = this.options;
    const bits = this.values;
    if (!bits.length) return options;
    const lastBit = bits[bits.length - 1] || "";
    if (lastBit.length > 1 && !this.lastBitIncluded) {
      const keyword = lastBit.toLowerCase();
      options = options.filter((e: Datum) =>
        String(e.name ?? e.id)
          .toLowerCase()
          .includes(keyword)
      );
      // if (options2.length) {
      //   options = options2;
      // }
    }

    options = options.filter((e: Datum) => !bits.includes(e.id));
    // if (options2.length === 1 && value === options2[0].id) return null;
    return options.slice(0, 100);
  }

  append({ value = "" }) {
    const bits = this.values;
    if (!this.lastBitIncluded) {
      bits.pop();
    }
    this.change({ value: [...bits, value].join(", ") });
  }

  cutLast() {
    const bits = this.values;
    bits.pop();
    this.change({ value: [...bits].join(", ") });
  }

  change({ value = "" }) {
    this.change({ value });
    return { opened: false };
  }
}
