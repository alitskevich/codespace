export function generateEnvs(meta) {
  const variant = String(process.argv[2] ?? "default").trim();

  console.log("# Environment variables. ");
  console.log("# Generated file. Do not edit. ");

  console.log("\n# Environment code");
  console.log(`ENV="${variant}"`);

  const items = meta.env
    .filter((e) => e.id && !e.deleted)
    .map((e) => {
      const { id, isPublic, notes, link } = e;
      const value = String(e[`value_${variant}`] || e[`value`] || "").replaceAll('"', "");
      return `
# ${notes || id} ${link || ""}
${isPublic ? "NEXT_PUBLIC_" : ""}${id}="${value}"`;
    });

  console.log(items.join("\n"));
}
