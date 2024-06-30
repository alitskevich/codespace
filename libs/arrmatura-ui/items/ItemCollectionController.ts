import { Component } from "arrmatura";
import { arraySortBy } from "ultimus";
import { Hash, Tag, Delta } from "ultimus/types";

import { Item } from "../support/Item";

import { showCounts } from "./utils";

export class ItemCollectionController extends Component {
  selection: Hash<boolean> = {};
  shownLimit = 50;
  sortBy = "";
  sortByName = "";
  sortDir = "";
  filterBy?: (item: Item) => boolean;
  kluqPoshuku = "";
  labelsFields: string | undefined;
  data?: Item[] | null;
  inputKluqPoshuku = "";
  newEntry: any;
  entry: any;
  db: any;
  initials = "";

  setData(data: Hash[]) {
    this.data = !data
      ? null
      : (Array.isArray(data) ? data : Object.values(data)).map((e: any) => new Item(e));
  }

  get sortedData() {
    const data = this.data;
    if (!data) return null;
    if (!this.sortBy) return data;
    return arraySortBy(data, this.sortBy, this.sortDir === "-" ? -1 : 1) as unknown as Item[];
  }

  getInfo() {
    const sortedData = this.sortedData;
    if (!sortedData) {
      return {};
    }
    const counts = {
      total: this.data?.length,
      actual: sortedData.length,
      hasMore: this.shownLimit < sortedData.length,
    };
    return {
      isLoaded: this.isLoaded,
      sortBy: this.sortBy,
      sortDir: this.sortDir,

      data: this.data,
      sortedData,
      shownData: sortedData.slice(0, this.shownLimit),

      selection: Object.entries(this.selection)
        .filter(([_, v]) => Boolean(v))
        .map(([k]) => k),

      counts: !this.isLoaded ? {} : counts,
      countsInfo: !this.isLoaded ? "..." : showCounts(counts),
    };
  }

  // event handlers:

  onTag({ id }: Tag) {
    return {
      selection: !id
        ? {}
        : {
            ...this.selection,
            [id]: !this.selection[id],
          },
    };
  }

  onResetTag({ id }: Tag) {
    return {
      selection: id.split(".").reduce<Hash>((r, s) => {
        r[s] = 1;
        return r;
      }, {}),
    };
  }

  onSortBy({ value, name }: Delta) {
    return {
      sortBy: value || "",
      sortByName: name || value || "",
    };
  }

  onSortDir({ value }: Delta) {
    return {
      sortDir: value || "",
    };
  }
  changeField({ id, field, value }: Delta) {
    return {
      "...": new Promise((resolve) => {
        this.db.upsertItem({
          collection: this.collection ?? "items",
          id,
          [field]: value,
          $callback: ({ error = null, ...rest }) => {
            console.log(error, rest);
            if (error) {
              const msg = (error as Error)?.message;
              this.toast({
                id: msg,
                level: "error",
                message: `Error: ${msg}`,
              });
              return null;
            }
            resolve({ counter: NaN });
          },
        });
      }),
    };
  }
  showMore({ size = 50 }) {
    return {
      shownLimit: this.shownLimit + size,
    };
  }
}
