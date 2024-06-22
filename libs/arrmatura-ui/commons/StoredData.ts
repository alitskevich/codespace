import { Component } from "arrmatura";
import { PersistenceType } from "arrmatura-web/types";
import type { Op } from "ultimus";

import { ClientStorage } from "../support";

export class StoredData extends Component {
  action?: Op;
  name = "";
  defaults = null;
  persistence: PersistenceType = "local";
  local?: ClientStorage;

  get storage() {
    return (
      this.local ?? (this.local = new ClientStorage(this.persistence, this.name ?? this.refId))
    );
  }

  get data(): any {
    return this.storage.get("data") ?? this.defaults;
  }

  set data(data) {
    if (this.opened) {
      this.storage.set("data", data);
    }
  }

  __() {
    this.action?.(this.data);
    this.opened = true;
    return null;
  }
}
