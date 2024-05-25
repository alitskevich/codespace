import { Hash, XmlNode } from "ultimus";

export function reactCodeGen(body: any, componentId: string) {
  if (!componentId) return null;

  const metadata = body.find((e: XmlNode) => e.tag === "Meta")?.nodes ?? [];

  body = body?.filter((e: XmlNode) => e.tag !== "Meta") ?? [];

  const description = metadata.find((e: XmlNode) => e.tag === "Description")?.text ?? "";

  const usageDescription = metadata.find((e: XmlNode) => e.tag === "UsageDescription")?.text ?? "";

  const props: Hash<any> = metadata.find((e: XmlNode) => e.tag === "Properties")?.nodes?.map((p: any) => p.attrs) ?? [];

  const adjustPropKey = (key: string) => (key === "class" ? "className" : key);

  const resolveAttr = (val: string, key: string) => {
    key = adjustPropKey(key);

    if (val.startsWith("@")) {
      // props.push({ id: key })
      return `${key}={${adjustPropKey(val.slice(1))}}`;
    }

    if (val.includes("{")) {
      const substFn = (_: string, key: string) => `\${${adjustPropKey(key)}}`;
      return `${key}={\`${val.replaceAll(/{@(\w+)}/g, substFn)}\`}`;
    }

    return `${key}="${val}"`;
  };

  const attributesToString = (v: any) => {
    if (!v) return "";

    return Object.entries(v)
      .map(([key, val]) => ` ${resolveAttr(val as any, key)}`)
      .join("");
  };

  const uikitTypes: Hash = {};

  function xmlStringify({ tag, attrs, nodes = [] }: Partial<XmlNode>, tab = "    ") {
    if (attrs?.text) {
      return `${tab}${String(attrs.text || "")}`;
    }

    if (tag && tag[0] === tag[0]?.toUpperCase()) {
      uikitTypes[tag] = 1;
    }
    const sattrs = attributesToString(attrs);

    const ssubs: any = nodes.map((c) => xmlStringify(c, `  ${tab}`)).join("\n");

    return `${tab}<${tag}${sattrs ?? ""}${!ssubs ? "/>" : `>\n${ssubs}\n${tab}</${tag}>`}`;
  }

  // const description = metadata.find((e: XmlNode) => e.tag === "Description")?.text;
  // https://www.figma.com/file/dF392jmezPb1yV0s1Gb4LN/test?type=design&node-id=0%3A1&mode=design&t=ONtGNDQLLHpiNTyM-1
  // const usageDescription = metadata.find((e: XmlNode) => e.tag === "UsageDescription")?.text ?? "";
  //  * ${ description }.
  //  *
  //  * Usage: ${ usageDescription }
  //   \`\`\`jsx
  //     ${story ?? `<${componentId} {...props} />`}
  //     \`\`\`

  const propClass = props.find((e: XmlNode) => e.id === "class");
  if (propClass) {
    propClass.id = "className";
  }

  const jsx = xmlStringify({ tag: "", nodes: body });

  const output = `"use client";

import { ${Object.keys(uikitTypes).join(", ")} } from "@/atoms";
import * as Types from "@/types";

type Props = {
${props
      .map((p: any) => `  ${p.id}${p.required ? "" : "?"}: Types.${p.type ?? "TEXT"}; // ${p.description ?? p.id}`)
      .join("\n")}
}

/**
 * ${componentId} Component.
 * ${description}
 * ${usageDescription}
 */
export function ${componentId}({${props.map((p: any) => `${p.id}`).join(", ")}}: Props) {
  return (
${jsx}
  );
}`;
  return output;
}
