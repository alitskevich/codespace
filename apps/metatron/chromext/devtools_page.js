// https://developer.chrome.com/docs/extensions/reference/manifest

// chrome.devtools.*
// chrome.extension.*

// // Create a tab in the devtools area
// @ts-ignore
chrome.devtools.panels.create("Metatron", "assets/logo.png", "./devtools_panel.html", function (panel) {
  // mmm
});

// // Create a connection to the background page
// @ts-ignore
var backgroundPageConnection = chrome.runtime.connect({
  name: "devtools-page",
});

// backgroundPageConnection.onMessage.addListener(function (message) {
//   // Handle responses from the background page, if any
// });

// @ts-ignore
console.log("inspectedWindow", chrome.devtools.inspectedWindow);

// Relay the tab ID to the background page
backgroundPageConnection.postMessage({
  // @ts-ignore
  tabId: chrome.devtools.inspectedWindow.tabId,
  scriptToInject: "injection.js",
});

// devtools.js
// Example: Log the contents of the inspected page
// @ts-ignore
chrome.devtools.inspectedWindow.eval('document', function (result, isException) {
  if (!isException) {
    console.log('Document of the inspected window:', result);
  } else {
    console.error('Failed to execute script:', result);
  }
});