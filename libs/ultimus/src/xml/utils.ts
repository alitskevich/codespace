const RE_ESCAPE_XML_ENTITY = /["'&<>]/g;

const RE_XML_ENTITY = /&#?[0-9a-z]{2,5};/g;

const SUBST_XML_ENTITY: Record<string, string> = {
  amp: "&",
  gt: ">",
  lt: "<",
  quot: '"',
  nbsp: " ",
};

const ESCAPE_XML_ENTITY: Record<string, string> = {
  34: "&quot;",
  38: "&amp;",
  39: "&#39;",
  60: "&lt;",
  62: "&gt;",
};
const FN_ESCAPE_XML_ENTITY = (m: string) => ESCAPE_XML_ENTITY[m.charCodeAt(0)];

const FN_XML_ENTITY = function (s0: string) {
  const s = s0.substring(1, s0.length - 1);
  return s[0] === "#" ? String.fromCharCode(+s.slice(1)) : SUBST_XML_ENTITY[s] || " ";
};

export const skipQoutes = (s: string, sym = '"', sym2 = sym) =>
  s[0] === sym && s[s.length - 1] === sym2 ? s.slice(1, -1) : s;

export const decodeXmlEntities = (s?: string) => String(s ?? "").replace(RE_XML_ENTITY, FN_XML_ENTITY);

export const escapeXml = (s: string) => (!s ? "" : `${s}`.replace(RE_ESCAPE_XML_ENTITY, FN_ESCAPE_XML_ENTITY));
