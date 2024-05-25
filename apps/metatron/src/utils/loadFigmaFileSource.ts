import { fetchFigmaApi } from "./fetchFigmaApi";
import { getLocalFigmaIfVersion } from "./getLocalFigmaIfVersion";
import { openFigmaDb } from "./openFigmaDb";

export async function loadFigmaFileSource(id: string) {

  const db = openFigmaDb();

  let input = await getLocalFigmaIfVersion(db, id);

  if (input) return input;

  input = await fetchFigmaApi(`files/${id}?geometry=paths`);

  if (input.error) return input;

  const variables = {}// await fetchFigmaApi(`files/${id}/variables/local`);

  await db.put(Object.assign(input, { id, variables }), 'files');

  return input;
}
