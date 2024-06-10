import ui from "arrmatura-ui";

import * as services from "./services";
import { templates } from "./xml";

export const components = [...ui, ...templates, ...Object.values(services)];
