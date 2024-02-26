import type { Delta } from "ultimus";
import { ClientStorage } from "../support";
import { Component } from "arrmatura";
import { PersistenceType } from "arrmatura-web/types";

export class DbCollection extends Component {
  name = "items";
  persistence: PersistenceType = "transient";
  local?: ClientStorage;

  get storage() {
    return this.local ?? (this.local = new ClientStorage(this.persistence, `DbCollection:${this.name}`));
  }

  get data() {
    const data = this.storage.get('data') || null;
    const upstream = this.storage.get('upstream') || null;

    return { ...data, ...upstream }
  }

  set data(data) {
    this.storage.set('data', data || null);
  }

  get since() {
    return Number(this.storage.get(`since`) ?? 0);
  }

  set since(s) {
    this.storage.set(`since`, s || 0);
  }

  get upstream() {
    return this.storage.get(`upstream`)
  }

  set upstream(s: any) {
    this.storage.set(`upstream`, s || null);
  }

  init() {
    return this.sync();
  }

  invokeApi(_data: any): Promise<any> {
    throw new Error("Method not implemented.");
  }

  sync() {
    return {
      busy: true,
      error: null,
      "...": this.invokeApi({ action: 'sync', collection: this.name, since: this.since, data: this.upstream })
        .then(({ data = {}, reset, timestamp }) => {
          this.log(`sync ${this.name}`, timestamp, data);
          return { upstream: null, data: !reset ? { ...this.data, ...data } : data, busy: false, isLoaded: true, isOutdated: false, since: timestamp };
        })
        .catch((error) => {
          const message = String(error?.message || error || "unknown");
          this.toast({ id: message, level: "error", message: `Ошибка: ${message}`, });
          return { busy: false, isOutdated: true, error: message };
        }),
    };
  }

  batchUpsert(data: Delta) {
    this.storage.transform(`upstream`, (prev: any) => ({ ...prev ?? {}, ...data }));

    return this.sync();
  }
  addNewItem(data: Delta) {
    const id = `${this.name}-${Date.now()}`
    this.storage.transform(`upstream`, (prev: any) => ({ ...prev ?? {}, [id]: data }));

    return this.sync();
  }
}
