import { mapEntries } from "ultimus";

import { UINode } from "./UINode";

const stylingSpec = (T: UINode) => {
  const isFlexItem = T.parent.container.type === 'flex'
  const isGridItem = T.parent.container.type === 'grid'
  return [
    { id: "display", type: 'enum', typeSpec: 'display' },
    { id: "position", type: 'enum', typeSpec: 'position' },
    { id: "inset", type: 'bounds' },
    { id: "transform_translate", type: 'point' },
    { id: "transform_rotate", type: 'point' },
    { id: "size", type: 'sizeMinMax' },
    { id: "padding", type: 'bounds' },
    { id: "margin", type: 'bounds' },
    { id: "layout_align", type: 'enum', typeSpec: ['start', 'end', 'center', 'stretch'] },
    { id: "layout_justify", type: 'enum', typeSpec: ['start', 'end', 'center', 'between', 'around', 'evenly'] },
    { id: "layout_gap", type: 'enum', typeSpec: ['1', '2', '3', '4'] },
    { id: "layout_justify", type: 'enum', typeSpec: ['start', 'end', 'center', 'between', 'around', 'evenly'] },
    { id: "layout_align", type: 'enum', typeSpec: ['start', 'end', 'center', 'stretch'] },
    { id: "item_align", type: 'enum', typeSpec: ['start', 'end', 'center', 'stretch'], enabled: isFlexItem },
    { id: "item_resizeShrink", type: 'unit', enabled: isFlexItem },
    { id: "item_resizeGrow", type: 'unit', enabled: isFlexItem },
    { id: "item_resizeAuto", type: 'boolean', enabled: isFlexItem },
    { id: "item_cell_span", type: 'number', enabled: isGridItem },
    { id: "border_l", type: 'border' },
    { id: "border_r", type: 'border' },
    { id: "border_t", type: 'border' },
    { id: "border_b", type: 'border' },
    { id: "radius_tl", type: 'size' },
    { id: "radius_tr", type: 'size' },
    { id: "radius_bl", type: 'size' },
    { id: "radius_br", type: 'size' },
    { id: "text_align", type: 'enum', typeSpec: ['start', 'end', 'center', 'stretch'] },
    { id: "text_valign", type: 'enum', typeSpec: ['start', 'end', 'center', 'stretch'] },
    { id: "text_decoration", type: 'enum', typeSpec: ['none', 'underline'] },
    { id: "text_size", type: 'size' },
    { id: "text_leading", type: 'unit' },
    { id: "text_font", type: 'unit' },
    { id: "text_color", type: 'color' },
    { id: "opacity", type: 'url' },
    { id: "background_color", type: 'color' },
    { id: "background_image", type: 'url' },
    { id: "effects", type: 'url' },
  ]
};

export const appearance = mapEntries(stylingSpec, (id, val) => {
  return {
    id, value: mapEntries(val, (id, v) => {
      return { id, name: id, ...v };
    })
  };
});

const commonTag = {
  styling: [],
}

const tagsSpec = {
  div: {
    contains: 'any',
    ...commonTag
  },
  span: {
    contains: 'text',
    styling: commonTag.styling,
  },
  img: {
    contains: 'none',
    styling: commonTag.styling,
    props: {
      src: { type: 'url' }
    }
  },
  a: {
    contains: 'div,span,img,text',
    styling: commonTag.styling,
    props: {
      href: { type: 'url' }
    }
  },
  p: {
    contains: 'span,text',
    styling: commonTag.styling,
  },
  button: {
    contains: 'span,img,text',
    styling: commonTag.styling,
    props: {
      click: { type: 'handler' }
    }
  },
  input: {
    contains: 'none',
    styling: commonTag.styling,
    props: {
      type: { type: 'enum', typeSpec: ['text', 'number', 'date'] },
      change: { type: 'handler' },
      value: { type: 'any' }
    },
  }
}

export const DesignSystem = {
  styling: stylingSpec,
  tags: tagsSpec,
}

export default DesignSystem;