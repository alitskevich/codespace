import { isValuable, mapEntries, properCase, qname, round } from "ultimus";
export * from "./pixels";
export const slug = (s) =>
  String(s)
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .toLowerCase();

export const px2tw = (px = 0) => Math.round(px) / 4;

export const prefx = (p, l) => (l ? `${p}-${l}` : "");

export const classJoin = (...args) => args.filter(Boolean).join(" ");

export const guardValuable = (x) => (isValuable(x) ? x : undefined);

export const fnApplicator = (fx, info) => info.filter(Boolean).map((inf) => fx(...inf));

// effects
export const findTypedEffect = (effects, type) => effects?.find((d) => d.type === type && d.visible !== false);

export const toPropertyName = (ref) => {
  const prev = ref.split("#")[0] ?? "";
  return qname(prev).replace(/^(\d)/, "C$1");
};

export const toComponentName = (...args: string[]) =>
  args
    .filter(Boolean)
    .map((s) => properCase(String(s).replace(/[^a-zA-Z0-9]+/g, "-").replace(/^(\d)/, "C$1"), '-'))
    .join(".");

export const toReactComponentClassName = (componentName) => properCase(componentName.replaceAll(/\W+/g, "-"), "-");

export const adoptProperties = (componentProperties, components) =>
  mapEntries(componentProperties, (id, { type, value, ...prop }) => {
    const val = (type === 'INSTANCE_SWAP') ? toComponentName(components[value]?.name ?? value) : value

    return {
      id: toPropertyName(id),
      type,
      value: val,
      ...prop,
    }
  });

export const getBounds = (node) => {
  const [r0, r1] = node.relativeTransform ?? [[], []];
  const { x: w, y: h } = node.size ?? {};
  const bounds = {
    x: r0?.[2] ? round(r0[2]) : undefined,
    y: r1?.[2] ? round(r1[2]) : undefined,
    w: w ? round(w) : undefined,
    h: h ? round(h) : undefined,
  };

  return Object.values(bounds).find((v) => v != null) == null ? undefined : bounds;
};
export const getSize = (node) => {
  const { x: w, y: h } = node.size ?? {};
  const bounds = {
    w: w ? round(w) : undefined,
    h: h ? round(h) : undefined,
  };

  return Object.values(bounds).find((v) => v != null) == null ? undefined : bounds;
};

// export const getBounds2 = (absoluteBoundingBox, offset) => {
//   const { x: x0 = 0, y: y0 = 0 } = offset ?? {};
//   const { x, y, width: w, height: h } = absoluteBoundingBox ?? {};
//   const bounds = {
//     x: x ? round(x - x0) : undefined,
//     y: y ? round(y - y0) : undefined,
//     w: w ? round(w) : undefined,
//     h: h ? round(h) : undefined,
//   };

//   return Object.values(bounds).find((v) => v != null) == null ? undefined : bounds;
// };

export const getBoundsDelta = (absoluteBoundingBox, absoluteRenderBounds) => {
  const { x, y, width: w, height: h } = absoluteBoundingBox ?? {};
  const { x: xx, y: yy, width: ww, height: hh } = absoluteRenderBounds ?? {};
  return {
    dx: !xx || xx === x ? undefined : round(xx - x),
    dy: !yy || yy === y ? undefined : round(yy - y),
    dw: !ww || ww === w ? undefined : round(ww - w),
    dh: !hh || hh === h ? undefined : round(hh - h),
  };
};
