import { Component } from "arrmatura-web";
export class IndexedDbQuery extends Component {
  __created({ api, field }) {
    this.defineCalculatedProperty(
      `data`,
      (value, store) => api.query(store ?? "items", field, value) ?? null,
      [`value`, "store"]
    );
  }
}
