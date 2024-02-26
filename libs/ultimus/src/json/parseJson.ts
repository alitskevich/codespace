/**
 * This function tries to parse the input string as JSON using the `JSON.parse()` method.
 *
 * @param text text containing JSON data to be parsed
 * @param def  default value to be returned in case of failure or no input provided
 * @returns If the parsing is successful, it returns the resulting object. Otherwise, it returns the default value provided or an empty object if none was specified.
 */
export function parseJson(text?: string | null, def: unknown = {}) {
  try {
    return text ? JSON.parse(text) : def;
  } catch (e) {
    return def;
  }
}
