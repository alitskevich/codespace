import { Hash } from "../../types";

export const EN = {
  monthNames: [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  monthNamesShort: ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  dayNamesShort: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
};

function pad(x: number) {
  let s = String(x);
  if (s.length < 2) {
    s = `0${s}`;
  }
  return s;
}

export const formatTimezone = (tzOffsetInMinutes: string | number) => {
  const toNumber = Number(tzOffsetInMinutes);
  if (isNaN(toNumber)) return ""
  if (toNumber === 0) return "Z"
  return toNumber > 0
    ? `-${pad(toNumber / 60)}${pad(toNumber % 60)}`
    : `+${pad(-toNumber / 60)}${pad(-toNumber % 60)}`;
};

export const DATE_FORMATTERS: Hash<(date: Date) => string> = {
  hh: (date: Date) => pad(date.getHours()),
  mm: (date: Date) => pad(date.getMinutes()),
  ss: (date: Date) => pad(date.getSeconds()),
  SSS: (date: Date) => pad(date.getMilliseconds()),

  dd: (date: Date) => pad(date.getDate()),
  w: (date: Date) => String(EN.dayNames[date.getDay()]),
  ww: (date: Date) => String(EN.dayNamesShort[date.getDay()]),
  MMMM: (date: Date) => EN.monthNames[date.getMonth() + 1],
  MMM: (date: Date) => EN.monthNamesShort[date.getMonth() + 1],
  MM: (date: Date) => pad(date.getMonth() + 1),
  yyyy: (date: Date) => `${date.getFullYear()}`,
  l: (date: Date) => `${date.getTime()}`,
  X: (date: Date) => `${formatTimezone(date.getTimezoneOffset())}`,
};

export const DEFAULT_DATE_FORMAT = "yyyy-MM-dd";

export const DEFAULT_DATE_TIME_FORMAT = "yyyy-MM-ddThh:mm:ssX";
