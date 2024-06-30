/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./**/*.{xml,html}", "./node_modules/arrmatura-ui*/**/*.xml", "./node_modules/arrmatura-ui*/**/styles.ts"],

  safelist: [
    "text-2xl",
    "text-3xl",
    {
      pattern: /(text|bg)-(red|green|yellow|blue|gray|amber|sky|purple)-(300|500|700)/,
    },
    {
      pattern: /(-|)rotate-90/,
    }
  ],
};
