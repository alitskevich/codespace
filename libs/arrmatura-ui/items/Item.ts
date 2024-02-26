import { Delta, Hash } from "ultimus/types";

export class Item implements Delta {
  id?: string;
  $row?: string;
  $: Hash<any> = {};
  $navInfo?: { index: number; total: number; prev?: Item | null; next?: string };
  [key: string]: unknown;

  constructor({ _$, ...opts }: Delta = {}) {
    Object.assign(this, opts);
  }

  getLabels(): Set<string> {
    const key = "labels";
    return (
      this.$[key] ||
      (this.$[key] = new Set(
        String(this[key] || this.labels)
          .split(",")
          .filter(Boolean)
      ))
    );
  }

  get $data() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { $row, $navInfo, $, ...d } = this;
    return d;
  }
}
