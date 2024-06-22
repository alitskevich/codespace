import { str } from "ultimus";

import ctest from "../../data/ctest.json";
import { data as dictionary } from "../../data/dictionary.json";
import idioms from "../../data/idioms.json";
import interview from "../../data/interview.json";
import irregular from "../../data/irregular.json";
import thesaurus from "../../data/thesaurus.json";

import { stemm } from "./stemm";

function prepareIdioms() {
  idioms?.forEach((item: any) => {
    const reWord = /[ñáéóü\w]+/gi;
    const s = str(`${item.en}`);
    item.stems = [];
    for (let e = reWord.exec(s); e; e = reWord.exec(s)) {
      const stem = stemm(e[0]).id;
      if (stem.length > 3) {
        item.stems.push(stem);
      }
    }
  });

  return idioms;
}

function prepareInterview() {
  interview?.forEach((item: any) => {
    const reWord = /[ñáéóü\w]+/gi;
    const s = str(`${item.id}:${item.en}`);
    item.stems = [];
    item.name = `${item.prefix ?? ""}\n${item.subject}`;
    for (let e = reWord.exec(s); e; e = reWord.exec(s)) {
      item.stems.push(stemm(e[0]).id);
    }
  });

  return interview;
}

function prepareThesaurus() {
  thesaurus?.forEach((item: any) => {
    item.stem = stemm(item.id).id;
  });

  return thesaurus;
}

function prepareIrregular() {
  irregular?.forEach((item: any) => {
    item.id = item.v1;
  });
  return irregular;
}

function prepareCtest() {
  return ctest;
}

function prepareDictionary() {
  return dictionary;
}

export const initialData = {
  idioms: prepareIdioms,
  thesaurus: prepareThesaurus,
  interview: prepareInterview,
  ctest: prepareCtest,
  dictionary: prepareDictionary,
  irregular: prepareIrregular,
};
