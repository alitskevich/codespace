/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./**/*.xml", "./node_modules/arrmatura-ui*/**/*.xml", "./node_modules/arrmatura-ui*/**/styles.ts"],
  safelist: [
    "text-2xl",
    "text-3xl",
    {
      pattern: /(text|bg)-(red|green|yellow|blue|gray|amber|sky)-(500|700)/,
    },
    {
      pattern: /(-|)rotate-90/,
    }
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter var',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',],
      },
      colors: {
        clifford: "#da373d",
        active: "#86198f",
      },
    },
  },
};
