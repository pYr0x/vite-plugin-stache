import path from "path";

export function createCodeSnippetForDynamicImports(dynamicImports: string[]): string {
  if(dynamicImports.length) {
    return `const dynamicImportMap = Object.assign({}, ${dynamicImports.map((file) => {
      if(!path.extname(file)){
        file += '.js';
      }
      return `import.meta.glob('${file}')`;
    }).join(",")});
            dynamicImporter(dynamicImportMap);`;
  }
  return '';
}

export function createCodeSnippetForStaticImports(staticImports: string[]): string {
  if(staticImports.length) {
    return `const staticImportMap = [${staticImports.map((file) => {
      return `"${file}"`;
    }).join(",")}];
            staticImporter(staticImportMap);`;
  }
   return '';
}
