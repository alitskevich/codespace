// https://developer.chrome.com/docs/extensions/reference/manifest

/*
 * Chrome.devtools.*
 * chrome.extension.*
 */

// // Create a tab in the devtools area
chrome.devtools.panels.create("Metatron", "assets/logo.png", "./devtools_panel.html", (_panel) => {
  // Mmm
});

// // Create a connection to the background page
const backgroundPageConnection = chrome.runtime.connect({
  name: "devtools-page",
});

/*
 * BackgroundPageConnection.onMessage.addListener(function (message) {
 *   // Handle responses from the background page, if any
 * });
 */

console.log("inspectedWindow", chrome.devtools.inspectedWindow);

// Relay the tab ID to the background page
backgroundPageConnection.postMessage({
  tabId: chrome.devtools.inspectedWindow.tabId,
  scriptToInject: "injection.js",
});

/*
 * Devtools.js
 * Example: Log the contents of the inspected page
 * @ts-ignore
 */
chrome.devtools.inspectedWindow.eval('document', (result, isException) => {
  if (!isException) {
    console.log('Document of the inspected window:', result);
  } else {
    console.error('Failed to execute script:', result);
  }
});