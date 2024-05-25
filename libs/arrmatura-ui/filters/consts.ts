import { Hash } from "ultimus";

export const OPT_EMPTY = "$$$empty";
export const OPT_NON_EMPTY = "$$$non-empty";

export const OPT_NAMES: Hash = {
  [OPT_NON_EMPTY]: {
    id: OPT_NON_EMPTY,
    name: " Ω ",
    count: 0,
    isSelected: false,
  },
  [OPT_EMPTY]: {
    id: OPT_EMPTY,
    name: " Ø ",
    count: 0,
    isSelected: false,
  }
};

