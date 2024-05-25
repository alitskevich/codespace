import { str } from "ultimus";

import concepts from "../../data/concepts.json";
import ctest from "../../data/ctest.json";
import idioms from "../../data/idioms.json";
import interview from "../../data/interview.json";

import { shuffleArray } from "./shuffleArray";
import { stemm } from "./stemm";

function prepareIdioms() {
  idioms?.forEach((item: any) => {
    const reWord = /[ñáéóü\w]+/gi
    const s = str(`${item.id}:${item.en}`)
    item.stems = [];
    for (let e = reWord.exec(s); e; e = reWord.exec(s)) {
      item.stems.push(stemm(e[0]).id)
    }
  });

  return idioms;
}

function prepareInterview() {
  interview?.forEach((item: any) => {
    const reWord = /[ñáéóü\w]+/gi
    const s = str(`${item.id}:${item.en}`)
    item.stems = [];
    item.name = `${item.prefix ?? ''}\n${item.subject}`
    for (let e = reWord.exec(s); e; e = reWord.exec(s)) {
      item.stems.push(stemm(e[0]).id)
    }
  });

  return interview;
}

function prepareConcepts() {
  concepts?.forEach((item: any) => {
    item.stem = stemm(item.id).id
  });

  return concepts;
}

export const initialData = {
  idioms: prepareIdioms,
  concepts: prepareConcepts,
  interview: prepareInterview,
  ctest: () => shuffleArray(ctest).map((quiz, order) => {
    const { answer1, answer2, answer3, answer4, ...rest } = quiz;
    const options = [answer1, answer2, answer3, answer4]
      .filter(Boolean)
      .map((name, id) => ({ id: id + 1, name }));
    return { options, order, ...rest };
  }),
}
