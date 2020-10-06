import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import replace from '@rollup/plugin-replace'
import type { RollupOptions } from 'rollup'
// import { terser } from 'rollup-plugin-terser'

const options: RollupOptions = {
  input: 'src/index.ts',
  output: [
    {
      file: 'build/index.cjs.js',
      format: 'commonjs',
      sourcemap: true,
    },
    { file: 'build/index.esm.js', format: 'esm' },
    {
      file: 'build/index.global.js',
      format: 'iife',
      name: 'RabbitMock',
    },
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [],
  // https://github.com/rollup/plugins
  plugins: [
    // Compile TypeScript files
    typescript({
      tsconfig: './tsconfig.json',
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/plugins/tree/master/packages/node-resolve
    resolve({
      // for xhr-mock proxy.browser
      browser: true,
      // for xhr-mock dependencies url
      preferBuiltins: false,
    }),
    // Allow json resolution
    json(),
  ],
}

export default options
