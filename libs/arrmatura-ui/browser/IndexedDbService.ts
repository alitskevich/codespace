import { Component } from "arrmatura";
import { ClientStorage } from "../support";
import { IndexedDb } from "../support/IndexedDb";
import { Delta, capitalize } from "ultimus";

export class IndexedDbService extends Component {
  trigger: unknown;
  name = "idb";
  collections = {};
  counters: any = {};
  db = new IndexedDb()
  local?: ClientStorage;

  async init() {
    await IndexedDb.forcePersistMode()

    await this.db.open(this.name, { initialData: this.initialData as any, collections: { ...this.collections, upstream: 'id' } });

    // const threadUpId = setInterval(() => this.emit('this.upstream()', {}), 10000);
    // const threadDownId = setInterval(() => this.emit('this.downstream()', {}), 5 * 60000);

    // this.defer(() => {
    //   clearInterval(threadUpId)
    //   clearInterval(threadDownId)
    // })

    Object.keys(this.collections).forEach((key) => {
      Object.defineProperty(this, `counter${capitalize(key.toLowerCase())}`, {
        get(): string {
          return this.counters[key] ?? 0
        }
      })
      this.defineCalculatedProperty(`data${capitalize(key.toLowerCase())}`, () => this.db.getAll(key), [`counter${capitalize(key.toLowerCase())}`])
    });

    return this.downstream();
  }
  get storage() {
    return this.local ?? (this.local = new ClientStorage("local", `IndexedDbService:${this.name}`));
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

  invokeApi({ action = 'realtime.downstream', since = 0, data }: { action: 'realtime.downstream' | 'realtime.upsert' | 'realtime.upstream', since?: number, data?: any }): Promise<any> {
    return Promise.resolve({
      ok: true,
      action,
      since,
      data,
      item: data
    });
  }

  upstream(opts?: any) {
    return {
      ...opts,
      busy: true,
      error: null,
      "...upstream": this.db.getAll('upstream')
        .then(async (data) => {
          return data?.length ? this.invokeApi({ action: 'realtime.upstream', data }) : { ok: false }
        })
        .then(async ({ ok }) => {
          if (ok) {
            await this.db.clear('upstream')
          }
          this.log(`upstream ${this.name}`);
          return { busy: false, isOutdated: false };
        })
        .catch((error) => {
          const message = String(error?.message || error || "unknown error");
          this.toast({ id: message, level: "error", message: `upstream: ${message}`, });
          return { busy: false, isOutdated: true, error: message };
        }),
    };
  }
  downstream(opts?: any) {
    return {
      ...opts,
      busy: true,
      error: null,
      "...downstream": this.invokeApi({ action: 'realtime.downstream', since: this.since })
        .then(async ({ data, since }) => {
          await Promise.all(data?.map(({ $collection = "items", ...rest }) => {
            this.counters[$collection] = (this.counters[$collection] ?? 0) + 1
            return this.db.put(rest, $collection)
          }) ?? []);

          return {
            since
          }
        })
        .then(({ since }) => {
          this.log(`downstream ${this.name}`, since);
          return { busy: false, isLoaded: true, isOutdated: false, since };
        })
        .catch((error) => {
          const message = String(error?.message || error || "unknown error");
          this.toast({ id: message, level: "error", message: `downstream: ${message}`, });
          return { busy: false, isOutdated: true, error: message };
        }),
    };
  }
  async upsertOptimistic(data: Delta) {
    const now = Date.now();
    const { id = `${now}`, $collection = "items", $callback, ...payload } = data;
    const item = { ...payload, id, updatedAt: now };
    await this.db.put({ ...payload, id, $collection, updatedAt: now }, 'upstream')
    await this.db.update(item, $collection);
    this.counters[$collection] = (this.counters[$collection] ?? 0) + 1
    $callback?.({})
    return this.upstream({
      isOutdated: true
    });
  }

  upsert(data: Delta) {
    // const now = Date.now();
    const { $collection: collection = "items", $callback, ...payload } = data
    return {
      isOutdated: true,
      busy: true,
      hasUploaded: false,
      isUploading: true,
      uploadError: null,
      "...upsert": this.invokeApi({ action: 'realtime.upsert', data: { ...payload, $collection: collection } })
        .then(async ({ item }) => {
          const { $collection = collection, ...payload } = item
          await this.db.put(payload, $collection)
          this.log(`upsert ${this.name}`, item);
          await $callback?.({ item })
          this.counters[collection] = (this.counters[collection] ?? 0) + 1
          return { busy: false, isUploading: false, isOutdated: false, hasUploaded: true };
        })
        .catch(async (error) => {
          const message = String(error?.message || error || "unknown error");
          await $callback?.({ error })
          return { busy: false, isUploading: false, uploadError: message };
        }),
    };
  }
}
