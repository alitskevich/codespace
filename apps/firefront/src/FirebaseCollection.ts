import { Component } from "arrmatura-web";
import { capitalize } from "ultimus";

import { FirebaseService } from "./FirebaseService";

export class FirebaseCollection extends Component {
  store = "items";

  api: FirebaseService;

  get trigger() {
    return this.api?.[`trigger${capitalize(this.store?.toLowerCase())}`];
  }

  constructor(ini, $) {
    super(ini, $);
    const { field } = this;
    this.api = ini.api;
    this.defineCalculatedProperty(
      `data`,
      (api, value, store) => api.query(store, field, value) ?? null,
      ["api", `value`, "store", "trigger"]
    );
  }
}
