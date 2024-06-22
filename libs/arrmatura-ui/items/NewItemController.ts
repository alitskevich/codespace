import { Component } from "arrmatura";
import { Hash } from "ultimus/types";

export class NewItemController extends Component {
  all?: Hash<Hash>;
  itemId = "";
  meta: any;
  data = {};
  initialData = {};

  __init() {
    return {
      showModal: false,
      data: {
        ...this.initialData,
      },
    };
  }

  submit() {
    return {
      busy: true,
      error: null,
      "...": new Promise((resolve) => {
        this.emit(`${this.upsertOperationId ?? "db.upsert"}()`, {
          ...this.data,
          $callback: ({ error = null, item }) => {
            console.log(error, item);
            if (error) {
              const msg = (error as Error)?.message;
              this.toast({
                id: msg,
                level: "error",
                message: `Error: ${msg}`,
              });
              resolve({ busy: false, error });
              return;
            }

            this.toast({
              message: `Added successfully. ${item.title ?? `#${item.id}`}`,
              timeout: 5000,
              link: `#/main?itemId=${item.id}`,
            });
            resolve({ busy: false, showModal: false });
          },
        });
      }),
    };
  }

  // event handlers:
  change(delta: Hash) {
    return {
      touched: true,
      data: { ...this.data, ...delta },
    };
  }
}
