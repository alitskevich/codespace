/*
 * This creates and maintains the communication channel between
 * the inspectedPage and the dev tools panel.
 * 
 * In this example, messages are JSON objects
 * {
 *   action: ['code'|'script'|'message'], // What action to perform on the inspected page
 *   content: [String|Path to script|Object], // data to be passed through
 *   tabId: [Automatically added]
 * }
 */
// window.pageId = 'chromext';
// window.projectId = 'AKfycby270ZB1dClxsslDg1Oc7QqGRjS6t7D39S2nrQbM7uk-haR2R-woxGtzhJWsiacFX8Oew';


(function createChannel() {
  //Create a port with background page for continous message communication
  const port = chrome.runtime.connect({
    name: "Sample Communication", //Given a Name
  });

  // Listen to messages from the background page
  port.onMessage.addListener((message) => {
    const elt = window.document.querySelector("#insertmessagebutton");

    if (elt) {
      elt.innerHTML = message.content;
    }
    // Port.postMessage(message);
  });
})();
/*
 * This one acts in the context of the panel in the Dev Tools
 *
 * Can use
 * chrome.devtools.*
 * chrome.extension.*
 */

/*
 * This sends an object to the background page
 * where it can be relayed to the inspected page
 */
// function sendObjectToInspectedPage(message) {
//   message.tabId = chrome.devtools.inspectedWindow.tabId;
//   chrome.runtime.sendMessage(message);
// }

/*
 * Document.querySelector("#executescript").addEventListener(
 *   "click",
 *   function () {
 *     sendObjectToInspectedPage({
 *       action: "code",
 *       content: "console.log('Inline script executed')",
 *     });
 *   },
 *   false
 * );
 */

/*
 * Document.querySelector("#insertscript").addEventListener(
 *   "click",
 *   function () {
 *     sendObjectToInspectedPage({
 *       action: "script",
 *       content: "scripts/inserted-script.js",
 *     });
 *   },
 *   false
 * );
 */

/*
 * Document.querySelector("#insertmessagebutton").addEventListener(
 *   "click",
 *   function () {
 *     sendObjectToInspectedPage({
 *       action: "code",
 *       content: "document.body.innerHTML='<button>Send message to DevTools</button>'",
 *     });
 *     sendObjectToInspectedPage({
 *       action: "script",
 *       content: "scripts/messageback-script.js",
 *     });
 *   },
 *   false
 * );
 */

