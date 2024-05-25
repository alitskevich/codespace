import { fetchIntoFile } from "../utils/fetchIntoFile";

export async function doFetchContract({ metaUrl, contractDir }) {
  console.log(`✅ Fetch Contract: ${metaUrl}`);
  await fetchIntoFile(metaUrl, [contractDir, `app.contract.json`]);

  console.log(`✅ Contract metadata has been fetched`);
}
