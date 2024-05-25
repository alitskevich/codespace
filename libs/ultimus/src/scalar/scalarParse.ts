import { Scalar } from "../../types";
/**
 * The scalarParse() function takes an optional string parameter s and returns a Scalar value.
 * It can also return undefined or null.
 * The function tries to parse the input string and convert it to a scalar value, based on some predefined rules.
 *
 * @param s (optional): a string that needs to be parsed and converted to a scalar value.
 * @return returns a Scalar value that can be one of the following:
 *     A boolean value (true or false).
 *     A number (integer or floating-point).
 *     A string value.
 *     undefined if the input string is the string "undefined".
 *     null if the input string is the string "null".
 *     An empty string if the input string is an empty string.
 *     Rules for parsing
 *     The scalarParse() function uses the following rules to parse the input string:
 *
 * If the input string is an empty string (''), an empty string is returned.
 * If the input string is the string "true", a boolean value true is returned.
 * If the input string is the string "false", a boolean value false is returned.
 * If the input string is the string "0", the number 0 is returned.
 * If the input string is the string "1", the number 1 is returned.
 * If the input string starts with a digit (0-9), a plus sign (+) or a minus sign (-) and has a length less than or equal to 17 characters, the string is converted to a number using the unary + operator. If the resulting value is NaN, the original string is returned, otherwise, the converted number is returned.
 * If the input string is the string "undefined", undefined is returned.
 * If the input string is the string "null", null is returned.
 * In all other cases, the input string is returned as-is.
 */
export const scalarParse = (s?: string): Scalar | null => {
  if (s === "") {
    return "";
  }
  if (s === "true") {
    return true;
  }
  if (s === "false") {
    return false;
  }
  if (s === "0") {
    return 0;
  }
  if (s === "1") {
    return 1;
  }
  if (s && "1234567890+-".includes(s[0]) && s.length <= 17) {
    const num = +s;
    return isNaN(num) ? s : num;
  }
  if (s === "null") {
    return null;
  }
  if (s === "undefined") {
    return undefined;
  }
  return s;
};
