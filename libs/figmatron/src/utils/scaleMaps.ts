import { ScaleMapping } from "../../types";

import { toDiscreetNumber } from "./toDiscreetNumber";

import { prefx } from ".";

export const rotationValues = [-180, -90, -45, -12, -6, -3, -2, -1, 1, 2, 3, 6, 12, 45, 90, 180];

export const CORNER_KEYS = ["tl", "tr", "bl", "br"];

export const opacityValues = [0, 5, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 95];

const mapLetterSpacing: Record<number, string> = {
  "-0.05": "tighter",
  "-0.025": "tight",
  // 0: "normal",
  0.025: "wide",
  0.05: "wider",
  0.1: "widest",
};

export const scaleMap_LineHeight: Record<number, string> = {
  0.75: "3",
  1: "",
  1.25: "tight",
  1.375: "snug",
  1.5: "normal",
  1.625: "relaxed",
  2: "loose",
  1.75: "7",
  2.25: "9",
  2.5: "10",
};

const mapFontSize: Record<number, string> = {
  0.75: "xs",
  0.875: "sm",
  1: "base",
  1.125: "lg",
  1.25: "xl",
  1.5: "2xl",
  1.875: "3xl",
  2.25: "4xl",
  3: "5xl",
  3.75: "6xl",
  4.5: "7xl",
  6: "8xl",
  8: "9xl",
};

const mapWidthHeightSize: Record<number, string> = {
  // 0: "0",
  0.125: "0.5",
  0.25: "1",
  0.375: "1.5",
  0.5: "2",
  0.625: "2.5",
  0.75: "3",
  0.875: "3.5",
  1: "4",
  1.25: "5",
  1.5: "6",
  1.75: "7",
  2: "8",
  2.25: "9",
  2.5: "10",
  2.75: "11",
  3: "12",
  3.5: "14",
  4: "16",
  5: "20",
  6: "24",
  7: "28",
  8: "32",
  9: "36",
  10: "40",
  11: "44",
  12: "48",
  13: "52",
  14: "56",
  15: "60",
  16: "64",
  18: "72",
  20: "80",
  24: "96",
};

export const borderRadiusKeys: Record<number, string> = {
  // 0: "none",
  0.125: "sm",
  0.25: "",
  0.375: "md",
  0.5: "lg",
  0.75: "xl",
  1.0: "2xl",
  1.5: "3xl",
  10: "full",
};

export const nearestValue = (goal: number, array: Array<number>): number => {
  return array.reduce(function (prev, curr) {
    return Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev;
  });
};

const pixelToTailwindValue = (value: number, conversionMap: Record<number, string>) => {
  return conversionMap[
    nearestValue(
      value / 16,
      Object.keys(conversionMap).map((d) => +d)
    )
  ];
};

const SCALES = new Map();
const getScaleForMap = (map: ScaleMapping) =>
  SCALES.has(map) ? SCALES.get(map) : SCALES.set(map, Object.keys(map).map(Number).sort()).get(map);

export const VALUE_SCALE_MAPS = {
  leading: scaleMap_LineHeight,
  text: mapFontSize,
  tracking: mapLetterSpacing,
};

export const narrowByScale = (num: number, scaleMap: ScaleMapping) => toDiscreetNumber(num, getScaleForMap(scaleMap));

export const resolvePrecisePixelsScaleClass = (prefix: keyof typeof VALUE_SCALE_MAPS, px: number | string | null = 0) => {
  return px ? prefx(prefix, VALUE_SCALE_MAPS[prefix][Number(px) / 16] ?? `[${px}px]`) : null;
};

export const borderRadiusKey = (value: number): string => borderRadiusKeys[narrowByScale(value / 16, borderRadiusKeys)];

export const nearestOpacity = (nodeOpacity: number): number => nearestValue(nodeOpacity * 100, opacityValues);

export const pxToLayoutSize = (value: number): string => pixelToTailwindValue(value, mapWidthHeightSize);


export const map_fontWeight = {
  "100": "thin",
  "200": "extralight",
  "300": "light",
  "400": "normal",
  "500": "medium",
  "600": "semibold",
  "700": "bold",
  "800": "extrabold",
  "900": "black",
};
export const resolveFontWeightClass = (n: number | string): string => {
  if (!n) return '';
  const code = map_fontWeight[n];
  return `font-${code ? code : `[${n}px]`}`;
};