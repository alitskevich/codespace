import { Component } from "arrmatura";
import { ClientStorage, loadJson } from "../support";
import { arrayGroupBy, arrayToObject } from "ultimus";

const resourceBundlesAdapter = (data) => Object.values(arrayGroupBy(data, ({ id }) => id.split('.')[0]))
  .reduce((acc, { id, items }) => {
    acc[id] = items.map((e: any) => ({ ...e, id: e.id?.split('.')[1] }));
    return acc
  }, {});

export class GreenAppService extends Component {
  url = "";
  version = "";
  ttl = 10 * 3600000;
  local?: ClientStorage;

  get storage() {
    return this.local ?? (this.local = new ClientStorage("local", this.url.replace(/\W+/g, "_")));
  }

  get storedResources() {
    return this.storage.get("$R");
  }

  init() {
    const ts = this.storage.get("$ts");
    const stale = ts && Number(ts) + this.ttl <= Date.now();

    if (!stale) {
      this.updateResources();
      return {};
    }

    return this.reload()
  }

  reload() {
    const R = this.storedResources;
    return { isLoading: true, isFetching: true, error: null, "...": this.fetch(R?.version) }
  }

  updateResources() {
    const { config, forms, structs, enums, strings, styles, mocks, ...res } = this.storedResources ?? {};
    res.strings = arrayToObject(strings, 'id', 'value');
    res.styles = arrayToObject(styles, 'id', 'value');
    res.enums = resourceBundlesAdapter(enums);
    res.forms = resourceBundlesAdapter(forms);
    res.structs = resourceBundlesAdapter(structs);
    res.mocks = resourceBundlesAdapter(mocks);

    this.platform.updateResources({ ...config, ...res });
  }

  fetch(version = undefined) {
    return loadJson(this.url, { data: { version } })
      .then((res) => {
        this.storage.set("$ts", Date.now());
        const isSameVersion = version && res?.version && version == res?.version;
        if (!isSameVersion) {
          this.storage.set("$R", res);
          this.updateResources();
        }
        return { isOutdated: version && !isSameVersion, error: null };
      })
      .catch((error) => {
        return { error, isOutdated: true };
      })
      .then((res) => {
        return { ...res, isLoading: false, isFetching: false, };
      })
  }
}
