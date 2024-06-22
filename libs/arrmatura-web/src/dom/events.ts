import { debounce } from "ultimus";
import type { Hash } from "ultimus/types";

import type { DomNode, IElement } from "../../types";
import { isEltEnabled } from "../utils/isEltEnabled";
import { setEventListener } from "../utils/setEventListener";

export const LISTENERS: Hash<($: IElement, e: DomNode, v: unknown) => void> = {
  click: ($, e) =>
    setEventListener($, "click", (domEvent: Event) => {
      setTimeout(async () => {
        if (isEltEnabled(e)) {
          await $.click?.(e.$dataset ?? {}, domEvent);
          $.afterClick?.(e.$dataset ?? {}, domEvent);
        }
      }, 10);
      domEvent.preventDefault();
      return false;
    }),
  clickCapture: ($, e) =>
    setEventListener(
      $,
      "clickCapture:click",
      (domEvent: Event) => {
        setTimeout(() => {
          if (isEltEnabled(e)) {
            $.clickCapture?.(e.$dataset ?? {}, domEvent);
          }
        }, 10);
        return false;
      },
      { capture: true }
    ),
  contentEditable: ($, e) => {
    e.contentEditable = "true";
    setEventListener(
      $,
      "contentEditable:input",
      debounce((domEvent: Event) => {
        $.contentEditable?.({ ...e.$dataset, domEvent, value: e.innerHTML, text: e.innerText });
        domEvent.preventDefault();
        return false;
      }, 330)
    );
  },
  toggleClass: ($, e) =>
    setEventListener(
      $,
      "toggleClass:click",
      () => {
        setTimeout(() => {
          if (isEltEnabled(e)) {
            $.toggleClass?.split(";").forEach((chunk = "") => {
              const [className, prep, toggleClassTarget = prep] = chunk.trim().split(" ");
              const target = toggleClassTarget ? document.getElementById(toggleClassTarget) : e;

              if (!target) {
                console.warn(`toggleClass: target element not found: ${toggleClassTarget}`);
              }

              target?.classList.toggle(className);
            });
          }
        }, 10);
        return false;
      },
      { capture: true }
    ),
  blur: ($, e) =>
    setEventListener($, "blur", (domEvent: Event) => {
      setTimeout(() => {
        if (e.contentEditable) {
          $.blur?.({ ...e.$dataset, value: e.innerText }, domEvent);
        } else {
          $.blur?.(e.$dataset ?? {}, domEvent);
        }
      }, 10);
      return false;
    }),
  focus: ($, e) =>
    setEventListener($, "focus", (domEvent: Event) => {
      $.focus?.(e.$dataset ?? {}, domEvent);
      return false;
    }),
  dblclick: ($, e) =>
    setEventListener($, "dblclick", (domEvent: Event) => {
      if (isEltEnabled(e)) {
        $.dblclick?.(e.$dataset ?? {}, domEvent);
      }
      return false;
    }),

  keypress: ($, e) =>
    setEventListener($, "keypress:keyup", (ev: KeyboardEvent) => {
      if (ev.keyCode !== 13 && ev.keyCode !== 27) {
        $.keypress?.({ value: e.value, ...e.$dataset }, ev);
        setTimeout(() => e.focus(), 0);
      }
      return false;
    }),
  enter: ($, e) =>
    setEventListener($, "enter:keyup", (ev: KeyboardEvent) => {
      if (ev.keyCode === 13) {
        $.enter?.({ value: e.value, ...e.$dataset }, ev);
      }
      if (ev.keyCode === 13 || ev.keyCode === 27) {
        e.blur();
      }
      return false;
    }),
  change: ($, e) =>
    setEventListener($, "change", (ev: Event) => {
      const input = e as unknown as HTMLInputElement;
      const value = input.type === "file" ? input.files : e.value;
      $.change?.({ value, ...e.$dataset }, ev);
      return false;
    }),
  toggle: ($, e) =>
    setEventListener($, "toggle:change", (ev: Event) => {
      $.toggle?.({ value: e.checked, ...e.$dataset }, ev);
      return false;
    }),
  scroll: ($, e) =>
    setEventListener($, "scroll", (ev) => {
      $.scroll?.(Object.assign(ev, { value: e.scrollTop }));
    }),
  scrolledDown: ($, element) =>
    setEventListener($, "scrolledDown:scroll", (ev) => {
      const gap = $.scrolledDownGap || 10;
      const offset = element.clientHeight + element.scrollTop;
      const isDown = Math.abs(element.scrollHeight - offset) < gap;
      if (isDown && offset > ($._maxScrolledDownOffset || 0)) {
        $._maxScrolledDownOffset = offset;
        $.scrolledDown?.({ offset }, ev);
      }
    }),
};
