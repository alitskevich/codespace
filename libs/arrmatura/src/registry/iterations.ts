import type { EContent, IManifestNode, IPlatform } from "arrmatura/types";
import { mapEntries } from "ultimus";
import type { Datum, Delta, Hash, Uid, XmlNode } from "ultimus/types";

import { Arrmatron } from "../core/Arrmatron";
import { ManifestNode } from "../core/ManifestNode";
import { compilePlaceholder } from "../utils/compileExpression";


const narrowData = (data: any) => {
  if (!data) {
    return [];
  }
  if (Array.isArray(data)) return data;
  if (typeof data[Symbol.iterator] === 'function') return [...data];
  if (typeof data === "string") return data.split(',').map(id => ({ id, name: id }));
  if (typeof data === "object") return mapEntries(data, (key, value) => ({ ...value, id: key }));
  return [{ id: String(data), name: String(data) }];
}

class Iterative extends Arrmatron<CForNode> {
  pkHash: Hash<Datum> = {};

  get displayName(): string {
    return "🔹each";
  }

  get contentManifests() {
    const each: any = narrowData(this.$component.each);
    const itemNode = this.manifest.getItemCtxNode(this.platform);
    const nodes: Map<Uid, IManifestNode> = new Map();
    this.pkHash = {};
    if (each?.length) {
      if (!each.forEach) {
         
        throw new Error(`[each] Items has no forEach() ${each.toString()}`);
      }
      each.forEach((_datum: Datum, index: number) => {
        const datum = typeof _datum === "string" ? { id: _datum } : _datum;
        let id = datum.id;

        if (id == null) {
          this.logError("ERROR: empty item id: ", datum);
          id = String(index);
        }

        const pk = String(id);
        if (this.pkHash[pk]) {
          this.logError(`ERROR: duplicate item id : ${pk} (skipped)`, datum);
          return;
        }

        this.pkHash[pk] = datum;

        const inode = itemNode
          .cloneWithDatum(datum, this.platform)
          .addPropertyResolver(() => this.pkHash[pk], itemNode.itemName);

        nodes.set(inode.uid, inode);
      });
    }
    return nodes;
  }
}

export class CForNode extends ManifestNode {
  #itemNode?: CItemNode;
  #itemName: string;
  #xmlNode: XmlNode;
  constructor(xmlNode: XmlNode, [itemName, prep, expr = prep]: string[]) {
    super(xmlNode.id);

    this.#xmlNode = xmlNode;

    this.#itemName = itemName.startsWith("@") ? itemName.slice(1) : itemName;

    if (expr[0] === "<" && expr[1] === "-") {
      this.addConnector(expr.slice(2), "each");
    } else {
      this.addPropertyResolver(compilePlaceholder(expr), "each");
    }
  }

  getItemCtxNode(platform: IPlatform) {
    return (
      this.#itemNode ?? (this.#itemNode = new CItemNode(this.#xmlNode.id, this.#itemName, platform.getCompiledNodes([this.#xmlNode])))
    );
  }

  get EntitronConstructor() {
    return Iterative;
  }
}

class IterativeItem extends Arrmatron<CItemNode> {
  get recontentScope(): Arrmatron {
    return this;
  }

  get displayName(): string {
    return "🔹ui:for:item";
  }

  emit(key: string, data: Delta) {
    return this.scope.emit(key, data);
  }

  get(propId: string) {
    const iName: string = this.manifest.itemName;
    const value = propId.startsWith(`${iName}.`) || propId === iName ? super.get(propId) : this.scope.get(propId);
    // this.log(propId, value);
    return value;
  }
}

class CItemNode extends ManifestNode {
  itemName: string;
  constructor(id: string, itemName: string, content?: EContent) {
    super(id);
    this.itemName = itemName;
    this.$content = content;
  }

  cloneWithDatum(datum: Datum, platform: IPlatform) {
    const uid = `${String(this.uid)}#${datum.id}`;
    const c = new CItemNode(uid, this.itemName, this.getSubNodes(platform));
    c.uid = uid;
    return c;
  }

  get EntitronConstructor() {
    return IterativeItem;
  }
}
