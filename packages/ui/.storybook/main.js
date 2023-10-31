import { dirname, join } from 'path'
// https://storybook.js.org/docs/react/configure/overview
module.exports = {
  stories: ['../src/**/*.stories.tsx'],

  addons: [
    getAbsolutePath('@storybook/addon-actions'),
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('@storybook/addon-controls'),
    getAbsolutePath('@storybook/addon-toolbars'),
  ],

  webpackFinal: (/** @type {import('webpack').Configuration} */ config) => {
    return config
  },

  framework: {
    name: getAbsolutePath('@storybook/react-webpack5'),
    options: {},
  },
}

function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, 'package.json')))
}
