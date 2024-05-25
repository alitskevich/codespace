import { Hash, isValuable, mapEntries } from "ultimus";

import { FNode } from "../../types";
import { guardValuable, toPropertyName } from "../utils";
import { rgbTo6hex } from "../utils/color";
import { getPaddingInfo } from "../utils/getPaddingInfo";
import { getTwColor } from "../utils/getTwColor";

export const TEXT_DEFAULTS = {
  textAutoResize: null,
  textAlignHorizontal: null,
  textAlignVertical: null,

  fontFamily: null,
  fontPostScriptName: null,
  fontWeight: null,
  fontSize: null,

  lineHeightPx: null,
  letterSpacing: null,

  textCase: null,
  textDecoration: null,

  hyperlink: null,
};

export const STYLE_DEFAULTS = {
  blendMode: "PASS_THROUGH",
  strokeAlign: "INSIDE",
  strokeWeight: null,
  strokeGeometry: 0,

  // ## effects
  // Effect[] = []
  // An array of effects attached to this node(see effects section for more details)
  effects: null,

  // ## strokes
  // Paint[] = []
  // An array of stroke paints applied to the node
  strokes: (list) => list?.map((e) => ({ ...e, color: rgbTo6hex(e.color) })),

  // ## fills
  // Paint[] = []
  // An array of fill paints applied to the node
  fills: (list) => list?.map((e) => ({ ...e, color: rgbTo6hex(e.color) })),

  // ## cornerRadius
  // Number
  // Radius of each corner of the frame if a single radius is set for all corners
  cornerRadius: null,

  // ## rectangleCornerRadii
  // Number[]
  // default: same as cornerRadius
  // Array of length 4 of the radius of each corner of the frame, starting in the top left and proceeding clockwise
  rectangleCornerRadii: null,

  // ## paddingLeft
  // Number=0
  // The padding between the left border of the frame and its children.This property is only applicable for auto - layout frames.
  // ## paddingRight
  // Number=0
  // The padding between the right border of the frame and its children.This property is only applicable for auto - layout frames.
  // ## paddingTop
  // Number=0
  // The padding between the top border of the frame and its children.This property is only applicable for auto - layout frames.
  // ## paddingBottom
  // Number=0
  // The padding between the bottom border of the frame and its children.This property is only applicable for auto - layout frames.
  padding: (_, origin) => getPaddingInfo(origin),

  textStyle: (_, origin) => guardValuable(stylify(origin.style, TEXT_DEFAULTS, origin)),

  backgroundColor: (backgroundColor) => {
    if (backgroundColor) {
      const twc = getTwColor(backgroundColor);
      if (twc !== "black") return twc;
    }
  },
  // ## opacity
  // Number = 1
  // Opacity of the node
  opacity: 1,

  // ## layoutMode
  // (NONE | HORIZONTAL | VERTICAL) = NONE
  // Whether this layer uses auto - layout to position its children.
  layoutMode: 'NONE',

  // ## layoutWrap
  // String
  // default: NO_WRAP
  // Whether this auto - layout frame has wrapping enabled.
  //   NO_WRAP
  // WRAP
  layoutWrap: null,

  // ## itemSpacing
  // Number = 0
  // The distance between children of the frame.Can be negative.This property is only applicable for auto - layout frames.
  itemSpacing: null,

  // ## primaryAxisAlignItems
  // String
  // default: MIN
  // Determines how the auto - layout frame’s children should be aligned in the primary axis direction.This property is only applicable for auto - layout frames.
  //   MIN
  // CENTER
  // MAX
  // SPACE_BETWEEN
  primaryAxisAlignItems: null,

  // ## primaryAxisSizingMode
  // String
  // default: AUTO
  // Whether the primary axis has a fixed length(determined by the user) or an automatic length(determined by the layout engine).This property is only applicable for auto - layout frames.
  //   FIXED
  // AUTO
  primaryAxisSizingMode: null,

  // ## counterAxisAlignItems
  // String
  // default: MIN
  // Determines how the auto - layout frame’s children should be aligned in the counter axis direction.This property is only applicable for auto - layout frames.
  //   MIN
  // CENTER
  // MAX
  // BASELINE
  counterAxisAlignItems: null,

  // ## counterAxisSizingMode
  // String
  // default: AUTO
  // Whether the counter axis has a fixed length(determined by the user) or an automatic length(determined by the layout engine).This property is only applicable for auto - layout frames.
  //   FIXED
  // AUTO
  counterAxisSizingMode: null,

  // ## counterAxisSpacing
  // Number = 0
  // The distance between wrapped tracks of an auto - layout frame.This property is only applicable for auto - layout frames with layoutWrap: "WRAP".
  counterAxisSpacing: 0,

  // ## counterAxisAlignContent
  // String
  // default: AUTO
  // Determines how the auto - layout frame’s wrapped tracks should be aligned in the counter axis direction.This property is only applicable for auto - layout frames withlayoutWrap: "WRAP".
  //   AUTO
  // SPACE_BETWEEN
  counterAxisAlignContent: 'AUTO',

  // ## layoutSizingHorizontal
  // (FIXED |  HUG | FILL)
  // The horizontal sizing setting on this auto - layout frame or frame child.
  // HUG is only valid on auto - layout frames and text nodes.FILL is only valid on auto - layout frame children.
  layoutSizingHorizontal: null,

  // ## layoutSizingVertical
  // (FIXED |  HUG | FILL)
  // The vertical sizing setting on this auto - layout frame or frame child.
  // HUG is only valid on auto - layout frames and text nodes.FILL is only valid on auto - layout frame children.
  layoutSizingVertical: null,

  // ## overflowDirection
  // String = NONE
  // Defines the scrolling behavior of the frame, if there exist contents outside of the frame boundaries.The frame can either scroll vertically, horizontally, or in both directions to the extents of the content contained within it.This behavior can be observed in a prototype.
  // HORIZONTAL_SCROLLING
  // VERTICAL_SCROLLING
  // HORIZONTAL_AND_VERTICAL_SCROLLING
  overflowDirection: "NONE",

  // ## clipsContent
  // Boolean
  // Whether or not this node clip content outside of its bounds
  clipsContent: false,
};

export const OUTER_LAYOUT_DEFAULTS = {
  If: (_, { visible, componentPropertyReferences: refs }) => {
    if (refs?.visible) {
      return `{${toPropertyName(refs.visible)}}`;
    } else if (String(visible).toLowerCase() === 'false') {
      return false;
    }
  },

  // ## constraints
  // LayoutConstraint
  // Horizontal and vertical layout constraints for node
  constraints: ({ vertical, horizontal }: any = {}) =>
    vertical === "TOP" && horizontal === "LEFT" ? undefined : { vertical, horizontal },

  // ## minWidth
  // Number | null=null
  // The minWidth of the frame, or null if not set.
  minWidth: null,
  // ## maxWidth
  // Number | null=null
  // The maxWidth of the frame, or null if not set.
  maxWidth: null,
  // ## minHeight
  // Number | null=null
  // The minHeight of the frame, or null if not set.
  minHeight: null,
  // ## maxHeight
  // Number | null=null
  // The maxHeight of the frame, or null if not set.
  maxHeight: null,

  isFixed: null,

  // ## layoutPositioning
  // String
  // default: AUTO Determines whether a layer's size and position should be determined by auto-layout settings or manually adjustable.ABSOLUTE
  layoutPositioning: "AUTO",

  // ## layoutAlign
  // INHERIT |  STRETCH
  // Determines if the layer should stretch along the parent’s counter axis.
  // This property is only provided for direct children of auto - layout frames.

  // In previous versions of auto layout, determined how the layer is aligned inside an auto - layout frame.This property is only provided for direct children of auto - layout frames.
  // MIN
  // CENTER
  // MAX
  // STRETCH
  // In horizontal auto - layout frames, "MIN" and "MAX" correspond to "TOP" and "BOTTOM".
  // In vertical auto - layout frames, "MIN" and "MAX" correspond to "LEFT" and "RIGHT".
  layoutAlign: "INHERIT",

  // ## layoutGrow
  // Set 1 for grow auto item to occupy free space of its container
  layoutGrow: 0,

  // Layout Version
  layoutVersion: 4,
};

// const _OTHERS = {
// ## styles
// Map<StyleType, String>
// A mapping of a StyleType to style ID(see Style) of styles present on this node.The style ID can be used to look up more information about the style in the top - level styles field.
// styles: null,
// ## children
// Node[]
// An array of nodes that are direct children of this node

// ## strokeWeight
// Number
// The weight of strokes on the node

// ## strokeAlign
// String
// Position of stroke relative to vector outline, as a string enum
//   INSIDE: stroke drawn inside the shape boundary
// OUTSIDE: stroke drawn outside the shape boundary
// CENTER: stroke drawn centered along the shape boundary

// ## strokeDashes
// Number[] = []
// An array of floating point numbers describing the pattern of dash length and gap lengths that the vector path follows.For example a value of[1, 2] indicates that the path has a dash of length 1 followed by a gap of length 2, repeated.

// ## cornerSmoothing
// Number
// A value that lets you control how "smooth" the corners are.Ranges from 0 to 1. 0 is the default and means that the corner is perfectly circular.A value of 0.6 means the corner matches the iOS 7 "squircle" icon shape.Other values produce various other curves.See this post for the gory details!

// ## exportSettingsExportSetting[] = []
// An array of export settings representing images to export from the node

// blendModeBlendMode
// How this node blends with nodes behind it in the scene(see blend mode section for more details)

// ## preserveRatio
// Boolean = false
// Keep height and width constrained to same ratio

// ## transitionNodeID
// String = null
// Node ID of node to transition to in prototyping

// ## transitionDuration
// Numbernull
// The duration of the prototyping transition on this node(in milliseconds)

// ## transitionEasing
// EasingType = null
// The easing curve used in the prototyping transition on this node

// ## horizontalPadding
// Number = 0
// The horizontal padding between the borders of the frame and its children.This property is only applicable for auto - layout frames.Deprecated in favor of setting individual paddings.

// ## verticalPadding
// Number = 0
// The vertical padding between the borders of the frame and its children.This property is only applicable for auto - layout frames.Deprecated in favor of setting individual paddings.

// ## itemReverseZIndex
// Boolean = false
// Determines the canvas stacking order of layers in this frame.When true, the first layer will be draw on top.This property is only applicable for auto - layout frames.

// ## strokesIncludedInLayout
// Boolean = false
// Determines whether strokes are included in layout calculations.When true, auto - layout frames behave like css "box-sizing: border-box".This property is only applicable for auto - layout frames.

// ## layoutGridsLayoutGrid[] = []
// An array of layout grids attached to this node(see layout grids section for more details).GROUP nodes do not have this attribute

// ## isMask
// Boolean = false
// Does this node mask sibling nodes in front of it ?

// ## isMaskOutline
// Boolean = false
// [DEPRECATED] Whether the mask ignores fill style(e.g.gradients) and effects.This property is deprecated; please use the maskType field instead(isMaskOutline = true corresponds to maskType = "VECTOR").

// ## maskType
// String
// If this layer is a mask, this property describes the operation used to mask the layer's siblings. The value may be one of the following:
// ALPHA: the mask node's alpha channel will be used to determine the opacity of each pixel in the masked result.
// VECTOR: if the mask node has visible fill paints, every pixel inside the node's fill regions will be fully visible in the masked result. If the mask has visible stroke paints, every pixel inside the node's stroke regions will be fully visible in the masked result.
//   LUMINANCE: the luminance value of each pixel of the mask node will be used to determine the opacity of that pixel in the masked result.
// }

export const stylify = (data: FNode, meta: any, origin = data) => {
  if (!data) return {};

  const bundle: Hash = {};

  mapEntries(meta, (key, value) => {
    let val = data[key];
    if (typeof value === "function") {
      val = value(val, origin);
    }
    if (val != null && val !== value && isValuable(val)) {
      bundle[key] = val;
    }
  });

  return bundle;
};
