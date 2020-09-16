import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import type { RollupOptions } from 'rollup'
// import { terser } from 'rollup-plugin-terser'

const options: RollupOptions = {
  input: 'src/index.ts',
  output: [
    { file: 'build/main.cjs.js', format: 'commonjs', sourcemap: true },
    { file: 'build/main.esm.js', format: 'esm' },
    {
      file: 'build/main.global.js',
      format: 'iife',
      name: 'RabbitMock',
    },
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [],
  plugins: [
    // Compile TypeScript files
    typescript({
      tsconfig: './tsconfig.json',
    }),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/plugins/tree/master/packages/node-resolve
    resolve({ browser: true }),
    // Allow json resolution
    json(),
  ],
}

export default options
