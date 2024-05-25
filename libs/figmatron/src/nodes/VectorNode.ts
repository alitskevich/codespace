import { ANode } from "./ANode";
export class VectorNode extends ANode {
  getHtmlNode() {
    const { id, name, componentName, styling, bounds = {} } = this;
    const { w = 8, h = 8 } = bounds;
    const htmlNode = {
      name,
      tag: "component",
      attrs: { id: componentName },
      nodes: {
        name,
        tag: "svg",
        styling,
        attrs: {
          key: id,
          width: `${w}`,
          height: `${h}`,
          class: `{@class}`,
          viewBox: `0 0 ${w} ${h}`,
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
        },
        nodes: styling?.strokeGeometry?.map(({ path, ...attrs }: any) => {
          return {
            tag: "path",
            attrs: {
              stroke: "#8EDFEB",
              ...attrs,
              d: path,
            },
          };
        })

      },
    };

    return htmlNode;
  }
}
