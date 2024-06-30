export default {
  klikable: `cursor-pointer 
text-gray-500 dark:text-gray-400

focus:ring-1 focus:ring-gray-200 dark:focus:ring-gray-700 

aria-selected:text-gray-500 aria-selected:dark:text-slate-50
aria-selected:bg-gray-100 aria-selected:dark:bg-gray-700

hover:text-gray-500 hover:dark:text-slate-50
hover:bg-gray-100 dark:hover:bg-gray-700`,

  fline: `flex flex-no-wrap items-center gap-2`,

  dropdown: `border border-slate-300 dark:border-slate-700 rounded-lg 
  text-gray-700 bg-slate-100 dark:bg-slate-600 dark:text-gray-200`,

  "dropdown-item": `hover:bg-slate-300 dark:hover:bg-slate-700`,
  "dropdown-item-selected": `bg-slate-400 dark:bg-slate-800;`,

  input: ` 
    w-full px-2 py-1 min-h-10
    text-lg 
    border border-solid border-gray-300 rounded-lg
    bg-gray-50 text-gray-900  placeholder-gray-400
    focus:ring-blue-500 focus:border-blue-500
    dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400
    dark:focus:ring-blue-500  dark:focus:border-blue-500
`,

  btn: `
      inline-flex flex-row 
      items-center justify-center gap-1
      text-sm text-center font-medium 
      rounded-full px-3 py-2 `,

  "btn-default": `text-gray-900 bg-gray-100 border border-gray-200
  hover:bg-gray-100 hover:text-blue-700
  focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800
  dark:bg-gray-700 dark:border-gray-600 dark:text-white
  dark:hover:text-white dark:hover:bg-gray-600
`,
  "btn-primary": `text-white
  bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700
  hover:bg-gradient-to-br hover:text-white
  focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800
`,
  "disabled:btn": `text-gray-500 bg-gray-100 border border-gray-200
  dark:bg-gray-700 dark:border-gray-600 dark:text-slate-100`,

  tab: `border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300`,
  "tab-active": `text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500`,

  nav: `bg-gray-300 dark:bg-gray-800 text-gray-800 dark:text-gray-300 z-10`,
  "nav-item": `text-gray-800 dark:text-gray-300 hover:bg-gray-700 hover:text-white text-base font-medium`,
  "nav-item--active": `bg-gray-900 text-white`,

  list: `flex flex-col md:gap-2`,
  "list-item": `block p-6
        md:rounded-lg border-b md:border-b-0 md:shadow-md
        bg-white hover:bg-gray-100
        dark:bg-gray-800 dark:hover:bg-slate-800
        border-gray-600 dark:border-gray-500
`,

  card: `p-6 bg-white
        border-y sm:border-x border-gray-200 sm:rounded-lg
        hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700
`,
  badge: `inline-block py-1 px-1.5 leading-none 
              text-center whitespace-nowrap align-baseline
              font-bold rounded ml-2 
              bg-gray-200 text-gray-600
              dark:bg-gray-600 dark:text-gray-300
`,
};
