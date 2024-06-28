import { Component } from "arrmatura-web";
import { capitalize } from "ultimus";

import { FirebaseService } from "./FirebaseService";

export class FirebaseCollection extends Component {
  store = "items";

  api?: FirebaseService;

  get trigger() {
    return this.api?.[`trigger${capitalize(this.store?.toLowerCase())}`];
  }

  __init() {
    const { index } = this;
    this.defineCalculatedProperty(
      `data`,
      (api, value, store) => api?.queryForValue(store, index, value) ?? null,
      ["api", `value`, "store", "trigger"]
    );
  }
}
