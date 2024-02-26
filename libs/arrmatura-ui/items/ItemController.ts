import { Item } from "./Item";
import { getPredicat } from "ultimus";
import { Component } from "arrmatura";
import { Hash, Delta, Datum } from "ultimus/types";

const CHANGES: Hash<Hash> = {};

export class ItemController extends Component {
  all?: Hash<Hash>;
  itemId = "";
  meta: any;

  get initialElement() {
    return Array.isArray(this.all) ? this.all.find((e) => e.id == this.itemId) : this.all?.[this.itemId];
  }

  get initialData() {
    const e = this.initialElement;
    return !e?.id ? null : e.$data ?? e;
  }

  get actualData() {
    const initial = this.initialData;
    if (!initial) {
      return null;
    }
    const data = { ...initial, ...CHANGES[this.itemId] };
    this.meta?.map((field: { [k: string]: string }) => {
      const { id, visible } = field;
      const isVisible = !visible || getPredicat(visible)(data);
      if (!isVisible && data[id]) {
        data[id] = "";
      }
    });
    return data;
  }

  get item() {
    return this.$item ?? (this.$item = new Item(this.actualData || {}));
  }

  get itemNavInfo() {
    return { prev: null, next: null, ...this.initialElement?.$navInfo };
  }

  get itemTitle() {
    return this.initialElement?.title;
  }

  get touched() {
    return !!CHANGES[this.itemId];
  }

  submitData(data: Delta) {
    return !data
      ? null
      : {
        "...": new Promise((resolve) => {
          this.emit(`${this.upsertOperationId ?? 'db.upsert'}(data)`, {
            ...data,
            $callback: ({ error = null, lastUpdatedItemId = "", ...rest }) => {
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
              delete CHANGES[this.itemId];

              this.toast({
                message: "Updated successfully. ",
                timeout: 5000,
                link: `#/main?itemId=${lastUpdatedItemId}`,
              });
              resolve({ counter: NaN });
            },
          });
        }),
      };
  }

  setItemId = (id: string) => {
    this.itemId = id;
    this.$item = null;
  };

  setAll = (all: Hash<Hash>) => {
    this.all = all;
    this.$item = null;
  };

  // event handlers:
  onChange = (delta: Hash) => {
    this.$item = null;
    CHANGES[this.itemId] = { ...CHANGES[this.itemId], ...delta };
    return {
      counter: NaN,
    };
  };

  onSave() {
    return this.submitData(this.actualData);
  }

  onSaveField({ id, value }: Datum) {
    return this.submitData({
      _action: "setField",
      id: this.itemId,
      field: id,
      value,
    });
  }

  onDelete() {
    const { id } = this.initialElement?.id;
    if (!id) return null;

    return this.submitData({ id, status: "deleted" });
  }
}
