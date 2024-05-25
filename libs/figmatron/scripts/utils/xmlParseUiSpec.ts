import { xmlParserFactory } from "ultimus/src/xml/xmlParserFactory";

export const xmlParseUiSpec = xmlParserFactory({ SINGLE_TAGS: { img: 1, br: 1, hr: 1, col: 1, source: 1 } });


