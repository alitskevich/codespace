import { Hash } from "ultimus"

export type BaseWord = {
  id: string,
  name: string,
}

export type DictWord = BaseWord & {
  seen: number,
  mark: number
}

export namespace Word {
  export const create = (word: BaseWord): DictWord => ({ id: word.id, name: word.name, seen: 1, mark: 0 })
  export const mark = (word: DictWord, mark: number): DictWord => Object.assign(word, { mark })
  export const findOrCreate = (word: BaseWord, words: Hash<DictWord>) => {
    const found = words[word.id]
    if (found) {
      return found
    }
    const newWord = create(word)
    words[newWord.id] = newWord

    return newWord
  }
  export const toTextWords = (word: BaseWord, dict?: Hash<DictWord>): TextWord =>
    Object.assign({}, word, dict?.[word.id] ?? create(word))
}

export type TextWord = DictWord & {
  count?: number,
  sentences?: string[]
}
