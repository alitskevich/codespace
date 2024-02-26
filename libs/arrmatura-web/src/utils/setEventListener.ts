import type { IElement } from "../../types";

export function setEventListener($: IElement, key: string, value: (ev: any) => any, options?: object) {
  const listeners = $.$listeners ?? ($.$listeners = new Set());
  if (!listeners.has(key)) {
    listeners.add(key);
    const [akey, ekey = akey] = key.split(":");
    $.$element.addEventListener(ekey, value, options ?? false);
  }
}
