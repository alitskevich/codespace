import { addOnConnectionMessageListener, initializeRuntimeListeners } from "./background-utils.js";

initializeRuntimeListeners({
  onInstalled: () => {
    // Chrome automatically creates a background.html page for this to execute.
    const color = "#3aa757";
    //   Chrome.storage.sync.set({ color });
    console.log("Default background color set to %cgreen", `color: ${color}`);

    /*
     * Chrome.action.setBadgeText({
     *   text: "OFF",
     * });
     */
  },
  onConnect: (connection) =>
    addOnConnectionMessageListener(connection, (message, _sender, _sendResponse) => {
      const { tabId, scriptToInject } = message;
      console.log(message);
      // Inject a content script into the identified tab
      if (tabId && scriptToInject) {
        chrome.scripting.executeScript({
          target: { tabId },
          files: [scriptToInject],
        });
      }
    })
  ,
  onMessage(request, sender, sendResponse) {
    console.log(sender.tab ? `from a content script:${sender?.tab?.url}` : "from the extension", request);
    sendResponse({ farewell: "goodbye", content: request.content });
    return true;
  }
})


