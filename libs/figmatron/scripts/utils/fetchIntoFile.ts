import { writeFileContent } from "ultimus-fs";

export async function fetchIntoFile(url: string, filePath: string[]) {
  const content = await fetch(url)
    .then((r) => r.text())
    .catch((error) => {
      console.error(error);
      return null;
    });

  if (content) {
    writeFileContent(filePath, content);
  }

  return content;
}
