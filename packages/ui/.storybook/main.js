// https://storybook.js.org/docs/react/configure/overview
module.exports = {
  stories: ['../src/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-docs',
    '@storybook/addon-controls',
  ],
  webpackFinal: (/** @type {import('webpack').Configuration} */ config) => {
    return config
  },
}
