export type Uid = string;
export type Guid = string;

export type ExpressionText = string;

export type Scalar = string | number | boolean | undefined  ;
export type Dateable = string | number | Date | { toDate: () => Date } | { getTime: () => number };

export type Hash<T = any> = Record<string, T>;
export type StringHash = Record<string, string>;
export type ScalarHash = Record<string, Scalar>;
export type Value = Scalar | Scalar[] | unknown;
export type Data = Record<string, Value | Value[]>;
export type Datum = {
  [key: string]: unknown;
  id: string;
}
export type Delta = Hash;
export type Obj = Record<string, unknown>;
export type Bundle = Hash<Hash<string> | string>;

export type Proc = () => void;
export type Op<X = unknown, Y = unknown> = (x: X) => Y;
export type Fn = (...args: any[]) => any;
export type Predicat<T = unknown> = (e: T) => boolean;
export type Constructor = new (...args: unknown[]) => unknown;

export type UrlParams = Hash;

export type Url = {
  protocol?: string;
  host: string;
  path: string[];
  params: UrlParams;
  hash?: string;
}

export type XmlNode = {
  text?: string;
  tag: string;
  ns?: string;
  id: string;
  attrs?: Hash<Scalar | null>;
  nodes?: XmlNode[];
}

export type Tag = {
  id: string;
  name: string;
  count: number;
  selected: boolean;
  nonSelectable?: boolean;
  [K: string]: any;
}

export type LogEntryLevel = "log" | "error" | "warning" | "info" | "";

export type LogEntry = {
  level?: LogEntryLevel;
  message: string;
  link?: string;
  id?: string;
  ttl?: number;
  timeout?: number;
  counter?: number;
  source?: string;
  error?: Error;
  params?: unknown[];
}
