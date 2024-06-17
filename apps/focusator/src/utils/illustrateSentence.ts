import { strEnhance } from "ultimus";

const rules = [
  ['.', '', '*'],
  [' не ', ' ❌'],
  [/^(я) /, '🗣️<br/> '],
  [/ (мне)/, '  <br/>🗣️'],
  [/(ты) /, '🫵<br/> '],
  [/ (тебя)/, '', '* <br/>🫵'],
  [/(они) /, '👫<br/> '],
  [/ (им|их|них|ними)/, '', '* <br/>👫'],
  [/^(она) /, '👩‍🦰<br/> '],
  [/ (ей|её|ее|ней|нею)/, '', '* <br/>🧍‍♀️'],
  [/(он) /, '👨‍🦰<br/> '],
  [/ (ему|его|нем|ним)/, '', '* <br/>🧍‍♂️'],


  ['?', '', '❓ *'],
]
export function illustrateSentence(s) {
  return rules.reduce((s: string, [re, fn, enh]) => {
    const r = s.replace(re, fn)
    if (r === s) return s;
    if (enh) {
      return strEnhance(r, enh);
    }
    return r;
  }, String(s ?? '').toLowerCase());
}
