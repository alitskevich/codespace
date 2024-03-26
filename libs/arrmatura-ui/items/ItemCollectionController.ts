import { applyNavInfo } from "./utils";
import { arraySortBy } from "ultimus";
import { analyzeDataByTags } from "./utils-analyzeDataByTags";
import { showCounts } from "./utils";
import { Item } from "./Item";
import { Hash, Tag, StringHash, Delta } from "ultimus/types";
import { Component } from "arrmatura";

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
  initials = "";
  tags: Tag[] = [];

  setData(data: Hash[]) {
    this.data = !data ? null : (Array.isArray(data) ? data : Object.values(data)).map((e: any) => new Item(e));
  }

  get sortedData() {
    const data = this.data;
    if (!data) return null;

    // this.tags = [];
    // const actualData = analyzeDataByTags(
    //   data,
    //   this.selection,
    //   this.initials,
    //   this.tags,
    //   this.labelsFields
    // ) as unknown as StringHash[];
    return arraySortBy(data, this.sortBy, this.sortDir === "-" ? -1 : 1) as unknown as Item[];
  }

  getInfo() {
    const data = this.sortedData;
    if (!data) {
      return {};
    }
    const counts = {
      total: this.data?.length,
      actual: data.length,
      hasMore: this.shownLimit < data.length,
    };
    return {
      isLoaded: this.isLoaded,
      sortBy: this.sortBy,
      sortDir: this.sortDir,

      data: data,
      sortedData: data,
      shownData: data.slice(0, this.shownLimit),

      tags: this.tags,
      selection: Object.entries(this.selection)
        .filter(([_, v]) => Boolean(v))
        .map(([k]) => k),

      counts: !this.isLoaded ? {} : counts,
      countsInfo: !this.isLoaded ? '...' : showCounts(counts),
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
  changeField({ collection, itemId, field, value }: Delta) {
    return !collection
      ? null
      : {
        "...": new Promise((resolve) => {
          this.emit(`${this.upsertOperationId ?? 'db.upsertOptimistic'}(data)`, {
            $collection: collection,
            id: itemId,
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
