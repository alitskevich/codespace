export class Heartbeat {
  interval: any;
  watcher?: () => unknown;

  constructor(watcher?: () => unknown) {
    this.setWatcher(watcher);
  }

  setWatcher(watcher?: () => unknown) {
    this.watcher = watcher;
  }

  startWatch() {
    if (!this.interval) {
      this.interval = setInterval(() => {
        this.watcher?.();
      }, 1000);
    }
  }

  stopWatch() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = 0;
    }
  }

  setActive(active: boolean) {
    if (!active) {
      this.stopWatch();
    } else {
      this.startWatch();
    }
  }
}
