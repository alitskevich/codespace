// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const C = chrome;

C.runtime.onInstalled.addListener(() => {
  C.action.setBadgeText({
    text: "OFF",
  });
});

C.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(sender.tab ? `from a content script:${sender?.tab?.url}` : "from the extension", request);

  sendResponse({ farewell: "goodbye", content: request.content });

  return true;
});

C.action.onClicked.addListener(async (tab) => {
  // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
  const tabId = tab.id;

  const prevState = await C.action.getBadgeText({ tabId });

  // Next state will always be the opposite
  const text = prevState === "ON" ? "OFF" : "ON";

  // Set the action badge to the next state
  await C.action.setBadgeText({ tabId, text });

  if (text === "ON") {
    await C.scripting.insertCSS({
      files: ["dist/index.8cba7520.css"],
      target: { tabId: tab.id },
    });

    await C.scripting.executeScript({
      target: { tabId },
      files: ["dist/index.4942b430.js"],
    });
    // } else {

  }
});
