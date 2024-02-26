// This is included and executed in the inspected page
(function () {
  console.log("External script attached");
  // var editorExtensionId = "abcdefghijklmnoabcdefhijklmnoabc";

  chrome.runtime.sendMessage({ content: document.body.outerHTML }, function (message) {
    console.log("outerHTML sent", message);
  });
})();
