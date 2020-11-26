import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import replace from '@rollup/plugin-replace'
import type { RollupOptions } from 'rollup'
// import { terser } from 'rollup-plugin-terser'
import { getGitVersion } from './git-info'

const options: RollupOptions = {
  input: 'src/index.ts',
  output: [
    {
      file: 'build/index.js',
      format: 'umd',
      name: 'Mocat',
      sourcemap: true,
    },
    { file: 'build/index.esm.js', format: 'esm' },
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [],
  // https://github.com/rollup/plugins
  plugins: [
    // Compile TypeScript files
    typescript({
      tsconfig: './tsconfig.json',
    }),
    replace(
      Object.entries({
        NODE_ENV: 'production',
        VERSION: getGitVersion(),
        BUILD_DATE: new Date().toISOString(),
        CI: process.env.CI || null,
      }).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [`process.env.${key}`]: JSON.stringify(value),
        }),
        {}
      )
    ),
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
