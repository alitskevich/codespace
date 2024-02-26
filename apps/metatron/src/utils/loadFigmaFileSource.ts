import { IndexedDb } from "arrmatura-ui/support/IndexedDb";
import { fetchFigmaApi } from "./fetchFigmaApi";


export async function loadFigmaFileSource(fileKey: string) {

  const db = new IndexedDb();

  db.open(`figma`, {
    collections: {
      files: 'id'
    },
    initialData: {}
  });

  let input = await db.get(fileKey, 'files');

  if (input) {
    fetchFigmaApi(`files/${fileKey}/versions?page_size=1`).then(async ({ versions }) => {
      const versionId = versions?.[0]?.id;
      if (versionId && versionId !== input.version) {
        input = await fetchFigmaApi(`files/${fileKey}?geometry=paths`);

        if (!input.error) {
          input.id = fileKey;
          await db.put(input, 'files');
          window.location.reload();
        }
      }
    });

    return input;
  }

  input = await fetchFigmaApi(`files/${fileKey}?geometry=paths`);
  if (!input.error) {
    input.id = fileKey;
    await db.put(input, 'files');
  }

  return input;
}
