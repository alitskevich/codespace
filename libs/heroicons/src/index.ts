import launchWeb from "arrmatura-web";

import heroicons from "../heroicons.json";

import templates from "./index.xml";

launchWeb({
  types: [templates],
  resources: { heroicons },
});
