import { mapEntries, qname, scalarParse } from "ultimus";
const pairedTags = ["component", "div", "section", "svg"];

const PROP_TYPES = {
  INSTANCE_SWAP: "string",
  VARIANT: "string",
  TEXT: "string",
};

const ATOMARY_TAGS = ["Text", "Vector", "DynamicComponent"];

const COUNTERS = {};

const counterForKey = (sKey) => {
  if (sKey in COUNTERS) {
    COUNTERS[sKey]++;
    return COUNTERS[sKey];
  }
  COUNTERS[sKey] = 0;
  return "";
};

export const generateReactTsx = (body: any = [], componentClassName: string, metadata: any = {}) => {

  const { description } = metadata;
  const codeBlock: string[] = [];
  const styling = {};
  const imports = {};
  const props = metadata.properties ?? (metadata.properties = {});
  const cases = metadata.cases ?? (metadata.cases = {});
  const dependencies = metadata.dependencies ?? (metadata.dependencies = []);

  const registerProp2 = (x: string, opts = {}) => {
    const id = qname(x === "class" ? "className" : x);

    if (!props[id]) {
      props[id] = opts;
    }

    return id;
  };

  const registerImport = (id: string, from = "") => {
    if (!imports[id]) {
      imports[id] = from || `@/components/${id}`;
    }

    if (!from && !dependencies.includes(id)) {
      dependencies.push(id);
    }

    return id;
  };

  const resolveBoundPropName = (bindPropName: string) => {

    if (bindPropName.startsWith("R.")) {
      registerImport("T", "@/i18n");
      return `T("${bindPropName.slice(2)}")`;
    }
    registerProp2(bindPropName)
    return `${bindPropName}`;
  };

  const resolveClassAttributeValue = (value: string, key: string) => {
    // if (!value) return "";
    const qValue = value.replace("{class}", "");

    const sKey = key.replaceAll(/[;:-\d]+/g, "").replace(/^(\d)/, "C$1") || "S";

    const prevKey = sKey + (COUNTERS[sKey] ?? "");

    const qKey = styling[prevKey] === qValue ? prevKey : `${sKey}${counterForKey(sKey)}`;

    styling[qKey] = qValue;

    if (value.includes("{class}")) {
      registerProp2("className", { type: "string" });
      return `className={\`${qValue} \${className}\`}`;
      // return `className={\`\${C.$÷{qKey}} \${className}\`}`;
    }

    return `className={\`${qValue} ${qKey}\`}`;
    // return `className={\`${qValue} $\{C.${qKey}}\`}`;
  };

  const resolveAttributeValue = (val: string) => {
    if (typeof val === "string") {
      if (val.startsWith("{")) {
        return resolveBoundPropName(val.slice(1, -1));
      }

      if (val.includes("{")) {
        const substVar = (val: string) => {
          if (val.startsWith("{")) {
            return resolveBoundPropName(val.slice(1, -1));
          }
          return JSON.stringify(scalarParse(val));
        };

        const substExpr = (_: string, expr: string) => {
          return `\${${expr.replaceAll(/@?@?[\w.-]+/g, substVar)}}`;
        };

        return `\`${val.replaceAll(/{([^}]+)}/g, substExpr)}\``;
      }
    }

    return JSON.stringify(val);
  };

  const attributesToString = (attrs: any, sep = " ") => mapEntries(attrs, (key, value) => {
    if (key === "key" || key === 'styling') return ``;

    if (key === "class") return resolveClassAttributeValue(String(value || "none"), attrs.key)

    return `${key}={${resolveAttributeValue(value)}}`;
  }).join(sep);

  const outChildNodes = (output, nodes) => nodes?.forEach((child: any) => {
    output.push(nodeToJsx(child.getHtmlNode ? child.getHtmlNode() : child));
  });

  function nodeToJsx(inode: any) {
    let { tag = "View" } = inode;

    const { attrs = {}, nodes: xnodes } = inode;

    const nodes = xnodes ? (Array.isArray(xnodes) ? xnodes : [xnodes]) : null;

    const hasChildren = nodes?.length;

    const singleTag = !hasChildren && !pairedTags.includes(tag);

    const output: string[] = [];

    if ('If' in attrs) {
      const iff = String(attrs.If);
      delete attrs.If;
      const expr = iff === 'true' || iff === 'false' ? iff : resolveBoundPropName(iff.slice(1, -1));
      return ` <>{!(${expr}) ? null : ${nodeToJsx(inode)}}</>`;
    }

    if (tag[0] === tag[0].toUpperCase()) {
      if (tag === "Meta") {
        nodes
          ?.find((n) => n.tag == "Properties")
          ?.nodes?.filter((n) => n.tag == "Property")
          .forEach(({ attrs: { id, type, value } }) => {
            type = PROP_TYPES[type] ?? type?.toLowerCase() ?? "string";

            registerProp2(id, { type, value });
          });
        return "";

      } else if (tag === "Selector") {
        outChildNodes(output, nodes?.length === 1 ? nodes[0].nodes : nodes);
        return output.join("\n");

      } else if (tag === "Case") {
        const keys: any = {};
        const formula: string[] = [];
        let id = "Default";
        attrs.When
          ?.split(",")
          .map((k) => k.trim().split("="))
          .forEach(([key, val]) => {
            if (key === "key") {
              id = val;
            } else {
              keys[key] = val;
              registerProp2(key)
              formula.push(`${key} === ${JSON.stringify(scalarParse(val))} `);
            }
          });
        if (formula.length == 0) {
          // registerProp2('key')
          formula.push(`key === "${id}"`);
        }
        cases[id] = keys;
        output.push(` {
  !(${formula.join(" && ")}) ?null : `);
        outChildNodes(output, nodes);
        output.push(`
} `);
        return output.join("\n");
      } else if (ATOMARY_TAGS.includes(tag)) {
        output.push(`<${tag} ${attributesToString({ ...attrs }, `\n  `)} />`);
        registerImport(tag, "@/atoms");
        return output.join("\n");
      }
      registerImport(tag);

    } else {

      tag = "View";
      registerImport(tag, "@/atoms");
    }

    output.push(`<${tag} ${attributesToString({ ...attrs })}${singleTag ? " /" : ""}>`);

    if (hasChildren) {
      outChildNodes(output, nodes);
    }

    if (!singleTag) {
      output.push(`</${tag}>`);
    }

    return output.join("\n");
  }

  const jsx = body.map((n) => nodeToJsx(n)).join("\n  ");

  const propertyList = mapEntries(props, (id, p: any) =>
    p.ignore ? null : { id, ...p, jsType: PROP_TYPES[p.type] ?? p.type ?? "string" }
  ).filter(Boolean);

  const propType = `{\n${propertyList.map((p) => `  ${p.id}${p.required ? "" : "?"}: ${'any'};`).join("\n")}\n}`;//

  const propJsDoc = `${propertyList
    .map(
      (p) =>
        `@param {${p.jsType}} ${componentClassName}.${p.id} ${p.description ?? p.id} ${p.required ? "" : "(optional)"}`
    )
    .join("\n  * ")}`;

  const importedComponents = mapEntries(
    imports,
    (id, from) => `import ${id.startsWith("*") ? id : `{ ${id} }`} from "${from}";`
  ).join("\n");

  const propNames = propertyList
    .map(({ id, value, required }) =>
      required ? id : `${id} = ${value === undefined ? "undefined" : JSON.stringify(value)}`
    )
    .join(", ");

  const hasProps = !!propNames.length;

  const propsTypes = hasProps ? propType : "Record<string, never>";

  const output = `"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-constant-condition */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React, { FC } from "react";

${importedComponents}

// Component properties type
export type ${componentClassName}Props = ${propsTypes};

/**
 * ${componentClassName} UI Component.
 * ${description}
 * 
 * @param {${componentClassName}Props} ${componentClassName}Props - Component properties
 * ${propJsDoc}
 * @return {ReactElement} The rendered ${componentClassName} component.
 * 
 * @copyright ${metadata.copyright ?? '-'}.
 */
export const ${componentClassName}: FC<${componentClassName}Props> = (${propNames ? `{${propNames}}` : ""}) => {
  ${codeBlock.join(",  ")}
  return (
  <>
${jsx}
  </>
  );
}`;

  return output;
};
