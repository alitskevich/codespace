import { DEFAULT_DATE_TIME_FORMAT, EN } from "./consts";
import { dateFormat } from "./dateFormat";

export { dateParseISO8601 } from "./dateParseISO8601";
export { dateOf } from "./dateOf";
export { dateFormat } from "./dateFormat";

export const monthName = (m: keyof typeof EN.monthNames): string => EN.monthNames[m] as string;

export const now = () => Date.now();

export const date = (x: any, f?: string) => dateFormat(x, f);

export const dateTimeFormat = (x: any, f = DEFAULT_DATE_TIME_FORMAT) => dateFormat(x, f);
