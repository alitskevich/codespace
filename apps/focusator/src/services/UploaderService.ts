import { StoredData } from "arrmatura-ui/commons/StoredData";
import { arraySortBy } from "ultimus";

import { Stemm } from "../types";
import { parseText } from "../utils/parseText";

// service component
export class UploaderService extends StoredData {
  // defaults = {}
  // name = 'focusator'
  list: Stemm[] = [];//arraySortBy(Object.values<any>(this.data), 'count', -1);
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
    this.list = arraySortBy(Object.values<any>(data), 'name');
    // this.listIterator = this.getListIterator()

    return { text, parsequence }
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