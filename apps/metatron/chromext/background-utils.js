// Chrome automatically creates a background.html page for this to execute.
// const color = "#3aa757";

export const addOnConnectionMessageListener = (connection, listener) => {
  connection.onMessage.addListener(listener);
  connection.onDisconnect.addListener(() => {
    connection.onMessage.removeListener(listener);
  });
}

export const initializeRuntimeListeners = (listeners) => {
  Object.entries(listeners).forEach(([key, value]) => {
    chrome.runtime[key].addListener(value);
  })
}

/*
 * Chrome.action.onClicked.addListener(async (tab) => {
 *   // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
 *   const tabId = tab.id;
 *   const prevState = await chrome.action.getBadgeText({ tabId });
 *   // Next state will always be the opposite
 *   const text = prevState === "ON" ? "OFF" : "ON";
 */

/*
 *   // Set the action badge to the next state
 *   await chrome.action.setBadgeText({ tabId, text });
 */

/*
 *   If (text === "ON") {
 *     // Insert the CSS file when the user turns the extension on
 *     await chrome.scripting.insertCSS({
 *       files: ["chromext/focus-mode.css"],
 *       target: { tabId: tab.id },
 *     });
 *     await chrome.scripting.executeScript({
 *       target: { tabId },
 *       files: ["chromext/injection.js"],
 *     });
 *   } else if (text === "OFF") {
 *     // Remove the CSS file when the user turns the extension off
 *     await chrome.scripting.removeCSS({
 *       files: ["chromext/focus-mode.css"],
 *       target: { tabId: tab.id },
 *     });
 *   }
 * });
 */
