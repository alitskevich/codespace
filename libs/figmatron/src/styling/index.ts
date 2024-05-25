import { mapEntries } from "ultimus";

import { EvaluationContext } from "../../types";
import { ANode } from "../nodes/ANode";
import { prefx, pxCode } from "../utils";
import { nearestOpacity } from "../utils/scaleMaps";
import { nearestValue, rotationValues } from "../utils/scaleMaps";

import { applyBorderRadius } from "./applyBorderRadius";
import { applyFills } from "./applyFills";
import { applyTextStyle } from "./applyTextStyle";
import { classMap_effectsTypes, overflow_classMap } from "./classMaps";


export const attrsCommon = {
  applyFills,
  applyBorderRadius,

  overflowDirection({ addClass }, { overflowDirection, clipsContent }) {
    if (clipsContent) {
      addClass("overflow-hidden");
    } else if (overflowDirection) {
      addClass(overflow_classMap[overflowDirection]);
    }
  },
  minmaxBounds({ addClass }, { minWidth, maxWidth, minHeight, maxHeight }) {
    if (minWidth) { addClass(`min-w-${pxCode(minWidth)}`); }
    if (maxWidth) { addClass(`max-w-${pxCode(maxWidth)}`); }
    if (minHeight) { addClass(`min-h-${pxCode(minHeight)}`); }
    if (maxHeight) { addClass(`max-h-${pxCode(maxHeight)}`); }
  },

  opacity({ addClass }, { opacity }) {
    if (opacity !== undefined && opacity !== 1) {
      addClass(`opacity-${nearestOpacity(opacity)}`);
    }
  },
  padding({ addClass }, { padding }) {
    mapEntries(padding, (key, value) => addClass(`${prefx(key, pxCode(value))}`));
  },

  effects({ addClass }, { effects }) {
    effects?.forEach(({ type }) => addClass(classMap_effectsTypes[type]));
  },

  text({ type, addClass }, styling) {
    if (type === "TEXT") {
      applyTextStyle(styling, addClass);
    }
  },

  layoutSizing({ addClass, bounds }: ANode, { layoutSizingHorizontal, layoutSizingVertical }) {
    if (layoutSizingHorizontal === 'FIXED' && bounds?.w) {
      addClass(`w-${pxCode(bounds.w)}`);
    }
    if (layoutSizingVertical === 'FIXED' && bounds?.h) {
      addClass(`h-${pxCode(bounds.h)}`);
    }
  },

  strokes({ addClass }: ANode, { strokeWeight, strokes }) {
    // [strokeWeight] can have a value even when there are no strokes
    if (!strokes?.length || !strokeWeight) return "";
    addClass(strokeWeight === 1 || !strokeWeight ? "border" : prefx("border", pxCode(strokeWeight)));
  },

  rotation({ addClass }, { rotation }) {
    // that's how you convert angles to clockwise radians: angle * -pi/180
    // using 3.14159 as Pi for enough precision and to avoid importing math lib.
    if (rotation !== undefined && Math.round(rotation) !== 0) {
      let nearest = nearestValue(rotation, rotationValues);
      let minusIfNegative = "";
      if (nearest < 0) {
        minusIfNegative = "-";
        nearest = -nearest;
      }
      addClass(`transform ${minusIfNegative}rotate-${nearest}`);
    }
  },
};

const applicators = Object.values(attrsCommon);

export const evaluateNodeStyling = (node: ANode, _context: EvaluationContext) => {
  applicators.forEach((spec) => spec(node, node.styling || {}));
};
