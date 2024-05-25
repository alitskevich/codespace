import { Component } from "arrmatura";


export class PostMessageSender extends Component {
  targetId = "iframe";
  eventType = "main";

  get targetWindow() {
    if (this.targetId === "parent") {
      return window.parent;
    }
    const iframe = window.document.getElementById(this.targetId) as unknown as {
      contentWindow: any;
    };
    return iframe?.contentWindow;
  }

  post() {
    this.targetWindow?.postMessage(JSON.stringify({ type: this.eventType, data: this.data }), "*");
  }

  setOn(val: unknown) {
    this.on = val;
    this.post();
  }

  setData(data: unknown) {
    this.data = data;
    this.post();
  }
}
