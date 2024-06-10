import { StoredData } from "arrmatura-ui/commons/StoredData";
import { arraySortBy } from "ultimus";

import { parseText } from "../utils/parseText";

// service component
export class WordsStore extends StoredData {
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

  updateStemmAcquitance({ id, acquired }) {
    const { data, parsequence } = this;
    const newWord = { ...data[id], acquired };
    const newData = { ...data, [id]: newWord }
    const newParsequence = (parsequence as any)?.map((st: any) => ({ ...st, stemm: newData[st.stemm?.id] }));
    return { data: newData, parsequence: newParsequence }
  }

  updateSentenceAcquitance({ id, acquired }) {
    this.emit('db.upsert()', { collection: 'acquired', id, acquired })
  }

  get textWords() {
    const markFilter = this.mark
    const list = arraySortBy(Object.values<any>(this.data), 'id');
    // const maxLevel = Number(this.level) || 100

    return markFilter === 'all' ? list : list
      .filter(({ acquired }) => acquired == markFilter)
    //   && (frequency ? frequency <= maxLevel : true)
    //   && (words.includes(id))).slice(0, 50) ?? []
  }

  get acquiredConcepts() {
    const acquired = (this.acquired);
    // const maxLevel = Number(this.level) || 100
    return this.concepts?.map((e, index, all) => ({
      ...e,
      nextId: all[index + 1]?.id ?? null,
      acquired: acquired?.[e.id]?.acquired ?? 0,
      // idioms: this.idiomsHash?.[stemm(e.id).id] ?? []
    }))
  }
  get acquiredInterview() {
    const acquired = (this.acquired);
    // const maxLevel = Number(this.level) || 100
    return this.interview?.map((e, index, all) => ({
      ...e,
      nextId: all[index + 1]?.id ?? null,
      acquired: acquired?.[e.id]?.acquired ?? 0,
      // idioms: this.idiomsHash?.[stemm(e.id).id] ?? []
    }))
  }

  get tree() {
    const acquired = (this.acquired);
    const tree: any = {}
    this.concepts?.forEach((e) => {
      const { domain, topic, id, ...info } = e;

      const domainElt = tree[domain] ?? (tree[domain] = { id: domain, name: domain, items: {} })
      const topicElt = domainElt.items[topic] ?? (domainElt.items[topic] = { id: topic, name: topic, domain, items: {} })
      topicElt.items[id] = ({
        ...info,
        id,
        acquired: acquired?.[id]?.acquired ?? 0,
        // idioms: this.idiomsHash?.[stemm(id).id] ?? []
      })
    });

    return tree
  }

  get treeInterview() {
    const acquired = (this.acquired);
    const tree: any = {}
    this.interview?.forEach((e) => {
      const { kind, topic = 'common', id, ...info } = e;

      const domainElt = tree[kind] ?? (tree[kind] = { id: kind, name: kind, items: {} })
      const topicElt = domainElt.items[topic] ?? (domainElt.items[topic] = { id: topic, name: topic, domain: kind, items: {} })
      topicElt.items[id] = ({
        ...info,
        id,
        acquired: acquired?.[id]?.acquired ?? 0,
      })
    });

    return tree
  }

  get quiz() {
    const list = Object.values<any>(this.data ?? {});
    // const maxLevel = Number(this.level) || 100
    return list
      .filter(({ acquired }) => acquired == 2)
      .map(({ id }, index) => ({
        id,
        "slug": id,
        "examType": "C",
        "year": 2022,
        "variant": 1,
        "part": "A",
        "order": index,
        "questionType": "select",
        "question": "Выберите один из предложенных вариантов ответа.",
        "body": "In paragraph 1, what do we learn about Pen Hadow’s opinion of the new expedition?\n",
        "answer1": "guilty that he once added to the pressure caused by his absence",
        "answer2": "sad that he is missing so much of their growing up",
        "answer3": "sorry that he can’t telephone more often",
        "answer4": "",
        "answer5": "",
        "correct": 1,
        "explanation": "... when I last went, and I made a mistake in the way I said goodbye.",
        "weight": 2
      }))
      .map((quiz) => {
        const { answer1, answer2, answer3, answer4, answer5, ...rest } = quiz;
        const options = [answer1, answer2, answer3, answer4, answer5]
          .filter(Boolean)
          .map((name, id) => ({ id: id + 1, name }));
        return { options, ...rest };
      })
  }
}