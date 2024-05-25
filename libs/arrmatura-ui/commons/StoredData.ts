import { Component } from "arrmatura";
import { PersistenceType } from "arrmatura-web/types";
import type { Op } from "ultimus";

import { ClientStorage } from "../support";

export class StoredData extends Component {
  action?: Op;
  name = "";
  persistence: PersistenceType = "local";
  local?: ClientStorage;

  get storage() {
    return this.local ?? (this.local = new ClientStorage(this.persistence, this.name));
  }

  get data(): any {
    return this.storage.get(this.name) ?? this.defaults ?? null;
  }

  set data(data) {
    if (this.opened) {
      this.storage.set(this.name, data);
    }
  }

  init() {
    this.action?.(this.data);
    this.opened = true;
    return null;
  }
}
