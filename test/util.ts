import {RollupOptions, RollupOutput} from "rollup";
import {build as viteBuild} from "vite";
// import {default as stache} from '../dist/cjs/index';
// import {default as stache} from '../src/index';
import stachePlugins from '../dist/esm/index';
import fsSync from "fs";
import path from "path";


export async function generateBundle(
  example: string,
  options: RollupOptions = {},
): Promise<RollupOutput> {
  // @ts-ignore
  return await viteBuild({
    configFile: false,
    root: path.resolve(__dirname, `../examples/${example}`),
    build: {
      manifest: true,
      minify: false,
      polyfillDynamicImport: false,
      rollupOptions: Object.assign({
        input: {
          main: path.resolve(__dirname, `../examples/${example}/index.js`),
        },
        output: {
          manualChunks: undefined
        },
      }, options),
      write: false
    },
    plugins: [
      ...stachePlugins()
    ]
  });
}

export async function writeBundle(
  example: string,
  options: RollupOptions = {},
): Promise<RollupOutput> {
  // @ts-ignore
  return await viteBuild({
    configFile: false,
    root: path.resolve(__dirname, `../examples/${example}`),
    build: {
      manifest: true,
      minify: false,
      polyfillDynamicImport: false,
      rollupOptions: Object.assign({
        input: {
          main: path.resolve(__dirname, `../examples/${example}/index.html`),
        },
        output: {
          // manualChunks: undefined
        },
      }, options),
      write: true
    },
    plugins: [
      ...stachePlugins()
    ]
  });
}

export function deleteMatchedFiles(dir: string, regex: RegExp) {
  fsSync.readdirSync(dir)
    .filter(f => regex.test(f))
    .map(f => fsSync.unlinkSync(path.resolve(dir, f)));
}

export function injectScript(script: string) {
  const s = document.createElement('script');
  s.text = script;
  const test = document.getElementsByTagName('body')[0];
  if(test){
    test.appendChild(s);
  }
}

export function getInnerText(element: HTMLElement | null): string {
  if(element){
    return element.innerText || element.textContent || "";
  }
  return "";
}
