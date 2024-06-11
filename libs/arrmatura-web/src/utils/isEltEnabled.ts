export const isEltEnabled = e => !e.disabled && !e.getAttribute('aria-disabled') && !e.classList.contains("disabled");
