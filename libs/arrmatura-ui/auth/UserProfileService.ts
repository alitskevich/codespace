import { Component } from "arrmatura";
import { PersistenceType } from "arrmatura-web/types";
import { Delta } from "ultimus";

import { ClientStorage } from "../support";

export class UserProfileService extends Component {
  url = "";
  api: any;
  persistence: PersistenceType = "session";
  local?: ClientStorage;
  ttl = 10 * 3600000;

  get storage() {
    return this.local ?? (this.local = new ClientStorage(this.persistence, "$user"));
  }

  set data(data: unknown) {
    this.log(`set user data`, data);
    if (data) {
      this.storage.set("data", data);
      this.storage.set("ts", Date.now());
    }
  }

  get data(): Delta {
    return this.storage.get("data");
  }

  __init() {
    const ts = this.storage.get("ts");
    const stale = !this.data || (ts && Number(ts) + this.ttl <= Date.now());

    if (!stale) {
      return { isLoading: false, isFetching: false, error: null };
    }

    return this.data ? null : this.sync();
  }

  sync() {
    return this.api.loadUser
      ? {
          isLoading: true,
          error: null,
          "...": this.api
            .loadUser()
            .catch((error) => {
              const message = String(error?.message ?? error ?? "unknown");
              if (message !== "NOT_SIGNED") {
                this.toast({ id: message, level: "error", message: `${message}` });
              }
              return { isLoading: false, error };
            })
            .then(({ user, data = user }) => {
              return { isLoading: false, data };
            }),
        }
      : null;
  }

  save(data: Delta) {
    return this.api.updateUser
      ? {
          isLoading: true,
          error: null,
          "...": this.api
            .updateUser(data)
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
        }
      : null;
  }
}
