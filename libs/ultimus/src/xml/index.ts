import { xmlParserFactory } from "./xmlParserFactory";

/**
 * Parses an XML string and returns an array of XmlNode objects.
 *
 * @param {_s} [string] The XML string to be parsed.
 * @returns {XmlNode[]} An array of XmlNode objects representing the XML nodes in the parsed string.
 */
export const xmlParse = xmlParserFactory();
