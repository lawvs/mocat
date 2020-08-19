// https://storybook.js.org/docs/react/configure/overview
module.exports = {
  stories: ['../src/**/*.stories.tsx'],
  addons: ['@storybook/addon-actions', '@storybook/addon-links'],
  webpackFinal: (/** @type {import('webpack').Configuration} */ config) => {
    return config
  },
}
