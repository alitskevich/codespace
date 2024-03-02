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

import { WordsStore } from "./WordsStore"
import { QuizService } from "./QuizService"

export const components = [WordsStore, QuizService, ...ui, app, atoms, ctest, interview, branding, main, mywords, idioms, text, quiz, stat];
