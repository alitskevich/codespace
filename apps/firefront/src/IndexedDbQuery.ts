import { Component } from "arrmatura-web";
export class IndexedDbQuery extends Component {
  trigger = 0;
  __created({ db, field, store }) {
    db.listenCollection(store ?? "items", () => {
      this.up({ trigger: (this.trigger ?? 0) + 1 });
    });
    this.defineCalculatedProperty(
      `data`,
      (value, store) => db.query(store ?? "items", field, value) ?? null,
      [`value`, "store", "trigger"]
    );
  }
}
