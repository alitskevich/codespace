import { Component } from "arrmatura";
import { Delta } from "ultimus";
import { PersistenceType } from "arrmatura-web/types";
import { ClientStorage } from "../support";

export class UserProfileService extends Component {
  url = "";
  persistence: PersistenceType = "session";
  local?: ClientStorage;

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
    return this.data ? null : this.sync();
  }

  invokeApi(_data: any): Promise<any> {
    throw new Error("Method not implemented.");
  }

  sync(data?: Delta) {
    return {
      isLoading: true,
      error: null,
      "...": this.invokeApi({ action: "user.sync", data })
        .catch((error) => {
          const message = String(error?.message ?? error ?? "unknown");
          if (message !== "NOT_SIGNED") {
            this.toast({ id: message, level: "error", message: `${message}` });
          }
          return { isLoading: false, error };
        })
        .then(({ user, data = user }) => {
          this.log(`sync user`, data);
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
