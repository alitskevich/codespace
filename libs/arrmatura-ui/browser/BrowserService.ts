import { Component } from "arrmatura";
import { copyToClipboard } from "../support";

/**
 * Common browser API.
 */
export class BrowserService extends Component {
  get title() {
    return window.document.title;
  }

  set title(title: any) {
    window.document.title = `${title}`;
  }

  get location() {
    return window.location
  }

  get hash() {
    return window.location.hash
  }

  set hash(hash: any) {
    window.location.hash = `${hash}`;
  }

  reload() {
    window.location.reload();
  }

  copyToClipboard(data: any) {
    copyToClipboard(data, (t) => this.toast(t));
  }

}
