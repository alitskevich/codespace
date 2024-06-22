import ui from "arrmatura-ui";

import { pages } from "./pages";
import * as services from "./services";
import { templates } from "./xml";

export const components = [...ui, ...templates, ...pages, ...Object.values(services)];
