import ui from "arrmatura-ui";
import branding from "./branding.xml";
import main from "./main.xml";
import app from "./app.xml";
import mywords from "./mywords.xml";
import idioms from "./idioms.xml";
import text from "./text.xml";
import quiz from "./quiz.xml";
import stat from "./stat.xml";
import atoms from "./atoms.xml";
import ctest from "./ctest.xml";
import interview from "./interview.xml";
import addText from "./add-text/add-text.xml";

import { WordsStore } from "./WordsStore"
import { SimpleWordsStore } from "./SimpleWordsStore"
import { QuizService } from "./QuizService"
import { AddTextStore } from "./add-text/AddTextStore";

export const components = [SimpleWordsStore, AddTextStore, WordsStore, QuizService, ...ui, app, addText, atoms, ctest, interview, branding, main, mywords, idioms, text, quiz, stat];
