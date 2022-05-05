import {ViteDevServer} from "vite";

export interface Options {
  include?: string | RegExp | (string | RegExp)[]
  exclude?: string | RegExp | (string | RegExp)[]

  isProduction?: boolean,
  sourceMap?: boolean,

  inlineTransformation?: boolean,
}
export interface ResolvedOptions extends Options {
  root: string
  devServer?: ViteDevServer
}
