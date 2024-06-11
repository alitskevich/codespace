import { Component } from "arrmatura/src/core/Component";

import { isEltEnabled } from "../../arrmatura-web/src/utils/isEltEnabled";
import { setEventListener } from "../../arrmatura-web/src/utils/setEventListener";
import type { IWebPlatform, MyTouchEvent } from "../../arrmatura-web/types";

export class TouchPlugin extends Component {

  constructor(ini, $ctx) {

    super(ini, $ctx);

    const platform: IWebPlatform = $ctx.platform;

    platform.addElementAttributeSetters({
      mousedown: ($, e) =>
        setEventListener($, "mousedown", (ev: Event) => {
          $.mousedown?.({ ...e.$dataset }, ev);
          return false;
        }),
      mouseup: ($, e) =>
        setEventListener($, "mouseup", (ev: Event) => {
          $.mouseup?.({ ...e.$dataset }, ev);
          return false;
        }),
      mouseover: ($, e) => {
        setEventListener($, "mouseover", (domEvent: Event) => {
          if (isEltEnabled(e)) {
            $.mouseover?.(e.$dataset ?? {}, domEvent);
          }
          return false;
        })
      },
      mouseout: ($, e) => {
        setEventListener($, "mouseout", (domEvent: Event) => {
          if (isEltEnabled(e)) {
            $.mouseout?.(e.$dataset ?? {}, domEvent);
          }
          return false;
        })
      },
      touch: function ($, e) {
        const data: any = {};

        const h = (stop = false) => {
          return (ev: MyTouchEvent) => {
            const xx = ev.pageX || ev.changedTouches?.[0]?.screenX || 0;
            const yy = ev.pageY || ev.changedTouches?.[0]?.screenY || 0;
            const dx = data.xx ? data.xx - (data.x || 0) : 0;
            const dy = data.yy ? data.yy - (data.y || 0) : 0;

            $.touch?.(Object.assign(data, {
              ...ev,
              ...e.$dataset,
              active: !stop,
              xx,
              yy,
              dx,
              dy,
            }));
            return false;
          };
        };
        setEventListener($, "touch:touchstart", h());
        setEventListener($, "touch:mousedown", h());
        setEventListener($, "touch:touchcancel", h(true));
        setEventListener($, "touch:touchend", h(true));
        setEventListener($, "touch:mouseup", h(true));
        setEventListener($, "touch:touchmove", h());
        setEventListener($, "touch:mousemove", h());
      }
    })
  }
}