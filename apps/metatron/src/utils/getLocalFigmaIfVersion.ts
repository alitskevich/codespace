import { fetchFigmaApi } from "./fetchFigmaApi";

export async function getLocalFigmaIfVersion(db, fileKey: string) {
  const input = await db.get(fileKey, 'files');

  if (!input?.version) return null;

  const { versions } = await fetchFigmaApi(`files/${fileKey}/versions?page_size=1`);
  const versionId = versions?.[0]?.id;

  return (versionId === input.version) ? input : null;
}
