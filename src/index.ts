// @ts-ignore
import {parse} from "can-stache-ast";
// const makeSourceMap = require( "./source-map" );
import { Plugin, ViteDevServer } from 'vite'
import process from "process";

export interface Options {
  isProduction?: boolean
}
export interface ResolvedOptions extends Options {
  root: string
  devServer?: ViteDevServer
}

export default function stachePlugin(rawOptions: Options = {}): Plugin {
  let options: ResolvedOptions = {
    isProduction: process.env.NODE_ENV === 'production',
    ...rawOptions,
    root: process.cwd()
  }

  return {
    name: 'vite:stache',
    configResolved(config: ResolvedOptions) {
      options = {
        ...options,
        root: config.root,
        isProduction: config.isProduction
      }
    },
    transform(code: string, id: string) {
      const [filename, ] = id.split('?', 2)

      if (filename.endsWith('.stache')) {

        const ast = parse(id, code.trim());
        const intermediate = JSON.stringify(ast.intermediate);

        const tagImportMap: string[] = [];
        const simpleImports: string[] = [];

        const staticImports = [...new Set(ast.imports)];
        staticImports.forEach((file) => {
          for (let importFile of ast.importDeclarations) {
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

        const dynamicImportMap: string[] = ast.dynamicImports || [];

        // language=JavaScript
        var body = `
          import stache from 'can-stache';
          import Scope from 'can-view-scope';
          import 'can-view-import';
          import 'can-stache/src/mustache_core';
          import stacheBindings from 'can-stache-bindings';

          ${tagImportMap.map((file, i) => `import * as i_${i} from '${file}';`).join('\n')}
          ${simpleImports.map((file) => `import '${file}';`)}

          stache.addBindings(stacheBindings);
          var renderer = stache(${intermediate});

          ${dynamicImportMap.length ? `
          window.require = window.require || new Function('return false');
          (function () {
            const oldPrototype = window.require.prototype;
            const oldRequire = window.require;
            window.require = async function (moduleName) {
              const dynamicImportMap = Object.assign({}, ${dynamicImportMap.map((file) => {
                return `import.meta.glob('${file}')`;
              }).join(",")});

              if (moduleName in dynamicImportMap) {
                return dynamicImportMap[moduleName]()
              }
              return oldRequire.apply(this, arguments);
            };
            window.require.prototype = oldPrototype;
          })();`: ``}

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
