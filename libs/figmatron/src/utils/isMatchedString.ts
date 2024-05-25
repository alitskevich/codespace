export function isMatchedString(name: any, regexps) {
  return regexps?.some((re) => re.test(name));
}
