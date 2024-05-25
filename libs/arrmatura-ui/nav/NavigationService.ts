import { Component } from "arrmatura";
import { urlParse, urlStringify, Url } from "ultimus";
export class NavigationService extends Component {
  prevHash = "";
  host: any;
  path: any;
  params: any;

  init() {
    const hashchange = () => {
      const hash = window.location.hash.slice(1);
      if (hash[0] === "/" && hash !== this.prevHash) {
        void this.emit('this.hash', hash as any);
        this.prevHash = hash;
      } else if (!this.prevHash) {
        void this.emit('this.hash', "/main" as any);
      }
    }

    window.addEventListener("hashchange", hashchange);
    this.defer(() => {
      window.removeEventListener("hashchange", hashchange);
    })

    setTimeout(hashchange, 0);

    return null;
  }

  parse(d: string | Partial<Url>) {
    const { host, path = ["*"], params = {} } = typeof d === "string" ? urlParse(`/${d}`) : d;
    const page = (!host || host === "*" ? this.host : host) || "main";
    const actualPath = (path[0] === "*" ? this.path : path) ?? [];

    return {
      host: page,
      page,
      subpage: actualPath[0] || null,
      path: actualPath,
      params: params.reset ? { ...params, reset: null } : { ...this.params, ...params },
    };
  }

  setHash(d: string | Partial<Url>) {
    const route = this.parse(d);
    const strRoute = urlStringify(route).slice(1);

    if (strRoute === this.prevHash) return;

    window.location.hash = this.prevHash = urlStringify(route).slice(1);

    void this.up({ ...route, route });
  }

  onParams(params: object) {
    this.setHash({ params: { ...params } });
  }

  setParam(expr) {
    const [key, value] = expr.split('=');
    const params = { ...this.params, [key]: value };
    this.onParams(params);
  }
  unsetParam(key) {
    const params = { ...this.params, [key]: null };
    this.onParams(params);
  }
}
