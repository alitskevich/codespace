import { Component } from "arrmatura";

import { ClientStorage } from "../support";

export class LocalStorage extends Component {
  storage = new ClientStorage("local");

  __getStateProperty(propName: string) {
    return this.storage.get(propName);
  }

  __stateChanged(changes: Map<string, any>) {
    changes.forEach((value, propName) => {
      this.storage.set(propName, value);
    });
  }
}
