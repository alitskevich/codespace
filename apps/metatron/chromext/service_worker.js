// Chrome automatically creates a background.html page for this to execute.
const color = "#3aa757";

chrome.runtime.onInstalled.addListener(() => {
  //   chrome.storage.sync.set({ color });
  console.log("Default background color set to %cgreen", `color: ${color}`);

  chrome.action.setBadgeText({
    text: "OFF",
  });
});

// Background page -- background.js
// chrome.runtime.onConnect.addListener(function(devToolsConnection) {
//     // assign the listener function to a variable so we can remove it later
//     var devToolsListener = function(message, sender, sendResponse) {
//         const {tabId,scriptToInject} = message;
//         console.log(message);
//         // Inject a content script into the identified tab
//         if (tabId && scriptToInject) {
//             chrome.scripting.executeScript({
//                 target : {tabId },
//                 files : [ scriptToInject ],
//               });
//         }
//     }
//     // add the listener
//     devToolsConnection.onMessage.addListener(devToolsListener);

//     devToolsConnection.onDisconnect.addListener(function() {
//          devToolsConnection.onMessage.removeListener(devToolsListener);
//     });
// });

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(sender.tab ? "from a content script:" + sender?.tab?.url : "from the extension", request);
  sendResponse({ farewell: "goodbye", content: request.content });
  return true;
});

chrome.action.onClicked.addListener(async (tab) => {
  // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
  const tabId = tab.id;
  const prevState = await chrome.action.getBadgeText({ tabId });
  // Next state will always be the opposite
  const text = prevState === "ON" ? "OFF" : "ON";

  // Set the action badge to the next state
  await chrome.action.setBadgeText({ tabId, text });

  if (text === "ON") {
    // Insert the CSS file when the user turns the extension on
    await chrome.scripting.insertCSS({
      files: ["chromext/focus-mode.css"],
      target: { tabId: tab.id },
    });
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ["chromext/injection.js"],
    });
  } else if (text === "OFF") {
    // Remove the CSS file when the user turns the extension off
    await chrome.scripting.removeCSS({
      files: ["chromext/focus-mode.css"],
      target: { tabId: tab.id },
    });
  }
});
