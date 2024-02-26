import { Component } from "arrmatura";
import { ClientStorage, loadJson } from "../support";

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
    const stale = ts && Number(ts) + this.ttl > Date.now();

    if (stale) {
      this.platform.updateResources(this.storedResources);
      return {};
    }

    return this.reload()
  }

  reload() {
    const R = this.storedResources;
    return { isLoading: !R, isFetching: true, "...": this.fetch(R?.version) }
  }

  fetch(version = undefined) {
    return loadJson(this.url, { data: { version } })
      .then((res) => {
        this.storage.set("$ts", Date.now());
        const isSameVersion = version && res?.version && version == res?.version;
        if (!isSameVersion) {
          this.storage.set("$R", res);
          this.platform.updateResources(res);
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
