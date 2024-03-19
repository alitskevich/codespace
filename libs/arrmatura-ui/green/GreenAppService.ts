import { Component } from "arrmatura";
import { ClientStorage, loadJson } from "../support";
import { arrayGroupBy, arraySortBy, arrayToObject } from "ultimus";
import { IndexedDb } from "../support/IndexedDb";

const resourceBundlesAdapter = (data) => Object.values(arrayGroupBy(data, ({ id }) => id.split('.')[0]))
  .reduce((acc, { id, items }) => {
    acc[id] = arraySortBy(items.map((e: any) => ({ ...e, id: e.id?.split('.')[1] })), e => e.position ?? e.name ?? e.id);
    return acc
  }, {});

export class GreenAppService extends Component {
  url = "";
  name = "meta";
  version = "";
  collections = {
    config: 'id',
    enums: 'id',
    strings: 'id',
    structs: 'id',
    forms: 'id',
    components: 'id',
    mocks: 'id',
  };
  isLoading = true;
  ttl = 10 * 3600000;
  local?: ClientStorage;
  db = new IndexedDb()

  get storage() {
    return this.local ?? (this.local = new ClientStorage("local", this.name));
  }

  async getStoredData() {
    const all = await Promise.all(Object.keys(this.collections).map(async (key) => {
      const items = await this.db.getAll(key);
      return { id: key, items }
    }));
    return arrayToObject(all, 'id', 'items')
  }

  async storeData(data: any) {
    return Promise.all(Object.keys(this.collections).map(async (coll) => {
      return this.db.bulkUpdate(data[coll], coll);
    }));
  }

  async reload() {
    const version = this.storage.get("version");
    return { isLoading: true, isFetching: true, error: null, "...": this.fetch(version) }
  }

  async updateResources() {
    const { config, forms, structs, enums, strings, styles, mocks, ...res } = await this.getStoredData();
    res.strings = arrayToObject(strings, 'id', 'value');
    res.styles = arrayToObject(styles, 'id', 'value');
    res.enums = resourceBundlesAdapter(enums);
    res.forms = resourceBundlesAdapter(forms);
    res.structs = resourceBundlesAdapter(structs);
    res.mocks = resourceBundlesAdapter(mocks);

    const delta = { ...arrayToObject(config, 'id', 'value'), ...res };
    this.platform.updateResources(delta);

    return { isLoading: false, isFetching: false }
  }

  fetch(version = undefined) {
    return loadJson(this.url, { data: { version } })
      .then(async (res) => {
        const { version: newVersion = null } = res
        const isSameVersion = version && newVersion && version == newVersion;
        if (!isSameVersion) {
          this.storage.set("version", newVersion);
          await this.storeData(res);
        }
        this.storage.set("ts", Date.now());
        await this.updateResources();
        return { isOutdated: version && !isSameVersion, error: null };
      })
      .catch((error) => {
        return { error, isOutdated: true };
      })
      .then((res) => {
        return { ...res, isLoading: false, isFetching: false, };
      })
  }
  initMetatronChannel() {
    const handler = (event) => {
      if (this.eventOrigin && event.origin !== this.eventOrigin) return;

      const { type, data } = JSON.parse(event.data);
      if (type === this.eventType) {
        this.log("onMessage:", type, data);
      }
    }

    window.addEventListener("message", handler, false);
    this.defer(() => {
      window.removeEventListener("message", handler, false);
    });

  }

  async init() {
    await IndexedDb.forcePersistMode()

    await this.db.open(this.name, { initialData: {}, collections: { ...this.collections, upstream: 'id' } });

    const ts = this.storage.get("ts");
    const version = this.storage.get("version");
    const stale = !version || (ts && Number(ts) + this.ttl <= Date.now());

    this.initMetatronChannel();

    if (!stale) {
      return { isLoading: true, isFetching: true, error: null, "...": this.updateResources() };
    }

    return this.reload()
  }
}
