const metaUrl =
  "https://script.google.com/macros/s/AKfycbzanjLtO_SqRt5SBhIeUfFUW8bKqf8geKC3dnxytCRk-_UgBvIl10qft1whQ7hJ2lpD/exec";

const excludes = [
  /cover/i,
  /Dump/i,
  /screenshot/i,
  /local components/i,
]
// # OPERATION = fetchFigmaFile

// const defaultOperation = 'generateReact';
const defaultOperation = 'normalize,generateUiSpec,generateReact';

export const config = {
  defaultOperation,
  copyright: process.env.COPYRIGHT || "2024, The company",
  figmaToken: process.env.FIGMA_TOKEN,
  figmaFileKey: process.env.FIGMA_FILE,
  reactOutputDir: process.env.REACT_OUTPUT_DIR,
  contractDir: process.env.CONTRACT_DIR,
  metaUrl,
  excludes,
};
