import { Component } from "arrmatura";
import type { Op } from "ultimus";

import { ClientStorage } from "../support";

export class StoredData extends Component {
  action?: Op;
  name = "";
  defaults = null;
  data: any = null;
  #opened = false;
  local?: ClientStorage;

  __created({ persistence, name = this.refId, defaults = null }) {
    const storage = new ClientStorage(persistence ?? "local", name);

    Object.defineProperty(this, "data", {
      get: () => {
        return storage.get("data") ?? defaults;
      },
      set: (value) => {
        if (!this.#opened) return;
        storage.set("data", value);
      },
    });
  }

  __getStateProperty(propName: string) {
    switch (propName) {
      case "name":
      case "action":
      case "defaults":
      case "persistence":
      case "data":
        return this[propName];
      default:
        return this.data?.[propName];
    }
  }

  __stateChanged(changes: Map<string, any>) {
    changes.forEach((value, propName) => {
      switch (propName) {
        case "persistence":
          this[propName] = value;
          return;

        case "action":
          this[propName] = value;
          return;
        case "defaults":
        case "data":
          this[propName] = value;
          return;
        default:
          this.data = { ...this.data, [propName]: value };
          return;
      }
    });
  }

  __init() {
    this.action?.(this.data);
    this.#opened = true;
    return null;
  }
}
