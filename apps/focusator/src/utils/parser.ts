import { arrayToObject, str } from "ultimus";

import aux from "../../data/aux.json";
import { BaseWord } from "../types";

import { cachedStemm } from "./stemm";
// import { data } from "../data/index.json";

const auxHash = arrayToObject(aux, e => e);

export const parseText = (_s: string, stemms: any = {}) => {
  const result: BaseWord[] = []
  const reWord = /([ñáéóüäß]|[^\d\W])+/gi
  const s = str(_s)
  let count = 0
  let lastIndex = 0;

  for (let e = reWord.exec(s); e; e = reWord.exec(s)) {
    const text = s.slice(lastIndex, e.index);
    result.push({ id: `s${++count}`, name: text, type: text === ' ' ? 'space' : 'gap', })
    const name = e[0]
    const key = name.toLowerCase();
    if (auxHash[key]) {
      result.push({ id: `a${++count}`, name, type: 'aux' })
    } else {
      let stemm = cachedStemm(key);
      if (stemms[stemm.id]) {
        stemm = stemms[stemm.id];
        count = stemm?.count ? stemm.count + 1 : 1
        stemms[stemm.id] = { ...stemm, names: { ...stemm.names, [key]: 1 }, count }
      } else {
        stemms[stemm.id] = stemm;
      }
      // const info = (data[stemm.id] ?? { id: name, mark: 3 }) as any

      result.push({
        id: stemm.id + (++count),
        type: 'word',
        name,
        stemm,
      })
    }

    lastIndex = reWord.lastIndex;
  }

  const text = s.slice(lastIndex);
  result.push({ id: `s${++count}`, name: text, type: text === ' ' ? 'space' : 'gap', })

  return result
}