import { capitalize } from "ultimus";

import type { IComponent } from "../../types";

export function applyStateChangedToImpl(changes: Map<string, unknown>, impl: IComponent) {
  if (impl.__stateChanged) {
    impl.__stateChanged(changes);
  } else {
    changes.forEach((v, k) => {
      const setter = impl[`set${capitalize(k)}`];
      if (typeof setter === "function") {
        setter.call(impl, v);
      } else {
        impl[k] = v;
      }
    });
  }
}
