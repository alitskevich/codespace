import { mapDirectoryRecurrsive, mapFilesInDirectory, writeFileContent } from "../ultimus-fs";

// 1
function main() {
  const REGISTRY = {};

  mapDirectoryRecurrsive('.', f => {
    if (f.name.startsWith('vendor') || f.name.startsWith('support') || f.name.startsWith('impl') || f.name.startsWith('utils')) return;

    if (f.isDirectory()) {
      return mapFilesInDirectory([f.name], (ff, dir) => {
        if (ff.startsWith('utils')) return;
        if (ff.startsWith('types')) return;
        console.log(ff, dir)
        const ids = ff.split('.');
        const ext = ids.pop();
        const id = ids.join('');
        if (ext == 'xml') {
          REGISTRY[id] = `import ${id} from "./${f.name}/${ff}"`
        }
        if (ext == 'ts') {
          REGISTRY[id] = `import { ${id} } from "./${f.name}/${id}"`
        }
      })
    } else {
      // console.log(f.name)
      // return f.name
    }
  });

  writeFileContent('index.ts', `
${Object.values(REGISTRY)?.sort().join(';\n')}

// all componets types:
export default [
  ${Object.keys(REGISTRY)?.sort().join(',\n  ')}
];
`)

}

main();