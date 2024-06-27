import ui from "arrmatura-ui";
import defaults from "arrmatura-ui/resources";
import launchWeb from "arrmatura-web";
import { urlParse } from "ultimus";

import assets from "./assets";
import templates from "./index.xml";
import customComponents from "./src";

const { params } = urlParse(window.location.href);

let apiKey = params.apiKey ?? window.localStorage.getItem("apiKey:crud");
while (!apiKey) {
  apiKey = window.prompt("Enter API Key") ?? "";
}

window.localStorage.setItem("apiKey:crud", apiKey);

const green = {
  name: `meta${apiKey}`,
  url: `https://script.google.com/macros/s/${apiKey}/exec?action=metadata`,
};

const configLocal = {
  authLocal: {
    url: `http://localhost:3000/dev/api`,
    isSignUpAllowed: true,
  },
  apiLocal: {
    url: `http://localhost:5001/mozart-389609/us-central1/api`,
  },
};

const config = {
  resources: {
    ...defaults,
    assets,
    params,
    green,
    ...configLocal,
  },
  components: [...ui, templates, ...customComponents],
};

launchWeb(config);
