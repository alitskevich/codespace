import { Component } from "arrmatura";

export class LocationHashService extends Component {
  data: any;

  init() {
    const hashchange = () => {
      const data = window.location.hash.slice(1);
      this.up({ data });
    };
    window.addEventListener("hashchange", hashchange);
    setTimeout(hashchange, 0);
    this.defer(() => {
      window.removeEventListener("hashchange", hashchange);
    });
    if (this.default && !window.location.hash.slice(1)) {
      window.location.hash = `#${this.default}`;
    }
    return null;
  }

  onData(data: any) {
    window.location.hash = `#${data}`;
  }
}
