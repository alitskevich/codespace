import { Component } from "arrmatura";
import { PersistenceType } from "arrmatura-web/types";
import { Proc, StringHash, Hash } from "ultimus";

import { IndexedDb } from "../idb/impl/IndexedDb";
import { ClientStorage, loadJson } from "../support";
import { makeAsyncReturnState } from "../support/makeAsyncReturnState";

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
    const { email, username = email, password } = data || {};
    const body = { action: "user.signin", creds: `${username}:${password}`, credentials: data, data };

    return makeAsyncReturnState(() => loadJson({ url: this.url, body }), { targetProp: '...signIn' });
  }

  signUp(data: Hash) {
    const body = { action: "user.signup", data };

    if (!this.isSignUpAllowed) return null;

    return makeAsyncReturnState(() => loadJson({ url: this.url, body }), { targetProp: '...signUp' });
  }

  async signOut() {
    if (!this.isSignOutAllowed) return;

    await ClientStorage.clearAll();

    await IndexedDb.deleteAll();

    this.token = null;

    await this.afterSignedOut?.();
  }
}
