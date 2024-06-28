import { Component } from "arrmatura";
import { Hash } from "ultimus/types";

import { IndexedDbService } from "../idb/IndexedDbService";

export class ItemController extends Component {
  data?: Hash | null;
  delta?: Hash | null;
  preflightItems?: any[];
  db?: IndexedDbService;
  $itemId = null;
  upsertItemKey = "db.upsertItem()";
  loadItemKey = "db.loadItem()";

  invokeLoad(id) {
    return new Promise((resolve) => {
      this.emit(this.loadItemKey, {
        id,
        $callback: ({ error = null, item, data = item }) => {
          // console.log(error, data);
          if (error) {
            const msg = (error as Error)?.message;
            this.toast({ id: msg, level: "error", message: `Error: ${msg}` });
          }
          resolve({ isLoading: false, data, error });
        },
      });
    });
  }

  getItemId() {
    return this.$itemId;
  }

  setItemId(id) {
    this.$itemId = id;
    this.up({
      // data: {},
      delta: {},
      isLoading: true,
      error: null,
      touched: false,
      "...preflight": (async () => {
        const result = (await this.db?.idb.queryForValue(id)) ?? null;
        return {
          data: result?.[0] ?? { id },
          "...load": this.invokeLoad(id),
        };
      })(),
    });
  }

  doReload() {
    this.up({
      isLoading: true,
      error: null,
      "...reload": this.invokeLoad(this.$itemId),
    });
  }

  // event handlers:
  onChange = (delta: Hash) => {
    return {
      touched: true,
      delta: { ...this.delta, ...delta },
      data: { ...this.data, ...delta },
    };
  };

  onSave(data = {}) {
    return {
      isLoading: true,
      error: null,
      "...save": new Promise((resolve) => {
        this.emit(this.upsertItemKey, {
          ...this.data,
          ...data,
          $callback: ({ error = null, item, data = item }) => {
            if (error) {
              const msg = (error as Error)?.message;
              this.toast({ id: msg, level: "error", message: `Error: ${msg}` });
              resolve({ isLoading: false, error });
              return null;
            }
            this.toast({
              message: "Updated successfully. ",
              timeout: 5000,
              link: `#/main?itemId=${data.id}`,
            });
            resolve({ isLoading: false, touched: false, data });
          },
        });
      }),
    };
  }
}
