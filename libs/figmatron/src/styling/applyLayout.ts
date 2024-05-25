import { ANode } from "../nodes/ANode";
import { pxCode } from "../utils";

import { classMap_counterAxisAlignItems, classMap_primaryAxisAlignItems } from "./classMaps";

export function applyLayout(node: ANode) {
  const { addClass, bounds = {}, styling, nodes, parent } = node;
  const { layoutGrow, layoutAlign, layoutPositioning, constraints, isFixed } = styling ?? {};
  const { x = 0, y = 0, w = 0, h = 0 } = bounds ?? {};

  const itemLayoutMode = parent?.styling?.layoutMode

  if (styling?.layoutMode) {
    // apply flexbox
    const { layoutMode, layoutWrap, itemSpacing, primaryAxisAlignItems, counterAxisAlignItems } = styling;
    const isFlexRowMode = layoutMode === "HORIZONTAL";

    addClass(`flex ${isFlexRowMode ? "flex-row" : "flex-col"}`);

    if (layoutWrap === "NO_WRAP") { addClass("flex-nowrap"); }
    if (itemSpacing) { addClass(`gap-${pxCode(itemSpacing)}`); }

    if (primaryAxisAlignItems) { addClass(classMap_primaryAxisAlignItems[primaryAxisAlignItems]); }
    if (counterAxisAlignItems) { addClass(classMap_counterAxisAlignItems[counterAxisAlignItems]); }

    // const { primaryAxisSizingMode, counterAxisSizingMode } = styling;
    // if (primaryAxisSizingMode === "FIXED") {

    //   addClass(`shrink-0`);
    //   addClass(flexFixedSize_overflow_classMap[layoutMode]);

    //   if (!itemLayoutMode) {
    //     addClass(isFlexRowMode ? `w-${w ? `${pxCode(w)}` : "full"}` : `min-h-${h ? `${pxCode(h)}` : "full"}`);
    //   } else {
    //     const isCoherent = itemLayoutMode === 'HORIZONTAL' && isFlexRowMode || itemLayoutMode === 'VERTICAL' && !isFlexRowMode;
    //     if (isCoherent) {
    //       addClass(isFlexRowMode ? `w-${w ? `${pxCode(w)}` : "full"}` : `min-h-${h ? `${pxCode(h)}` : "full"}`);
    //     } else {
    //       addClass(`self-stretch`);
    //     }
    //   }
    // }

    // "FIXED": The counter axis length is determined by the user or plugins, unless the layoutAlign is set to “STRETCH” or layoutGrow is 1.
    // "AUTO": The counter axis length is determined by the size of the children.If set, the auto - layout frame will automatically resize along the counter axis to fit its children.
    // if (counterAxisSizingMode === "FIXED" && layoutAlign !== "STRETCH" && layoutGrow !== 1) {
    //   addClass(!isFlexRowMode ? `w-${w ? `${pxCode(w)}` : "full"}` : `min-h-${h ? `${pxCode(h)}` : "full"}`);
    // }
  }

  if (itemLayoutMode && !isFixed && !layoutPositioning) {
    // addClass(`flex flex-${itemLayoutMode[0] === 'H' ? "row" : "col"}`);
    if (layoutGrow === 1) {
      addClass(`flex-1`);
    } else {
      if (nodes?.length) {
        // addClass(`${isHorizontalPositioning ? 'w-fit' : 'h-fit'}`)
      } else {
        // addClass(itemLayoutMode === "HORIZONTAL" ? `min-w-${pxCode(w)}` : `min-h-${pxCode(h)}`);
      }
    }

    if (layoutAlign === "STRETCH") {
      addClass(`self-stretch`);
    }

    addClass('relative');
  } else {
    const { x: x0 = 0, y: y0 = 0, w: w0 = 0, h: h0 = 0 } = parent?.bounds ?? {};

    const parentClasses = parent?.classes;
    const isFreeParent = parentClasses?.["absolute"] || parentClasses?.["fixed"] || parentClasses?.["relative"];
    if (parent && !isFreeParent) {
      parent.addClass(`relative`);
    }

    addClass(isFixed ? "fixed" : isFreeParent ? `absolute` : 'relative');

    if (constraints) {
      const { vertical = "TOP", horizontal = "LEFT" } = constraints;
      if (vertical === "TOP" && horizontal === "LEFT") {
        if (y) { addClass(`top-${pxCode(y)}`); }
        if (x) { addClass(`left-${pxCode(x)}`); }
      } else {
        if (vertical === "TOP") {
          addClass(`top-${pxCode(y - y0)}`);
        } else if (vertical === "CENTER") {
          if (h) {
            addClass(`h-${pxCode(h)}`);
          }
          addClass(`top-[calc(50%_-_${h / 2}px)]`);
        } else if (vertical === "SCALE") {
          addClass(`top-${pxCode(y - y0)}`);
          addClass(`bottom-${pxCode(h - h0 - y + y0)}`);
        }

        if (horizontal === "LEFT") {
          addClass(`left-${pxCode(x - x0)}`);
        } else if (horizontal === "CENTER") {
          if (w) {
            addClass(`w-${pxCode(w)}`);
          }
          addClass(`left-1/2 -translate-x-1/2`);
        } else if (horizontal === "SCALE") {
          addClass(`left-${pxCode(x - x0)}`);
          addClass(`right-${pxCode(w - w0 - x + x0)}`);
        }
      }
    } else {
      if (isFreeParent) {
        addClass(`top-${pxCode(y)}`);
        addClass(`left-${pxCode(x)}`);
        if (w) { addClass(`w-${pxCode(w)}`); }
        if (h) { addClass(`h-${pxCode(h)}`); }
      }
    }
  }

}
