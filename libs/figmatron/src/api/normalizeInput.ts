import { Hash, arrayToObject, mapEntries, strJoin } from "ultimus";

import { FNode, NormalizedNode } from "../../types";
import { adoptProperties, getBounds, getSize, guardValuable, toComponentName, toPropertyName } from "../utils";
import { NodeTree } from "../utils/NodeTree";
import { appendProperties } from "../utils/appendProperties";
import { dehydrateObject } from "../utils/dehydrateObject";

import { OUTER_LAYOUT_DEFAULTS, STYLE_DEFAULTS, stylify } from "./stylify";


/**
 * Normalizes the raw input data from Figma REST API v.1.
 *
 * @param {any} input - The input data to be normalized.
 * @return {any} The normalized output data.
 */
export function normalizeInput(input: any = {}, opts: any = {}) {
  if (input.nodes) {
    return Object.values(input.nodes ?? {}).reduce((r, node) => {
      return normalizeInput(node);
    }, []);
  }

  const { components, componentSets, document, styles, ...metaInfo } = input;
  const tree = new NodeTree();

  const decomposeNode = (node: FNode, parent: FNode) => {
    node.id = node.id.startsWith("0:") ? node.id.slice(2) : node.id;

    const { id, type, children } = node;
    const parentId = parent.id;

    if (type === "COMPONENT_SET") {
      // local only, so will be added from its first variant instance, just like as remote

    } else if (node.name.startsWith("ignore-")) {
      // ignore

    } else if (type === "COMPONENT" || type === "INSTANCE" || node.name.startsWith("component-")) {
      const { componentId = id } = node;

      const meta = components[componentId] ?? { id, name: node.name.slice("component-".length) };

      let componentSetId = meta.componentSetId;
      if (!componentSetId) {
        // consider as a variant of a fake component for sake of brevity
        componentSetId = meta.componentSetId = `S:${componentId}`;
        componentSets[componentSetId] = { ...meta };
      }

      const { componentPropertyReferences, componentProperties = node.componentPropertyDefinitions } = node;
      const properties = adoptProperties({ ...componentProperties }, components);

      const compSetMeta = componentSets[componentSetId];
      const componentSetName = toComponentName(compSetMeta.name); //componentSetId

      if (componentPropertyReferences?.mainComponent) {
        // this is a reference to another component made from a parent property
        tree.addUsageChild(parentId, { ...node, id: `D${id}` }, "DynamicComponent", {
          ...arrayToObject(properties, 'id', 'value'),
          As: `{${toPropertyName(componentPropertyReferences?.mainComponent)}}`,
        });
        return;
      }

      // create component set for first time
      const compSet =
        tree.all.get(componentSetName) ??
        tree.addTop({
          ...node,
          id: componentSetName,
          type: "COMPONENT_SET",
          name: `${compSetMeta.name}`,
          properties: [],
          componentName: componentSetName,
          variants: {},
        });

      // create component variant for first time
      const when = strJoin(",", ...properties.filter(p => p.type === 'VARIANT').map(({ id, value }) => `${id}=${value}`));

      if (!compSet.variants[when]) {
        compSet.variants[when] = 1;
        const vnode = { ...node, id, properties, type: "VARIANT" };
        tree.addChild(componentSetName, vnode);
        appendProperties(compSet, properties);
        children?.forEach((v) => decomposeNode(v, node));
      }

      // add usage of this component in place
      tree.addUsageChild(parentId, node, componentSetName, arrayToObject(properties, 'id', 'value'));

    } else if (type === "VECTOR") {
      tree.addVector(parentId, node, components[node.componentId]);

    } else if (type === "TEXT") {
      const charRef = node.componentPropertyReferences?.["characters"];
      const text = charRef ? `{${toPropertyName(charRef)}}` : node.characters;
      node.content = text;
      node.size = {}
      tree.addChild(parentId, node);

    } else if (type === "GROUP") {
      tree.addChild(parentId, node);
      node.clipsContent = true;
      children?.forEach((v) => decomposeNode(v, node));

    } else {
      tree.addChild(parentId, node);
      children?.forEach((v) => decomposeNode(v, node));
    }
  };

  // traverse and decompose all the tree
  const isPageNode = opts.isPageNode ?? ((node: any, parent) => parent.type === "SECTION");
  const scanForPages = (nodes: any[], parent) => {
    nodes?.forEach((node) => {
      if (isPageNode(node, parent)) {
        const { id, name, children, absoluteBoundingBox } = node;
        const componentName = `${toComponentName(name)}`;
        tree.addTop({ id, name, type: "PAGE", componentName, absoluteBoundingBox, });
        children?.forEach((v) => decomposeNode(v, node));
      } else {
        scanForPages(node.children, node)
      }
    })
  }
  scanForPages(document?.children, document);

  // apply normalization transformations
  const normNodes: Hash<NormalizedNode> = {};
  tree.all.forEach((node: any) => {
    const { id, type, tag, attrs, content, properties, name, parentId, componentName, origin } = node;

    const bounds = parentId ? getBounds(node) : getSize(origin ?? node);

    const styling = {
      bounds: mapEntries(bounds, (k, v) => `${k}-${v ?? 0}`).join('-'),
      ...(origin ? null : guardValuable(stylify(node, STYLE_DEFAULTS))),
      ...stylify(origin ?? node, OUTER_LAYOUT_DEFAULTS),
    };

    normNodes[id] = dehydrateObject({ id, type, name, tag, attrs, properties, content, componentName, styling, bounds, });
  });

  // re-union all
  tree.all.forEach((node: any) => {
    const { id } = node;
    const nodes = tree.allChildren.get(id)?.map((id) => normNodes[id]);
    if (nodes) {
      Object.assign(normNodes[id], { nodes });
    }
  });

  // select components (from top)
  const nodes = tree.top.map((id) => normNodes[id]);

  const output = { nodes, styles, meta: metaInfo };

  return output;
}