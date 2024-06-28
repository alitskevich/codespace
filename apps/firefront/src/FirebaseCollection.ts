import { Component } from "arrmatura-web";
export class FirebaseCollection extends Component {
  __created({ api, field }) {
    this.defineCalculatedProperty(
      `data`,
      (value, store) => api.query(store, field, value) ?? null,
      [`value`, "store"]
    );
  }
}
