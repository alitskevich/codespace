import { Component } from "arrmatura";
import { arraySortBy } from "ultimus";
import { Hash, StringHash, Delta } from "ultimus/types";

import { ClientStorage } from "../support";
import { Item } from "../support/Item";
const WEAKMAP = new WeakMap<any, any>();

function getSearchDataFor(e: any, searchFields: string[]) {
  let searchData = WEAKMAP.get(e);
  if (searchData == null) {
    const words: Hash = {};
    const text = searchFields.map((key) => String(e[key] ?? "")).join("|");

    text.replace(/[a-z0-9а-яёўі]{3,}/gi, (w: string) => {
      words[w] = 1;
      return "";
    });

    searchData = {
      words: Object.keys(words),
      text: text.toLowerCase(),
    };

    WEAKMAP.set(e, searchData);
  }
  return searchData;
}

export const getSearchKeySuggestions = (data: Item[], kluq: string, searchFields) => {
  if (!kluq) return null;

  const lokey = kluq.toLowerCase();

  const words: Hash = {};
  data.forEach((e) =>
    getSearchDataFor(e, searchFields).words.forEach((w) => {
      if (w.startsWith(lokey)) {
        words[w] = 1;
      }
    })
  );

  if (!Object.keys(words).length) {
    data.forEach((e) =>
      getSearchDataFor(e, searchFields).words.forEach((w) => {
        if (w.includes(lokey)) {
          words[w] = 1;
        }
      })
    );
  }

  return arraySortBy(
    Object.keys(words).map((s) => ({ name: s, id: s })),
    "name"
  );
};

export class ItemSearchController extends Component {
  kluqPoshuku = "";

  data?: any[] | null;
  inputKluqPoshuku = "";
  searchFields = ["title", "name"];

  local = new ClientStorage("local");

  get searchHistory(): string[] {
    const str = this.local?.get("searchHistory");

    return str ? str.split(",") : null;
  }

  set searchHistory(arr: string[]) {
    this.local?.set("searchHistory", (arr ?? []).join(","));
  }

  get searchSuggestion() {
    if (this.kluqPoshuku === this.inputKluqPoshuku) {
      if (this.kluqPoshuku) return null;
      return this.searchHistory?.map((s: string) => ({ name: s, id: s }));
    }

    return this.data
      ? getSearchKeySuggestions(this.data, this.inputKluqPoshuku, this.searchFields)
      : null;
  }

  addHistoryItem(value: string) {
    if (value) {
      this.searchHistory = [value, ...(this.searchHistory ?? []).filter((s) => s !== value)].slice(
        0,
        20
      );
    }
  }

  setData(data: Hash[]) {
    this.data = !data ? null : Array.isArray(data) ? data : Object.values(data);
  }

  get actualData() {
    const data = this.data;
    if (!data) return null;
    if (!this.kluqPoshuku) return data;

    return data.filter((e) => {
      const searchData = getSearchDataFor(e, this.searchFields);
      return searchData.words.some((w) => w.startsWith(this.kluqPoshuku));
    });
  }

  getInfo() {
    return {
      kluq: this.kluqPoshuku,
      value: this.inputKluqPoshuku,
      suggestions: this.searchSuggestion,
      input: (data: Delta) => this.emit("this.inputKluq()", data),
      enter: (data: Delta) => this.emit("this.znajdzPoKluqu()", data),
    };
  }

  // event handlers:

  inputKluq({ value }: Delta) {
    return {
      inputKluqPoshuku: value || "",
    };
  }

  znajdzPoKluqu({ value }: StringHash) {
    this.addHistoryItem(value);

    return {
      inputKluqPoshuku: value || "",
      kluqPoshuku: value || "",
    };
  }
}
