import { Component } from "arrmatura";

/**
 * SSE client.
 */
export class SSEventSource extends Component {
  url = "/sse";
  action?: (event: any) => void;

  __init() {
    let evtSource: EventSource | null = new EventSource(this.url, {
      withCredentials: false,
    });

    evtSource.onmessage = (event) => {
      console.log("EventSource message", event);
      this.action?.(event);
    };

    evtSource.onerror = (err) => {
      console.error("EventSource failed:", err);
    };

    const close = () => {
      evtSource?.close();
      evtSource = null;
    };

    this.defer(close);

    window.addEventListener("beforeunload", close);

    return null;
  }
}
