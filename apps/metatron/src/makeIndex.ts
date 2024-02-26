import { mapDirectoryRecurrsive, mapFilesInDirectory, writeFileContent } from "ultimus-fs";


function main() {
  const REGISTRY = {};

  mapDirectoryRecurrsive('.', f => {
    if (f.name.startsWith('core') || f.name.startsWith('util') || f.name.startsWith('support')) return;

    if (f.isDirectory()) {
      return mapFilesInDirectory([f.name], (ff, dir) => {
        if (ff.startsWith('utils')) return;
        console.log(ff, dir)
        const [id, ext] = ff.split('.')
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

  writeFileContent('registry.ts', `
${Object.values(REGISTRY)?.join(';\n')}

// all componets types:
export default [
  ${Object.keys(REGISTRY)?.join(',\n  ')}
];
`)

}

main();