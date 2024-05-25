// This is included and executed in the inspected page
(function () {
  console.log("External script attached");
  // Var editorExtensionId = "abcdefghijklmnoabcdefhijklmnoabc";

  chrome.runtime.sendMessage({ content: document.body.outerHTML }, (message) => {
    console.log("outerHTML sent", message);
  });
})();
