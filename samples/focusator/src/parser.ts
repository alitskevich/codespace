import { Hash } from "ultimus"
import { BaseWord, DictWord, TextWord, Word } from "./types"

export const toTextWords = (words: BaseWord[], dict: Hash<DictWord>, mark: number): TextWord[] =>
  (words ?? []).map(w => Word.toTextWords(w, dict)).filter(w => w.mark <= (mark ?? 100))