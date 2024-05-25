import { Component } from "arrmatura";
import { arraySortBy } from "ultimus";


/**
 * Speech API.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/speak
 */
export class SpeechService extends Component {

  synth = window.speechSynthesis
  voices = this.synth.getVoices();
  voicesList = arraySortBy(this.voices.map((e, id) => ({ ...e, id, name: `${e.name} (${e.lang})`, language: e.lang, voice: e })), 'name');
  defaultVoice = this.voices.find(e => e.default) ?? this.voices[0] ?? { lang: 'en-US', name: 'English' };

  language = this.defaultVoice.lang?.slice(0, 2) ?? 'en'

  textToSpeech({ text, ...options }: any) {
    const utterThis = Object.assign(new SpeechSynthesisUtterance(text), options);
    this.synth.speak(utterThis);
  }

  get currentVoices() {
    return this.voicesList.filter(e => e.language.startsWith(this.language));
  }

  get voice() {
    return this.currentVoice ?? this.defaultVoice;
  }

  set voice(voiceId) {
    this.currentVoice = this.voicesList.find(e => e.id === voiceId)?.voice;
  }
}
