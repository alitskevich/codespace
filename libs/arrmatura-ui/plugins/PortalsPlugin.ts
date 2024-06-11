import { Component } from "arrmatura/src/core/Component";

import type { DomNode, IElement, IWebPlatform } from "../../arrmatura-web/types";

const portal = ($: IElement, element: DomNode, portalId: unknown): void => {
  if ($.portal) return;

  const portals: any = $.platform.portals ?? ($.platform.portals = {});
  let portal = portals[`${portalId}`];
  if (!portal) {
    (portals[`${portalId}`] = document.createElement('div'));
    portal = portals[`${portalId}`];
    document.body.appendChild(portal);
  }

  $.attachToParent = () => {
    if (portal !== element.parentElement) {
      element.parentElement?.removeChild(element);
      portal.appendChild(element);
    }
  };
};

export class PortalsPlugin extends Component {

  constructor(ini, $ctx) {

    super(ini, $ctx);

    const platform: IWebPlatform = $ctx.platform;
    platform.addElementAttributeSetters({ portal })
  }
}