import {parse} from "can-stache-ast";
// const makeSourceMap = require( "./source-map" );
import {Plugin} from 'vite'
import process from "process";
import stacheTransformer from "stache-inline-transformer";
import whichModules from "stache-inline-transformer/dist/transformer/modules";
import {createCodeSnippetForDynamicImports, createCodeSnippetForStaticImports} from "./codeSnippets";
import {Options, ResolvedOptions} from "../types/plugin";
import {identifyImports} from "./util";


function stacheFilePlugin(rawOptions: Options = {}): Plugin {
  const {
    include = /\.stache$/,
    exclude
  } = rawOptions

  let options: ResolvedOptions = {
    isProduction: process.env.NODE_ENV === 'production',
    ...rawOptions,
    include,
    exclude,
    root: process.cwd()
  }
  return {
    name: 'vite:stache',
    configResolved(config) {
      options = {
        ...options,
        root: config.root,
        sourceMap: config.command === 'build' ? !!config.build.sourcemap : true,
        isProduction: config.isProduction
      }
    },
    transform(code: string, id: string) {
      const [filename] = id.split('?', 2)
      code = code.trim()
      if (filename.endsWith('.stache') && !code.startsWith('import')) {

        const ast = parse(id, code);
        const intermediate = JSON.stringify(ast.intermediate);

        const {simpleImports, tagImportMap} = identifyImports( [...new Set(ast.imports)], ast.importDeclarations);

        const dynamicImports = ast.dynamicImports || [];
        // console.log(ast);

        // language=JavaScript
        const body = `
          import stache from 'can-stache';
          import Scope from 'can-view-scope';
          import 'can-view-import';
          import 'can-stache/src/mustache_core';
          import stacheBindings from 'can-stache-bindings';

          ${(Object.keys(dynamicImports).length || tagImportMap.length || simpleImports.length) ? `import {staticImporter, dynamicImporter} from 'vite-stache-import-module';`: ``}
          ${tagImportMap.map((file, i) => `import * as i_${i} from '${file}';`).join('\n')}
          ${simpleImports.map((file) => `import '${file}';`).join('\n')}

          ${(tagImportMap.length || simpleImports.length) && createCodeSnippetForStaticImports([...tagImportMap, ...simpleImports])}

          stache.addBindings(stacheBindings);
          var renderer = stache(${intermediate});

          ${dynamicImports.length && createCodeSnippetForDynamicImports(dynamicImports)}

          export default function (scope, options, nodeList) {
            if (!(scope instanceof Scope)) {
              scope = new Scope(scope);
            }
            var variableScope = scope.getScope(function (s) {
              return s._meta.variable === true
            });
            if (!variableScope) {
              scope = scope.addLetContext();
              variableScope = scope;
            }
            var moduleOptions = Object.assign({}, options);
            Object.assign(variableScope._context, {
              module: null,
              tagImportMap: {${tagImportMap.map((file, i) => `"${file}": i_${i}`).join(',')}}
            });

            return renderer(scope, moduleOptions, nodeList);
          };`;

        // const sourceMap = makeSourceMap( body, code.trim(), filename )

        return {
          code: body,
          map: {mappings: ''}
          // map: sourceMap
        };
      }
      return null;
    }
  }
}

function stacheImportPlugin(rawOptions: Options = {}): Plugin {
  let options: ResolvedOptions = {
    isProduction: process.env.NODE_ENV === 'production',
    ...rawOptions,
    root: process.cwd()
  }

  return {
    name: 'vite:stache-import-module',
    configResolved(config) {
      options = {
        ...options,
        root: config.root,
        sourceMap: config.command === 'build' ? !!config.build.sourcemap : true,
        isProduction: config.isProduction
      }
    },
    resolveId ( source ) {
      if (source === 'vite-stache-import-module') {
        return source;
      }
      return null;
    },
    load ( id ) {
      if (id === 'vite-stache-import-module') {
        // language=JavaScript
        return `
          import {flushLoader, addLoader} from 'can-import-module';

          flushLoader();

          export function staticImporter(staticImportMap){
            addLoader((moduleName) => {
              if (staticImportMap.indexOf(moduleName) !== -1) {
                return Promise.resolve();
              }
            });
          }

          export function dynamicImporter(dynamicImportMap) {
            addLoader((moduleName) => {
              if (!(moduleName.match(/[^\\\\\\\/]\\.([^.\\\\\\\/]+)$/) || [null]).pop()) {
                moduleName += '.js';
              }
              if (moduleName in dynamicImportMap) {
                return dynamicImportMap[moduleName]()
              }
            });
          }`
      }
      return null;
    }
  };
}

function stacheInlinePlugin(rawOptions: Options = {}): Plugin {
  let options: ResolvedOptions = {
    isProduction: process.env.NODE_ENV === 'production',
    ...rawOptions,
    root: process.cwd()
  }
  return {
    name: 'vite:stache-inline',
    configResolved(config) {
      options = {
        ...options,
        root: config.root,
        sourceMap: config.command === 'build' ? !!config.build.sourcemap : true,
        isProduction: config.isProduction
      }
    },
    transform(code: string, id: string) {
      const [filename] = id.split('?', 2)

      if (filename.endsWith('.js') && /node_modules/.exec(id) === null) {
        if (whichModules(code).length > 0) {
          const newCode = stacheTransformer(code);
          return {
            code: newCode,
            map: {mappings: ''}
          };
        }
      }
      return null;
    }
  }
}

export default function stachePlugin(rawOptions: Options = {}): Plugin[]{
  const {
    inlineTransformation = true,
  } = rawOptions
  const plugins: Plugin[] = [
    stacheFilePlugin(rawOptions),
    stacheImportPlugin(rawOptions)
  ];

  if(inlineTransformation){
    plugins.push(stacheInlinePlugin(rawOptions))
  }
  return plugins;
}
// // overwrite for cjs require('...')() usage
// module.exports = stachePlugin
// stachePlugin['default'] = stachePlugin
