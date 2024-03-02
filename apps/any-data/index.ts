import launchWeb from "arrmatura-web";
import templates from "./index.xml";
import ui from "arrmatura-ui";
import defaults from "arrmatura-ui/resources";
import assets from "./assets";
import { urlParse } from "ultimus";

const { params } = urlParse(window.location.href);

let apiKey = params.apiKey ?? window.localStorage.getItem('apiKey:crud');
while (!apiKey) {
  apiKey = window.prompt('Enter API Key') ?? '';
  if (apiKey) {
  }
}

window.localStorage.setItem('apiKey:crud', apiKey)

const green = { name: 'domovod-meta', url: `https://script.google.com/macros/s/${apiKey}/exec?action=metadata` }

const config = {
  resources: { ...defaults, assets, params, green },
  components: [...ui, templates]
};

launchWeb(config);