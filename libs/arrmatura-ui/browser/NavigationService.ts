import { urlParse, urlStringify, Url } from "ultimus";
import { Component } from "arrmatura";
export class NavigationService extends Component {
  prevHash = "";
  host: any;
  path: any;
  params: any;

  init() {
    window.addEventListener("hashchange", () => this.hashchange());
    setTimeout(() => this.hashchange(), 0);
    return null;
  }

  hashchange() {
    const hash = window.location.hash.slice(1);
    if (hash[0] === "/" && hash !== this.prevHash) {
      void this.emit('@hash', hash);
      this.prevHash = hash;
    } else if (!this.prevHash) {
      void this.emit('@hash', "/main");
    }
  }

  done() {
    window.removeEventListener("hashchange", this.hashchange);
  }

  setTitle(d: string) {
    window.document.title = d;
  }

  setPage(value: string) {
    this.setHash(`/${value}`);
  }

  setOnBodyScroll(d: any) {
    window.document.body.addEventListener("scroll", d, false);
  }

  parse(d: string | Partial<Url>) {
    const { host, path = ["*"], params = {} } = typeof d === "string" ? urlParse(`/${d}`) : d;
    const page = (!host || host === "*" ? this.host : host) || "main";
    return {
      host: page,
      page,
      path: path[0] === "*" ? this.path : path,
      params: params.reset ? { ...params, reset: null } : { ...this.params, ...params },
    };
  }

  setHash(d: string | Partial<Url>) {
    const route = this.parse(d);
    const strRoute = urlStringify(route).slice(1)
    if (strRoute === this.prevHash) return;
    window.location.hash = this.prevHash = urlStringify(route).slice(1);
    void this.up({ ...route, route });
  }

  reload() {
    window.location.reload();
  }

  onScript({ src = "", type = "module" }) {
    document.body.appendChild(Object.assign(document.createElement("script"), { type, src }));
  }

  // onFetch ({type ='json', ...options}) {
  //   return fetch(options)
  //   .then((res) => res[type]?.())
  // }

  onHash({ value = "" }) {
    this.setHash(`/${value}`);
  }

  onParams(params: object) {
    this.setHash({ params: { ...params } });
  }
}
