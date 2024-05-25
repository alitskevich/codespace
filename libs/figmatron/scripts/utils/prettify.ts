import prettier from "prettier";

const prettiesOptions: prettier.Options = {
  parser: "babel",
  singleQuote: false,
  tabWidth: 2,
  printWidth: 120,
  semi: true,
  singleAttributePerLine: false,
  trailingComma: "es5",
};

export const prettify = (content) => {
  try {
    return prettier.format(content, prettiesOptions);
  } catch {
    console.error(`Failed to prettify content`);
    return content;
  }
};
