import * as lib from "ultimus";
import { launch } from "arrmatura";
import { WebPlatform } from "./platform";
import { popoversPlugin } from "./plugins/popoversPlugin";
import { LaunchWebOptions } from "../types";
import { portalsPlugin } from "./plugins/portalsPlugin";
import { dropdownPlugin } from "./plugins/dropdownPlugin";
import { draggingPlugin } from "./plugins/draggingPlugin";

/**
 * Creates an instance of the "Application" component and renders it to the page.
 *
 * @param template: Specifies the markup with root component of the application, default is <App />.
 * @param types: An array of component templates, in this case, the contents of the templates.xml file.
 * @param resources: An object that contains the static data used in the application.
 * @param functions: An object that contains functions that can be used in component templates.
 * @returns root node
 */
export function launchWeb(config?: LaunchWebOptions) {
  const { rootElement, functions, plugins = [], components = [], template = "<App/>", resources = {}, Platform = WebPlatform } = config ?? window as LaunchWebOptions;

  const $fn = { ...lib, ...resources?.functions, ...functions };

  const platform = new Platform(rootElement, {
    ...resources,
    functions: $fn,
  }, [popoversPlugin, portalsPlugin, dropdownPlugin, draggingPlugin, ...plugins]);

  platform.registerTypes(components);
  platform.registerTypes(resources?.types);

  platform.init();

  const top = launch(platform, template);

  window.addEventListener("beforeunload", () => {
    top.done()
    platform.done()
  });

  return top;
}
