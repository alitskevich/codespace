import { Component } from "arrmatura";
import { LogEntry, Datum } from "ultimus";

import { Heartbeat } from "../support/heartbeat";

export class ToastService extends Component {
  items: LogEntry[] = [];

  heartbeat = new Heartbeat(() => {
    void this.emit("this.tick(data)", {});
  });

  setItems(items: LogEntry[]) {
    this.heartbeat.setActive(!!items.length);
    this.items = items;
  }

  send(data: LogEntry) {
    const { items } = this;
    const now = Date.now();
    const id = String(data.id ?? now);
    const close = () => this.emit("this.close(data)", { id });
    const toast = {
      ...data,
      message: data.message || String(data),
      level: data?.message?.startsWith("error") || data instanceof Error ? "error" : data.level,
      id,
      close,
      ttl: now + (data.timeout ?? 6000),
    };
    const prev = items.find((e) => e.id === id);
    if (prev) {
      toast.counter = 1 + (prev.counter ?? 1);
    }
    return {
      items: [toast, ...items.filter((e) => e.id !== id)],
    };
  }

  tick(_: unknown) {
    const now = Date.now();
    return {
      items: this.items.filter((e: LogEntry) => (e.ttl ?? 0) > now),
    };
  }

  close({ id }: Datum) {
    return {
      items: this.items.filter((e) => e.id !== id),
    };
  }
}
