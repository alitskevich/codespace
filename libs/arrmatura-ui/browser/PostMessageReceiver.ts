import { Component } from "arrmatura";
import { IArrmatron } from "arrmatura/types";

export class PostMessageReceiver extends Component {
  eventType = "main";
  eventOrigin = "";

  onMessage = (_data: unknown) => {
    // no-op
  };

  init(_: IArrmatron) {
    const handler = (event) => {
      if (this.eventOrigin && event.origin !== this.eventOrigin) return;

      const { type, data } = JSON.parse(event.data);
      if (type === this.eventType) {
        this.log("onMessage:", type, data);
        this.onMessage(data);
      }
    }
    window.addEventListener("message", handler, false);

    this.defer(() => {
      window.removeEventListener("message", handler, false);
    })

    return null;
  }
}