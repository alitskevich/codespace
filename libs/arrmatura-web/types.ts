import { IPlatform } from "arrmatura/types";

import { WebPlatform } from "./src/WebPlatform";

export type DomNode = HTMLElement & {
  disabled: boolean | null;
  selected: boolean | null;
  value: unknown;
  checked: boolean;
  contentEditable: string;
  focus: () => void;
  blur: () => void;
  $dataset: any;
  component?: IElement;
}

export type IElement = {
  init?: () => any;
  $listeners: any;
  $element: DomNode;
  [key: string]: any;
}
export type IWebPlatform = IPlatform & {
  addElementAttributeSetters(attrs: any): void;
  setElementAttribute(element: IElement, node: DomNode, key: string, value: any): void;
}
export type MyTouchEvent = TouchEvent & {
  layerX: number;
  layerY: number;
  pageX: number;
  pageY: number;
};

export type LaunchWebOptions = {
  template?: string;
  components?: any[];
  functions?: Record<string, (...args: any[]) => any>;
  resources?: any;
  Platform?: new <T extends WebPlatform>() => T;
  rootElement?: HTMLElement;
}

export type PersistenceType = "local" | "session" | "transient";
