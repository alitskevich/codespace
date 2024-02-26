import { Proc, StringHash, Hash } from "ultimus";
import { Component } from "arrmatura";
import { ClientStorage, loadJson } from "../support";
import { PersistenceType } from "arrmatura-web/types";
import { IndexedDb } from "../support/IndexedDb";

export class AuthService extends Component {
  url = "";
  isSignUpAllowed = false;
  isSignOutAllowed = true;
  $info: unknown;
  afterSignedOut?: Proc;
  persistence: PersistenceType = "session";
  local?: ClientStorage;

  get storage() {
    return this.local ?? (this.local = new ClientStorage(this.persistence, this.url.replace(/\W+/g, "_")));
  }

  get token(): any {
    return this.storage.get("$auth_token");
  }

  set token(token: any) {
    this.storage.set("$auth_token", token);
  }

  get isAuthorized() {
    return !!this.token;
  }

  invalidateToken() {
    return this.signOut();
  }

  signIn(data: StringHash) {
    const { username, password } = data || {};
    return {
      busy: true,
      "...": loadJson(this.url, { action: "signin", creds: `${username}:${password}`, credentials: data, data })
        .catch((error: Error) => {
          this.toast({ id: 'error:sign-in', level: "error", message: `Unable to sign in: ${error.message}` });
          return { error };
        })
        .then((info) => ({ busy: false, ...info })),
    };
  }

  signUp(data: Hash) {
    return !this.isSignUpAllowed ? null : {
      busy: true,
      "...": loadJson(this.url, { action: "signup", data })
        .catch((error: Error) => {
          this.toast({ id: 'error:sign-up', level: "error", message: `Unable to sign up: ${error.message}` });
          return null;
        })
        .then((info) => ({ busy: false, ...info })),
    };
  }

  async signOut() {
    if (!this.isSignOutAllowed) return;

    await ClientStorage.clearAll();

    await IndexedDb.deleteAll();

    this.token = null;

    await this.afterSignedOut?.();
  }
}
