import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';

import pkg from './package.json';

const external = ['path', 'fs', 'typescript', ...Object.keys(pkg.dependencies), ...Object.keys(pkg.devDependencies)];

export default {
  input: 'src/index.ts',
  plugins: [
    typescript({ sourceMap: false, tsconfig: './tsconfig.json' }),
    commonjs()
  ],
  external,
  output: [
    { file: pkg.main, format: 'cjs', exports: 'auto'},
    { file: pkg.module, format: 'esm' }
  ]
};
