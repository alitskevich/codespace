export type PostMessage = {
  action: string;
  payload?: unknown;
  requestId?: unknown;
  error?: unknown;
};

export type Data = {
  [K: string]: unknown;
};

export type Hash<T> = { [key: string]: T };
