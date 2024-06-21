export function speak(text, options) {
  requestAnimationFrame(() => {
    window.speechSynthesis?.speak(
      Object.assign(new SpeechSynthesisUtterance(text), {
        lang: "en-US",
        ...options,
      })
    );
  });
}
