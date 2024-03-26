import { capitalize, identity } from "ultimus";
import { stringify } from "../utils/stringify";
import type { Delta, Fn, Hash, LogEntry, Proc, Uid } from "ultimus/types";
import type { IArrmatron, IManifestNode, IComponent, IPlatform } from "arrmatura/types";
import { objectFingerprint } from "../utils/objectFingerprint";

/**
 * The Arrmatron is the essential concept of the framework.
 * It creates a component instance, manages its state and keeps in touch with others.
 */
export class Arrmatron<T extends IManifestNode = IManifestNode> implements IArrmatron {
  readonly $component: IComponent;
  $children?: Map<Uid, Arrmatron>;
  readonly root: IArrmatron;
  readonly scope: Arrmatron;
  isDone = false;
  #isInited = false;
  #fprints: Hash = {};
  #initialState: Hash = {};
  #listeners?: Set<(c: Arrmatron) => void>;
  #defered?: Array<(c: IArrmatron) => void> = [];
  #weak?: Map<string, number>;
  #refs?: Hash<IArrmatron>;
  #propFnMap?: Map<string, Proc>;

  constructor(readonly platform: IPlatform, protected readonly manifest: T, private _parent?: Arrmatron, scope?: Arrmatron) {
    this.scope = scope ?? this;
    this.root = scope?.root ?? this;
    this.#initialState = this.manifest.resolveInitialProps(this);
    this.$component = this.createComponent(this.#initialState);

    if (this.refId) {
      this.scope.addReference(this.refId, this);
    }
  }

  get parent(): IArrmatron | undefined {
    return this._parent;
  }

  get uid(): string {
    return this.manifest.uid;
  }

  get displayName(): string {
    return "🔹";
  }

  createComponent(initials: Hash): IComponent {
    // by default, a component is just a plain object.
    return { ...initials };
  }

  // --- State

  // updates component state
  up(delta?: Delta | Promise<any> | null | void | unknown, force = false): void {
    if (!delta || this.isDone) {
      return;
    }

    if (delta instanceof Promise) {
      const racer = this.raceCondition(`set`);
      delta.then((val) => racer(() => this.up(val)));
      return;
    }

    const changes = new Map<string, unknown>();
    Object.entries(delta).forEach(([k, v]) => {
      if (v instanceof Promise) {
        const isSpreading = !k || k.startsWith("...");
        const racer = this.raceCondition(`set:${k}`);
        void v.then((val) => racer(() => this.up(isSpreading ? val : { [k]: val })));

      } else if (k && typeof v !== "undefined") {
        if (k[0] === "$") {
          if (this.$component[k] !== v) {
            changes.set(k.slice(1), v);
          }
        } else {

          const fprint = objectFingerprint(v);
          if (!(k in this.#fprints) || fprint !== this.#fprints[k]) {
            this.#fprints[k] = fprint;
            changes.set(k, v);
          }
        }
      }
    });

    if (changes.size || force) {
      this.stateChanged(changes);
    }
  }

  private stateChanged(changes: Map<string, unknown>) {
    const impl = this.$component;

    if (impl.stateChanged) {
      impl.stateChanged(changes);
    } else {
      changes.forEach((v, k) => {
        const setter = impl[`set${capitalize(k)}`];
        if (typeof setter === "function") {
          setter.call(this.$component, v);
        } else if (impl.__setProperty) {
          (impl.__setProperty as (p: string, val: any) => unknown)(k, v);
        } else {
          impl[k] = v;
        }
      });
    }
    this.touch();
  }

  // do recontent and notify all
  touch() {
    this.recontent();
    this.notify();
  }

  /**
   * Retrieves the component value associated with the given property ID.
   * Dot-sepated pathes to properties are supported.
   * Supported getters like `get<Name>()`.
   * use '@' prefix to access platform resources.
   * Functional values are bounded and cached.
   *
   * @param {string} propId - The ID of the property. 
   * @return {unknown} The value associated with the property ID.
   */
  get(propId: string): unknown {
    const map = this.#propFnMap ?? (this.#propFnMap = new Map());
    if (map.has(propId)) {
      return map.get(propId)();
    }

    let fn: Fn | null = null;
    const impl = this.$component;
    const instant = impl[propId];
    if (instant && typeof instant === "function") {
      const bound = instant.bind(impl);
      fn = () => bound;
    } else if (impl.__getProperty) {
      fn = () => (impl.__getProperty as (p: string) => unknown)(propId);
    } else {
      const [pk, ...path] = propId.split(".");
      if (pk[0] === "@") {
        path.unshift(pk.slice(1));
        const val = this.platform.getResource(path) ?? null;
        fn = () => val;
      } else {
        const gettr = impl[`get${capitalize(pk)}`];
        const fn0 = typeof gettr === "function" ? () => gettr.call(impl) ?? null : () => impl[pk] ?? null;

        fn = !path.length ? fn0 : () => path.reduce((r, p) => r?.[p] ?? null, fn0());
      }
    }

    map.set(propId, fn);

    return fn();
  }

  getFromScope(propId: string): unknown {
    return this.scope.get(propId);
  }

  // --- Left Arrow.

  notify() {
    this.#listeners?.forEach((fn) => fn(this));
  }

  // add listener to componet state changes
  subscribe(handler: (src: Arrmatron) => any): Proc {
    const listeners = this.#listeners ?? (this.#listeners = new Set());
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }

  // --- Right Arrow.

  // emits action event to this component
  emit(key: string, data: Delta): void {
    try {
      if (key.endsWith(")")) {
        const [refId, target] = key.split("(")[0].split(".");
        const ref = this.getByRef(refId);
        if (!ref) {
          throw new Error(`No such reference: ${refId}`);
        }

        const impl = ref.$component;

        const method = impl[target];
        if (!(typeof method === "function")) {
          throw new Error(`Not a method: ${refId}.${target}()`);
        }

        const result = method.call(impl, data);

        this.log(`-> ${refId}.${target}(data)`, result, data, impl);

        ref.up(result);
      } else {
        const [refId, target] = key.split("@");

        const ref = this.getByRef(refId && refId !== "..." ? refId : 'this');
        if (!ref) {
          throw new Error(`No such reference: ${refId}`);
        }

        ref.up(!target || target === "..." ? data : { [target]: data });

        this.log(`-> ${refId}@${target ?? ''} = `, data);
      }

    } catch (ex) {
      this.logError(`emit ${key}:`, ex);
    }
    return;
  }
  // --- life-cycle.

  // Done  hook.
  done() {
    if (this.isDone) {
      return;
    }
    this.isDone = true;

    this.$component.done?.(this);

    this.children?.forEach((c) => c.done());

    this.#defered?.forEach((f) => f(this));
    this.#defered = undefined;

    this._parent?.children?.delete(this.uid);
    this._parent = undefined;
  }

  // register callback to be called on done
  defer(fn: (c: IArrmatron) => void) {
    if (fn && typeof fn === "function") {
      (this.#defered ?? (this.#defered = [])).push(fn);
    }
  }

  private settleAsChild() {
    if (!this.#isInited) {
      this.#isInited = true;

      this.initConnectors();

      this.up(this.#initialState, true);

      this.up(this.$component.init?.(this));
    } else {
      void this.up(this.manifest.resolveProps(this), true);
    }
  }

  // --- Content.

  // map of children contexts
  get children(): Map<Uid, IArrmatron> | undefined {
    return this.$children;
  }

  // map of chidren of its node
  get contentManifests() {
    return this.manifest.getSubNodes(this.platform);
  }

  // actual scope for re-content
  get recontentScope() {
    return this.scope;
  }

  // perform children instantiation and updates
  private recontent() {
    const nodes = this.contentManifests;

    this.platform.redraw(this, this.root);

    this.children?.forEach((e, uid) => {
      if (!nodes?.get(uid)) {
        e.done();
      }
    });

    const children = new Map<Uid, Arrmatron>();

    nodes?.forEach((node: IManifestNode, uid: Uid) => {
      const e = this.$children?.get(uid) ?? node.createArrmatron(this.platform, this, this.recontentScope);
      children.set(e.uid, e);
    });

    this.$children = children;

    for (const ch of children.values()) {
      ch.settleAsChild();
    }
  }

  // --- Referencing.

  get refId() {
    return this.manifest.refId;
  }

  // gets any context instance in current or upper scope by key
  getByRef(refId: string): IArrmatron | undefined {
    if (!refId) return undefined;

    if (refId === "this") {
      return this;
    }
    const local = this.#refs?.[refId];
    if (local) {
      return local;
    }
    return this.parent?.getByRef(refId);
  }

  private addReference(refId: string, c: IArrmatron) {
    (this.#refs ?? (this.#refs = {}))[refId] = c;
  }

  // --- Connectors -------------------------

  private initConnectors() {
    if (this.manifest.connectors) {
      for (const [key, pipes] of this.manifest.connectors.entries()) {
        const [srcIds, targetPropName] = key.split("|");
        const [refId, sourcePropName] = srcIds.split("@");

        const ref = this.parent?.getByRef(refId) as Arrmatron;
        if (!ref) {
          this.logError(`Connect: No such ref: ${refId}`);
          continue;
        }

        if (!sourcePropName) {
          this.logError(`Connect: No prop specified: ${key}`);
          continue;
        }

        const applicator = targetPropName ? (rr: any) => ({ [targetPropName]: rr }) : identity;

        this.defer((() => {
          let popre;
          return ref.subscribe(async (source: Arrmatron) => {
            try {
              const val = await source.get(sourcePropName);
              const fingerprint = objectFingerprint(val);

              if (popre !== undefined && popre === fingerprint) return;

              popre = fingerprint;
              const r = applicator(pipes(this, val));
              this.up(r as Delta);
            } catch (ex) {
              source.logError("Notify ", ex);
            }
          })
        })()
        );

        // hot subscription
        Object.assign(this.#initialState, applicator(pipes(ref, ref.get(sourcePropName))));
      }
    }
  }

  // --- Routines -------------------------

  raceCondition(key: string) {
    const COUNTERS = this.#weak ?? (this.#weak = new Map<string, number>());
    let counter = 1 + (COUNTERS.get(key) ?? 0);
    COUNTERS.set(key, counter);
    return (fn: () => unknown) => {
      if (counter === COUNTERS.get(key)) {
        counter = 0;
        return fn();
      }
    };
  }

  log(val: any, ...args: unknown[]) {
    this.platform.log({
      level: "log",
      source: `${this.displayName}:${this.uid}`,
      message: val,
      params: args,
    });
    return val;
  }

  logError(error: any, ...args: unknown[]) {
    this.platform.log({
      level: "error",
      source: `${this.displayName}:${this.uid}`,
      error,
      message: `${String(error.message || error)}\n${this.toString().slice(0, 120)}`,
      params: args,
    });
  }

  toast = (t: LogEntry) => {
    this.platform.toast(t, this);
  }

  toString(): string {
    return stringify(this);
  }
}
