import defaults from "arrmatura-ui/resources";

import assets from "../assets";

import * as functions from "./utils/functions";
import { initialData } from "./utils/initialData";

export const resources = {
  ...defaults,
  name: "10ACE",
  app: {
    hint: "Paste here any text you want and tap red button.",
    hint2:
      "Enjoy reading and pick up unknown words. You can review all of them at once on the 'Review' page",
    lemmaUrl:
      "https://docs.google.com/spreadsheets/d/1JenJOLO0GJSPlpwl0sTeaU5xVBr8SMqBtMN1ehgjXLI/edit#gid=1464289509",
    dictionaryUrl: "https://www.merriam-webster.com/dictionary/",
    copy: "© 2024, 10ACE. All rights reserved.",
    slogan: "Learn as you go",
    overview: `Pick up a new words from any text, hone with your own vocabulary and see how well you progress!`,
    logoUrl: assets.logo,
    pictureUrl: assets.picture,
  },
  nav: [
    { id: "addText", name: "Upload", caption: "Add a new text" },
    { id: "quiz", name: "Quiz", caption: "Practice until confident." },
    { id: "ctest", name: "Train", caption: "Train until done." },
    { id: "mywords", name: "Revise", caption: "Revise wordbank." },
    { id: "irregular", name: "Irregular", caption: "Irregular verbs." },
  ],
  functions,
  assets,
  strings: {
    confirm: "Confirm",
    nextQuestion: "Next Question",
    congratTitle: "Never give up!",
    congratButtonTitle: "Submit",
  },
  samples: {
    text1:
      "Explore the impact of generative AI on software development methodologies, from traditional processes to the challenges and benefits of using AI tools. Dive into the evolution of roles in the AI space and the potential blending of roles with virtual agents. Discover practical AI applications, automation of routine tasks, and testing AI capabilities with different currencies. Learn about the importance of aligning organizational beliefs with client pitches and mastering wave two and three approaches for increased productivity. Join the discussion on workflow, collaboration, change management, and adoption of new tools, with a focus on empowering users and driving adoption and trust in tools. Don't miss out on this insightful exploration of the future of AI in software development.",
    text2: `An element will only render something when a texture is defined. A texture is rendered as a background, and the children are rendered in front of it.
      The easiest way to define a texture is by specifying one of the following shorthand properties:`,
  },
  db: {
    name: "focusator",
    stores: {
      thesaurus: { keyPath: "id", indicies: { en: {}, adversial: {} } },
      idioms: { keyPath: "id", indicies: { stems: { multiEntry: true } } },
      acquired: { keyPath: "id", indicies: {} },
      irregular: { keyPath: "id", indicies: {} },
      ctest: { keyPath: "id", indicies: {} },
      interview: { keyPath: "id", indicies: {} },
      dictionary: { keyPath: "id", indicies: { family: {}, stem: {} } },
    },
    initialData,
  },
  enums: {
    fiveNumbers: [
      { id: "1", name: "1" },
      { id: "2", name: "2" },
      { id: "3", name: "3" },
      { id: "4", name: "4" },
      { id: "5", name: "5" },
    ],
    acquired: [
      { id: "-1", name: "Incognito" },
      { id: "0", name: "In progress" },
      { id: "1", name: "Confident!" },
    ],
    ctest: [
      { id: "ctest", name: "Basic" },
      { id: "idioms", name: "Large" },
      { id: "irregular", name: "Irregular" },
    ],
    languages: [
      { id: "en", name: "English" },
      { id: "es", name: "Spanish" },
      { id: "de", name: "Deutsch" },
    ],
    levels: [
      { id: "A", name: "A" },
      { id: "B", name: "B" },
      { id: "C", name: "C" },
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
  columns: {
    thesaurus: [
      { id: "en", name: "En" },
      { id: "definition", name: "definition" },
      { id: "ru", name: "ru" },
      { id: "adversial", name: "adversial", class: "text-gray-300" },
      { id: "alternate1", name: "alternate1" },
      { id: "alternate2", name: "alternate2" },
      { id: "alternate3", name: "alternate3" },
      { id: "alternate4", name: "alternate4" },
      { id: "alternate5", name: "alternate5" },
      { id: "alternate6", name: "alternate6" },
      { id: "alternate7", name: "alternate7" },
      { id: "alternate8", name: "alternate8" },
    ],
    irregular: [
      { id: "ru", name: "ru" },
      { id: "v1", name: "v1", type: "IrregularVerb", width: "minmax(40rem, 1fr)" },
    ],
  },
};
