import { IArrmatron } from "arrmatura/types";
import commonUiTypes from "arrmatura-ui";
import launchWeb from "arrmatura-web";
import * as lib from "ultimus";
import { capitalize } from "ultimus";

import typesRegistry from "./src/registry";
import appResources from "./src/resources";
import { fetchApiData } from "./src/utils/fetchApiData";
import { resolveProjectMetadata } from "./src/utils/resolveProjectMetadata";


const apiKey = "AKfycbwLdEiWXYDr5WESB7hI-zmwr4NEqx-6yhMhzi2uYk4OraJCvyWryvMGhYnzAYModa4N";
const { params, path } = lib.urlParse(window.location.href);
const pageId = window['pageId'] ?? path[0] ?? "home";
const projectsUrl = `https://script.google.com/macros/s/${apiKey}/exec`;
// const metatronUrl = `https://script.google.com/macros/s/AKfycbz9KNZSQr71Hg2seKmQvohsFQYNC7JRsrhN674j_XSIKQVyWvHELExJrzHoQLK7ObRt/exec`;

let root: IArrmatron | null = null;

const reload = (meta: any, projects: any, params = {}, resetUI?: lib.Fn, Platform?: any) => {
  const components = [...commonUiTypes, ...typesRegistry, ...(meta?.templates ?? [])];

  const resources = {
    ...appResources,
    ...meta,
    projects,
    resetUI,
    ...params,
    params,
    enums: { ...appResources.enums, ...meta.enums },
  };
  const template = `<App.${capitalize(pageId)} />`;
  root?.done();
  root = launchWeb({ template, components, resources, Platform });
};

function main() {

  fetchApiData(`projects`, projectsUrl).then(({ projects }) => {
    if (pageId === "project") {
      const projectId = path[1] ?? params.projectId;
      const projectUrl = `https://script.google.com/macros/s/${projectId}/exec`;

      resolveProjectMetadata(projectId, projectUrl).then((data) =>
        reload((data), projects, { ...params, projectId })
      );
    } else if (pageId === "preview") {
      const { projectId, darkMode, locale } = params;
      const projectUrl = `https://script.google.com/macros/s/${projectId}/exec`;

      const root = window.document.querySelector(":root");
      if (root) {
        root.className = darkMode ? "dark" : "";
      }

      window.document.dir = locale === "ar" ? "rtl" : "ltr";
      const resetUI = () =>
        resolveProjectMetadata(projectId, projectUrl).then((_data) => {

          //reload((data), projects, params, resetUI, PreviewWebPlatform)
        }
        );

      resetUI();
    } else if (pageId === "editor" || pageId === "chromext") {
      const projectId = window.projectId ?? path[1] ?? params.projectId;
      const itemId = path[2] ?? params.itemId;
      const projectUrl = `https://script.google.com/macros/s/${projectId}/exec`;

      resolveProjectMetadata(projectId, projectUrl).then((data) => {
        const metadata = (data)
        reload(metadata, projects, {
          ...params,
          projectId,
          itemId,
          item: metadata.components.find(e => e.id == itemId)
        })
      }
      );
    } else {
      reload({}, projects);
    }
  });
}

main();
