export { addNextIds } from "./addNextIds";
export { toColor, toColorText } from "./color";
export { idiomsHash } from "./idiomsHash";
export { parseText } from "./parseText";
export { illustrateSentence } from "./illustrateSentence";
export { shuffleArray } from "./shuffleArray";
export { speak } from "arrmatura-ui/support/speech";

export const adaptQuizItem = (quiz, order) => {
  const { ru, en, answer1 = en, answer2, answer3, answer4, body = ru, correct = 1, ...rest } = quiz;
  if (rest.v1) {
    const { v1, v2, v3 } = rest;
    return {
      ...rest,
      body: ru,
      answer1: [v1, v2, v3].join(", "),
      correct: 1,
    };
  }
  const options = [answer1, answer2, answer3, answer4]
    .filter(Boolean)
    .map((name, id) => ({ id: id + 1, name }));
  return { options, order, body, correct, ...rest };
};
