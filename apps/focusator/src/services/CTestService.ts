import { Component } from "arrmatura-web";

export class CTestService extends Component {
  #step = 0;
  state = {};
  quiz: any[] = [];

  get count() {
    return Number(this.quiz?.length || 0);
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
        setTimeout(() => {
          resolve((this.quiz.findIndex((q) => q.order > current.order && !state?.[q.id]?.answered) + 1 ||
            this.quiz.findIndex((q) => q.order < current.order && !state?.[q.id]?.answered) + 1 ||
            0) - 1
          );
        }, 1000);
      })
      ,
    };
  }

  onBack(_, { step }) {
    return {
      step: step == 0 ? 0 : step - 1,
    };
  }

  onNext(_, { step }) {
    return {
      step: step + 1,
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
