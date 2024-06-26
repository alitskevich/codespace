export { addNextIds } from "./addNextIds";
export { toColor, toColorText } from "./color";
export { idiomsHash } from "./idiomsHash";
export { parseText } from "./parseText";
export { illustrateSentence } from "./illustrateSentence";
export { arrayShuffle } from "./arrayShuffle";
export { speak } from "arrmatura-ui/support/speech";

export const calcIrregularVerbQuizProgress = (data) => {
  const result = (data ?? []).reduce(
    (acc, { f1, f2, f3, a1, a2, a3 }) => {
      if (f1 === a1) acc.r1++;
      if (f2 === a2) acc.r2++;
      if (f3 === a3) acc.r3++;
      acc.total++;
      return acc;
    },
    { r1: 0, r2: 0, r3: 0, total: 0, percent: 0 }
  );
  result.percent = result.total
    ? Math.round((100 * (result.r1 + result.r2 + result.r3)) / 3 / result.total)
    : 0;
  return result;
};

export const adaptQuizItem = (quiz, order) => {
  const { ru, en, answer1 = en, answer2, answer3, answer4, body = ru, correct = 1, ...rest } = quiz;
  if (rest.f1) {
    const { f1, f2, f3 } = rest;
    return {
      ...rest,
      body: ru,
      answer1: [f1, f2, f3].join(", "),
      correct: 1,
    };
  }
  const options = [answer1, answer2, answer3, answer4]
    .filter(Boolean)
    .map((name, id) => ({ id: id + 1, name }));
  return { options, order, body, correct, ...rest };
};

export const arrayDedup = (arr) => {
  return arr.filter((item, index) => arr.indexOf(item) === index);
};

export const adaptIrregularVerbItems = (items, language, mode) => {
  return (items ?? [])
    .map((item) => {
      const { name, f1, a1, f2, a2, f3, a3, ...rest } = item;
      const completed = f1 == a1 && f2 == a2 && f3 == a3;
      return {
        ...item,
        language,
        completed,
        name: language === "en" ? name : rest[language],
      };
    })
    .filter((item) => mode !== "quiz" || !item.completed);
};
