import type { IArrmatronRoot, IPlatform } from "arrmatura/types";

import { CRootNode } from "./src/registry/root";

export * from "./src/registry";
export { CRootNode } from "./src/registry/root";
export * from "./src/core/Component";

/**
 * Launches the runtime with given top-level template on the specified platform.
 *
 * @param {IPlatform} platform - The platform on which to launch the template.
 * @param {string} template - The template to launch with.
 * @return {IArrmatronRoot} The root context object.
 */
export const launch = (platform: IPlatform, template: string): IArrmatronRoot => {
  const root = new CRootNode(template).createArrmatron(platform);

  root.up({}, true);

  return root;
};
