import { ANode } from "./ANode";

export class ComponentSetNode extends ANode {
  evaluateLayout() {
    this.nodes?.forEach((node) => {
      node.evaluateLayout();
    });
  }

  getHtmlNode() {
    const { id, componentName, name, properties = [], nodes } = this;

    const selectorProps = properties.filter(({ type }) => type === "VARIANT");

    const selectorWhenExpr = selectorProps
      ?.map(({ id, defaultValue }) => `${id}={${id} ?? '${defaultValue ?? "Default"}'}`)
      .join(",");

    const metaNode: any = {
      tag: "Meta",
      attrs: { id },
      nodes: {
        tag: "Properties",
        nodes: properties.map(({ preferredValues: _, ...attrs }) => {
          return { tag: "Property", attrs };
        }),
      },
    };

    const htmlNode = {
      name,
      tag: "component",
      attrs: { id: componentName },
      nodes: [metaNode].concat(
        (nodes?.length ?? 0) > 1
          ? {
            tag: "Selector",
            attrs: { On: selectorWhenExpr },
            nodes: nodes?.map((n: any) => Object.assign(n, { selectorProps })),
          }
          : nodes?.map((n: any) => n.innerNode())
      ),
    };

    return htmlNode;
  }
}
