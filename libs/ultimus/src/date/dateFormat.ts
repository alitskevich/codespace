import { Dateable } from "../../types";

import { DATE_FORMATTERS, DEFAULT_DATE_FORMAT } from "./consts";
import { dateOf } from "./dateOf";


export const dateFormat = (x: Dateable | null, format = DEFAULT_DATE_FORMAT) => {
  if (!x) {
    return "";
  }
  const date = dateOf(x);
  return !date
    ? ""
    : format.replace(/[_]/g, "\n").replace(/(yyyy|MMM?M?|dd|hh|mm|ss|SSS|X|ww?|l)/g, function (key: string) {
      if (key in DATE_FORMATTERS) {
        return DATE_FORMATTERS[key](date);
      }
      return key;
    });
};

