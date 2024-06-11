import { StoredData } from "arrmatura-ui/commons/StoredData";
import { arraySortBy } from "ultimus";

import { BaseWord, Stemm } from "../types";
import { parseText } from "../utils/parseText";

// service component
export class UploaderService extends StoredData {
  acquired?: any
  // defaults = {}
  // name = 'focusator'
  // listIterator = this.getListIterator()
  // word: Stemm = this.listIterator.next().value ?? { id: 'none', names: {} }

  init() {
    super.init()
    window.document.body.addEventListener('keydown', (e) => {
      console.log(e);

      // if (e.key === 'ArrowRight') {
      //   this.determineWord()
      // }
    })
    return null
  }

  uploadText(text) {
    const data = {}
    const parsequence = parseText(String(text ?? ""), data)
    // this.listIterator = this.getListIterator()

    return { data, text, parsequence }
  }

  get parsedText(): BaseWord[] {
    return this.parsequence?.map((e, index, all) => ({
      ...e,
      nextId: all[index + 1]?.id ?? null,
      acquired: this.acquired?.[e.stemm?.id ?? '']?.acquired ?? 0,
      // idioms: this.idiomsHash?.[stemm(e.id).id] ?? []
    }));
  }

  get list(): Stemm[] {
    return arraySortBy(Object.values<any>(this.data), 'name').map((e, index, all) => ({
      ...e,
      nextId: all[index + 1]?.id ?? null,
      acquired: this.acquired?.[e.id]?.acquired ?? 0,
      // idioms: this.idiomsHash?.[stemm(e.id).id] ?? []
    }));
  }
  // updateStemmAcquitance({ id, acquired }) {
  //   const { data, parsequence } = this;
  //   const newWord = { ...data[id], acquired };
  //   const newData = { ...data, [id]: newWord }
  //   const newParsequence = (parsequence as any)?.map((st: any) => ({ ...st, stemm: newData[st.stemm?.id] }));
  //   return { data: newData, parsequence: newParsequence }
  // }
  // determineWord() {
  //   console.log(this.word);
  //   const word = this.listIterator.next().value;
  //   if (word) {
  //     this.word = word
  //   }
  //   return { word }
  // }

  // *getListIterator() {
  //   for (const word of this.list) {
  //     yield word
  //   }
  // }




}