import { arrayToObject, str } from "ultimus";

import aux from "../../data/aux.json";
import { BaseWord } from "../types";

import { getStemmByToken } from "./stemm";
// import { data } from "../data/index.json";

const auxHash = arrayToObject(aux, e => e);

export const parseText = (_s: string, stemms) => {
  const result: BaseWord[] = []
  const reWord = /[a-z]([ñáéóüäß']|[^\d\W])+/gi
  const s = str(_s)
  let nextId = 0
  let lastIndex = 0;

  for (let e = reWord.exec(s); e; e = reWord.exec(s)) {
    const text = s.slice(lastIndex, e.index);
    result.push({ id: `s${++nextId}`, name: text, type: text === ' ' ? 'space' : 'gap', })
    const name = e[0]
    const key = name.toLowerCase();
    if (auxHash[key]) {
      result.push({ id: `a${++nextId}`, name, type: 'aux' })
    } else {
      const stemm = getStemmByToken(key, stemms);
      // const info = (data[stemm.id] ?? { id: name, mark: 3 }) as any

      result.push({
        id: stemm.id + (++nextId),
        type: 'word',
        name,
        stemm,
      })
    }

    lastIndex = reWord.lastIndex;
  }

  const text = s.slice(lastIndex);
  result.push({ id: `s${++nextId}`, name: text, type: text === ' ' ? 'space' : 'gap', })

  return result
}