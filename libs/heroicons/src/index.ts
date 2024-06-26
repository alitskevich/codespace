import launchWeb from "arrmatura-web";

import heroicons from "../heroicons.json";

import templates from "./index.xml";

launchWeb({
  components: [templates],
  resources: { heroicons },
});
