import type { Hash } from "ultimus/types";

import { ANode } from "./src/nodes/ANode";

export type Px = number;

export type ScaleMapping = Record<Px, string>;

export type NodeBounds = {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
};

/** An RGBA color */
export type Color = {
  /** Red channel value, between 0 and 1 */
  r: number;
  /** Green channel value, between 0 and 1 */
  g: number;
  /** Blue channel value, between 0 and 1 */
  b: number;
  /** Alpha channel value, between 0 and 1 */
  a?: number;
};

export type NodeStyling = {

  blendMode?: string;
  strokeAlign?: string;
  strokeWeight?: string;
  strokes?: string;
  fills?: string;
  cornerRadius?: string;
  rectangleCornerRadii?: string;
  strokeGeometry?: any;

  textAutoResize?: string;
  textAlignHorizontal?: string;
  textAlignVertical?: string;

  If?: boolean;
  isFixed?: boolean;

  constraints?: {
    vertical: string;
    horizontal: string;
  };

  layoutMode?: any;
  layoutWrap?: string;
  layoutPositioning?: string;
  layoutGrow?: 0 | 1;
  layoutAlign?: string;
  minWidth?: number;
  maxWidth?: number;

  primaryAxisAlignItems?: string;
  counterAxisAlignItems?: string;
  primaryAxisSizingMode?: string;
  counterAxisSizingMode?: string;
  itemSpacing?: string;
};

export type FNode = {
  [x: string]: any;
  style?: Hash<string | number | null | undefined>;
  classes?: any;
  type?: any;
  tag?: any;
  attrs?: any;
  children?: any;
  name?: any;
};
export type NormalizedNode = {
  nodes: NormalizedNode[];
};

export type Padding = {
  className: string;
  all: number;
  horizontal: number;
  left: number;
  right: number;
  vertical: number;
  top: number;
  bottom: number;
};

export type AttributeSpec = (node: ANode, styling: any, ctx?: EvaluationContext) => void;

export type AttributesSpec = Hash<AttributeSpec>;

export type EvaluationContext = any;
