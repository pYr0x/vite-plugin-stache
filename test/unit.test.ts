// import {assert, describe, expect, it, suite, test} from 'vitest'
import {describe, expect, it, should} from 'vitest'
import stachePlugin from "../src";
import {createCodeSnippetForDynamicImports, createCodeSnippetForStaticImports} from "../src/codeSnippets";
import {identifyImports} from "../src/util";

should();

interface ImportDeclaration {
  specifier: string,
  loc: {
    line: number
  },
  attributes: Map<string, string>
}


describe.concurrent('Plugin usage', () => {
  it('should be able to use the plugin', () => {
    expect(stachePlugin).to.be.a('function');
  });
  it('should have inlineTransformer in plugin array by default', () => {
    const plugins = stachePlugin();
    // last item in array should be inlineTransformer
    expect(plugins[plugins.length - 1].name).to.equal('vite:stache-inline');
  });
  it('disable inlineTransformer', () => {
    const plugins = stachePlugin({inlineTransformation: false});
    plugins.should.have.length(2)
    expect(plugins[plugins.length - 1].name).not.to.equal('vite:stache-inline');
  });
})
describe.concurrent('stache file', () => {

  it('should skip tranforming if file is not a stache file', async() => {
    const [filePlugin, , ] = stachePlugin();
    const transform = filePlugin.transform('var sum = 1+1;', 'test.js');
    expect(transform).to.be.null;
  });

  // stacheFilePlugin should return a object if filename ends with .stache
  it('should return a object with a code element if filename ends with .stache', async() => {
    const [filePlugin,] = stachePlugin();
    const transform = filePlugin.transform('', 'test.stache');
    expect(transform).to.be.a('object');
    expect(transform).to.have.property('code');
  });

  it('create a code snippet for dynamic imported files and adds .js extension to all files they haven´t', async() => {
    const codeSnippet = createCodeSnippetForDynamicImports(['./foo' ]);
    expect(codeSnippet).toMatchSnapshot();
    // search for foo.js in codeSnippet
    expect(codeSnippet).to.contain('foo.js');
  });

  it('create a code snippet for static imported files', async() => {
    const codeSnippet = createCodeSnippetForStaticImports(['./foo' ]);
    expect(codeSnippet).toMatchSnapshot();
    // search for foo in codeSnippet
    expect(codeSnippet).to.contain('foo');
  });

});

describe.concurrent('stache import', () => {
  // stacheImportPlugin load function should return a string if the id is vite-stache-import-module
  it('should return a string if the id is vite-stache-import-module', async() => {
    const [, importPlugin] = stachePlugin();
    const id = 'vite-stache-import-module';
    const load = importPlugin.load(id);
    expect(load).to.be.a('string');
  });
  // stacheImportPlugin load function should return null if id is not vite-stache-import-module
  it('should return null if id is not vite-stache-import-module', async() => {
    const [, importPlugin] = stachePlugin();
    const id = 'any-other-imported-module';
    const load = importPlugin.load(id);
    expect(load).to.be.null;
  });
});

describe.concurrent('stache inline', () => {
  // stacheInlinePlugin do not transform if file is located in node_modules
  it('should not transform if file is located in node_modules', async() => {
    const [, , inlinePlugin] = stachePlugin();
    const transform = inlinePlugin.transform('', 'node_modules/foo/bar.js');
    expect(transform).to.be.null
  });
  // stacheInlinePlugin do not transform the code if does not machtes the stache pattern
  it('should not transform the code if does not machtes the stache pattern', async() => {
    const [, , inlinePlugin] = stachePlugin();
    const transform = inlinePlugin.transform(`var sum = 1+1;`, 'test.js');
    expect(transform).to.be.null
  });
  // stacheInlinePlugin pass the code through the inlineTransformer if the stache pattern: StacheElement is found
  it('should pass the javascript code through the inlineTransformer if the stache pattern: StacheElement is found ', async() => {
    const [, , inlinePlugin] = stachePlugin();
    const transform = inlinePlugin.transform(`class Counter extends StacheElement {}`, 'test.js');
    expect(transform).to.be.a('object');
    expect(transform).to.have.property('code');
  });
});

describe.concurrent('utils', () => {
  it('identifyImports split correctly in simple imports and taged imports', async() => {
    const imports = ['./foo', './bar'];


    const importDeclarations: ImportDeclaration[] = [
      {
        "specifier": "./foo",
        "loc": {
          "line": 1
        },
        "attributes": new Map([["form", "./foo"], ["value:to", "scope.vars.foo"]])
      },
      {
        "specifier": "./bar",
        "loc": {
          "line": 2
        },
        "attributes": new Map([["form", "./bar"]])
      }
    ];
    const {simpleImports, tagImportMap} = identifyImports(imports, importDeclarations);
    expect(simpleImports).to.deep.equal(['./bar']);
    expect(tagImportMap).to.deep.equal(['./foo']);
  });
});

