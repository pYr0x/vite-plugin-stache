interface Program {
  filename: string,
  start: (tagName: string, unary: boolean) => void,
  attrStart: (attrName: string) => void,
  attrEnd: (attrName: string) => void,
  attrValue: (value: string) => void,
  end: (tagName: string, unary: boolean, line: number) => void,
  close: (tagName: string, unary: boolean, line: number) => void,
  chars: (text: string) => void,
  special: () => void
}

interface ImportDeclaration {
  specifier: string,
  loc: {
    line: number
  },
  attributes: Map<string, string>
}

interface Exports {
  [key: string]: string
}

declare module "can-stache-ast" {
  export function parse(filename: string, source:string): {
    intermediate: Program,
    program: Program,
    imports: string[],
    dynamicImports: string[],
    importDeclarations: ImportDeclaration[],
    ases: Exports,
    exports: Exports
  };
}
