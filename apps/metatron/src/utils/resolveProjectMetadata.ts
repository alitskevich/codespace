import { normalizeInput, buildTree, ANode } from "figmatron";
import { Hash, StringHash, arrayGroupBy, arraySortBy, arrayToObject } from "ultimus";

import { fetchApiData } from "./fetchApiData";
import { loadFigmaFileSource } from "./loadFigmaFileSource";

export const resolveProjectMetadata = async (key: string, url: string) => {
  const { props, components, enums, consts, datasets, types, classes } = await fetchApiData(
    `project:${key}`,
    url
  );

  const propsHash = arrayGroupBy(
    props.map(({ prop, id: _, ...e }: Hash) => ({ ...e, id: prop })),
    "entity"
  );
  const data: any = {
    ...arrayToObject(consts, "id", "value"),
    components: [],
    types,
    classes,
    enums: arrayToObject(Object.values(arrayGroupBy(enums, "enumId")), "id", "items"),
    data: arrayToObject(Object.values(arrayGroupBy(datasets, "bundle")), "id", (e: any) => ({
      id: e.id,
      type: "data",
      data: e.items.map(({ key, json }: any) => ({ ...json, id: key })),
    })),
    templates: [],
  };

  const resolveItemTemplates = (item: any) => {
    const { id, body, props, description = "", preview } = item;

    let cbody = body.startsWith("<component")
      ? body
      : `
<component id="${id}">
${body}
</component>`;

    if (!cbody.includes("<Meta>")) {
      cbody = cbody.replace(
        "</component>",
        `
  <Meta>
    <Description>${description}</Description>
    <Properties>
      ${
        props
          ?.map(({ type, id }: Hash) => `<Property id="${id}" type="${type}" />`)
          .join("\n\t\t") ?? ""
      }
    </Properties>
  </Meta>
  </component>
    `
      );
    }

    data.templates.push(
      `
${cbody}
<component id="ItemPreview.${id}">
${preview ?? `<div class="p-4 relative">\n<${id} Props="@properties" />\n</div>`}
</component>
`
    );

    data.components.push(Object.assign(item, {}));
  };

  // const input = await loadFigmaFileSource('bXt9NPqRZ82YO4IUCIdrpO')//data.figmaFile); S1
  const input = await loadFigmaFileSource(data.figmaFile); //data.figmaFile); finance templates
  // const input = await loadFigmaFileSource('9cIvlac9wqgXDNewmxPh3X')//data.figmaFile); banking templates

  const { nodes } = normalizeInput(input);

  const root = buildTree({ nodes });

  // console.log(JSON.stringify(nodes, null, 2));

  arraySortBy<ANode>(root.nodes as any)
    .map((n) => ({
      ...n,
      body: n.toHtml(),
      id: n.componentName ?? n.name ?? n.tag,
      name: n.componentName ?? n.name ?? n.tag,
      group: n.name.split(/\W/)[0],
      node: nodes.find(({ id }) => id === n.id),
    }))
    .map(resolveItemTemplates);

  components
    .map((e: StringHash) => ({ ...e, props: propsHash[e.id]?.items }))
    .map(resolveItemTemplates);

  data.componentsTree = Object.values(arrayGroupBy(data.components, "type"));

  return data;
};
