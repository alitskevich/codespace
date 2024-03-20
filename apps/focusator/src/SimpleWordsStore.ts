import { StoredData } from "arrmatura-ui/browser/StoredData";
import { parseText } from "./utils/parser";
import { arraySortBy } from "ultimus";

// service component
export class SimpleWordsStore extends StoredData {
  name = 'focusator'
  mark = 'all'
  level = 500
  text = ''
  parsequence = []
  concepts?: any[]
  interview?: any[]
  idiomsHash?: any
  acquired?: any

  uploadText(text) {
    const parsequence = parseText(String(text ?? ""), this.data)
    return { data: { ...this.data }, text, parsequence }
  }

  // updateStemmAcquitance({ id, acquired }) {
  //   const { data, parsequence } = this;
  //   const newWord = { ...data[id], acquired };
  //   const newData = { ...data, [id]: newWord }
  //   const newParsequence = (parsequence as any)?.map((st: any) => ({ ...st, stemm: newData[st.stemm?.id] }));
  //   return { data: newData, parsequence: newParsequence }
  // }

  get textWords() {
    const list = arraySortBy(Object.values<any>(this.data), 'id');
    // const maxLevel = Number(this.level) || 100

    return list
    //   && (frequency ? frequency <= maxLevel : true)
    //   && (words.includes(id))).slice(0, 50) ?? []
  }



}