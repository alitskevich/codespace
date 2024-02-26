// https://developer.chrome.com/docs/extensions/reference/manifest

// chrome.devtools.*
// chrome.extension.*

// Create a tab in the devtools area
chrome.devtools.panels.create("Metatron", "assets/logo.png", "chromext/devtools_panel.html", function (panel) {
  // mmm
});

// Create a connection to the background page
var backgroundPageConnection = chrome.runtime.connect({
  name: "devtools-page",
});

backgroundPageConnection.onMessage.addListener(function (message) {
  // Handle responses from the background page, if any
});

console.log("inspectedWindow", chrome.devtools.inspectedWindow);

// Relay the tab ID to the background page
backgroundPageConnection.postMessage({
  tabId: chrome.devtools.inspectedWindow.tabId,
  scriptToInject: "injection.js",
});

// devtools.js
// Example: Log the contents of the inspected page
chrome.devtools.inspectedWindow.eval('document', function (result, isException) {
  if (!isException) {
    console.log('Document of the inspected window:', result);
  } else {
    console.error('Failed to execute script:', result);
  }
});