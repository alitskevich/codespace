import ui from "arrmatura-ui";

import { services } from "./services";
import { templates } from "./xml";


export const components = [...ui, ...templates, ...services];
