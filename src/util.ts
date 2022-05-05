export function identifyImports(imports: string[], importDeclarations: ImportDeclaration[]) {
  const tagImportMap: string[] = [];
  const simpleImports: string[] = [];

  imports.forEach((file) => {
    for (let importFile of importDeclarations) {
      if (importFile && importFile.specifier === file && importFile.attributes instanceof Map) {
        if(importFile.attributes.size > 1) {
          tagImportMap.push(importFile.specifier);
          break;
        }else if(importFile.attributes.size === 1){
          simpleImports.push(importFile.specifier);
          break;
        }
      }
    }
  });
  return {simpleImports, tagImportMap};
}
