import { transformFileJsonContent, readFileContent } from "ultimus-fs";

export function doVersionUp({ contractDir }) {
  const nextVersion = (version) => {
    const [maj = "1", min = "0", patch = "0"] = version.split(".");

    return [maj, min, String(1 + +patch)].join(".");
  };

  transformFileJsonContent(['./', "package.json"], (obj: any) => {
    const version = nextVersion(obj?.version ?? '1.0.1');
    const date = new Date().toISOString().split("T")[0];

    const latestLogs = readFileContent("git.log");

    transformFileJsonContent([contractDir, "changelog.json"], (cobj: any) => {
      const data = cobj?.data ?? [];
      const data100 = data.slice(0, 100);

      latestLogs.replaceAll(/^Merged PR (\d{2,}):\s*(.*)$/gm, (_1, _2, text: string) => {
        const [, type, id] = text.match(/^(.+?)\s(\d{2,})/) ?? [];
        if (!id || data100.find((e) => e.id === id)) return '';
        data.push({
          id,
          version,
          type: type?.toLowerCase(),
          url: `https://dev.azure.com/-/-/_workitems/edit/${id}`,
          text,
          date,
        });
        return '';
      });

      latestLogs.replaceAll(/^(fix|feat): (pbi|bug) (\d{4,})/gm, (_1, kind, type, id: string) => {
        if (!id || data100.find((e) => e.id === id)) return '';
        data.push({
          id,
          version,
          type,
          url: `https://dev.azure.com/-/-/_workitems/edit/${id}`,
          text: `${kind}: ${id}`,
          date,
        });
        return '';
      });

      return { data };
    });

    console.log(`✅ version up to ${version}`);
    return Object.assign(obj, { version });
  });
}
