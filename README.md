# vite-plugin-stache

![](https://img.shields.io/github/workflow/status/pYr0x/vite-plugin-stache/CI?style=flat-square)
![](https://img.shields.io/npm/v/vite-plugin-stache?style=flat-square)
![](https://img.shields.io/node/v/vite-plugin-stache?style=flat-square)
![](https://img.shields.io/npm/dependency-version/vite-plugin-stache/peer/vitejs?style=flat-square)

> vite-plugin-stache requires CanJS >= 5.x

## Install

```bash
npm i vite-plugin-stache --save-dev
```
or
```bash
yarn add -D vite-plugin-stache
```
or
```bash
pnpm add -D vite-plugin-stache
```

## Usage
Use the plugin in your Vite config (`vite.config.ts`)
### All-in-one
```JavaScript
import stachePlugins from 'vite-plugin-stache'

export default {
    plugins: [
      ...stachePlugins()
    ]
}
```

### Plugins
The Vite-Stache plugin consists of several plugins.
- Stache-Loader: Loads a .stache template file and converts it into a javascript module with the stache-ast for the template part.
- Stache-Import: Within the .stache file you can import other files like (https://canjs.com/doc/can-view-import.html). This plugin handles static and dynamic import (ES2020 `import()`).
- Stache-Inline-Converter _(optional)_: Searching for a stache template string within javascript files and converts it into an AST.


```JavaScript
import stachePlugins from 'vite-plugin-stache'

export default {
    plugins: [
      stachePlugins({inlineTransformation: false})
    ]
}
```
