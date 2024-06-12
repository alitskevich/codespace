import { Component } from "arrmatura-web";

import { shuffleArray } from "../utils/shuffleArray";

export class CTestService extends Component {
  #step = 0;
  state = {};
  quiz: any[] = [];

  get count() {
    return Number(this.quiz?.length || 0);
  }

  setAutoplay(auto) {
    this.autoplay = auto;
    if (auto) {
      const nextTick = async () => {
        const { state, current } = this;
        const text = this.current.options[this.current.correct - 1]?.name ?? 'aga'
        window.speechSynthesis.speak(Object.assign(new SpeechSynthesisUtterance(this.current.body), {
          lang: 'ru-RU',
          onend: () => {
            setTimeout(() => {
              const { id: key, correct } = current;
              this.up({
                state: {
                  ...state,
                  [key]: { value: correct, answered: true, isCorrect: true, correct, symbol: "🟢" }
                }
              })
              window.speechSynthesis.speak(Object.assign(new SpeechSynthesisUtterance(text), {
                onend: () => {
                  if (this.autoplay) {
                    this.up({ step: this.findNextStepInOrder() });
                    nextTick()
                  }
                }
              }));
            }, 4000)
          }
        }));
      }
      nextTick();
    }
  }

  setData(data) {
    this.data = data;
    this.quiz = shuffleArray(data).map((quiz, order) => {
      const { answer1, answer2, answer3, answer4, ...rest } = quiz;
      const options = [answer1, answer2, answer3, answer4]
        .filter(Boolean)
        .map((name, id) => ({ id: id + 1, name }));
      return { options, order, ...rest };
    })
  }

  get current() {
    const current = this.quiz?.[this.step];
    const currentSate = this.state?.[current.id] || {};

    return {
      value: null,
      isCorrect: null,
      answered: false,
      symbol: null,
      ...current,
      ...currentSate,
    };
  }
  get progress() {
    return this.quiz?.map((current) => {
      const { answered, isCorrect, value } = this.state?.[current.id] || {};
      return {
        id: current.id,
        order: current.order,
        color: !value ? "slate" : !answered ? "yellow" : isCorrect ? "green" : "red",
      };
    });
  }

  get step() {
    return Number(this.#step || 0);
  }

  findNextStepInOrder() {
    const { state, current } = this;
    return (this.quiz.findIndex((q) => q.order > current.order && !state?.[q.id]?.answered) + 1 ||
      this.quiz.findIndex((q) => q.order < current.order && !state?.[q.id]?.answered) + 1 ||
      0) - 1;
  }

  set step(step) {
    this.#step = step > this.count - 1 ? -1 : step;
  }

  onAnswer({ key, value }) {
    const { state, current } = this;
    const isCorrect = current.correct == value;
    const symbol = isCorrect ? "🟢" : "🔴";
    return {
      state: {
        ...state,
        [key]: { value, answered: true, isCorrect, correct: current.correct, symbol }
      },
      step: new Promise((resolve) => {
        setTimeout(async () => {
          resolve(this.findNextStepInOrder());
        }, 1000);
      })
      ,
    };
  }

  onBack() {
    return {
      step: this.step == 0 ? 0 : this.step - 1,
    };
  }

  onNext() {
    return {
      step: this.step + 1,
    };
  }
  onRestart() {
    return {
      step: 0,
      state: {},
    };
  }
  onStop() {
    return {
      step: -1,
    };
  }

  onAutoPlay() {
    return {
      autoplay: !this.autoplay,
    };
  }

  get stat() {
    // const total = this.quiz?.length || 0;
    const weight = {
      total: 0,
      correct: 0,
    };
    const stat: any = {
      // total,
      answered: 0,
      correct: 0,
    };

    this.quiz?.forEach((current) => {
      const { answered, isCorrect } = this.state?.[current.id] || {};
      if (answered) {
        weight.total += current.weight || 2;
        stat.answered++;
        if (isCorrect) {
          stat.correct++;
          weight.correct += current.weight || 2;
        }
      }
    });

    // report.unanswered = total - report.answered;
    // report.wrong = report.answered - report.correct;
    if (weight.total) {
      stat.score = weight.correct ? `${Math.round((100 * weight.correct) / weight.total)} / 100` : "N/A";
    } else {
      stat.score = "N/A";
    }
    return stat;
  }

  get report() {
    return Object.entries(this.stat)
      .filter(([_, value]) => !!value)
      .map(([id, value]) => ({ id, name: `${value}` }));
  }
}
