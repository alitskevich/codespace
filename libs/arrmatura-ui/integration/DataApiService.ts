import { Component } from "arrmatura";
import { PersistenceType } from "arrmatura-web/types";
import { Delta, Hash, Proc, StringHash, assert } from "ultimus";

import { IndexedDb } from "../idb/IndexedDb";
import { ClientStorage, loadJson } from "../support";

export class DataApiService extends Component {
  trigger: unknown;
  name = "items";
  version = 1;
  stores = {
    items: { keyPath: "id", indicies: { kind: {}, parent: {}, links: { multiEntry: true } } },
  };
  triggers: any = {};
  initialData?: any;
  indexedDb?: any;
  local?: ClientStorage;
  url = "/api";
  onUnauthorized?: (error: Error) => void;

  isSignUpAllowed = false;
  isSignOutAllowed = true;
  $info: unknown;
  afterSignedOut?: Proc;
  persistence: PersistenceType = "session";

  async __init() {
    // const threadUpId = setInterval(() => this.emit('this.upstream()', {}), 10000);
    // const threadDownId = setInterval(() => this.emit('this.downstream()', {}), 5 * 60000);

    // this.defer(() => {
    //   clearInterval(threadUpId)
    //   clearInterval(threadDownId)
    // })

    return this.downstream();
  }

  get storage() {
    return (
      this.local ??
      (this.local = new ClientStorage(this.persistence, this.url.replace(/\W+/g, "_")))
    );
  }

  get token(): any {
    return this.storage.get("$auth_token");
  }

  set token(token: any) {
    this.storage.set("$auth_token", token);
  }

  get isLoaded() {
    return this.storage.get(`isLoaded`) ?? false;
  }

  set isLoaded(s) {
    this.storage.set(`isLoaded`, !!s);
  }

  get since() {
    return Number(this.storage.get(`since`) ?? 0);
  }

  set since(s) {
    this.storage.set(`since`, s || 0);
  }

  downstream(opts?: any) {
    const data = { since: this.since, ...opts };
    return {
      busy: true,
      error: null,

      "...downstream": this.invokeApi({ body: { action: "realtime.downstream", data } })
        .then(async ({ data, since, next }) => {
          const triggers = { ...this.triggers };

          await Promise.all(
            data?.map(({ store = "items", ...rest }) => {
              triggers[store] = (triggers[store] ?? 0) + 1;
              return this.indexedDb?.put(rest, store);
            }) ?? []
          );

          if (next) {
            await this.downstream(next);
          }

          this.log(`downstream ${this.name}`, since);

          return { busy: false, triggers, isLoaded: true, isOutdated: false, since };
        })
        .catch((error) => {
          const message = String(error?.message || error || "unknown error");

          this.toast({ id: message, level: "error", message: `downstream: ${message}` });

          return { busy: false, isOutdated: true, error: message };
        }),
    };
  }

  invokeApi({
    body: { action = "realtime.downstream" },
  }: {
    body: {
      action:
        | "realtime.downstream"
        | "realtime.loadItem"
        | "realtime.upsertItem"
        | "realtime.upstream";
      data?: any;
    };
  }): Promise<any> {
    return Promise.resolve({
      ok: true,
      action,
      data: [],
      item: {},
    });
  }

  /**
   * API invocation with options.
   *
   * @param {type} data - description of parameter
   * @return {T} retrieved value object
   */
  invoke<T>(options) {
    const url = options.url ?? this.url;

    return loadJson<T>({
      url,
      ...options,
      headers: {
        Authorization: `Bearer ${this.token}`,
        // work-around for `script.google.com`
        "Content-Type": url.startsWith("https://script.google.com/macros/s/")
          ? "text/plain"
          : "application/json",
        ...options.headers,
      },
    }).catch((error: any) => {
      if (error?.code == 401 && this.onUnauthorized) {
        this.onUnauthorized?.(error);
      } else {
        throw error;
      }
    });
  }

  upstream() {
    return {
      isOutdated: true,
      busy: true,
      error: null,
      "...upstream": (async () => {
        try {
          const data = this.storage.get(`changeset`);

          if (!data || !Object.keys(data).length) return { busy: false, isOutdated: false };

          const upload = {};

          Object.values(data).forEach(({ store = "items", id, delta }: any) => {
            const coll = upload[store] ?? (upload[store] = {});
            coll[id] = { ...coll[id], ...delta };
          });

          const { ok } = await this.invokeApi({
            body: { action: "realtime.upstream", data: upload },
          });

          if (!ok) throw new Error(`upstream failed`);

          this.storage.transform(`changeset`, (root: any = {}) => {
            Object.keys(data).forEach((key) => {
              delete root[key];
            });
            return root;
          });

          this.log(`upstream ${this.name}`);

          return { busy: false, isOutdated: false };
        } catch (error) {
          const message = String((error as Error)?.message || error || "unknown error");
          this.toast({ id: message, level: "error", message: `upstream: ${message}` });
          return { busy: false, isOutdated: true, error: message };
        }
      })(),
    };
  }

  async upsertOptimistic(data: Delta) {
    const now = Date.now();

    const { id = `${now}`, store = "items", $callback, ...delta } = data;

    this.storage.transform(`changeset`, (root: any) => {
      return Object.assign(root ?? {}, { [Date.now()]: { id, store, delta } });
    });

    await this.indexedDb?.update({ ...delta, id, ts: now }, store);

    $callback?.({});

    setTimeout(() => this.emit("this.upstream()", {}), 5000);

    return {
      triggers: {
        ...this.triggers,
        [store]: (this.triggers[store] ?? 0) + 1,
      },
    };
  }

  upsertItem(data: Delta) {
    // const now = Date.now();
    const { store: store0 = "items", $callback, ...payload } = data;
    return {
      isOutdated: true,
      busy: true,
      hasUploaded: false,
      isUploading: true,
      uploadError: null,
      "...upsertItem": this.invokeApi({
        body: { action: "realtime.upsertItem", data: { ...payload } },
      })
        .then(async ({ item }) => {
          const { store = store0, ...payload } = item;
          this.log(`upsertItem ${this.name}`, item);
          await this.indexedDb?.put(payload, store);
          await $callback?.({ item });
          this.triggers[store] = (this.triggers[store] ?? 0) + 1;
          return { busy: false, isUploading: false, isOutdated: false, hasUploaded: true };
        })
        .catch(async (error) => {
          const message = String(error?.message || error || "unknown error");
          await $callback?.({ error });
          return { busy: false, isUploading: false, uploadError: message };
        }),
    };
  }

  loadItem(data: Delta) {
    // const now = Date.now();
    const { store: store = "items", $callback, ...payload } = data;
    return {
      isOutdated: true,
      busy: true,
      loadError: null,
      "...loadItem": this.invokeApi({
        body: { action: "realtime.loadItem", data: { ...payload, store } },
      })
        .then(async ({ item }) => {
          assert(item, `item not found: ${payload.id}`);

          await this.indexedDb.put(item, store);

          // this.log(`loadItem ${this.name}`, item);

          await $callback?.({ item });

          this.triggers[store] = (this.triggers[store] ?? 0) + 1;

          return { busy: false, isOutdated: false };
        })
        .catch(async (error) => {
          const message = String(error?.message || error || "unknown error");
          await $callback?.({ error });
          return { busy: false, loadError: message };
        }),
    };
  }

  loadUser() {
    return this.loadItem({ body: { action: "user.sync" } });
  }

  updateUser(data: Delta) {
    return this.upsertItem({ body: { action: "user.sync", data } });
  }

  get isAuthorized() {
    return !!this.token;
  }

  invalidateToken() {
    return this.signOut();
  }

  signIn(data: StringHash) {
    const { email, username = email, password } = data || {};
    const body = {
      action: "user.signin",
      creds: `${username}:${password}`,
      credentials: data,
      data,
    };

    return {
      busy: true,
      error: null,
      "...signIn": loadJson({ url: this.url, body })
        .catch((error) => ({ busy: false, error }))
        .then((result) => ({ busy: false, ...result })),
    };
  }

  signUp(data: Hash) {
    const body = { action: "user.signup", data };

    if (!this.isSignUpAllowed) return null;

    return {
      busy: true,
      error: null,
      "...signUp": loadJson({ url: this.url, body })
        .catch((error) => ({ busy: false, error }))
        .then((result) => ({ busy: false, ...result })),
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