import { rgbTo6hex, tailwindColors } from "./color";


export const getTwColor = (color) => {
  if (!color) return undefined;
  if (typeof color !== "string") return getTwColor(rgbTo6hex(color));
  return tailwindColors[`#${color}`] ?? `[#${color}]`;
};
