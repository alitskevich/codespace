import { Component } from "arrmatura";
import { PersistenceType } from "arrmatura-web/types";
import { Delta } from "ultimus";

import { ClientStorage } from "../support";

export class UserProfileService extends Component {
  url = "";
  persistence: PersistenceType = "session";
  local?: ClientStorage;
  ttl = 10 * 3600000;

  get storage() {
    return this.local ?? (this.local = new ClientStorage(this.persistence, "$user"));
  }

  set data(profile: unknown) {
    this.storage.set('data', profile);
  }

  get data(): Delta {
    return this.storage.get('data');
  }

  init() {

    const ts = this.storage.get("ts");
    const data = this.storage.get("profile");
    const stale = !data || (ts && Number(ts) + this.ttl <= Date.now());

    if (!stale) {
      return { isLoading: false, isFetching: false, error: null, data };
    }

    return this.data ? null : this.sync();
  }

  invokeApi(_data: any): Promise<any> {
    throw new Error("Method not implemented.");
  }

  sync(data?: Delta) {
    return {
      isLoading: true,
      error: null,
      "...": this.invokeApi({ body: { action: "user.sync", data } })
        .catch((error) => {
          const message = String(error?.message ?? error ?? "unknown");
          if (message !== "NOT_SIGNED") {
            this.toast({ id: message, level: "error", message: `${message}` });
          }
          return { isLoading: false, error };
        })
        .then(({ user, data = user }) => {
          this.log(`sync user`, data);
          if (data) {
            this.storage.set("profile", data);
            this.storage.set("ts", Date.now());
          }
          return { isLoading: false, data };
        }),
    };
  }

  save(delta: Delta) {
    return this.sync(delta);
  }

  toggleShowProfile() {
    return {
      showProfile: !this.showProfile,
    };
  }
}
