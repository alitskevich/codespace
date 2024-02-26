const pixelsScale: number[] = [
  0, 0.5, 1, 1.5, 2, 3, 3.5, 4, 5, 6, 7, 8, 9, 10,
  11, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48,
  52, 56, 60, 64,
  72, 80, 96,
];
const pixelNames = pixelsScale.reduce((r, n) => ({ ...r, [n * 4]: String(n) }), {
  1: "px",
  1440: "screen",
  900: "screen",
});

export const pxCode = (n: number | string, defVal = "0"): string => {
  if (!n) return defVal;
  const code = pixelNames[n];
  return code ? code : `[${n}px]`;
};

