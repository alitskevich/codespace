import { Uid, Delta, Data, LogEntry, Hash, XmlNode } from "ultimus/types";

import { Arrmatron } from "./src/core/Arrmatron";

export type IComponent = {
  // optional Lifecycle method called during initialization.
  __init?: (c: IArrmatron) => Delta | null | undefined | unknown | void;
  // optional Lifecycle method called when the state changes.
  __stateChanged?: (changes: Map<string, unknown>) => void;
  // state key/values
  [key: string]: unknown;
};

export type TArrmatron = {
  platform: IPlatform;
  isDone: any;

  // state access
  get: (propId: string) => unknown;
  up: (d: Delta | null | void | unknown, force?: boolean) => void;

  touch: () => void;
  emit: (key: string, arg1: Delta) => void;
  defer: (fn: () => void) => void;

  readonly refId?: string;

  log: (val: unknown, ...arg1: unknown[]) => void;
  logError: (error: unknown, ...arg1: unknown[]) => void;
  toast(t: LogEntry): void;
};

export type IArrmatron = TArrmatron & {
  readonly uid: Uid;
  parent?: IArrmatron;
  children?: Map<Uid, Arrmatron>;
  scope?: IArrmatron;
  $component: IComponent;
  root: IArrmatron;

  getFromScope: (key: string) => unknown;
  // get registered arrmatron instance by reference. look up recurrsively from current to root scopes.
  getByRef: (refId: string) => IArrmatron | undefined;
};

export type IArrmatronRoot = IArrmatron & {
  // done life-cycle hook
  done: () => void;
};

export type IManifestNode = {
  connectors?: Map<string, (c: IArrmatron, x: unknown) => unknown>;
  refId?: string;
  readonly uid: Uid;
  getSubNodes(platform: IPlatform): Map<Uid, IManifestNode> | undefined;
  resolveProps: (c: IArrmatron) => Delta | Promise<unknown> | undefined;
  resolveInitialProps: (c: IArrmatron) => Hash;

  createArrmatron: (platform: IPlatform, parent?: Arrmatron, scope?: Arrmatron) => Arrmatron;
};

export type IPlatform = {
  log(arg0: LogEntry): void;
  toast(t: LogEntry, ctx: IArrmatron): void;
  getCompiledNodes(tag: string): Map<Uid, IManifestNode>;
  getCompiledNodes(tag: XmlNode): IManifestNode;
  getCompiledNodes(tag: XmlNode[]): Map<Uid, IManifestNode>;
  updateResources(delta: any): void;
  getResource(key: string | string[]): Data;
  getFunction(id: string): (...args: unknown[]) => unknown;
  redraw(source: IArrmatron, root: IArrmatron): void;
  createComponent(
    def: IComponentDescriptor | string,
    initials: Hash,
    ctx: TArrmatron
  ): IComponent | Hash;
};

export type ComponentConstructor = new (initials: Hash, c: TArrmatron) => IComponent;

export type IComponentDescriptor = {
  tag?: string;
  template?: string;
  Ctor?: ComponentConstructor;
  unknown?: boolean;
  native?: boolean;
};

export type EContent = Map<Uid, IManifestNode>;
