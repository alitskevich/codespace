import defaults from "arrmatura-ui/resources";

import assets from "../assets";
import pictureUrl from "../assets/jumbo3.webp";
import logoUrl from "../assets/logo.svg";

import { addNextIds } from "./utils/addNextIds";
import { toColor, toColorText } from "./utils/color";
import { idiomsHash } from "./utils/idiomsHash";
import { initialData } from "./utils/initialData";
import { parseText } from "./utils/parser";

// resource bundle: strings, metadata, pipes functions
const functions = {
  toColor, toColorText, parseText, idiomsHash, addNextIds
};

export const resources = {
  ...defaults,
  name: "Focusator",
  app: {
    hint: "Paste here any text you want and tap red button.",
    hint2: "Enjoy reading and pick up unknown words. You can review all of them at once on the 'Review' page",
    lemmaUrl: "https://docs.google.com/spreadsheets/d/1JenJOLO0GJSPlpwl0sTeaU5xVBr8SMqBtMN1ehgjXLI/edit#gid=1464289509",
    dictionaryUrl: "https://www.merriam-webster.com/dictionary/",
    copy: "© 2023, Arrmatura. All rights reserved.",
    slogan: "Learn as you go",
    overview: `Pick up a new words from any text, hone with your own vocabulary and see how well you progress!`,
    logoUrl,
    pictureUrl
  },
  functions,
  assets,
  strings: {
    confirm: "Confirm",
    nextQuestion: "Next Question",
    congratTitle: "Your statistics",
    congratButtonTitle: "Submit",
    textSample: `An element will only render something when a texture is defined. A texture is rendered as a background, and the children are rendered in front of it.
      The easiest way to define a texture is by specifying one of the following shorthand properties:`,
  },
  db: {
    name: 'focusator',
    collections: {
      concepts: 'id',
      idioms: 'id',
      acquired: 'id',
      ctest: 'id',
      interview: 'id',
    },
    initialData
  },
  enums: {
    fiveNumbers: [
      { id: "1", name: "1" },
      { id: "2", name: "2" },
      { id: "3", name: "3" },
      { id: "4", name: "4" },
      { id: "5", name: "5" },
    ],
    acknowledgements: [
      { id: "3", name: "Confident!" },
      { id: "2", name: "In progress" },
      { id: "1", name: "Incognito" },
    ],
    acquired: [
      { id: "3", name: "Confident!" },
      { id: "2", name: "In progress" },
      { id: "1", name: "Incognito" },
    ],
    languages: [
      { id: "en", name: "English" },
      { id: "es", name: "Spanish" },
      { id: "de", name: "Deutsch" },
    ],
    levels: [
      { id: "500", name: "A1" },
      { id: "200", name: "A2" },
      { id: "100", name: "B1" },
      { id: "50", name: "B2" },
      { id: "20", name: "C1" },
    ],
    marks: [
      { id: "all", name: "All" },
      { id: "1", name: "Incognito" },
      { id: "2", name: "Need practice" },
      { id: "3", name: "Confident" },
    ],
  },
  forms: {
    filter: [
      { id: "acquired", name: "Acquired", type: "enum", typeSpec: "acquired" },
      { id: "topic", name: "Topic" },
      { id: "tags", name: "Tags", type: "multitext" },
    ],
  },
};