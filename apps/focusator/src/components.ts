import ui from "arrmatura-ui";

import { QuizService } from "./QuizService"
import { SimpleWordsStore } from "./SimpleWordsStore"
import { WordsStore } from "./WordsStore"
import { AddTextStore } from "./add-text/AddTextStore";
import addText from "./add-text/add-text.xml";
import app from "./app.xml";
import atoms from "./atoms.xml";
import branding from "./branding.xml";
import ctest from "./ctest.xml";
import idioms from "./idioms.xml";
import interview from "./interview.xml";
import main from "./main.xml";
import mywords from "./mywords.xml";
import quiz from "./quiz.xml";
import stat from "./stat.xml";
import text from "./text.xml";

export const components = [SimpleWordsStore, AddTextStore, WordsStore, QuizService, ...ui, app, addText, atoms, ctest, interview, branding, main, mywords, idioms, text, quiz, stat];
