import { Component } from "arrmatura";
import { IArrmatron } from "arrmatura/types";
import { Hash } from "ultimus";

import { ClientStorage } from "../support";

export class StoredValue extends Component {

  constructor(initials: Hash, $ctx: IArrmatron) {
    super({}, $ctx);

    const { persistence = "local", name = $ctx.refId, defaultValue = null } = initials;

    const storage = new ClientStorage(persistence, name);

    Object.defineProperty(this, "value", {
      get() {
        return storage.get("value") ?? defaultValue;
      },
      set(value) {
        storage.set("value", value);
      },
    })
  }
}
