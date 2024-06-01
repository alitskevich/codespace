import { Component } from "arrmatura-web";
import { Hash } from "ultimus";

import { BaseWord, DictWord, Word } from "./types";

export type Action = Hash<string>;

type State = {
  dict: Hash<DictWord>;
};


// local persistence service
class Storage {
  private _state: any;
  get state(): State {
    //initially, load data from storage
    return this._state ?? (this._state = JSON.parse(localStorage.getItem("focusator-words") ?? "null"));
  }
  set state(state) {
    this._state = state;
    localStorage.setItem("focusator-words", JSON.stringify(state));
  }
}

// service component
export class WordsStore extends Component {
  storage: Storage = new Storage();

  get state(): State {
    //initially, load data from storage
    return (
      this.storage.state || { dict: {} }
    );
  }
  set state(state) {
    this.storage.state = state;
  }

  updateState(state: State, update: Partial<State>) {
    return {
      state: Object.assign({}, state, update),
    }
  }

  onAddWords({ words }: { words: BaseWord[] }, { state }: this) {
    const dict: Hash<DictWord> = { ...state.dict };
    (words ?? []).map(w => Word.findOrCreate(w, dict))

    return this.updateState(state, { dict })
  }

  onMarkWord({ word, mark }, { state }: this) {
    const dict: Hash<DictWord> = { ...state.dict };
    const dictWord = Word.findOrCreate(word, dict)
    Word.mark(dictWord, mark)
    return this.updateState(state, { dict })
  }

  getWords() {
    return this.state.dict;
  }


}




