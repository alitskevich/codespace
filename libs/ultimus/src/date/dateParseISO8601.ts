
export const SAMPLE = new Date();
export function dateParseISO8601(x: string, TZ = SAMPLE.getTimezoneOffset()) {
  if (!x) {
    return null;
  }
  if (x.length === 10) {
    x += "T12:00Z";
  }
  const timebits = /^(\d\d\d\d)-(\d\d)-(\d\d)[ T](\d\d):(\d\d)(?::(\d\d)(\.\d\d\d?)?)?(Z?)(([+-])(\d\d):?(\d\d)?)?/;
  const m = timebits.exec(x);
  if (!m) {
    return null;
  }
  // utcdate is milliseconds since the epoch
  const localMillis = Date.UTC(
    parseInt(m[1]),
    parseInt(m[2]) - 1,
    parseInt(m[3]),
    parseInt(m[4]),
    parseInt(m[5]),
    m[6] ? parseInt(m[6]) : 0,
    m[7] ? parseInt(m[7].slice(1)) : 0
  );

  const localOffset = m[8] === 'Z' ? 0 : (!m[9] ? -TZ : (m[10] === "-" ? -1 : +1) * (parseInt(m[11]) * 60 + parseInt(m[12] ?? 0)));

  const utcMillis = localMillis - localOffset * 60000;

  return new Date(utcMillis);
}
